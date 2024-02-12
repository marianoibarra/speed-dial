import * as vscode from 'vscode';

export class SpeedDialTreeProvider implements vscode.TreeDataProvider<Entry> {
  constructor(private context: vscode.ExtensionContext) {}

  private _onDidChangeTreeData: vscode.EventEmitter<Entry | undefined | null | void> = new vscode.EventEmitter<Entry | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Entry | undefined | null | void> = this._onDidChangeTreeData.event;

  elements: Entry[] = [];

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
  
  getTreeItem(element: Entry): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if(element.type === vscode.FileType.Unknown) {
      const emptyTreeItem = new vscode.TreeItem('', vscode.TreeItemCollapsibleState.None);
      emptyTreeItem.description = 'Empty bookmark';
      emptyTreeItem.contextValue = 'empty';
      emptyTreeItem.label = { label: `${numbers[element.index]} `, highlights: [] };
      return emptyTreeItem;
    }

    const treeItem = new vscode.TreeItem(element.uri, vscode.TreeItemCollapsibleState.None);
    treeItem.label = { label: `${numbers[element.index]}  ${element.uri.path.split('/').at(-1)}`, highlights: [] };
    treeItem.description = vscode.workspace.asRelativePath(element.uri.path).split('/').slice(0, -1).join('/');
    treeItem.command = { title: 'Open' + element.index, command: 'speed-dial.open', arguments: [element.index] };
    treeItem.contextValue = 'bookmark';

    return treeItem;
  }

  getChildren(element?: Entry): vscode.ProviderResult<Entry[]> {
    if(!element) {
      this.elements = [];
      for(let i = 0; i < 10; i++) {
        const filepath: string = this.context.workspaceState.get(`bookmark-${i}`) as string ?? '';
        this.elements[i] = {
          uri: vscode.Uri.file(filepath),
          index: i,
          type: filepath ? vscode.FileType.File : vscode.FileType.Unknown
        };
    
      }
      return Promise.resolve(this.elements);
    }
  }

  getParent(element: Entry): vscode.ProviderResult<Entry> {
    return null;
  }
}

export interface Entry {
	uri: vscode.Uri;
	type: vscode.FileType;
  index: number;
}

const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];