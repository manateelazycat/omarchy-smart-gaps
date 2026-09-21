import QtQuick
import Quickshell
import Quickshell.Hyprland
import Quickshell.Io

Item {
  id: root

  // Injected by omarchy-shell.
  property var shell: null

  property bool applied: false
  property bool applyPending: false
  property bool unloading: false

  readonly property string enableRuleCode: 'if _G.omarchy_smart_gaps_rule then _G.omarchy_smart_gaps_rule:set_enabled(true) else _G.omarchy_smart_gaps_rule = hl.workspace_rule({ workspace = "w[v1]s[false]", gaps_out = 0, gaps_in = 0, no_border = true }) end'
  readonly property string disableRuleCode: 'if _G.omarchy_smart_gaps_rule then _G.omarchy_smart_gaps_rule:set_enabled(false) end'

  function applyRule() {
    if (root.unloading)
      return

    if (applyProcess.running) {
      root.applyPending = true
      return
    }

    root.applyPending = false
    applyProcess.command = ["hyprctl", "eval", root.enableRuleCode]
    applyProcess.running = true
  }

  function statusJson() {
    return JSON.stringify({
      applied: root.applied,
      selector: "w[v1]s[false]",
      gapsIn: 0,
      gapsOut: 0,
      borders: false
    })
  }

  Process {
    id: applyProcess

    stdout: StdioCollector {
      onStreamFinished: {
        if (text.trim() !== "" && text.trim() !== "ok")
          console.log("Omarchy Smart Gaps: " + text.trim())
      }
    }

    stderr: StdioCollector {
      onStreamFinished: {
        if (text.trim() !== "")
          console.warn("Omarchy Smart Gaps: " + text.trim())
      }
    }

    onExited: function(exitCode) {
      root.applied = exitCode === 0
      if (root.applyPending && !root.unloading)
        Qt.callLater(root.applyRule)
    }
  }

  Timer {
    id: applyTimer
    interval: 100
    repeat: false
    onTriggered: root.applyRule()
  }

  Connections {
    target: Hyprland

    function onRawEvent(event) {
      if (String(event?.name ?? "").toLowerCase() === "configreloaded")
        applyTimer.restart()
    }
  }

  IpcHandler {
    target: "io.github.manateelazycat.smart-gaps"

    function status(): string { return root.statusJson() }
  }

  Component.onCompleted: applyTimer.start()

  Component.onDestruction: {
    root.unloading = true
    Quickshell.execDetached(["hyprctl", "eval", root.disableRuleCode])
  }
}
