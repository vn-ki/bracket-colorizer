/** @babel */

import BracketMatcher from '../lib/bracket-matcher';

describe('bracket-matcher', function () {

  beforeEach(async function() {
    await atom.packages.activatePackage('bracket-colorizer');
  });

  describe("simple.txt", function () {

    beforeEach(async function () {
      this.editor = await atom.workspace.open('./simple.txt');
      this.bracketMatcher = new BracketMatcher(this.editor, ['{}', '()', '[]', '<>']);
    });

    it("should count brackets", async function () {
      for (let count = 0; count <= 10; count++) {
        const markers = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color${count}`});
        expect(markers.length).toBe(8);
      }
    });

  });

});
