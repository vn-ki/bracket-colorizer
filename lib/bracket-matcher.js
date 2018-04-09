'use babel';

export default class BracketMatcher {
  constructor(editor) {
    this.myEditor = editor;
    for (let bracket of atom.config.get('bracket-colorizer.brackets')) {
      colorify(bracket.split(';')[0], bracket.split(';')[1]);
    }
  }

  cleanUp() {
    this.decorations = this.myEditor.getDecorations({ stamp: 'bczr' });
    this.decorations.forEach(dec => dec.destroy());
  }
}

function colorify(symbol_start, symbol_end) {
  let count = 0;
  regex = new RegExp('\\'+symbol_start+'|'+'\\'+symbol_end, 'g');

  atom.workspace.getActiveTextEditor().scan(regex, (result) => {

    if(result.matchText == symbol_start) {
      count ++;
    }

    marker = atom.workspace.getActiveTextEditor().markBufferRange(result.range);
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
