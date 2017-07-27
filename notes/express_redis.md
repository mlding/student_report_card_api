## Express
高度包容，快速极简的Node.js Web框架。可以快速地搭建一个完整功能的网站

- req.body is undefined   
express 4.x版本中, 已经将bodyParser中间件分离了，需要单独安装模块，就可以对post进行解析了。
默认依赖了bodyParser ,可以用来解析常规的表单提交。

```
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));

```


- response指令

```
res.download()	提示将要下载文件。
res.end()	结束响应进程。
res.json()	发送 JSON 响应。
res.jsonp()	在 JSONP 的支持下发送 JSON 响应。
res.redirect()	重定向请求。
res.render()	呈现视图模板。
res.send()	发送各种类型的响应。
res.sendFile	以八位元流形式发送文件。
res.sendStatus()	设置响应状态码并以响应主体形式发送其字符串表示。
```

#### Express解析路径请求及对应的获取路径有以下几种形式
- req.query

```
// GET /search?q=tobi+ferret  
req.query.q  
// => "tobi ferret"  

// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse  
req.query.order  
// => "desc"  

req.query.shoe.color  
// => "blue"  

req.query.shoe.type  
// => "converse"
```

- req.body

```
// POST user[name]=tobi&user[email]=tobi@learnboost.com  
req.body.user.name  
// => "tobi"  

req.body.user.email  
// => "tobi@learnboost.com"  

// POST { "name": "tobi" }  
req.body.name  
// => "tobi"

```

- req.params

```
// GET /user/tj  
req.params.name  
// => "tj"  

// GET /file/javascripts/jquery.js  
req.params[0]  
// => "javascripts/jquery.js"
```

- req.param(name)

```
// ?name=tobi  
req.param('name')  
// => "tobi"  

// POST name=tobi  
req.param('name')  
// => "tobi"  

// /user/tobi for /user/:name   
req.param('name')  
// => "tobi"
```

## 四种常见的 POST 提交数据方式

1. x-www-form-urlencoded. 浏览器的原生 <form> 表单，如果不设置 enctype 属性，那么最终就会以 application/x-www-form-urlencoded 方式提交数据。它会将表单内的数据转换为键值对，如name=ding&age=12
2. form-data -> http请求中的multipart/form-data，它会将表单的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。
3. raw 它可以上传任意格式的文本，也可以上传text,json,xml,html...
4. binary 相当于Content-Type:application/octet-stream。它只能上传二进制数据，通常用来上传文件，由于没有键值，所以一次只能上传一个文件。

#### multipart/form-data与x-www-form-urlencoded区别
               
- multipart/form-data：既可以上传文件等二进制数据，也可以上传表单键值对，只是最后会转化为一条信息；
- x-www-form-urlencoded：只能上传键值对，并且键值对都是间隔分开的。


## Redis
Redis 是一个开源的，内存中的数据结构存储系统，它可以用作数据库、缓存和消息中间件。 它支持多种类型的数据结构.


[install](http://www.runoob.com/redis/redis-install.html)

[初识Redis](http://redisinaction.com/preview/chapter1.html)

#####dump.rdb是由Redis服务器自动生成的.默认情况下 每隔一段时间redis服务器程序会自动对数据库做一次遍历，把内存快照写在一个叫做“dump.rdb”的文件里，这个持久化机制叫做SNAPSHOT。有了SNAPSHOT后，如果服务器宕机，重新启动redis服务器程序时redis会自动加载dump.rdb，将数据库状态恢复到上一次做SNAPSHOT时的状态。 

## 常用命令

```
启动 Redis: redis-server
查看 redis 是否启动: redis-cli
ping
```

## Using Express Redis with Node.js
- apt-get install redis-server
- redis-server(启动 Redis)
- redis-cli(查看 redis 是否启动？)
- 在学生成绩单API项目根目录下面，

```
npm install express body-parser redis --save
在项目根目录下面的package.json文件中检查，
"dependencies": {
    "body-parser": "^1.17.2",
    "express": "^4.15.3",
    "redis": "^2.7.1"
  }
```
- [express Nodejs](http://www.runoob.com/nodejs/nodejs-express-framework.html)
- [redis Nodejs](https://www.npmjs.com/package/redis)
- 最后就可以在Nodejs中愉快地使用express， redis了。


```
var redis = require('redis');
var client = redis.createClient(port, host); //creates a new client, will use 6379 127.0.0.1
```
Now, you can perform some action once a connection has been established. Basically, you just need to listen for connect events as shown below.
```
client.on('connect', function() {
    console.log('connected');
});
```

### storing kye-value pairs

#### storing strings

```
client.set('userName', 'ding', function(err, reply) {
  console.log(reply);
});

client.get('userName', function(err, reply) {
  console.log(reply);
});
```

#### storing hash(objects)

```
client.hmset('formData', {
	"userName": userName,
    "age": age
});

client.hgetall('formData', function(err, object) {
    console.log(object);
});
```

#### storing lists(rpush, lpush, lrange)

```
//creates a list called frameworks and pushes two elements to it
client.rpush(['frameworks', 'angularjs', 'backbone'], function(err, reply) {
    console.log(reply); //prints 2
});

client.lrange('frameworks', 0, -1, function(err, reply) {
    console.log(reply); // ['angularjs', 'backbone']
});
```

#### storing sets(No duplicates)

```
client.sadd(['tags', 'angularjs', 'backbonejs', 'emberjs'], function(err, reply) {
    console.log(reply); // 3
});

client.smembers('tags', function(err, reply) {
    console.log(reply);
});
```

