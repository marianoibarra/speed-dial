import * as vscode from 'vscode';
import { SpeedDial } from './speed-dial';
import { Store } from './store';
import { TreeProvider } from './tree-provider';

export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context);
	const treeDataProvider = new TreeProvider(store);
	const speedDial = new SpeedDial(store);
	
	const treeView = vscode.window.createTreeView('speedDial', { treeDataProvider });

	const refresh = vscode.commands.registerCommand('speed-dial.refresh', () => treeDataProvider.refresh());
	const save = vscode.commands.registerCommand('speed-dial.save', index => speedDial.save(Number(index)));
	const saveFromMenu = vscode.commands.registerCommand('speed-dial.saveFromMenu', ({index}) => speedDial.save(Number(index)));
	const open = vscode.commands.registerCommand('speed-dial.open', index => speedDial.open(Number(index)));
	const edit = vscode.commands.registerCommand('speed-dial.edit', bookmark => speedDial.edit(bookmark));
	const remove = vscode.commands.registerCommand('speed-dial.remove', ({index}) => speedDial.remove(Number(index)));
	const removeAll = vscode.commands.registerCommand('speed-dial.removeAll',  () => speedDial.removeAll());

	vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
		if(!textEditor) { return; }

		const uri = textEditor.document.uri;
		const index = store.indexOf(uri);
		if(index) {
			treeView.reveal({index, uri});
		}
	});

	context.subscriptions.push(
		save, saveFromMenu, open, edit, remove, removeAll, treeView, refresh
	);
}

export function deactivate() {}
