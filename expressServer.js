const express = require('express');
const app = express();

// 应用程序会启动服务器，并在端口 3000 上侦听连接。此应用程序以“Hello World!”响应针对根 URL (/) 或路由的请求。对于其他所有路径，它将以 404 Not Found 进行响应。
app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
