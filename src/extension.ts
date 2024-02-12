import * as vscode from 'vscode';
import { SpeedDial } from './speed-dial';

export function activate(context: vscode.ExtensionContext) {

	const speedDial = new SpeedDial(context);

	const save = vscode.commands.registerCommand('speed-dial.save', index => speedDial.save(index));
	const saveFromMenu = vscode.commands.registerCommand('speed-dial.saveFromMenu', ({index}) => speedDial.save(index));
	const open = vscode.commands.registerCommand('speed-dial.open', index => speedDial.open(index));
	const edit = vscode.commands.registerCommand('speed-dial.edit', bookmark => speedDial.edit(bookmark));
	const remove = vscode.commands.registerCommand('speed-dial.remove',  bookmark => speedDial.remove(bookmark));
	const removeAll = vscode.commands.registerCommand('speed-dial.removeAll',  () => speedDial.removeAll());

	context.subscriptions.push(
		save, saveFromMenu, open, edit, remove, removeAll
	);
}

export function deactivate() {}
