// 交互式学生信息管理系统

// 导入学生管理系统
const { sms } = require('./studentManagementSystem');
const readline = require('readline');

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 菜单显示函数
function showMenu() {
  console.log('\n===== 学生信息管理系统 =====');
  console.log('1. 添加学生');
  console.log('2. 根据学号查询学生');
  console.log('3. 根据学号修改学生信息');
  console.log('4. 根据学号删除学生');
  console.log('5. 查看所有学生');
  console.log('0. 退出系统');
  console.log('=========================');
  rl.question('请选择操作 (0-5): ', handleMenuChoice);
}

// 处理菜单选择
function handleMenuChoice(choice) {
  switch (choice) {
    case '1':
      addStudent();
      break;
    case '2':
      findStudentById();
      break;
    case '3':
      updateStudent();
      break;
    case '4':
      deleteStudent();
      break;
    case '5':
      showAllStudents();
      break;
    case '0':
      console.log('感谢使用学生信息管理系统，再见！');
      rl.close();
      break;
    default:
      console.log('无效的选择，请重新输入！');
      showMenu();
  }
}

// 添加学生功能
function addStudent() {
  rl.question('请输入学号: ', (id) => {
    rl.question('请输入姓名: ', (name) => {
      rl.question('请输入年龄: ', (ageStr) => {
        const age = parseInt(ageStr);
        rl.question('请输入专业: ', (major) => {
          const result = sms.addStudent(id, name, age, major);
          if (result.success) {
            console.log('\n✅ 添加成功！学生信息:');
            console.log(result.data);
          } else {
            console.log(`\n❌ 添加失败: ${result.message}`);
          }
          showMenu();
        });
      });
    });
  });
}

// 查询学生功能
function findStudentById() {
  rl.question('请输入要查询的学号: ', (id) => {
    const result = sms.findStudentById(id);
    if (result.success) {
      console.log('\n✅ 查询成功！学生信息:');
      console.log(result.data);
    } else {
      console.log(`\n❌ 查询失败: ${result.message}`);
    }
    showMenu();
  });
}

// 修改学生功能
function updateStudent() {
  rl.question('请输入要修改的学生学号: ', (id) => {
    // 先查询学生是否存在
    const findResult = sms.findStudentById(id);
    if (!findResult.success) {
      console.log(`\n❌ ${findResult.message}`);
      showMenu();
      return;
    }

    console.log('\n当前学生信息:');
    console.log(findResult.data);
    console.log('\n请输入要修改的信息（直接回车跳过不修改）:');
    
    rl.question(`年龄 [${findResult.data.age}]: `, (ageStr) => {
      const age = ageStr ? parseInt(ageStr) : undefined;
      rl.question(`专业 [${findResult.data.major}]: `, (major) => {
        const updates = {};
        if (age !== undefined) updates.age = age;
        if (major) updates.major = major;

        const result = sms.updateStudent(id, updates);
        if (result.success) {
          console.log('\n✅ 修改成功！更新后的学生信息:');
          console.log(result.data);
        } else {
          console.log(`\n❌ 修改失败: ${result.message}`);
        }
        showMenu();
      });
    });
  });
}

// 删除学生功能
function deleteStudent() {
  rl.question('请输入要删除的学生学号: ', (id) => {
    rl.question(`确定要删除学号为${id}的学生吗？(y/n): `, (confirm) => {
      if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
        const result = sms.deleteStudent(id);
        if (result.success) {
          console.log(`\n✅ ${result.message}`);
        } else {
          console.log(`\n❌ 删除失败: ${result.message}`);
        }
      } else {
        console.log('已取消删除操作');
      }
      showMenu();
    });
  });
}

// 显示所有学生
function showAllStudents() {
  const students = sms.getAllStudents();
  if (students.length === 0) {
    console.log('\n📝 当前没有学生信息');
  } else {
    console.log('\n📝 所有学生信息:');
    students.forEach((student, index) => {
      console.log(`\n${index + 1}. 学号: ${student.id}`);
      console.log(`   姓名: ${student.name}`);
      console.log(`   年龄: ${student.age}`);
      console.log(`   专业: ${student.major}`);
    });
    console.log(`\n总计: ${students.length} 名学生`);
  }
  showMenu();
}

// 启动系统
console.log('欢迎使用学生信息管理系统！\n');
showMenu();

// 处理退出信号
process.on('SIGINT', () => {
  console.log('\n\n感谢使用学生信息管理系统，再见！');
  rl.close();
  process.exit(0);
});