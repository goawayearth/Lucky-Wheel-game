
class PopUpWin{
    constructor() {
        this.popup = document.getElementById('congratulationsPopup');
        this.congWords = document.getElementById("conWords");
        this.closeBtn = document.getElementById("closeBtn");
        this.closeBtn.onclick = ()=>this.closeCongratulations();
    }
    //祝贺弹窗
    showCongratulations() {
        // 显示弹窗
        this.popup.style.display = 'block';
    }

    closeCongratulations() {
        // 关闭弹窗
        console.log("关闭弹窗！");
        this.popup.style.display = 'none';
    }

}

class ShowArea{
    constructor() {
        this.textArea = document.getElementById("show2");
    }
    upDateContent(str){
        this.textArea.innerHTML = str;
    }
    getContent(){
        return this.textArea.innerHTML;
    }
}


// 弹窗类对象
const popUpWin = new PopUpWin();
const showArea = new ShowArea();

// 获取html页面的元素
let wapper = document.getElementById("wapper");
let textAll = document.getElementsByClassName("text");
let startGameBtn = document.getElementById("start-game");
let startRunBtn = document.getElementById("start-run");
let pauseRunBtn = document.getElementById("pause-run");
let speedUpBtn = document.getElementById("speed-up");
let reverseRunBtn = document.getElementById("reverse-run");
let circleBtn = document.getElementById("circle");
let selectModel = document.getElementById("select_model");
let randomModel = document.getElementById("random-model");

let stopSelect = document.getElementById("stop-model");
let stopModelBtn = document.getElementById("stop-model-btn");
let begin = 22.5;
// 一些全局参数
let ableRotate = false; // 记录当前是否可以点击旋转按钮
let pauseRunBtnIsOk = false; // 记录当前是否可以点击停止按钮
let timer = null; // 定时器
let rate = 0.02; // 默认转速改变速率
let basic = 3600; // 默认旋转圈数
let isOpti = true; // 标记正转还是反转
let isStart = true; // 标记游戏是否开始
let model = 0;//选择的抽奖类型
let prizeText = "";// 抽中的奖项
let niName = "";//抽奖者的名字
let stopModel = 0;//游戏停止的模式，涉及到转动的模式，默认是逐渐停止
// 这里是奖项的名字
let prize = [["笔记本电脑","电视机","数码相机","智能手机","游戏机","智能手表","无线耳机","未中奖"],
    ["冰箱","空调","吸尘器","洗衣机","微波炉","咖啡机","热水器","未中奖"],
    ["跑步机","高尔夫球具","网球拍","自行车","露营帐篷","登山鞋","篮球","未中奖"]];

// 权重数组 不同奖项的权重值，权重越高越容易中这个区域
let prizeWeight = [1, 3, 5, 7, 10, 15, 20, 30];
// 使用 reduce 方法计算总和
let totalSum = prizeWeight.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
}, 0);

// 给每一个div赋予文字，最开始的默认值
for(let i = 0 ; i < textAll.length ; i++){
    textAll[i].innerHTML = prize[model][i];
}

// 当选择的奖品类型发生变化的触发函数，会给扇形重新赋值
selectModel.onchange = function (){
    if(isStart){
        getText();
    }
    else{
        selectModel.selectedIndex = model;
    }
}

// 当停止模式改变的时候，stopModel也随着改变
stopSelect.onchange = function(){
    if(isStart){
        let text = stopSelect.value;
        if(text == "option1"){
            stopModel = 0;
        }
        else{
            stopModel = 1;
        }
    }
    else{
        stopSelect.selectedIndex = stopModel;
    }
}
// 随机选择奖品类型的按钮功能
randomModel.onclick = function() {
    if(isStart) {
        let times = 0;
        let lastSelect = 0;
        let intervalId = setInterval(function () {
            times++;
            if (times > 20) {
                clearInterval(intervalId);
            }
            var num = Math.floor(Math.random() * 3);
            while (num == lastSelect) {
                num = Math.floor(Math.random() * 3);
            }
            lastSelect = num;
            selectModel.selectedIndex = num;
            getText();
        }, 200);
    }
}

/**
 * 当点击随机选择停止模式的按钮之后，随机多次变化之后，更新stopModel
 */
