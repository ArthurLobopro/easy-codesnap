# Easy CodeSnap

This project is fully based on [CodeSnap](https://github.com/kufii/CodeSnap) extension.

## Features

- Quickly save screenshots of your code
- Copy screenshots to your clipboard
- Appearence configurable
- Import your settings from CodeSnap
- One time settings

## How to Use

- Select the code from your editor
- Click in the camera icon in your statusbar

![icon screenshot](https://raw.githubusercontent.com/ArthurLobopro/easy-codesnap/master/screenshots/screenshot-icon.png)

- You can also use the **`Easy CodeSnap`** command in your command palette.

- Make the final adjusts and take your code snapshot.

![](https://raw.githubusercontent.com/ArthurLobopro/easy-codesnap/master/screenshots/one-time-config.gif)

## Commands

- You can take your code snapshot from the command palette using the **`Easy CodeSnap`** command
- You can import your CodeSnap configuration using the **`Import CodeSnap Settings`** command

## Extension Settings

The Easy CodeSnap configuration is like the CodeSnap configuration:

**`codesnap.backgroundColor`:** The background color of the snippet's container. Can be any valid CSS color.

**`codesnap.boxShadow`:** The CSS box-shadow for the snippet. Can be any valid CSS box shadow.

**`codesnap.containerPadding`:** The padding for the snippet's container. Can be any valid CSS padding.

**`codesnap.roundedCorners`:** Boolean value to use rounded corners or square corners for the window.

**`codesnap.showWindowControls`:** Boolean value to show or hide OS X style window buttons.

**`codesnap.showWindowTitle`:** Boolean value to show or hide window title `folder_name - file_name`.

**`codesnap.showLineNumbers`:** Boolean value to show or hide line numbers.

**`codesnap.realLineNumbers`:** Boolean value to start from the real line number of the file instead of 1.

**`codesnap.transparentBackground`:** Boolean value to use a transparent background when taking the screenshot.

**`codesnap.target`:** Either `container` to take the screenshot with the container, or `window` to only take the window.

**`codesnap.shutterAction`:** Either `save` to save the screenshot into a file, or `copy` to copy the screenshot into the clipboard.

## Acknowledgements

Thank you very much [kufii](https://github.com/kufii/) to make the [CodeSnap extension](https://github.com/kufii/CodeSnap), the base of this project.