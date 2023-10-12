// 初始化
// 玩家
// 筹码
// 骰子
// 倍率
// 每轮统计结果：
// 输入玩家盘面
// 得到分数
// 筹码重新分配
// 如果有人筹码小于0则终止游戏
// 倍率换算

const nums = [11156, 12255, 12346, 55566, 22223, 12345, 66666];
const reward_nums = [10, 10, 30, 20, 40, 60, 100];
const names = ['三连', '双对', '小顺子', '葫芦', '四连', '大顺子', '五连'];
const dist = {};
const name_num = {};
let count_all = 0;
let count_reward = 0;

// 最后输出分数
class Player {
    constructor() {
        this.chip = 50;
        this.dices = [];
    }
}

let count = 1;
let p1 = new Player();
let p2 = new Player();
let lock_1 = [];
let lock_2 = [];
let odds = 1;
let max_index = 0;
let count_p1 = 0;
let count_p2 = 0;
function init() {
    odds = 1;
    const nums = []; // 假设这里已经定义了nums数组
    const reward_nums = []; // 假设这里已经定义了reward_nums数组
    const names = []; // 假设这里已经定义了names数组
    const dist = {};
    const lock_1 = [];
    const lock_2 = [];
    const p1 = { dices: [] };
    const p2 = { dices: [] };
    const name_num = {};

    for (let index = 0; index < nums.length; index++) {
        dist[nums[index]] = reward_nums[index];
        lock_1.length = 0;
        lock_2.length = 0;
        p1.dices.length = 0;
        p2.dices.length = 0;
    }

    for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * 6) + 1;
        const y = Math.floor(Math.random() * 6) + 1;
        p1.dices.push(x);
        p2.dices.push(y);
    }

    for (let index = 0; index < names.length; index++) {
        name_num[nums[index]] = names[index];
    }
}
function reward(dices, dist, kind) {
    let count_reward = 0;
    let tmp = [];
    for (let i of dices) {
        tmp.push(i);
    }
    tmp.sort((a, b) => a - b);
    let count = 0;
    let reward_0 = 0;
    let score = 0;
    for (let i of tmp) {
        count = count * 10 + i;
        score += i;
    }
    reward_0 += score;
    if (dist.hasOwnProperty(count)) {
        reward_0 += dist[count];
        console.log(name_num[count]);
        if (kind === 2) {
            count_reward++;
        }
    }
    return reward_0;
}
function judge(score_1, score_2, p1, p2, odds) {
    if (score_1 === score_2) {
        console.log(`玩家一筹码${p1.chip},玩家二筹码${p2.chip}`);
        console.log("两位玩家得分相同！");
        return;
    }

    if (score_1 > score_2) {
        p1.chip += (score_1 - score_2) * odds;
        p2.chip -= (score_1 - score_2) * odds;
        if (p2.chip <= 0) {
            p1.chip += p2.chip;
            console.log("玩家二被击飞");
            // global count_p1
            // count_p1 += 1
            console.log(`玩家一从玩家二获得筹码${p2.chip + (score_1 - score_2) * odds}`);
            p2.chip = 0;
            return;
        }
        console.log(`玩家一筹码${p1.chip},玩家二筹码${p2.chip}`);
        console.log(`玩家一从玩家二获得筹码${(score_1 - score_2) * odds}`);
    } else {
        p2.chip += (score_2 - score_1) * odds;
        p1.chip -= (score_2 - score_1) * odds;
        if (p1.chip <= 0) {
            p2.chip += p1.chip;
            console.log("玩家一被击飞");
            // global count_p2
            // count_p2 += 1
            console.log(`玩家二从玩家一获得筹码${p1.chip + (score_2 - score_1) * odds}`);
            p1.chip = 0;
            return;
        }
        console.log(`玩家一筹码${p1.chip},玩家二筹码${p2.chip}`);
        console.log(`玩家二从玩家一获得筹码${(score_2 - score_1) * odds}`);
    }
}
function playRound(count, dist) {

    if (count == 0) {
        for (let i = 0; i < 5; i++) {
            p1.dices[i] = Math.floor(Math.random() * 6) + 1;
            p2.dices[i] = Math.floor(Math.random() * 6) + 1;

        }
    }
    let score_1 = 0;
    let score_2 = 0;
    // 玩家一人一次投掷骰子
    p1.dices.sort((a, b) => a - b);
    p2.dices.sort((a, b) => a - b);
    console.log(p1.dices);
    console.log(p2.dices);
    // 锁定0-5个骰子
    odds, lock_1, lock_2;
    if (count < 2) {
        console.log("第一位玩家要锁定的骰子是：（举例：您要锁定第1、2、4个骰子则输入1 2 4）");
        lock_1 = prompt("请输入第一位玩家要锁定的骰子，用空格隔开：").split(" ");
        // lock_1 = suggest(p1.dices); // 人机对战
        console.log(`一号玩家锁定的骰子是：${lock_1}`);
        console.log("第二位玩家要锁定的骰子是：（举例：您要锁定第1、2、4个骰子则输入1 2 4）");
        lock_2 = prompt("请输入第二位玩家要锁定的骰子，用空格隔开：").split(" ");
        // lock_2 = suggest(p2.dices);
        // lock_2 = random_choice(p2.dices);
        console.log(`二号玩家锁定的骰子是：${lock_2}`);
        // console.log(odds);
        // 选定倍率
        while (true) {
            tmp = parseInt(prompt("第一位玩家要输入的倍数（0123）"))
            // let tmp = suggest_odds(p1, p2, odds); // tmp表示要增加的倍数

            if (0 <= tmp && tmp <= 3) {
                odds += tmp;
                break;
            } else {
                console.log("请重新输入您要增加的倍率");
            }
        }

        while (true) {
            tmp_1 = parseInt(prompt("第二位玩家要输入的倍数（0123）")); //# tmp_1表示要增加的倍数
            // tmp = Math.floor(Math.random() * 3);
            // if (tmp == 0) {
            //     tmp_1 = 3;
            // } else {
            //     tmp_1 = 0;
            // }
            if (0 <= tmp_1 && tmp_1 <= 3) {
                odds += tmp_1;
                break;
            } else {
                console.log("请重新输入您要增加的倍率");
            }

        }
        // 计分：奖、惩、判断是否击飞玩家
        console.log(`当前倍率来到${odds}!`);
        console.log(`第一位玩家要输入的倍数（0123）：${tmp}`);
        console.log(`第二位玩家要输入的倍数（0123）：${tmp_1}`);
    }

    score_1 += reward(p1.dices, dist, 1);
    score_2 += reward(p2.dices, dist, 2);
    if (count == 2) {
        judge(score_1, score_2, p1, p2, odds);
    }
    for (let i = 0; i < 5; i++) {
        console.log(lock_1[i]);

    }
    for (let i = 0; i < 5; i++) {
        console.log(lock_2[i]);
    }
    // roll_dice(lock_1, lock_2);
    // 给第二轮预备摇骰子
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (i + 1 !== lock_1[j]) {
                p1.dices[i] = Math.floor(Math.random() * 6) + 1;
                console.log(`谢谢谢谢谢`)
            }
            if (i + 1 !== lock_2[j]) {
                p2.dices[i] = Math.floor(Math.random() * 6) + 1;
            }
        }
    }
}
function suggest(dices) {
    let suggestLock = [];
    suggestLock.length = 0;
    // Calculate the expected value of the reward and the total score, and compare with the value of numbers greater than 3.5 * (less than 4)
    let Exp_0 = 0.000;
    let max_index = -1;
    let p = 0;
    let arr = [];
    let temp = [];
    dices.sort((a, b) => a - b);
    for (let i of dices) {  // Calculate the expected value of the score without considering the reward mechanism
        if (i < 4) {
            Exp_0 += 3.5;
        }
        Exp_0 += i;
    }
    for (let i = 0; i < dices.length; i++) {  // Compare each situation with the dice list, calculate the expected value of the reward and the score expectation
        let Exp_reward = 0.000;
        let count = 0;
        let exp = [];
        arr.length = 0;
        let tmp = dices[i];
        while (tmp > 1) {
            exp.push(tmp % 10);
            tmp = Math.floor(tmp / 10);
        }
        arr = exp.reverse();
        for (let j = 0; j < exp.length; j++) {
            Exp_reward += exp[j];
            if (exp[j] === dices[j]) {
                count++;
            }
        }
        p = Math.pow(5 - count, 6);
        p = Math.max(1, p);
        Exp_reward = (dist[dices[i]] + Exp_reward) / p;
        if (Exp_0 < Exp_reward) {
            max_index = Math.max(max_index, i);
        }
    }
    if (max_index === -1) {  // There is no meaning to form a combination
        for (let i = 0; i < dices.length; i++) {
            if (dices[i] > 3) {
                suggestLock.push(i + 1);
            }
        }
    } else {  // You can form a number
        arr.length = 0;
        suggestLock.length = 0;
        let tmp = dices[max_index];
        while (tmp > 1) {
            arr.push(tmp % 10);
            tmp = Math.floor(tmp / 10);
        }
        arr = arr.reverse();
        for (let i = 0; i < dices.length; i++) {
            if (dices[i] === arr[i]) {
                suggestLock.push(i + 1);
            }
        }
    }
    return suggestLock;
}
function suggest_odds(p1, p2, odds) {
    // 根据分差计算增加倍率多少，己方得分小不增加倍率
    let score_1 = reward(p1.dices, dist, 1);
    let score_2 = reward(p2.dices, dist, 2);
    if (score_1 < score_2) {
        return 0;
    } else {
        return 3;
    }
}
let m = 1;
count_p1 = 0;
count_p2 = 0;
count_all = 0;
lock_1 = new Set();
lock_2 = new Set();
while (m > 0) {
    m -= 1;
    let n = 5; // 每次五局
    let p1 = { chip: 100 };
    let p2 = { chip: 100 };

    for (let i = 0; i < n; i++) {
        let flag = true;
        init();
        console.log(`第${i + 1}局`);
        for (let j = 0; j < 3; j++) {
            count_all++;
            console.log(`第${j + 1}轮`);
            playRound(j, dist);
            if (p1.chip <= 0 || p2.chip <= 0) {
                flag = false;
                break;
            }
        }
        if (!flag) {
            break;
        }
    }

    Array.from(lock_1).clear();
    Array.from(lock_2).clear();
    if (p1.chip > p2.chip) {
        count_p1++;
        console.log("恭喜玩家一获胜");
    } else {
        count_p2++;
        console.log("恭喜玩家二获胜");
    }
}

console.log(`玩家一获胜${count_p1}次，玩家二获胜${count_p2}次`);
console.log(`玩家二奖励情况出现几率${count_reward * 1.00 / count_all * 1.00}`);

