const StudentModule = require('./student');
const BASE_URL = "http://localhost:3000"

function fixedTwoDecimal(number) {
    return number.toFixed(2);
}

function fillStudentInfo(stuInfo) {
  const { name, num, ethnic, klass, mandarinScore, mathScore, englishScore, programmingScore } = stuInfo;
  $("#alterModal #alterName").val(name);
  $("#alterModal #alterNum").val(num);
  $("#alterModal #alterEthnic").val(ethnic);
  $("#alterModal #alterClass").val(klass);
  $("#alterModal #alterMandarinScore").val(mandarinScore);
  $("#alterModal #alterMathScore").val(mathScore);
  $("#alterModal #alterEnglishScore").val(englishScore);
  $("#alterModal #alterProgrammingScore").val(programmingScore);
}

$("#queryTab").click(function() {
  $("#numList").val('');
  $("table tr td").remove();
})

$("#allTab").click(function(e) {
  e.preventDefault();
  let studentsInfoStr = '';
  $("table tr td").remove();
  $.get(`/students?queryStr=`, {}, allStudentInfo => {
    allStudentInfo.forEach(studentInfo => {
       studentsInfoStr += `<tr><td>${studentInfo.name}</td><td>${studentInfo.num}</td><td>${studentInfo.ethnic}</td><td>${studentInfo.klass}</td><td>${studentInfo.mandarinScore}</td><td>${studentInfo.mathScore}</td><td>${studentInfo.englishScore}</td><td>${studentInfo.programmingScore}</td><td>${fixedTwoDecimal(studentInfo.averageScore)}</td><td>${fixedTwoDecimal(studentInfo.totalScore)}</td</tr>`;
    });
    $("table").append(studentsInfoStr);
  });
});

$("#queryBtn").click(function(e) {
  $("table tr td").remove();
  e.preventDefault();
  const numsQueryStr = $("#numList").val();

  let domStr = '';
  $.get(`/students?queryStr=${numsQueryStr}`, {}, students => {
    const response = `${students.map((student) => {
      return `<tr><td>${student.name}</td><td>${student.num}</td><td>${student.ethnic}</td><td>${student.klass}</td><td>${student.mandarinScore}</td><td>${student.mathScore}</td><td>${student.englishScore}</td><td>${student.programmingScore}</td><td>${fixedTwoDecimal(student.averageScore)}</td><td>${fixedTwoDecimal(student.totalScore)}</td><td><a class="alterLink" href="#" data-stu-num="${student.num}">修改</a></td><td><a class="deleteLink" href="#" data-stu-num="${student.num}">删除</a></td></tr>`;
    })}
<tr><td>全班总分平均数：${fixedTwoDecimal(StudentModule.Student.averageOfTotalScoreSum(students))}</td></tr>
<tr><td>全班总分中位数：${fixedTwoDecimal(StudentModule.Student.medianOfTotalScoreSum(students))}</td></tr></table>`;
    domStr = response;
    $("table").append(domStr);
  });

});

$("table").on("click", ".alterLink", function() {
  $("#alterModal").modal("show");
  const stuNum = $(this).data("stu-num");
  $.get(`/students?queryStr=${stuNum}`, {}, students => {
    fillStudentInfo(students[0]);
  });

  $("#alterStudentInfoBtn").click(function() {
    const inputObj = {
      'alterName': $('#alterName').val(),
      'alterNum': $('#alterNum').val(),
      'alterEthnic': $('#alterEthnic').val(),
      'alterClass': $('#alterClass').val(),
      'alterMandarinScore': $('#alterMandarinScore').val(),
      'alterMathScore': $('#alterMathScore').val(),
      'alterEnglishScore': $('#alterEnglishScore').val(),
      'alterProgrammingScore': $('#alterProgrammingScore').val()
    };

    $.ajax({
      type: 'PUT',
      data: inputObj,
      url:  BASE_URL + '/students/' + stuNum,
      dataType: 'JSONP'
    })

    $("#queryBtn").trigger('click');
  });
});

$("table").on("click", ".deleteLink", function() {
  $("#deleteModal").modal("show");
  const deleteStuNum = $(this).data("stu-num");

  $("#deleteStudentInfoBtn").click(function() {
    $.ajax({
      type: 'DELETE',
      url:  BASE_URL + '/students/' + deleteStuNum,
      dataType: 'JSONP'
    });

    $("#queryBtn").trigger('click');
  });
});

$(document).ready(function() {
  $("#allTab").trigger('click');
});
