'use babel';

import { CompositeDisposable } from 'atom';
import BracketMatcher from './bracket-matcher';

export default {

  subscriptions: null,

  activate(state) {
    this.on = false;

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bracket-colorizer:toggle': () => this.toggle()
    }));

    this.activePane = atom.workspace.getActivePane();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    this.on = !this.on

    if(this.on) {
      console.log('Brackets colorized');
      this.subscriptionOne = this.activePane.onDidChangeActiveItem(this.process_current_page);
      editor = atom.workspace.getActiveTextEditor();
      if (this.activePane.activeItem == editor && this.activePane.focused == true) {
        this.process_current_page();
      }
    } else {
      this.cleanAll();
      this.subscriptionOne.dispose();
      console.log('Brackets decolorized');
    }

  },

  process_current_page() {
    function process(editor)
    {
      if(editor.textProcessor!= null) editor.textProcessor.cleanUp();
      editor.textProcessor = new BracketMatcher(editor);
    }
    editor = atom.workspace.getActiveTextEditor();
    if(editor.saveSubscription!=null)
    {
      editor.saveSubscription.dispose();
    }
    editor.saveSubscription = editor.onDidSave(function(){process(editor);});
    process(editor);
  },

  cleanAll()
  {
      atom.workspace.getTextEditors().forEach(function(element)
      {
        if(element.textProcessor!=null)
        {
          element.textProcessor.cleanUp();
          element.textProcessor = null;
        }
        if(element.saveSubscription!=null)
        {
          element.saveSubscription.dispose();
        }
    });
  }

};
