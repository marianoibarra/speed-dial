import { window, workspace } from "vscode";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { Entry, SpeedDialTreeProvider } from "./tree-provider";

export class SpeedDial {
  private treeView: vscode.TreeView<Entry>;
  private treeDataProvider: SpeedDialTreeProvider;

  constructor(private context: vscode.ExtensionContext) {
    this.treeDataProvider = new SpeedDialTreeProvider(context);
    this.treeView = vscode.window.createTreeView('speedDial', {treeDataProvider: this.treeDataProvider});
    vscode.commands.registerCommand('speed-dial.refresh', () => this.treeDataProvider.refresh());
    context.subscriptions.push(this.treeView);

    this.bindOnChangeActiveTextEditor();
  }

  private bindOnChangeActiveTextEditor(): void {
    window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
      if(!textEditor) { return; }
      for(const elem of this.treeDataProvider.elements) {
        if(elem.uri.path === vscode.Uri.file(textEditor.document.fileName).path) {
          this.treeView.reveal(elem);
          break;
        };
      }
    });
  } 

  private reveal(filepath: string, index: SpeedDialIndex) {
    const node: Entry = {index: Number(index), uri: vscode.Uri.file(filepath), type: vscode.FileType.File};
    this.treeView.reveal(node);
  }

  public save(index: SpeedDialIndex): void {
    const editor = window.activeTextEditor;

    if (!editor) {
      window.showInformationMessage('Make sure editor is active');
      return undefined;
    }

    const file: string = editor.document.fileName;

    if(SpeedDial.fileExists(file)) {
      this.context.workspaceState.update(`bookmark-${index}`, file);
      window.showInformationMessage(`Save in Speed dial ${index}`, file.split('\\').at(-1)!);
      vscode.commands.executeCommand('speed-dial.refresh');
    }
  }

  public open(index: SpeedDialIndex): void {
    const file: string = this.context.workspaceState.get(`bookmark-${index}`) || '';
    if(!file) {
      window.showWarningMessage(`Nothing saved in Speed Dial ${index}`);
      return;
    }
    if(!SpeedDial.fileExists(file)) {
      window.showErrorMessage(`${file.split('\\').at(-1)!} was not found (ERR: no matching file found).`);
      return;
    }
    workspace.openTextDocument(file).then(document => window.showTextDocument(document));
    this.reveal(file, index);
  }

  public edit({index, ...args}: Entry): void {
    window.showInputBox({value: this.context.workspaceState.get(`bookmark-${index}`), valueSelection: [999, 999]}).then(value => {
      if(!value) { return; }
      if(!SpeedDial.fileExists(value)) {
        window.showErrorMessage(`${value.split('\\').at(-1)!} was not found (ERR: no matching file found).`);
        return this.edit({index, ...args});
      }
      this.context.workspaceState.update(`bookmark-${index}`, value);
      vscode.commands.executeCommand('speed-dial.refresh');
    });
  }

  public remove(bookmark: Entry) {
    this.context.workspaceState.update(`bookmark-${bookmark.index}`, undefined);
    vscode.commands.executeCommand('speed-dial.refresh');
  }

  public removeAll(): void {
    this.context.workspaceState.keys().forEach(key => this.context.workspaceState.update(key, undefined));
    window.showInformationMessage(`Clear all!`);
    vscode.commands.executeCommand('speed-dial.refresh');
  }

  static fileExists(file: string): boolean {
    return fs.existsSync(file);
  }
}

type SpeedDialIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;