// The user's saved changes (run 3 F2) must survive a reload without freezing bundled data.
import { test } from "node:test";
import assert from "node:assert/strict";
import { EMPTY_OVERLAY, applyOverlay, parseOverlay, recordAdd, recordEdit, recordRemove, overlayCount } from "./overlay.ts";

const base = [{ id: "a", name: "A", rent: 1 }, { id: "b", name: "B", rent: 2 }];

test("an added listing survives a save/load round trip", () => {
  const o = recordAdd(EMPTY_OVERLAY, { id: "x", name: "Mine", rent: 9 });
  const reloaded = parseOverlay(JSON.stringify(o));
  assert.deepEqual(applyOverlay(base, reloaded).map((a) => a.id), ["a", "b", "x"]);
});

test("an edit applies on top of current bundled data, so data fixes still reach the user", () => {
  const o = recordEdit(EMPTY_OVERLAY, "a", { rent: 5 });
  const newerBase = [{ id: "a", name: "A (fixed name)", rent: 1 }, { id: "b", name: "B", rent: 2 }];
  const [a] = applyOverlay(newerBase, o);
  assert.equal(a.rent, 5);                 // the user's edit
  assert.equal(a.name, "A (fixed name)");  // the newer bundled fix, not a frozen copy
});

test("removing a bundled listing hides it; removing an added one drops it entirely", () => {
  let o = recordRemove(EMPTY_OVERLAY, "b");
  assert.deepEqual(applyOverlay(base, o).map((a) => a.id), ["a"]);
  o = recordAdd(EMPTY_OVERLAY, { id: "x" });
  o = recordRemove(o, "x");
  assert.equal(overlayCount(o), 0);
});

test("unreadable or foreign saved data counts as no changes instead of breaking the page", () => {
  for (const raw of [null, "", "{", "[]", '{"version":2}', '{"version":1,"added":"x"}']) {
    assert.deepEqual(parseOverlay(raw), EMPTY_OVERLAY, String(raw));
  }
});
