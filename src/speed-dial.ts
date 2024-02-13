import * as vscode from 'vscode';
import * as fs from 'fs';
import { window, workspace } from "vscode";
import { Bookmark } from "./tree-provider";
import { Store } from './store';

export class SpeedDial {

  constructor(private readonly store: Store) {}

  public save(index: number): void {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showInformationMessage('Make sure editor is active');
      return;
    }

    const uri: vscode.Uri = editor.document.uri;
    if(uri.scheme !== 'file') {
      window.showInformationMessage("Make sure it's a local file");
      return;
    }
    if(SpeedDial.fileExists(uri)) {
      this.store.set(index, uri);
    }
  }

  public open(index: number): void {
    const uri = this.store.get(index);
    if(!uri) {
      window.showWarningMessage(`Nothing saved in Speed Dial ${index}`);
      return;
    }

    if(!SpeedDial.fileExists(uri)) {
      window.showErrorMessage(`${this.getFileName(uri)} was not found (ERR: no matching file found).`);
      return;
    }
    workspace.openTextDocument(uri.path).then(document => window.showTextDocument(document));
  }

  public edit(bookmark: Bookmark): void {
    const uri = this.store.get(bookmark.index);
    if(!uri) { return; }
    const value = this.store.toRelativePath(uri);
    window.showInputBox({value, valueSelection: [999, 999]}).then(inputValue => {
      if(!inputValue) { return; }

      const uri = this.store.toAbsolutePath(inputValue);
      if(!uri) { return; }
      
      if(!SpeedDial.fileExists(uri)) {
        window.showErrorMessage(`${this.getFileName(uri)} was not found (ERR: no matching file found).`);
        return this.edit(bookmark);
      }
      this.store.set(bookmark.index, inputValue);
    });
  }

  public remove(index: number) {
    this.store.remove(index);
  }

  public removeAll(): void {
    this.store.clear();
    window.showInformationMessage(`Cleared all!`);
  }

  private getFileName(path: vscode.Uri | string): string {
    path = typeof path === 'string' ? path : path.fsPath;
    return path.split('\\').at(-1) ?? '';
  }

  static fileExists(uri: vscode.Uri): boolean {
    const response = fs.existsSync(uri.fsPath);
    return response;
  }
}