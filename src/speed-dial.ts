import { window, workspace } from "vscode";
import * as vscode from 'vscode';
import * as fs from 'fs';

export class SpeedDial {
  constructor(private context: vscode.ExtensionContext) {}

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
  }

  public clear(): void {
    window.showInformationMessage(`Clear all!`);
  }

  static fileExists(file: string): boolean {
    return fs.existsSync(file);
  }
}

type SpeedDialIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;