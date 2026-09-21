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

test("single-window regular workspaces have no gaps or borders", () => {
  assert.match(service, /workspace = "w\[v1\]s\[false\]"/);
  assert.match(service, /gaps_out = 0/);
  assert.match(service, /gaps_in = 0/);
  assert.match(service, /no_border = true/);
});

test("the runtime rule is disabled on unload and restored after config reload", () => {
  assert.match(service, /set_enabled\(false\)/);
  assert.match(service, /configreloaded/);
  assert.match(service, /applyTimer\.restart\(\)/);
});
