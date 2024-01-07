# Easy CodeSnap

![Banner](https://raw.githubusercontent.com/ArthurLobopro/easy-codesnap/main/screenshots/banner.png)

## Features

- Quickly save screenshots of your code
- Copy screenshots to your clipboard
- Appearance configurable
- Import your settings from CodeSnap
- One time settings
- Lock changes
- Link on editor

## How to Use

- Select the code from your editor
- Click on the camera icon on vscode statusbar

![icon screenshot](https://raw.githubusercontent.com/ArthurLobopro/easy-codesnap/master/screenshots/screenshot-icon.png)

- You can also use the **`Easy CodeSnap`** command in your command palette.

- Make the final adjustments and take your code snapshot.

![](https://raw.githubusercontent.com/ArthurLobopro/easy-codesnap/main/screenshots/one-time-config.gif)

## Commands

- You can take your code snapshot from the command palette using the **`Easy CodeSnap`** command
- You can import your CodeSnap configuration using the **`Import CodeSnap Settings`** command

## Extension Settings

The Easy CodeSnap configuration is like the CodeSnap configuration:

**`easy-codesnap.backgroundColor`:** The background color of the snippet's container. Can be any valid CSS color.

**`easy-codesnap.boxShadow`:** The CSS box-shadow for the snippet. Can be any valid CSS box shadow.

**`easy-codesnap.containerPadding`:** The padding for the snippet's container. Can be any valid CSS padding.

**`easy-codesnap.roundedCorners`:** Boolean value to use rounded corners or square corners for the window.

**`easy-codesnap.showWindowControls`:** Boolean value to show or hide OS X style window buttons.

**`easy-codesnap.showWindowTitle`:** Boolean value to show or hide window title `folder_name - file_name`.

**`easy-codesnap.showLineNumbers`:** Boolean value to show or hide line numbers.

**`easy-codesnap.realLineNumbers`:** Boolean value to start from the real line number of the file instead of 1.

**`easy-codesnap.transparentBackground`:** Boolean value to use a transparent background when taking the screenshot.

**`easy-codesnap.target`:** Either `container` to take the screenshot with the container, or `window` to only take the window.

**`easy-codesnap.shutterAction`:** Either `save` to save the screenshot into a file, or `copy` to copy the screenshot into the clipboard.

**`easy-codesnap.saveFormat`:** Format to save the code snap.

**`easy-codesnap.enableResizing`:** Boolean value to enable resizing the snap container

**`easy-codesnap.roundingLevel`:** Level to border rounding, only applied when `easy-codesnap.roundedCorners` is `true`

**`easy-codesnap.lockOnOpen`:** If the Snap Screen needs to be locked on open

**`easy-codesnap.linkOnOpen`:** If the Snap Screen needs to be linked to editor on open

## Acknowledgments

Thank you very much [kufii](https://github.com/kufii/) to made the [CodeSnap extension](https://github.com/kufii/CodeSnap), the base of this project.