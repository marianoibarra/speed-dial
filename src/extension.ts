import * as vscode from 'vscode';
import { SpeedDial } from './speed-dial';
import { Store } from './store';
import { TreeProvider } from './tree-provider';

export function activate(context: vscode.ExtensionContext) {
	const store = new Store(context);
	const speedDial = new SpeedDial(store);
	const treeDataProvider = new TreeProvider(store);
	
	const treeView = vscode.window.createTreeView('speedDial', { treeDataProvider });

	vscode.window.onDidChangeActiveTextEditor((textEditor?: vscode.TextEditor) => {
		if(!textEditor) { return; }

		const uri = textEditor.document.uri;
		const index = store.indexOf(uri);
		if(index) {
			treeView.reveal({index, uri});
		}
	});

	context.subscriptions.push(
		vscode.commands.registerCommand('speed-dial.save', ({index}) => speedDial.save(Number(index))),
		vscode.commands.registerCommand('speed-dial.saveKB', ({index}) => speedDial.save(Number(index))),
		vscode.commands.registerCommand('speed-dial.open', ({index}) => speedDial.open(Number(index))),
		vscode.commands.registerCommand('speed-dial.openKB', ({index}) => speedDial.open(Number(index))),
		vscode.commands.registerCommand('speed-dial.openCP', () => speedDial.openCP()),
		vscode.commands.registerCommand('speed-dial.remove', ({index}) => speedDial.remove(Number(index))),
		vscode.commands.registerCommand('speed-dial.removeKB', ({index}) => speedDial.remove(Number(index))),
		vscode.commands.registerCommand('speed-dial.edit', bookmark => speedDial.edit(bookmark)),
		vscode.commands.registerCommand('speed-dial.clear',  () => speedDial.clear()),
		vscode.commands.registerCommand('speed-dial.refresh', () => treeDataProvider.refresh()),
	);
}

export function deactivate() {}
