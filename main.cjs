const path = require('path');
const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1384,      // Chiều rộng mặc định
    height: 768,      // Chiều cao mặc định
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Tải file index.html từ thư mục dist
  mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

  // Xử lý sự kiện đóng cửa sổ
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Khởi chạy ứng dụng khi Electron đã sẵn sàng
app.on('ready', createWindow);

// Thoát ứng dụng khi tất cả cửa sổ đã đóng (trừ macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Tạo cửa sổ mới nếu ứng dụng được kích hoạt (macOS)
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
