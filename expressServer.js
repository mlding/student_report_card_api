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
    res.status(400).send({
        statusCode: 400,
        errMsg: '请按正确的格式输入查询字符串'
    })
  }
});


app.post('/student', (req, res) => {
  const inputAttr = ["inputName", "inputNum", "ethnic", "inputClass",
     "inputMandarinScore", "inputMathScore", "inputEnglishScore", "inputProgrammingScore"];
  const inputData = inputAttr.map(ele => {
     return req.body[ele];
   });
  const inputStr = inputData.join(", ");
  const isInputStrValid = StudentModule.Student.validateStudentString(inputStr);
  // client.flushdb( function (err, succeeded) {
  //     console.log(succeeded); // will be true if successfull
  // });

  let key = `stu:${inputData[1]}`;
  client.get(key, (err, student) => {
      if(isInputStrValid) {
          if(student == null) {
              const student = StudentModule.Student.initStudentFromString(inputStr);
              client.set(key, JSON.stringify(student));
              res.send(student);
          } else {
              res.status(400).send({
                  statusCode: 400,
                  errMsg: '该学号已存在'
              })
          }
      } else {
          res.status(400).send({
              statusCode: 400,
              errMsg: '请按正确的格式输入要打印的学生的学号（格式： 学号, 学号,…）'
          })
      }
  });
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
