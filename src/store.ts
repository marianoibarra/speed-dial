import * as vscode from 'vscode';
import * as fs from 'fs';

export class Store {
  private _store = new Map<number, string>();
  private readonly _indexes: number[] = [1, 2, 3, 4, 5, 6, 7, 8 ,9];
  private readonly _keyPrefix: string = 'bookmark-';

  private readonly _onDidUpdate = new vscode.EventEmitter<null>();
  readonly onDidUpdate = this._onDidUpdate.event;
  
  constructor(private context: vscode.ExtensionContext) {
    this._indexes.forEach(index => {
      const value: string = this.context.workspaceState.get(this._keyPrefix + index) as string;
      this._store.set(index, value);
    });
  }

  get(index: number): vscode.Uri | undefined {
    if(!this._indexes.includes(index)) {
      return undefined;
    }
    const relativePath = this._store.get(index)!;
    return this.toAbsolutePath(relativePath);
  }

  set(index: number, pathOrUri: string | vscode.Uri): void {
    const relativePath = this.toRelativePath(pathOrUri);
    this._store.set(index, relativePath!);
    this.context.workspaceState.update(this._keyPrefix + index, relativePath);
    this.didUpdate();
  }

  remove(index: number): void {
    this._store.delete(index);
    this.context.workspaceState.update(this._keyPrefix + index, undefined);
    this.didUpdate();
  }

  clear(): void {
    this._store.clear();
    this._indexes.forEach(i => {
      this.context.workspaceState.update(this._keyPrefix + i, undefined);
    });
    this.didUpdate();
  }

  indexOf(uri: vscode.Uri): number {
    let response: number = -1;
    for(const [index, value] of this._store) {
      if(this.toRelativePath(uri) === value) {
        response = index;
      }
    }
    return response;
  }

  toRelativePath(pathOrUri: string | vscode.Uri): string | undefined {
    return vscode.workspace.asRelativePath(pathOrUri);
  }

  toAbsolutePath(path: string): vscode.Uri | undefined {
    if(!path || typeof path !== 'string') {
      return undefined;
    };
    const workspaceFolder = vscode.workspace.workspaceFolders?.at(0)?.uri;
    if(!workspaceFolder) {
      vscode.window.showErrorMessage('There is no open workspace');
      return;
    }
    return vscode.Uri.joinPath(workspaceFolder, path);
  }

  private didUpdate(): void {
    this._onDidUpdate.fire(null);
  }
}