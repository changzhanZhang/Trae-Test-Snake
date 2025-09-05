interface User {
    email: string;
    id: string;
    name: string;
    age: number;
}
/**
 * 根据用户ID获取用户信息
 * @param id 用户ID
 * @param users 用户列表
 * @returns {User | undefined} 用户对象
 */

// 根据用户邮箱获取用户信息
function getUserByEmail(email: string, users: User[]): User | undefined {
    return users.find(user => user.email === email);
}
//根据用户ID获取用户信息（异步版本，模拟从数据库获取数据）
async function getUserById(id: string, users: User[]): Promise<User | undefined> {
    // 返回一个Promise来模拟异步数据库操作
    return new Promise((resolve, reject) => {
        try {
            // 检查参数有效性
            if (!id || typeof id !== 'string') {
                throw new Error('用户ID必须是非空字符串');
            }
            if (!Array.isArray(users)) {
                throw new Error('用户列表必须是数组');
            }

            // 模拟数据库查询延迟
            setTimeout(() => {
                try {
                    const user = users.find(user => user.id === id);
                    resolve(user);
                } catch (error) {
                    reject(new Error(`查询用户时发生错误: ${error instanceof Error ? error.message : String(error)}`));
                }
            }, 100); // 模拟100ms的数据库查询延迟
        } catch (error) {
            // 处理同步错误
            setTimeout(() => {
                reject(new Error(`参数验证失败: ${error instanceof Error ? error.message : String(error)}`));
            }, 0);
        }
    });
}