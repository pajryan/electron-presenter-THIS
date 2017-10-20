const BrowserWindow = require('electron').BrowserWindow;

export const editMenuTemplate = {
  label: 'Edit',
  submenu: [
    { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
    { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
    { type: 'separator' },
    { label: 'Settings', accelerator: 'Shift+CmdOrCtrl+T', selector: 'settings:',
      click: () => {
        var focusedWindow = BrowserWindow.getFocusedWindow();
        focusedWindow.webContents.send('open-settings');
      }
    },
    { type: 'separator' },
    { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
    { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
    { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
    { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
  ],
};
