//随机生成骰子功能
let diceImages = ["../dices/dice1.png", "../dices/dice2.png", "../dices/dice3.png", "../dices/dice4.png", "../dices/dice5.png", "../dices/dice6.png"];
let diceElements = document.querySelectorAll(".dice");
let diceElements2 = document.querySelectorAll(".dice2");

class Player {
    constructor() {
        this.chip = 1000;
        this.dices = [];
    }
}
let p1 = new Player();
let p2 = new Player();
function rollDice() {
    diceElements.forEach(dice => {
        const randomIndex = Math.floor(Math.random() * 6);
        dice.src = diceImages[randomIndex];
        dice.alt = "Dice " + (randomIndex + 1);
    });

    // 同时更新玩家2区域的投掷结果

    diceElements2.forEach(dice => {
        const randomIndex = Math.floor(Math.random() * 6);
        dice.src = diceImages[randomIndex];
        dice.alt = "Dice " + (randomIndex + 1);
    });
}

// 投掷按钮
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startRound);
// 当前轮次
let currentRound = 1;
//当前局次
let currentPlay = 1;
// 是否正在投掷中
let rolling = false;
//是否可以移动骰子
let moveDice = true;

// 投掷区和锁定区的DOM元素
const rollArea = document.getElementById('throwArea');
const lockArea = document.getElementById('lockArea');
const rollArea2 = document.getElementById('throwArea2'); // 玩家2的投掷区
const lockArea2 = document.getElementById('lockArea2'); // 玩家2的锁定区

// 初始化游戏
function initGame() {
    clearArea(rollArea);
    clearArea(lockArea);
    clearArea(rollArea2); // 清空玩家2的投掷区
    clearArea(lockArea2); // 清空玩家2的锁定区
    currentRound = 1;
    rolling = false;
    startButton.disabled = false;
    startButton.textContent = "开始投掷";
}

// 清空区域
function clearArea(area) {
    while (area.firstChild) {
        area.removeChild(area.firstChild);
    }
}
// 开始新的轮次
function startRound() {
    rollDice()
    if (rolling) return;
    rolling = true;
    clearArea(rollArea);
    clearArea(rollArea2); // 清空玩家2的投掷区
    const diceToRoll = 5 - lockArea.children.length;
    const diceToRoll2 = 5 - lockArea2.children.length; // 玩家2的可投掷骰子数
    moveDice = true;
    // 玩家1的投掷结果
    const rollResult = [];
    for (let i = 0; i < diceToRoll; i++) {
        const randomIndex = Math.floor(Math.random() * diceImages.length);
        const diceImage = diceImages[randomIndex];
        rollResult.push(diceImage);

        const diceElement = createDiceElement(diceImage, 1);
        diceElement.addEventListener('click', () => {
            if (moveDice) {
                toggleLock(diceElement, rollArea, lockArea)
            }
        });
        rollArea.appendChild(diceElement);
    }

    // 玩家2的投掷结果
    const rollResult2 = [];
    for (let i = 0; i < diceToRoll2; i++) {
        const randomIndex = Math.floor(Math.random() * diceImages.length);
        const diceImage = diceImages[randomIndex];
        rollResult2.push(diceImage);

        const diceElement = createDiceElement(diceImage, 2);
        diceElement.addEventListener('click', () => {
            if (moveDice) {
                toggleLock(diceElement, rollArea2, lockArea2)
            }
        });
        rollArea2.appendChild(diceElement);
    }

    currentRound++;
    //每局轮数更换
    if (currentRound <= 4) {
        const cRound = document.getElementById('cRound');
        cRound.textContent = `${currentRound - 1}`;
    }

    if (currentPlay === 3 && currentRound === 4) {
        startButton.textContent = '游戏结束！！！';
        startButton.disabled = true;
        startButton.removeEventListener('click', startRound);
        endGame();
    }
    else if (currentRound === 4) {
        startButton.textContent = "本局游戏结束，点击开始下一局";
        startButton.removeEventListener('click', startRound);
        startButton.addEventListener('click', startNewGame);
        endGame();
    }
    else {

        startButton.textContent = "锁定完成,点击开始投入倍率";
        startButton.removeEventListener('click', startRound);
        startButton.addEventListener('click', chooseMulti);

    }
    rolling = false;
}

