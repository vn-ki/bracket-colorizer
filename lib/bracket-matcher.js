'use babel';

export default class BracketMatcher {
  constructor(editor) {
    this.myEditor = editor;
    for (let bracket of atom.config.get('bracket-colorizer.brackets')) {
      colorify(bracket.split(';')[0], bracket.split(';')[1]);
    }
  }

  cleanUp() {
    this.decorations = this.myEditor.getDecorations({stamp: 'bczr'});
    this.decorations.forEach(dec => dec.destroy());
  }
}

function colorify(symbol_start, symbol_end) {
  let count = 0;
  const regex = new RegExp(`\\${symbol_start}|\\${symbol_end}`, 'g');
  const editor = atom.workspace.getActiveTextEditor();

  editor.scan(regex, (result) => {

    if (isRangeCommentedOrString(editor, result.range)) {
      return;
    }

    if (result.matchText === symbol_start) {
      count++;
    }

    const marker = editor.markBufferRange(result.range);
    const colorClass = `color${count}`;

    editor.decorateMarker(
      marker, {type: 'text', class: colorClass, stamp: 'bczr'}
    );

    if (result.matchText === symbol_end) {
      count--;
    }

    if (count < 0) {
      count = 0;
    }

  });
}

function isRangeCommentedOrString(editor, range) {
  const scopesArray = editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
  for (let scope of scopesArray.reverse()) {
    scope = scope.split('.');
    if (scope.includes('embedded') && scope.includes('source')) {
      return false;
    }
    if (scope.includes('comment') || scope.includes('string')) {
      return true;
    }
  }
  return false;
}
