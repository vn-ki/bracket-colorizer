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

    function process(editor) {
      if(editor.bracketMatcher != null)  {
        editor.bracketMatcher.cleanUp();
      }
      editor.bracketMatcher = new BracketMatcher(editor);
    }

    editor = atom.workspace.getActiveTextEditor();
    if (editor == null) {
      return;
    }

    if(editor.changeSubscription != null) {
      editor.changeSubscription.dispose();
    }
    editor.changeSubscription = editor.onDidStopChanging(() => process(editor));
    process(editor);
  },

  cleanAll() {
    // For each buffer
    atom.workspace.getTextEditors().forEach((element) => {
      if(element.bracketMatcher != null) {
        element.bracketMatcher.cleanUp();
        element.bracketMatcher = null;
      }

      if(element.changeSubscription != null) {
        element.changeSubscription.dispose();
      }
    });
  }
};
