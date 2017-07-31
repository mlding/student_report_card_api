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
  res.sendFile(__dirname + 'index.html');
  accessCount++;
  client.set('accessCount', accessCount, redis.print);
  client.get('accessCount', (err, res) => {
    console.log(res);
  });
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
                  errMsg: "该学号已存在"
              })
          }
      } else {
          res.status(400).send({
              statusCode: 400,
              errMsg: "请输入正确的格式..."
          })
      }
  });
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
