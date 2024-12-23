const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSources: (options) => ipcRenderer.invoke('get-sources', options),
});
