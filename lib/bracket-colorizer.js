/** @babel */

import { CompositeDisposable } from 'atom';
import BracketMatcher from './bracket-matcher';

export default {

  subscriptions: null,
  editors: new WeakMap(),
  brackets: null,

  config: {
    brackets: {
      title: 'Brackets to match',
      description: "The format should be: {}, (), []",
      default: ['{}', '()', '[]'],
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.editors = new WeakMap();

    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(() => this.processEditor()));
    this.subscriptions.add(atom.config.observe('bracket-colorizer.brackets', (value) => {
      this.brackets = value;
    }));

    this.processEditor();
  },

  deactivate() {
    this.cleanAll();
    this.subscriptions.dispose();
  },

  processEditor() {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor || this.editors.has(editor)) {
      return;
    }

    const editorObj = {
      subscriptions: new CompositeDisposable(),
      bracketMatcher: new BracketMatcher(editor, this.brackets),
    };
    editorObj.subscriptions.add(editor.onDidStopChanging(() => {
      editorObj.bracketMatcher.cleanUp();
      editorObj.bracketMatcher = new BracketMatcher(editor, this.brackets);
    }));
    editorObj.subscriptions.add(editor.onDidDestroy(() => {
      editorObj.bracketMatcher.cleanUp();
      editorObj.subscriptions.dispose();
      this.editors.delete(editor);
    }));
    this.editors.set(editor, editorObj);

    // run BracketMatcher once a newly loaded file is tokenized
    const tokenizeSubscription = editor.onDidTokenize(() => {
      editorObj.bracketMatcher.cleanUp();
      editorObj.bracketMatcher = new BracketMatcher(editor, this.brackets);
      tokenizeSubscription.dispose();
    });
  },

  process(editor) {
    if (!this.editors.has(editor)) {
      return;
    }
    const editorObj = this.editors.get(editor);
    editorObj.bracketMatcher.cleanUp();
    editorObj.bracketMatcher = new BracketMatcher(editor);
  },

  cleanAll() {
    atom.workspace.getTextEditors().forEach((editor) => {
      if (!this.editors.has(editor)) {
        return;
      }
      const editorObj = this.editors.get(editor);
      editorObj.bracketMatcher.cleanUp();
      editorObj.subscriptions.dispose();
      this.editors.delete(editor);
    });
  }
};
