import * as vscode from 'vscode';
import { SpeedDial } from './speed-dial';

export function activate(context: vscode.ExtensionContext) {


	const speedDial = new SpeedDial(context);

	const save0 = vscode.commands.registerCommand('speed-dial.save-0', () => speedDial.save(0));
	const save1 = vscode.commands.registerCommand('speed-dial.save-1', () => speedDial.save(1));
	const save2 = vscode.commands.registerCommand('speed-dial.save-2', () => speedDial.save(2));
	const save3 = vscode.commands.registerCommand('speed-dial.save-3', () => speedDial.save(3));
	const save4 = vscode.commands.registerCommand('speed-dial.save-4', () => speedDial.save(4));
	const save5 = vscode.commands.registerCommand('speed-dial.save-5', () => speedDial.save(5));
	const save6 = vscode.commands.registerCommand('speed-dial.save-6', () => speedDial.save(6));
	const save7 = vscode.commands.registerCommand('speed-dial.save-7', () => speedDial.save(7));
	const save8 = vscode.commands.registerCommand('speed-dial.save-8', () => speedDial.save(8));
	const save9 = vscode.commands.registerCommand('speed-dial.save-9', () => speedDial.save(9));
	const open0 = vscode.commands.registerCommand('speed-dial.open-0', () => speedDial.open(0));
	const open1 = vscode.commands.registerCommand('speed-dial.open-1', () => speedDial.open(1));
	const open2 = vscode.commands.registerCommand('speed-dial.open-2', () => speedDial.open(2));
	const open3 = vscode.commands.registerCommand('speed-dial.open-3', () => speedDial.open(3));
	const open4 = vscode.commands.registerCommand('speed-dial.open-4', () => speedDial.open(4));
	const open5 = vscode.commands.registerCommand('speed-dial.open-5', () => speedDial.open(5));
	const open6 = vscode.commands.registerCommand('speed-dial.open-6', () => speedDial.open(6));
	const open7 = vscode.commands.registerCommand('speed-dial.open-7', () => speedDial.open(7));
	const open8 = vscode.commands.registerCommand('speed-dial.open-8', () => speedDial.open(8));
	const open9 = vscode.commands.registerCommand('speed-dial.open-9', () => speedDial.open(9));
	const clear = vscode.commands.registerCommand('speed-dial.clear',  () => speedDial.clear());

	context.subscriptions.push(
		save0, save1, save2, save3, save4, save5, save6, save7, save8, save9,
		open0, open1, open2, open3, open4, open5, open6, open7, open8, open9,
		clear
	);
}

export function deactivate() {}
