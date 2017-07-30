## AJAX
AJAX = Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）。

AJAX 不是新的编程语言，而是一种使用现有标准的新方法。
AJAX 是与服务器交换数据并更新部分网页的艺术，在不重新加载整个页面的情况下。

就是利用JS来无刷新与后端交互，通过get和post方式把数据发送到后端，或者请求后端的数据，然后根据请求的数据进行改变DOM节点等操作，从而取消掉用form的submit方式一提交就会跳转页面的情况


#### 原生JS实现AJAX
所有现代浏览器（IE7+、Firefox、Chrome、Safari 以及 Opera）均内建 XMLHttpRequest 对象

1. GET

```
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET","demo_get.php?id=1&name=lemoo&t=" + Math.random(),true);
xmlhttp.send();

```

- 传递参数直接在?后指定，多个参数用&分隔
- GET请求同一URL时会有缓存，通过参数是否一致来判断
- 解决缓存问题，加个时间戳使每次参数不一致，上例中的t=Math.random()


2. POST

```
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST","ajax_test.php",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Bill&lname=Gates");
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  }
```

  
- POST没有缓存
- POST发送的数据量大
- AJAX无法发送文件
- readyState改变时触发onreadystatechange事件，4为完成
- status是返回状态，200是成功，404是未找到页面
- responseText是返回的数据，为字符串格式


[AJAX详细教程](http://www.w3school.com.cn/ajax/index.asp)

[常用的HTTP方法GET，POST](http://www.w3school.com.cn/tags/html_ref_httpmethods.asp)

[JSON](http://www.w3school.com.cn/json/index.asp)

[同步异步](https://segmentfault.com/a/1190000004322358)