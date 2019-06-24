/** @babel */

export default class BracketMatcher {
  constructor(editor, {
    brackets = ['{}', '()', '[]'],
    repeatColorCount = 9,
    alternateDifferent = false,
  } = {}) {
    this.editor = editor;
    this.brackets = brackets;
    this.repeatColorCount = repeatColorCount;
    this.alternateDifferent = alternateDifferent;
    this.markerLayer = editor.addMarkerLayer();
    this.colorBrackets();
  }

  refresh() {
    this.clear();
    this.colorBrackets();
  }

  clear() {
    this.markerLayer.clear();
  }

  destroy() {
    this.markerLayer.destroy();
  }

  colorBrackets() {
    if (this.alternateDifferent) {
      let symbolStarts = "";
      let symbolEnds = "";
      for (let bracket of this.brackets) {
        if (bracket.length === 2) {
          symbolStarts += bracket[0];
          symbolEnds += bracket[1];
        } else {
          atom.notifications.addError(`${bracket} is not a valid set of brackets`);
        }
      }
      if (symbolStarts && symbolEnds) {
        this.colorify(symbolStarts, symbolEnds)
      }
    } else {
      for (let bracket of this.brackets) {
        if (bracket.length === 2) {
          this.colorify(bracket[0], bracket[1]);
        } else {
          atom.notifications.addError(`${bracket} is not a valid set of brackets`);
        }
      }
    }
  }

  colorify(symbolStart, symbolEnd) {
    let count = 0;
    const regex = new RegExp(`[${this.escapeRegExp(symbolStart + symbolEnd)}]`, 'g');

    this.editor.scan(regex, (result) => {

      if (this.isRangeCommentedOrString(result.range)) {
        return;
      }

      if (symbolStart.includes(result.matchText)) {
        count++;
      }

      const marker = this.markerLayer.markBufferRange(result.range, {invalidate: 'inside'});

      const colorNumber = count > 0 ? (count - 1) % this.repeatColorCount + 1 : 0;
      this.editor.decorateMarker(
        marker, {type: 'text', class: `bracket-colorizer-color${colorNumber}`, stamp: 'bracket-colorizer'}
      );

      if (symbolEnd.includes(result.matchText)) {
        count--;
      }

      if (count < 0) {
        count = 0;
      }

    });
  }

  escapeRegExp(string) {
    // from https://stackoverflow.com/a/6969486/806777
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
