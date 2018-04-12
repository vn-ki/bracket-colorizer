/** @babel */

// import path from "path";
import BracketColorizer from '../lib/bracket-colorizer';

describe('bracket-colorizer', function() {

  beforeEach(async function() {
    await atom.packages.activatePackage('bracket-colorizer');
  });

  it("should colorize brackets", async function () {
    const editor = await atom.workspace.open('./simple.txt');
    BracketColorizer.processEditor();
    const markers = editor.getDecorations({stamp: 'bracket-colorizer'});
    expect(markers.length).toEqual(66);
  });

  it("should not fail when deactivated", async function () {
    let errorArgs = null;
    spyOn(console, "error").and.callFake((...args) => {
      errorArgs = args;
    });
    await atom.workspace.open('./simple.txt');
    BracketColorizer.processEditor();
    await atom.packages.deactivatePackage('bracket-colorizer');
    expect(errorArgs).toBeNull()
  });

});
