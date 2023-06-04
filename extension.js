const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"react-component-with-sass.create-component",
		async (resource) => {
			let folderUri;
			if (resource && resource.fsPath) {
				folderUri = resource;
			} else {
				folderUri = vscode.workspace.workspaceFolders
					? vscode.workspace.workspaceFolders[0].uri
					: null;
			}

			if (!folderUri) {
				vscode.window.showErrorMessage("Could not determine the target folder.");
				return;
			}

			let folderName = await vscode.window.showInputBox({
				prompt: "Eingabe Name der Komponente"
			});

			if (!folderName) {
				vscode.window.showErrorMessage("Invalid folder name");
				return;
			}

			folderName = toPascalCase(folderName);
			console.log("🚀 ~ file: extension.js:33 ~ folderName:", folderName);

			const folderPath = folderUri.fsPath;

			const folderUriToCreate = vscode.Uri.file(path.join(folderPath, folderName));
			fs.mkdirSync(folderUriToCreate.fsPath);

			const jsxContent = `import React from "react";
import styles from "./${folderName}.module.scss";

const ${folderName} = () => {
  return <div className={styles.root}></div>;
};

export default ${folderName};
`;

			const scssContent = `@use "@theme" as theme;

.root {
}
`;

			const jsxPath = path.join(folderUriToCreate.fsPath, `index.jsx`);
			const scssPath = path.join(folderUriToCreate.fsPath, `${folderName}.module.scss`);

			fs.writeFileSync(jsxPath, jsxContent);
			fs.writeFileSync(scssPath, scssContent);

			vscode.window.showInformationMessage(
				`Folder "${folderName}" with files created successfully!`
			);
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

function toPascalCase(string) {
	return string.replace(/(?:^\w|\b\w)/g, (match) => match.toUpperCase()).replace(/\s+/g, "");
}

module.exports = {
	activate,
	deactivate
};
