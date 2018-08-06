/** @babel */

export default class BracketMatcher {
  constructor(editor, brackets) {
    this.editor = editor;
    this.brackets = brackets;
    this.colorBrackets();
  }

  refresh() {
    this.cleanUp();
    this.colorBrackets();
  }

  cleanUp() {
    const decorations = this.editor.getDecorations({stamp: 'bracket-colorizer'});
    decorations.forEach(dec => dec.destroy());
  }

  colorBrackets() {
    for (let bracket of this.brackets) {
      if (bracket.length === 2) {
        this.colorify(bracket[0], bracket[1]);
      } else {
        atom.notifications.addError(`${bracket} is not a valid set of brackets`);
      }
    }
  }

  colorify(symbolStart, symbolEnd) {
    let count = 0;
    const regex = new RegExp(`\\${symbolStart}|\\${symbolEnd}`, 'g');

    this.editor.scan(regex, (result) => {

      if (this.isRangeCommentedOrString(result.range)) {
        return;
      }

      if (result.matchText === symbolStart) {
        count++;
      }

      const marker = this.editor.markBufferRange(result.range, {invalidate: 'inside'});

      this.editor.decorateMarker(
        marker, {type: 'text', class: `bracket-colorizer-color${count}`, stamp: 'bracket-colorizer'}
      );

      if (result.matchText === symbolEnd) {
        count--;
      }

      if (count < 0) {
        count = 0;
      }

    });
  }

  isRangeCommentedOrString(range) {
    const scopesArray = this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    for (let scope of scopesArray.reverse()) {
      scope = scope.split('.');
      if (scope.includes('embedded') && scope.includes('source')) {
        return false;
      }
      if (scope.includes('comment') || scope.includes('string') || scope.includes('regex')) {
        return true;
      }
    }
    return false;
  }
}