stopModelBtn.onclick = function(){
    if(isStart){
        let time = Math.random()*10+10;
        let intervalId = setInterval(function() {
            time--;
            if(time <= 0){
                clearInterval(intervalId);
            }
            let num = stopSelect.selectedIndex;
            num = (num+1) % 2;
            stopSelect.selectedIndex = num;
            stopModel = num;
        }, 200);
    }

}

/**
 * 点击开始游戏按钮，开启游戏
 */
startGameBtn.onclick=function(){
    if(isStart){
        isStart=false;
        ableRotate=true;
        niName = prompt("请输入您的名字：");
        while(!niName){
            niName = prompt("请重新输入您的名字：");
        }
        startGameBtn.style.backgroundColor = "dimgray";
        startRunBtn.style.backgroundColor = "#f2552e";
        pauseRunBtn.style.backgroundColor = "#f2552e";
        speedUpBtn.style.backgroundColor = "#f2552e";
        reverseRunBtn.style.backgroundColor = "#f2552e";
        startGameBtn.style.cursor = "default";
        startRunBtn.style.cursor = "pointer";
        pauseRunBtn.style.cursor = "pointer";
        speedUpBtn.style.cursor = "pointer";
        reverseRunBtn.style.cursor = "pointer"
        circleBtn.style.cursor = "pointer";
    }
};

/**
 * 转盘中心的旋转按钮
 */
circleBtn.onclick=function(){
    if(stopModel == 0){
        if(ableRotate){
            ableRotate=false;
            runNormal();
        }
    }
    else{
        //匀速旋转
        if(ableRotate){
            ableRotate = false;
            runStable();
        }

    }
};

/**
 * 开始旋转按钮，开始正向旋转
 */
startRunBtn.onclick=function(){
    if(stopModel == 0){
        if(ableRotate){
            ableRotate=false; // 不允许正转和反转
            runNormal();
        }
    }
    else{
        //匀速旋转
        if(ableRotate){
            ableRotate = false; // 不允许正转和反转
            runStable();
        }
    }

};

/**
 * 停止按钮
 */
pauseRunBtn.onclick=function(){
    if(pauseRunBtnIsOk){
        ableRotate=true; //可以正反转
        pauseRunBtnIsOk = false;
        clearInterval(timer);
        ableRotate = true;//表示可以转动
        console.log("begin:"+begin);
        if(stopModel == 1){
            let prizeNum = 0;
            if(begin<=45) {
                if(isOpti)prizeNum=0;
                else prizeNum=4;
            }
            else if(begin>45 && begin<=90){
                if (isOpti)prizeNum=1;
                else prizeNum = 5;
            }
            else if(begin>90 && begin<=135){
                if(isOpti)prizeNum=2;
                else prizeNum=6;
            }
            else if(begin>135 && begin<=180){
                if(isOpti)prizeNum=3;
                else prizeNum=7;
            }
            else if(begin>180 && begin<=225){
                if(isOpti)prizeNum=7;
                else prizeNum=3;
            }
            else if(begin>225 && begin<=270){
                if(isOpti)prizeNum=6;
                else prizeNum=2;
            }
            else if(begin>270 && begin<=315){
                if(isOpti)prizeNum=5;
                else prizeNum=1;
            }
            else if(begin>315 && begin<=360){
                if(isOpti)prizeNum=4;
                else prizeNum=0;
            }

            prizeText = prize[model][prizeNum];
            popUpWin.congWords.innerHTML = "恭喜您获得："+prizeText+"！";
            popUpWin.showCongratulations();
            // 获取当前时间
            let currentTime = new Date();
            // 获取时、分、秒
            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            let seconds = currentTime.getSeconds();
            // 格式化输出
            // 如果数字小于10，前面添加0
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            // 输出格式化后的时间
            let formattedTime = hours + ':' + minutes + ':' + seconds;
            let str =formattedTime+" "+niName+"获得:"+prizeText+"<br>";
            // let str1 = textArea.innerHTML;
            let str1 = showArea.getContent();
            str = str + str1;
            // textArea.innerHTML = str;
            showArea.upDateContent(str);
        }
    }
    else{
        alert("当前状态下无法使用该功能！");
    }
}

