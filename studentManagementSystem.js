// 学生信息管理系统

// 学生信息接口定义
class Student {
  constructor(id, name, age, major) {
    this.id = id;      // 学号
    this.name = name;  // 姓名
    this.age = age;    // 年龄
    this.major = major; // 专业
  }
}

// 学生管理类
class StudentManagementSystem {
  constructor() {
    // 内存数组存储学生信息
    this.students = [];
  }

  /**
   * 添加学生
   * @param {string} id - 学号
   * @param {string} name - 姓名
   * @param {number} age - 年龄
   * @param {string} major - 专业
   * @returns {Object} 操作结果
   */
  addStudent(id, name, age, major) {
    // 参数验证
    if (!id || !name || age === undefined || !major) {
      return { success: false, message: '参数不完整，请填写所有学生信息' };
    }

    // 验证年龄是否为数字
    if (isNaN(age) || age <= 0) {
      return { success: false, message: '年龄必须是大于0的数字' };
    }

    // 检查学号是否已存在
    const existingStudent = this.students.find(student => student.id === id);
    if (existingStudent) {
      return { success: false, message: `学号${id}已存在` };
    }

    // 创建新学生并添加到数组
    const newStudent = new Student(id, name, age, major);
    this.students.push(newStudent);
    return { success: true, message: '学生添加成功', data: newStudent };
  }

  /**
   * 根据学号查询学生
   * @param {string} id - 学号
   * @returns {Object} 操作结果
   */
  findStudentById(id) {
    if (!id) {
      return { success: false, message: '学号不能为空' };
    }

    const student = this.students.find(student => student.id === id);
    if (!student) {
      return { success: false, message: `未找到学号为${id}的学生` };
    }

    return { success: true, data: student };
  }

  /**
   * 根据学号修改学生信息
   * @param {string} id - 学号
   * @param {Object} updates - 要修改的信息
   * @returns {Object} 操作结果
   */
  updateStudent(id, updates) {
    if (!id) {
      return { success: false, message: '学号不能为空' };
    }

    const studentIndex = this.students.findIndex(student => student.id === id);
    if (studentIndex === -1) {
      return { success: false, message: `未找到学号为${id}的学生` };
    }

    // 验证更新的字段
    if (updates.age !== undefined) {
      if (isNaN(updates.age) || updates.age <= 0) {
        return { success: false, message: '年龄必须是大于0的数字' };
      }
      this.students[studentIndex].age = updates.age;
    }

    if (updates.major) {
      this.students[studentIndex].major = updates.major;
    }

    return { success: true, message: '学生信息更新成功', data: this.students[studentIndex] };
  }

  /**
   * 根据学号删除学生
   * @param {string} id - 学号
   * @returns {Object} 操作结果
   */
  deleteStudent(id) {
    if (!id) {
      return { success: false, message: '学号不能为空' };
    }

    const studentIndex = this.students.findIndex(student => student.id === id);
    if (studentIndex === -1) {
      return { success: false, message: `未找到学号为${id}的学生` };
    }

    this.students.splice(studentIndex, 1);
    return { success: true, message: '学生删除成功' };
  }

  /**
   * 获取所有学生信息
   * @returns {Array} 学生列表
   */
  getAllStudents() {
    return this.students;
  }
}

// 主程序测试
function main() {
  const sms = new StudentManagementSystem();
  console.log('===== 学生信息管理系统 =====\n');

  // 测试添加学生
  console.log('1. 添加学生:');
  const addResult = sms.addStudent('2023001', '张三', 20, '计算机科学');
  console.log(addResult);
  console.log('\n当前学生列表:', sms.getAllStudents());
  console.log('\n------------------------\n');

  // 测试查询学生
  console.log('2. 查询学生:');
  const findResult = sms.findStudentById('2023001');
  console.log(findResult);
  console.log('\n------------------------\n');

  // 测试修改学生
  console.log('3. 修改学生专业:');
  const updateResult = sms.updateStudent('2023001', { major: '软件工程' });
  console.log(updateResult);
  console.log('\n修改后的学生信息:', sms.findStudentById('2023001').data);
  console.log('\n------------------------\n');

  // 测试删除学生
  console.log('4. 删除学生:');
  const deleteResult = sms.deleteStudent('2023001');
  console.log(deleteResult);
  console.log('\n删除后学生列表:', sms.getAllStudents());
  console.log('\n------------------------\n');

  // 测试边界情况
  console.log('5. 测试边界情况:');
  console.log('添加已存在学生:', sms.addStudent('2023001', '李四', 21, '数学'));
  console.log('查询不存在学生:', sms.findStudentById('2023999'));
  console.log('\n===== 测试完成 =====');
}

// 运行主程序
sms = new StudentManagementSystem();

// 导出类供外部使用（如果需要）
module.exports = { StudentManagementSystem, sms };

// 当直接运行此脚本时执行测试
if (require.main === module) {
  main();
}