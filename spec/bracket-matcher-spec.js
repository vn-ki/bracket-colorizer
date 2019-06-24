/** @babel */

import BracketMatcher from '../lib/bracket-matcher';

describe('bracket-matcher', function () {

  describe("simple.txt", function () {

    beforeEach(async function () {
      this.editor = await atom.workspace.open('./simple.txt');
    });

    it("should count brackets", async function () {
      new BracketMatcher(this.editor, {
        brackets: ['{}', '()', '[]', '<>'],
        repeatColorCount: 10,
      });
      for (let count = 0; count <= 10; count++) {
        const markers = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color${count}`});
        expect(markers.length).toBe(8);
      }
    });

    it("should repeat count", async function () {
      new BracketMatcher(this.editor, {
        brackets: ['{}', '()', '[]', '<>'],
        repeatColorCount: 2,
      });
      const markers0 = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color0`});
      expect(markers0.length).toBe(8);
      const markers1 = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color1`});
      expect(markers1.length).toBe(40);
      const markers2 = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color2`});
      expect(markers2.length).toBe(40);
      const markers3 = this.editor.getDecorations({stamp: 'bracket-colorizer', class: `bracket-colorizer-color3`});
      expect(markers3.length).toBe(0);
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

      new BracketMatcher(this.editor, {
        brackets: ['{}', '()', '[]'],
        repeatColorCount: 10,
      });
      const markers = this.editor.getDecorations({stamp: 'bracket-colorizer'});
      expect(markers.length).toBe(6);
    });

    it("should only count non-comment/string brackets with tree-sitter", async function () {
      new BracketMatcher(this.editor, {
        brackets: ['{}', '()', '[]'],
        repeatColorCount: 10,
      });
      const markers = this.editor.getDecorations({stamp: 'bracket-colorizer'});
      expect(markers.length).toBe(6);
    });

  });

  describe("color order", function () {

    beforeEach(async function () {
      this.getOrder = async (text, options = {}) => {
        const editor = await atom.workspace.open();
        editor.setText(text);
        new BracketMatcher(editor, options);
        return editor.getDecorations({stamp: 'bracket-colorizer'})
          .map(marker => +marker.properties.class.replace(/^.*?(\d+)$/, "$1"));
      };
    });

    it("should alternate nested brackets", async function () {
      const colors = await this.getOrder("{{{}}}");
      expect(colors).toEqual([1, 2, 3, 3, 2, 1]);
    });

    it("should not alternate different nested brackets", async function () {
      const colors = await this.getOrder("{([])}");
      expect(colors).toEqual([1, 1, 1, 1, 1, 1]);
    });

    it("should not alternate consecutive brackets", async function () {
      const colors = await this.getOrder("{}{}{}");
      expect(colors).toEqual([1, 1, 1, 1, 1, 1]);
    });

    it("should alternate consecutive brackets", async function () {
      const colors = await this.getOrder("{}{}{}", {alternateConsecutive: true});
      expect(colors).toEqual([1, 1, 2, 2, 3, 3]);
    });

    it("should not alternate different consecutive brackets", async function () {
      const colors = await this.getOrder("{}()[]", {alternateDifferent: true});
      expect(colors).toEqual([1, 1, 1, 1, 1, 1]);
      const colors2 = await this.getOrder("{}()[]", {alternateConsecutive: true});
      expect(colors2).toEqual([1, 1, 1, 1, 1, 1]);
    });

    it("should alternate different consecutive brackets", async function () {
      const colors = await this.getOrder("{}()[]", {alternateDifferent: true, alternateConsecutive: true});
      expect(colors).toEqual([1, 1, 2, 2, 3, 3]);
    });

    it("should alternate different nested brackets", async function () {
      const colors = await this.getOrder("{([])}", {alternateDifferent: true});
      expect(colors).toEqual([1, 2, 3, 3, 2, 1]);
    });

    it("should not alternate different consecutive brackets", async function () {
      const colors = await this.getOrder("{}()[]", {alternateDifferent: true});
      expect(colors).toEqual([1, 1, 1, 1, 1, 1]);
    });

    it("should distinguish between different brackets", async function () {
      const colors = await this.getOrder("{([})]", {alternateDifferent: true});
      expect(colors).toEqual([1, 2, 3, 1, 2, 3]);
    });

  });

});
