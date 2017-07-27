const redis = require('redis');
const express = require('express');
const bodyParser = require('body-parser');

const client = redis.createClient('6379', '127.0.0.1');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// 应用程序会启动服务器，并在端口 3000 上侦听连接。此应用程序以“Hello World!”响应针对根 URL (/) 或路由的请求。对于其他所有路径，它将以 404 Not Found 进行响应。
let accessCount = 0;
app.get('/', (req, res) => {
  // res.send('hello world');
  res.sendFile('index.html', {root: './'});
  accessCount++;
  client.set('accessCount', accessCount, redis.print);
  client.get('accessCount', (err, res) => {
    console.log(res);
  });

});

app.post('/add-anything', (req, res) => {
  const userName = req.body.userName;
  const age = req.body.age;
  client.hmset("formData", {
    "userName": userName,
    "age": age
  });
  client.hgetall("formData", (err, resObj) => {
    console.dir(resObj);
    res.send(resObj);
  });
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