/**
 * 加速按钮
 */
speedUpBtn.onclick=function(){
    if(pauseRunBtnIsOk){
        rate = 0.1;
    }
    else{
        alert("当前状态下不能使用！");
    }
}

/**
 * 反向旋转按钮
 */
reverseRunBtn.onclick = function(){
    if(stopModel == 0){
        if(ableRotate){
            ableRotate=false;
            isOpti = false;
            runNormal();
        }
        else{
            alert("当前状态下无法使用该功能！");
        }
    }
    else{
        //匀速旋转时候的反向
        if(ableRotate){
            ableRotate=false;
            isOpti=false;
            runStable();
        }
        else{
            alert("当前状态下无法使用该功能！");
        }
    }
}

// 给转盘每个扇形赋值的函数
function getText(){
    var m = selectModel.value;
    switch (m){
        case "option1":model = 0;break;
        case "option2":model = 1;break;
        case "option3":model = 2;break;
        default:model=0;break;
    }
    for(let i = 0 ; i < textAll.length ; i++){
        textAll[i].innerHTML = prize[model][i];
    }
}


// 扇形发生转动的最核心的模块
function run(angle){
    pauseRunBtnIsOk = true;
    timer = setInterval(function(){

        if(isOpti){
            wapper.style.transform="rotate("+(begin)+"deg)";
        }
        else{
            wapper.style.transform="rotate("+(-begin)+"deg)";
        }
        // 这是一个算法 可以出现转盘又很快到慢慢变慢的效果
        begin+=Math.ceil(basic+angle-begin)*rate;

        if(begin >= (basic+angle)){
            ableRotate=true;
            pauseRunBtnIsOk = false;
            rate = 0.02;
            basic = 3600;
            isOpti = true;
            //弹窗设置
            clearInterval(timer);
            popUpWin.congWords.innerHTML = "恭喜您获得："+prizeText+"！";
            popUpWin.showCongratulations();
            // 获取当前时间
            let currentTime = new Date();
            // 获取时、分、秒
            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            let seconds = currentTime.getSeconds();
            // 格式化输出
            // 如果数字小于10，前面添加0
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            // 输出格式化后的时间
            let formattedTime = hours + ':' + minutes + ':' + seconds;
            let str =formattedTime+" "+niName+"获得:"+prizeText+"<br>";
            // let str1 = textArea.innerHTML;
            let str1 = showArea.getContent();
            str = str + str1;
            // textArea.innerHTML = str;
            showArea.upDateContent(str);
            begin = begin % 360;
        }


    },70);
}

function runStable(){
    pauseRunBtnIsOk = true;
    timer = setInterval(function(){
        begin = (rate * 1440 + begin) % 360;
        if(isOpti){
            wapper.style.transform="rotate("+(begin)+"deg)";
        }
        else{
            wapper.style.transform="rotate("+(-begin)+"deg)";
        }
    },70);
}

// 转轮开始旋转
function runNormal(){
    let weightRandom = parseInt(Math.random()*totalSum);
    let accumulatedWeight = 0;
    let randomIndex = 0;
    // 合并
    for(let i = 0;i < 8;i++){
        accumulatedWeight += prizeWeight[i];
        if(weightRandom <= accumulatedWeight){
            randomIndex = i;
            break;
        }
    }
    // 获奖的内容
    prizeText = prize[model][randomIndex];
    console.log("中奖奖项"+prizeText);
    switch(randomIndex) {
        case 0:
            if(isOpti){
                run(22.5);
            }
            else {
                run(338.5);
            }
            break;
        case 1:
            if(isOpti) run(66.5);
            else run(294.5);
            break;
        case 2:
            if(isOpti) run(112.5);
            else run(247.5);
            break;
        case 3:
            if(isOpti) run(157.5);
            else run(201.5);
            break;
        case 4:
            if(isOpti) run(338.5);
            else run(22.5);
            break;
        case 5:
            if(isOpti) run(294.5);
            else run(66.5);
            break;
        case 6:
            if(isOpti) run(247.5);
            else run(112.5);
            break;
        case 7:
            if(isOpti) run(201.5);
            else run(157.5);
            break;
    }
}

