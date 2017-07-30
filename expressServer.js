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
  // res.send('hello world');
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

  const allStudentInfo = JSON.parse(client.hgetall('allStudentInfo', function(err, allStudentInfo) {
    console.log(allStudentInfo);
  }));

  let isDuplicateNumStudent = false;
  if(allStudentInfo) {
      isDuplicateNumStudent = Object.keys(allStudentInfo).some(studentNum => {
          return studentNum === inputData[1];
      });
  }

  if(isInputStrValid && !isDuplicateNumStudent) {
    const student = StudentModule.Student.initStudentFromString(inputStr);
    const stuNum = student.num;

    client.hmset('allStudentInfo', {
        `${stuNum}`: JSON.stringify(student)
    });

    res.send(student);
  } else {
      res.send('404');
  }
});

app.listen(3000, () => {
  console.log('running on port 3000...');
});
