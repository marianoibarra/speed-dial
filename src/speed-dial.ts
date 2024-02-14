import * as vscode from 'vscode';
import * as fs from 'fs';
import { window, workspace } from "vscode";
import { Bookmark, numberEmoji } from "./tree-provider";
import { Store } from './store';

export class SpeedDial {

  constructor(private readonly store: Store) {}

  public save(index: number): void {
    const editor = window.activeTextEditor;
    if (!editor) {
      window.showErrorMessage(vscode.l10n.t('Make sure editor is active.'));
      return;
    }

    const uri: vscode.Uri = editor.document.uri;
    if(uri.scheme !== 'file') {
      window.showErrorMessage(vscode.l10n.t("Make sure it's a local file."));
      return;
    }
    if(SpeedDial.fileExists(uri)) {
      this.store.set(index, uri);
    }
  }

  public open(index: number): void {
    const uri = this.store.get(index);
    if(!uri) {
      window.showWarningMessage(vscode.l10n.t("Nothing saved in Speed Dial {index}", { index }));
      return;
    }

    if(!SpeedDial.fileExists(uri)) {
      window.showErrorMessage(vscode.l10n.t("{fileName} was not found (ERR: no matching file found).", {fileName: this.getFileName(uri)}));
      return;
    }
    workspace.openTextDocument(uri.path).then(document => window.showTextDocument(document));
  }

  public edit(bookmark: Bookmark): void {
    const uri = this.store.get(bookmark.index);
    if(!uri) { return; }

    const validateInput = (value: string) => {
      const regexp = /^(?![\/.])[\w.\/-]{1,253}$(?<![.\/])/;
      if(!regexp.test(value)) {
        return vscode.l10n.t("You must enter a valid relative path to a file.");
      }
    };

    window.showInputBox({
      title: vscode.l10n.t("Edit bookmark at Speed Dial {index}", { index: bookmark.index }), 
      value: this.store.toRelativePath(uri), 
      valueSelection: [999, 999], 
      validateInput
    }).then(inputValue => {
      if(!inputValue) { return; }

      const uri = this.store.toAbsolutePath(inputValue);
      if(!uri) { return; }
      
      if(!SpeedDial.fileExists(uri)) {
        window.showErrorMessage(vscode.l10n.t("{fileName} was not found (ERR: no matching file found).", {fileName: this.getFileName(uri)}));
        return this.edit(bookmark);
      }
      this.store.set(bookmark.index, inputValue);
    });
  }

  public remove(index: number) {
    this.store.remove(index);
  }

  public clear(): void {
    this.store.clear();
    window.showInformationMessage(vscode.l10n.t("Speed Dial cleared successfully."));
  }
  

  public openFromCommandPallete(): void {
    const quickPick = window.createQuickPick();
    quickPick.items = new Array(9)
      .fill(undefined)
      .map((_, index) => this.store.get(++index))
      .map((uri, index) => {
        return uri ? {
          label: `${numberEmoji[++index]}   ${this.getFileName(uri)}`,
          description: vscode.workspace.asRelativePath(uri!).split('/').slice(0, -1).join('/'),
          index,
        } : {
          label: `${numberEmoji[++index]} `,
          description: vscode.l10n.t('Empty bookmark'),
          index,
          empty: true
        };
      }
    );

    quickPick.onDidChangeSelection(([selection]) => {
      const { index, empty } = (selection as any);
      if(!empty) {
        this.open(index);
        quickPick.dispose();
      }
    });

    quickPick.show();
  }

  private getFileName(path: vscode.Uri | string): string {
    path = typeof path === 'string' ? path : path.fsPath;
    return path.split('\\').at(-1) ?? '';
  }

  static fileExists(uri: vscode.Uri): boolean {
    return fs.existsSync(uri.fsPath);
  }
}