# Omarchy Smart Gaps

https://github.com/user-attachments/assets/171da180-7709-40d9-ad21-b06e21bd89bb

An [Omarchy](https://omarchy.org/) plugin that automatically removes the inner and outer gaps and hides the border when a regular workspace has exactly one visible window. The normal gaps and border return as soon as the workspace contains multiple windows.

## Install

```bash
omarchy plugin add https://github.com/manateelazycat/omarchy-smart-gaps.git --enable
```

No additional configuration is required.

## Remove

```bash
omarchy plugin remove io.github.manateelazycat.smart-gaps
```

## Requirements

- Omarchy with the Quickshell plugin system
- Hyprland 0.56 or newer with Lua configuration support

## How it works

The plugin installs a runtime Hyprland workspace rule for `w[v1]s[false]`. Hyprland updates the match automatically as windows open, close, or move between workspaces. The rule is disabled when the plugin unloads, and reapplied after a Hyprland configuration reload. It is also refreshed after Omarchy's screensaver closes so the single-window layout is restored correctly after unlocking.

## License

GPL-3.0-only. See [LICENSE](LICENSE).
