const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const service = fs.readFileSync(path.join(root, "Service.qml"), "utf8");

test("manifest exposes a persistent service", () => {
  assert.equal(manifest.id, "io.github.manateelazycat.smart-gaps");
  assert.deepEqual(manifest.kinds, ["service"]);
  assert.equal(manifest.keepLoaded, true);
  assert.equal(manifest.entryPoints.service, "Service.qml");
});

test("single-tiled-window regular workspaces have no gaps or borders", () => {
  assert.match(service, /local selector = "w\[tv1\]s\[false\]"/);
  assert.match(service, /workspace = selector/);
  assert.match(service, /gaps_out = 0/);
  assert.match(service, /gaps_in = 0/);
  assert.match(service, /no_border = true/);
});

test("floating helper windows do not affect the smart-gaps match", () => {
  assert.doesNotMatch(service, /w\[v1\]s\[false\]/);
});

test("a changed selector replaces the cached runtime rule", () => {
  assert.match(service, /omarchy_smart_gaps_rule_selector ~= selector/);
  assert.match(service, /omarchy_smart_gaps_rule:set_enabled\(false\)/);
  assert.match(service, /omarchy_smart_gaps_rule = nil/);
});

test("the runtime rule is disabled on unload and restored after config reload", () => {
  assert.match(service, /set_enabled\(false\)/);
  assert.match(service, /configreloaded/);
  assert.match(service, /applyTimer\.restart\(\)/);
});

test("the rule is refreshed after the Omarchy screensaver closes", () => {
  assert.match(service, /screensaverClass:\s*"org\.omarchy\.screensaver"/);
  assert.match(service, /name === "openwindow"/);
  assert.match(service, /name === "closewindow"/);
  assert.match(service, /forgetScreensaver\(closed\[0\]\)/);
  assert.match(service, /applyTimer\.restart\(\)/);
});
