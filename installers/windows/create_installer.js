// ./build_installer.js

// 1. Import Modules
const {
    MSICreator
} = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64",
const APP_DIR = path.resolve(__dirname, './../../build/tungsteno-launcher-win32-x64');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer",
const OUT_DIR = path.resolve(__dirname, './../../build/windows_installer');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,
    appIconPath: path.resolve(__dirname, './../../assets/logo_app.ico'),
    // Configure metadata
    description: 'Tungsteno Launcher helps you run the latest versions of Tungsten from your computer.',
    exe: 'tungsteno-launcher',
    name: 'Tungsteno Launcher',
    manufacturer: 'Tungsteno Community',
    version: '1.0.0',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {

    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});