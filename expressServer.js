const redis = require('redis');
const express = require('express');
const bodyParser = require('body-parser');
const StudentModule = require('./src/student')

const client = redis.createClient('6379', '127.0.0.1');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

let accessCount = 0;
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  accessCount++;
  client.set('accessCount', accessCount, redis.print);
  client.get('accessCount', (err, res) => {
    console.log(res);
  });
});

app.get('/students', (req, res) => {
  const numsQueryStr = req.query.queryStr;
  const isQueryStrValid = StudentModule.Student.validateQueryString(numsQueryStr);
  let result = [];

  if(isQueryStrValid) {
    if(!numsQueryStr) {
      client.keys("stu:*", function (err, reply) {
        if (reply) {
            client.mget(reply, function (mgetErr, mgetReply) {
                mgetReply.forEach((mgetItem, index) => {
                    result.push(JSON.parse(mgetItem));
                    if (index == mgetReply.length - 1) {
                        res.send(result);
                    }
                });
            })
        } else {
            res.send('')
        }
      });
    } else {
      let searchNos = numsQueryStr.split(', ');
        searchNos.forEach((studentNo, index) => {
            let key = `stu:${studentNo}`;
            client.get(key, function (err, reply) {
                if (reply != null) {
                    result.push(JSON.parse(reply));
                }
                if (index == searchNos.length - 1) {
                    res.send(result);
                }
            })
        });
    }
  } else {
    res.status(400).send('请按正确的格式输入查询字符串')
  }
});

app.post('/addStudent', (req, res) => {
  const inputAttr = ["inputName", "inputNum", "ethnic", "inputClass",
     "inputMandarinScore", "inputMathScore", "inputEnglishScore", "inputProgrammingScore"];
  const inputData = inputAttr.map(ele => {
     return req.body[ele];
   });
  const inputStr = inputData.join(", ");
  const isInputStrValid = StudentModule.Student.validateStudentString(inputStr);

  let key = `stu:${inputData[1]}`;
  client.get(key, (err, student) => {
      if(isInputStrValid) {
          if(student == null) {
              const student = StudentModule.Student.initStudentFromString(inputStr);
              client.set(key, JSON.stringify(student));
              res.send(student);
          } else {
              res.status(400).send('该学号已存在')
          }
      } else {
          res.status(400).send('请按正确的格式输入要打印的学生的学号（格式： 学号, 学号,…）')
      }
  });
});

app.put('/students/:id', (req, res) => {
  const stuNum = req.params.id;
  const inputObj = req.body;
  const inputData = [inputObj.alterName, inputObj.alterNum, inputObj.alterEthnic, inputObj.alterClass,
    inputObj.alterMandarinScore, inputObj.alterMathScore, inputObj.alterEnglishScore, inputObj.alterProgrammingScore];
  const inputStr = inputData.join(", ");
  const isInputStrValid = StudentModule.Student.validateStudentString(inputStr);

  let key = `stu:${stuNum}`;
  client.get(key, () => {
    if(isInputStrValid) {
        const student = StudentModule.Student.initStudentFromString(inputStr);
        client.set(key, JSON.stringify(student));
        res.send(student);
    } else {
        res.status(400).send('请按正确的格式输入要修改的学生的信息（格式： 学号, 学号,…）')
    }
  });
});

app.delete('/students/:id', (req, res) => {
  const stuNum = req.params.id;
  let key = `stu:${stuNum}`;
  client.get(key, (err, reply) => {
    if(reply) {
      client.del(key);
      res.send({
        statusCode: 200,
        msg: "该学生已成功删除"
      });
    } else {
      res.send({
        statusCode: 400,
        msg: "该学生不存在"
      });
    }
  });
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
