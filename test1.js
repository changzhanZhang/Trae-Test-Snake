// 由于是 JavaScript 文件，不能使用 TypeScript 的类型别名，以下使用对象字面量形式表示结构示意
// 原代码里的类型声明部分在此文件中仅作注释示意
const exampleUser = {
    Id: string, //用户ID
    Name: string,//用户姓名
    Age: number,//用户年龄
    Email: string,//用户邮箱
    Status: 'ACTIVE' | 'INACTIVE',//用户状态
}
/**
 * 查找所有活跃用户
 * @param users 用户列表
 * @returns {User[]} 活跃用户列表
 */
async function getActiveUsers(users) {
    const activeUsers = await users.filter(user => user.Status === 'ACTIVE');
    return activeUsers;
}
