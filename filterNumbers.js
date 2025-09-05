// Node.js函数：筛选出数组中大于10的数字

/**
 * 筛选出数组中大于10的数字
 * @param {number[]} numbers - 输入的数字数组
 * @returns {number[]} 筛选后的数字数组
 */
function filterNumbersGreaterThan10(numbers) {
    // 检查参数是否为数组
    if (!Array.isArray(numbers)) {
        throw new Error('输入必须是一个数组');
    }
    
    // 筛选出大于10的数字
    return numbers.filter(num => typeof num === 'number' && num > 10);
}

// 示例数组
const exampleArray = [5, 12, 8, 15, 3, 20];

// 调用函数并输出结果
try {
    const result = filterNumbersGreaterThan10(exampleArray);
    console.log('原始数组:', exampleArray);
    console.log('大于10的数字:', result);
} catch (error) {
    console.error('发生错误:', error.message);
}

// 导出函数以便其他模块使用（如果需要）
module.exports = { filterNumbersGreaterThan10 };