//选择倍率
function chooseMulti() {
    let clickP1 = -1;
    let clickP2 = -1;
    let cl1 = false;
    let cl2 = false;
    moveDice = false;
    startButton.disabled = true;
    startButton.textContent = "请投入倍率";
    startButton.removeEventListener('click', chooseMulti);
    const buttons1 = document.querySelectorAll('.multi1');
    buttons1.forEach((button) => {
        button.style.visibility = 'visible';
        button.addEventListener('click', () => {
            // 点击隐藏所有按钮
            clickP1 = parseInt(button.textContent)
            cl1 = true;
            if (cl1 && cl2) {
                startButton.disabled = false;
                startButton.textContent = "开始下一轮投掷";
                cl1 = false;
                cl2 = false;
                changeBtn();
            }
            buttons1.forEach((btn) => {
                btn.style.visibility = 'hidden';
            });
            // console.log('点击的按钮文字内容是：', clickP1);
            // console.log(typeof (clickP1));
        });
    })

    const buttons2 = document.querySelectorAll('.multi2');
    buttons2.forEach((button) => {
        button.style.visibility = 'visible';
        button.addEventListener('click', () => {
            // 隐藏所有按钮
            clickP2 = parseInt(button.textContent)
            cl2 = true;
            if (cl1 && cl2) {
                startButton.disabled = false;
                startButton.textContent = "开始下一轮投掷";
                cl1 = false;
                cl2 = false;
                changeBtn();
            }
            buttons2.forEach((btn) => {
                btn.style.visibility = 'hidden';
            });
            // console.log('点击的按钮文字内容是：', clickP2);
            // console.log(typeof (clickP2));
        });
    })
    let buttonClicked = false;// 标志变量，初始状态为未点击
    function changeBtn() {
        if (!buttonClicked) {
            const mult = document.getElementById('multiple');
            let currentMul = parseInt(mult.textContent)
            // console.log(typeof (currentMul));
            currentMul = currentMul + clickP1 + clickP2;
            mult.textContent = `${currentMul}`;
            startButton.textContent = "点击开始下一轮投掷";
            startButton.addEventListener('click', startRound);
            buttonClicked = true;// 将按钮标记为已点击
        }

    }

}
// 创建骰子元素
function createDiceElement(imageUrl, num) {
    const diceElement = document.createElement('img');
    diceElement.src = imageUrl;
    diceElement.classList.add(`dice${num}`);
    return diceElement;
}

// 锁定或解锁骰子
function toggleLock(diceElement, sourceArea, targetArea) {
    if (rolling) return;
    if (currentRound === 4) return;
    // if (!moveDice) return;
    if (sourceArea.contains(diceElement)) {
        sourceArea.removeChild(diceElement);
        targetArea.appendChild(diceElement);
    }
    else if (targetArea.contains(diceElement) && currentRound === 1) {
        targetArea.removeChild(diceElement);
        sourceArea.appendChild(diceElement);
    }
}
// 游戏结束时处理函数
function endGame() {
    if (currentRound > 3) {
        // 游戏结束时，将投掷区中的骰子图片移动到相应的锁定区
        moveDiceToLockArea(rollArea, lockArea);
        moveDiceToLockArea(rollArea2, lockArea2);

        // 将锁定区的骰子记录到玩家的dices数组中
        recordLockedDice(lockArea, p1.dices);
        recordLockedDice(lockArea2, p2.dices);

        bubbleSort(p1.dices)
        bubbleSort(p2.dices)
        // 输出玩家的骰子记录
        console.log("玩家1的骰子记录:", p1.dices);
        console.log("玩家2的骰子记录:", p2.dices)
        // 计算玩家1和玩家2的分数
        const player1Score = reward(p1.dices);
        const player2Score = reward(p2.dices);
        // 更新分数元素的内容
        const p1ScoreElement = document.getElementById('P1score');
        const p2ScoreElement = document.getElementById('P2score');
        p1ScoreElement.textContent = player1Score;
        p2ScoreElement.textContent = player2Score;
        // 根据分数计算筹码，筹码更换到P1Money和P2Money中
        const mult = document.getElementById('multiple');
        judge(player1Score, player2Score, p1.chip, p2.chip, mult.textContent);

    }

}

