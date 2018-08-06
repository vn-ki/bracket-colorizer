/** @babel */

import BracketMatcher from '../lib/bracket-matcher';

describe('bracket-matcher', function () {

  describe("simple.txt", function () {

    beforeEach(async function () {
      this.editor = await atom.workspace.open('./simple.txt');
    });

    it("should count brackets", async function () {
      new BracketMatcher(this.editor, ['{}', '()', '[]', '<>']);
      for (let count = 0; count <= 10; count++) {
        const markers = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color${count}`});
        expect(markers.length).toBe(8);
      }
    });

  });

  describe("commentString.js", function () {

    beforeEach(async function () {
      atom.config.set("core.useTreeSitterParsers", true);
      await atom.packages.activatePackage('language-javascript');
      this.editor = await atom.workspace.open('./commentString.js');
    });

    it("should only count non-comment/string brackets without tree-sitter", async function () {
      atom.config.set("core.useTreeSitterParsers", false);
      this.editor.getBuffer().getLanguageMode().startTokenizing();
      await new Promise(resolve => this.editor.onDidTokenize(resolve));

      new BracketMatcher(this.editor, ['{}', '()', '[]']);
      const markers = this.editor.getDecorations({stamp: 'bracket-colorizer'});
      expect(markers.length).toBe(6);
    });

    it("should only count non-comment/string brackets with tree-sitter", async function () {
      new BracketMatcher(this.editor, ['{}', '()', '[]']);
      const markers = this.editor.getDecorations({stamp: 'bracket-colorizer'});
      expect(markers.length).toBe(6);
    });

  });

});
