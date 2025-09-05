/**
 * 冒泡排序算法
 * @param {Array} arr - 待排序的数组
 * @returns {Array} - 排序后的数组
 */
function bubbleSort(arr) {
    const len = arr.length;
    // 创建数组副本，避免修改原数组
    const result = [...arr];
    
    // 外层循环控制排序轮数
    for (let i = 0; i < len - 1; i++) {
        // 内层循环控制每轮比较次数
        for (let j = 0; j < len - 1 - i; j++) {
            // 如果当前元素大于下一个元素，则交换它们的位置
            if (result[j] > result[j + 1]) {
                const temp = result[j];
                result[j] = result[j + 1];
                result[j + 1] = temp;
            }
        }
    }
    
    return result;
}

// 测试数组
const numbers = [50, 30, 35, 20];

// 使用冒泡排序算法排序
const sortedNumbers = bubbleSort(numbers);