//冒泡排序
function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换 arr[j] 和 arr[j + 1]
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}
//计算筹码函数并更新
function judge(score_1, score_2, play1, play2, odds) {

    if (score_1 === score_2) {
        console.log(`玩家一筹码${play1},玩家二筹码${play2}`);
        console.log("两位玩家得分相同！");
        return;
    }

    if (score_1 > score_2) {
        let Gchips = 0;
        Gchips = (score_1 - score_2) * odds;
        play1 += Gchips;
        play2 -= Gchips;
        if (play2 <= 0) {
            play1 += play2;
            console.log("玩家二被击飞");
            // global count_p1
            // count_p1 += 1
            console.log(`玩家一从玩家二获得筹码${play2 + Gchips}`);
            play2 = 0;

        }
        console.log(`玩家一筹码${play1},玩家二筹码${play2}`);
        console.log(`玩家一从玩家二获得筹码${Gchips}`);
    } else {
        let Gchips = 0;
        Gchips = (score_2 - score_1) * odds;
        play2 += Gchips;
        play1 -= Gchips;
        if (play1 <= 0) {
            play2 += play1;
            console.log("玩家一被击飞");
            // global count_p2
            // count_p2 += 1
            console.log(`玩家二从玩家一获得筹码${play1 + Gchips}`);
            play1 = 0;

        }
        console.log(`玩家一筹码${play1},玩家二筹码${play2}`);
        console.log(`玩家二从玩家一获得筹码${Gchips}`);
    }
    const p1Chip = document.getElementById('P1Money');
    const p2Chip = document.getElementById('P2Money');
    p1Chip.textContent = play1;
    p2Chip.textContent = play2;
    p1.chip = play1;
    p2.chip = play2;

}
//  计算玩家的骰子总和以及奖励分作为分数
function reward(dices) {
    let tmp = [];
    let small_shunzi = [11234, 12234, 12334, 12344, 12346, 22345, 23345, 23445, 23455, 13456, 33456, 34456, 34556, 34566];
    let reward_0 = 0;
    let count = 0;

    dices.forEach(i => {
        tmp.push(i);
        count = count * 10 + i;
    });
    tmp.sort((a, b) => a - b);
    let collect = new Set(tmp);
    if (collect.size === 1) {
        reward_0 += 100; // 五连
    } else if (collect.size === 2) {
        reward_0 += 20; // 葫芦或四连
        for (let j of tmp) {
            if (tmp.filter(k => k === j).length === 4) {
                reward_0 += 20; // 四连
                break;
            }
        }
    } else if (collect.size === 3) {
        reward_0 += 10; // 双对或三连
    }

    if (small_shunzi.includes(count)) {
        reward_0 = 30;
    }

    if (count === 12345 || count === 23456) {
        reward_0 = 60;
    }

    let score = 0;
    tmp.forEach(i => {
        score += i;
    });
    reward_0 += score;

    return reward_0;
}

// 记录锁定区的骰子到玩家的dices数组中
function recordLockedDice(lockArea, playerDices) {
    const lockedDiceElements = lockArea.querySelectorAll("img");
    lockedDiceElements.forEach(diceElement => {
        console.log(diceElement.src);
        const imageUrl = diceElement.src;
        const fileName = imageUrl.split('/').pop(); // 获取文件名部分
        const match = fileName.match(/\d+/); // 使用正则表达式提取数字部分

        if (match) {
            const number = parseInt(match[0]); // 将提取的数字转换为整数
            console.log(`从URL中提取的数字是: ${number}`);
            playerDices.push(number);  //存入点数
        }
    });
}

// 新一局游戏的处理函数
function startNewGame() {
    initGame();

    // 局数增加
    currentPlay++;
    // 清空玩家的骰子记录
    p1.dices = [];
    p2.dices = [];
    //将分数初始化
    const p1ScoreElement = document.getElementById('P1score');
    const p2ScoreElement = document.getElementById('P2score');
    p1ScoreElement.textContent = '0';
    p2ScoreElement.textContent = '0';
    //
    //将倍率初始化
    const mult = document.getElementById('multiple');
    mult.textContent = `1`;
    //调整局数
    const roundCountElement = document.getElementById('cPlay');
    roundCountElement.textContent = currentPlay;
    const cRound = document.getElementById('cRound');
    cRound.textContent = `1`;
    // 移除按钮的点击事件
    startButton.removeEventListener('click', startNewGame);
    startButton.addEventListener('click', startRound);
}
// 将骰子图片移动到锁定区
function moveDiceToLockArea(sourceArea, targetArea) {
    while (sourceArea.firstChild) {
        const diceElement = sourceArea.firstChild;
        sourceArea.removeChild(diceElement);
        targetArea.appendChild(diceElement);
    }
}
// 初始化游戏
initGame();


//--------------------------------------------------------------------------

