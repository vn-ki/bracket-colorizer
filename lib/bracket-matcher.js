'use babel';

export default class BracketMatcher {
  constructor(editor) {
    this.myEditor = editor;
    if (atom.config.get('bracket-colorizer.gutter')) {
      console.log('hi');
      this.gutter = this.myEditor.addGutter({ name: 'bczr' });
    }
    for (let bracket of atom.config.get('bracket-colorizer.brackets')) {
      this.colorify(bracket.split(';')[0], bracket.split(';')[1]);
    }
  }

  cleanUp() {
    this.decorations = this.myEditor.getDecorations({ stamp: 'bczr' });
    this.decorations.forEach(dec => dec.destroy());
    if (atom.config.get('bracket-colorizer.gutter')) {
      this.gutter.destroy();
    }
  }

  colorify(symbol_start, symbol_end) {
    let count = 0;
    regex = new RegExp('\\'+symbol_start+'|'+'\\'+symbol_end, 'g');

    atom.workspace.getActiveTextEditor().scan(regex, (result) => {

      if(result.matchText == symbol_start) {
        count ++;
      }

      if (symbol_start === '{')
        this.color_symbol(result.range, count, true);
      else
        this.color_symbol(result.range, count, true);

      if(result.matchText == symbol_end)
      {
        count --;
      }

      if( count < 0) count = 0;

    });
  }

  color_symbol(range, count, gutter) {
    marker = atom.workspace.getActiveTextEditor().markBufferRange(range);
    colorClass = 'color'+count;

    if (atom.config.get('bracket-colorizer.gutter') && gutter) {
      gdecor = this.gutter.decorateMarker(marker, { type: 'gutter', class: colorClass, stamp:'bczr');
    }

    decoration = atom.workspace.getActiveTextEditor().decorateMarker(
      marker, { type: 'text', class: colorClass, stamp:'bczr' }
    );
  }
}
