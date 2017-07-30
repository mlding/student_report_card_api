class Student {

  constructor(name, num, ethnic, klass, mandarinScore, mathScore, englishScore, programmingScore) {
    this.name = name;
    this.num = num;
    this.ethnic = ethnic;
    this.klass = klass;
    this.mandarinScore = mandarinScore;
    this.mathScore = mathScore;
    this.englishScore = englishScore;
    this.programmingScore = programmingScore;
    this.totalScore = (Number(this.mandarinScore) + Number(this.mathScore) + Number(this.englishScore) + Number(this.programmingScore));
    this.averageScore = (this.totalScore / 4);
  }

  save() {
    localStorage.setItem(this.num, JSON.stringify(this));
  }

  static initStudentFromString(studentString){
    const re = /([\u4e00-\u9fa5]{1,4}), ([0-9]{2}), ([\u4e00-\u9fa5]), ([\u4e00-\u9fa5]{1,10}), ([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3})/;
    let name, num, ethnic, klass, mandarinScore, mathScore, englishScore, programmingScore;
    [name, num, ethnic, klass, mandarinScore, mathScore, englishScore, programmingScore] = studentString.match(re).slice(1);
    return new Student(name, num, ethnic, klass, mandarinScore, mathScore, englishScore, programmingScore);
  }

  static validateStudentString(studentString){
    const re = /^[\u4e00-\u9fa5]{1,4}, [0-9]{2}, [\u4e00-\u9fa5], [\u4e00-\u9fa5]{1,10}, [0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}$/;
    return re.test(studentString);
  }

  static validateQueryString(queryString){
    const re = /^[0-9]{2}(, [0-9]{2})*$/;
    return re.test(queryString);
  }

  static query(queryString, allStudentInfo){
    return allStudentInfo.filter((student) => {
      return queryString.split(', ').includes(student.num);
    });
  }

  static averageOfTotalScoreSum(students){
    if (students.length === 0){
      return 0;
    }

    return students.map((student) => {
      return student.totalScore;
    }).reduce((totalScoreSum, totalScore) => {
      return totalScoreSum + totalScore;
    }) / students.length;
  }

  static medianOfTotalScoreSum(students){
    if (students.length === 0){
      return 0;
    }

    return students.map((student) => {
      return student.totalScore;
    }).sort((left, right) => {
      return left - right;
    })[Math.round(students.length / 2) - 1];
  }
}

module.exports.Student = Student;
