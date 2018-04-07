'use babel';

export default class BracketMatcher {
  constructor(editor) {
    this.myEditor = editor;
    colorify('(', ')', /\(|\)/g);
    colorify('{', '}', /{|}/g);
    colorify('[', ']', /\[|\]/g);
  }

  cleanUp() {
    this.decorations = this.myEditor.getDecorations({ stamp: 'bczr' });
    this.decorations.forEach(dec => dec.destroy());
  }
}

function colorify(symbol_start, symbol_end, regex) {
  let count = 0;

  atom.workspace.getActiveTextEditor().scan(regex, (result) => {

    if(result.matchText == symbol_start) {
      count ++;
    }

    marker = atom.workspace.getActiveTextEditor().markScreenRange(result.range);
    colorClass = 'color'+count;

    decoration = atom.workspace.getActiveTextEditor().decorateMarker(
      marker, { type: 'text', class: colorClass, stamp:'bczr' }
    );

    if(result.matchText == symbol_end)
    {
      count --;
    }

    if( count < 0) count = 0;

  });
}
