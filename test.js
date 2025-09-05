// 获取示例用户信息
function getUserInfo() {
    let user = {
        name: 'ai',
        age: 18
    }
    return user;
}

/** 
 * 根据ID获取用户信息 
 * @param {string} id 用户ID 
 * @param {Array} users 用户列表 
 * @returns {Object} 用户对象 
 */ 
async function getUserById(id, users) {
    // 模拟异步操作
    return new Promise((resolve, reject) => {
        try {
            // 检查参数
            if (!id || !Array.isArray(users)) {
                throw new Error('参数不正确');
            }
            
            // 在用户列表中查找ID匹配的用户
            const user = users.find(user => user.id === id);
            
            // 返回找到的用户或undefined
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

        /** 
 * 根据邮箱获取用户信息 
 * @param {string} email 用户邮箱 
 * @param {Array} users 用户列表 
 * @returns {Object} 用户对象 
 */ 
async function getUserByEmail(email, users) {
    // 模拟异步操作
    return new Promise((resolve, reject) => {
        try {
            // 检查参数
            if (!email || !Array.isArray(users)) {
                throw new Error('参数不正确');
            }
            
            // 简单的邮箱格式验证
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('邮箱格式不正确');
            }
            
            // 在用户列表中查找邮箱匹配的用户
            const user = users.find(user => user.email === email);
            
            // 返回找到的用户或undefined
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}

// 示例用法（注释掉避免直接执行）
/*
const sampleUsers = [
    { id: '1', name: '张三', age: 20, email: 'zhangsan@example.com' },
    { id: '2', name: '李四', age: 22, email: 'lisi@example.com' },
    { id: '3', name: '王五', age: 25, email: 'wangwu@example.com' }
];

// 使用示例
async function test() {
    try {
        const userById = await getUserById('2', sampleUsers);
        console.log('通过ID找到用户:', userById);
        
        const userByEmail = await getUserByEmail('lisi@example.com', sampleUsers);
        console.log('通过邮箱找到用户:', userByEmail);
    } catch (error) {
        console.error('错误:', error.message);
    }
}
*/