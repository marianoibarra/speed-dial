import * as vscode from 'vscode';
import { Store } from './store';

export class TreeProvider implements vscode.TreeDataProvider<Bookmark> {
  constructor(private store: Store) {
    this.store.onDidUpdate(() => this.refresh());
  }

  private _onDidChangeTreeData: vscode.EventEmitter<Bookmark | undefined | null | void> = new vscode.EventEmitter<Bookmark | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Bookmark | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  getTreeItem(bookmark: Bookmark): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if(bookmark.uri) {
      return new BookmarkTreeItem(bookmark);
    }
    return new EmptyTreeItem(bookmark);
  }

  getChildren(): vscode.ProviderResult<Bookmark[]> {
    const bookmarks: Bookmark[] = new Array(9).fill(undefined);
    return Promise.resolve(bookmarks.map((_, index) => ({uri: this.store.get(++index), index})));
  }

  getParent(element: Bookmark): vscode.ProviderResult<Bookmark> {
    return null;
  }
}

class BookmarkTreeItem extends vscode.TreeItem {
  constructor({index, uri}: Bookmark) {
    super(uri!, vscode.TreeItemCollapsibleState.None);

    this.label = `${numberEmoji[index]}  ${uri?.path.split('/').at(-1)}`;
    this.description = vscode.workspace.asRelativePath(uri!).split('/').slice(0, -1).join('/');
    this.command = { title: 'Open' + index, command: 'speed-dial.open', arguments: [index] };
    this.contextValue = 'bookmark';
  }
}

class EmptyTreeItem extends vscode.TreeItem {
  constructor({index}: Bookmark) {
    super('', vscode.TreeItemCollapsibleState.None);

    this.label = `${numberEmoji[index]} `;
    this.description = vscode.l10n.t('Empty bookmark');
    this.contextValue = 'empty';
  }
}

export interface Bookmark {
  index: number;
	uri?: vscode.Uri;
}

export const numberEmoji = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];