import { homedir } from 'os'
import path from 'path'
import * as vscode from 'vscode'
import { importSettings } from "./importSettings"
import { createStatusbarButton } from "./statusBarButton"
import { getSettings, readHtml, writeFile } from './util'

const getConfig = () => {
	const editorSettings = getSettings('editor', ['fontLigatures', 'tabSize'])
	const editor = vscode.window.activeTextEditor
	if (editor) { editorSettings.tabSize = editor.options.tabSize }

	// const extensionSettings = getSettings('codesnap', [
	// 	'backgroundColor',
	// 	'boxShadow',
	// 	'containerPadding',
	// 	'roundedCorners',
	// 	'showWindowControls',
	// 	'showWindowTitle',
	// 	'showLineNumbers',
	// 	'realLineNumbers',
	// 	'transparentBackground',
	// 	'target',
	// 	'shutterAction'
	// ])

	const extensionSettings = vscode.workspace.getConfiguration("easy-codesnap")

	console.log(extensionSettings)
	console.log(vscode.workspace.getConfiguration("easy-codesnap"))

	const selection = editor && editor.selection
	const startLine = extensionSettings.realLineNumbers ? (selection ? selection.start.line : 0) : 0

	let windowTitle = ''
	if (editor && extensionSettings.showWindowTitle) {
		const activeFileName = editor.document.uri.path.split('/').pop()
		windowTitle = `${vscode.workspace.name} - ${activeFileName}`
	}

	return {
		...editorSettings,
		...extensionSettings,
		startLine,
		windowTitle
	}
}

const createPanel = async (context: vscode.ExtensionContext) => {
	const panel = vscode.window.createWebviewPanel(
		'easy-codesnap',
		'Easy CodeSnap 📸',
		{ viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(context.extensionPath)]
		}
	)
	panel.webview.html = await readHtml(
		path.resolve(context.extensionPath, 'webview/index.html'),
		panel
	)

	return panel
}

let lastUsedImageUri = vscode.Uri.file(path.resolve(homedir(), 'Desktop/code.png'))
const saveImage = async (data: string) => {
	const uri = await vscode.window.showSaveDialog({
		filters: { Images: ['png'] },
		defaultUri: lastUsedImageUri
	})

	lastUsedImageUri = uri as vscode.Uri

	uri && writeFile(uri.fsPath, Buffer.from(data, 'base64'))
}

const hasOneSelection = (selections: readonly vscode.Selection[]) =>
	selections && selections.length === 1 && !selections[0].isEmpty

const runCommand = async (context: vscode.ExtensionContext) => {
	const panel = await createPanel(context)

	const update = async () => {
		await vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction')
		panel.webview.postMessage({ type: 'update', ...getConfig() })
	}

	const flash = () => panel.webview.postMessage({ type: 'flash' })

	panel.webview.onDidReceiveMessage(async ({ type, data }) => {
		if (type === 'save') {
			flash()
			await saveImage(data)
		} else {
			vscode.window.showErrorMessage(`Easy CodeSnap 📸: Unknown shutterAction "${type}"`)
		}
	})

	const selectionHandler = vscode.window.onDidChangeTextEditorSelection(
		(e) => hasOneSelection(e.selections) && update()
	)
	panel.onDidDispose(() => selectionHandler.dispose())

	const editor = vscode.window.activeTextEditor
	if (editor && hasOneSelection(editor.selections)) { update() }
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('easy-codesnap.start', () => runCommand(context)),
		vscode.commands.registerCommand("easy-codesnap.importSettings", importSettings),
		createStatusbarButton()
	)
}

export function deactivate() { }
