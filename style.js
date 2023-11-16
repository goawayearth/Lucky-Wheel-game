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
let textArea = document.getElementById("show2");
let congWords = document.getElementById("conWords");

// 一些全局参数
let isFlag = false; // 记录当前是否可以点击旋转按钮
let pauseRunBtnIsOk = false; // 记录当前是否可以点击停止按钮
let timer = null; // 定时器
let rate = 0.02; // 默认转速改变速率
let basic = 3600; // 默认旋转圈数
let isOpti = true; // 标记正转还是反转
let isStart = true; // 标记游戏是否开始
let model = 0;//选择的抽奖类型
let prizeText = "";// 抽中的奖项
let niName = "";//抽奖者的名字

// 这里是奖项的名字
let prize = [["数码1号","数码2号","数码3号","数码4号","数码5号","数码6号","数码7号","未中奖"],
            ["家电1号","家电2号","家电3号","4号家电","5号家电","6号家电","7号家电","未中奖"],
            ["1号学习","2号学习","3号学习","4号学习","5号学习","6号学习","7号学习","未中奖"]];
    
// 权重数组 不同奖项的权重值，权重越高越容易中这个区域
let prizeWeight = [1,3,5,7,10,15,20,30];

// 给每一个div赋予文字，最开始的默认值
for(let i = 0 ; i < textAll.length ; i++){
    textAll[i].innerHTML = prize[model][i];
}

// 当选择的奖品类型发生变化的触发函数，会给扇形重新赋值
selectModel.onchange = function (){
    getText();
}

// 随机选择奖品类型的按钮功能
randomModel.onclick = function() {

    let times = 0;
    let lastSelect = 0;
    let intervalId = setInterval(function() {
        times++;
        if(times > 20){
            clearInterval(intervalId);
        }
        var num = Math.floor(Math.random() * 3);
        while(num == lastSelect){
            num = Math.floor(Math.random() * 3);
        }
        lastSelect = num;
        console.log(num);
        const selectElement = document.querySelector('select');
        selectElement.selectedIndex = num;
        getText();
    }, 200);
}

startGameBtn.onclick=function(){
    if(isStart){
        isStart=false;
        isFlag=true;
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

circleBtn.onclick=function(){
    if(isFlag){
        isFlag=false;
        getLucky();
    }
};
// 开始按钮
startRunBtn.onclick=function(){
    if(isFlag){
        isFlag=false;
        getLucky();
    }
};

pauseRunBtn.onclick=function(){
    if(pauseRunBtnIsOk){
        isFlag=true;
        pauseRunBtnIsOk = false;
        clearInterval(timer);
    }
    else{
        alert("当前状态下无法使用该功能！");
    }


}

speedUpBtn.onclick=function(){
    if(pauseRunBtnIsOk){
        rate = 0.1;
    }
    else{
        alert("当前状态下不能使用！");
    }
    
}

reverseRunBtn.onclick = function(){
    if(isFlag){
        isFlag=false;
        isOpti = false;
        getLucky();
    }
    
}

// 给转盘每个扇形赋值的函数
function getText(){
    var m = selectModel.value;
    switch (m){
        case "option1":model = 0;break;
        case "option2":console.log("家电");model = 1;break;
        case "option3":model = 2;break;
        default:console.log("默认");model=0;break;
    }
    for(let i = 0 ; i < textAll.length ; i++){
        textAll[i].innerHTML = prize[model][i];
    }
}


// 扇形发生转动的最核心的模块
function run(angle){
    let begin = 0;
    pauseRunBtnIsOk = true;
    timer = setInterval(function(){
        if(begin >= (basic+angle)){
            isFlag=true;
            pauseRunBtnIsOk = false;
            rate = 0.02;
            basic = 3600;
            isOpti = true;
            clearInterval(timer);
            congWords.innerHTML = "恭喜您获得："+prizeText+"！";
            showCongratulations();
            let date = new Date();
            let str = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" "+niName+"获得:"+prizeText+"<br>";
            let str1 = textArea.innerHTML;
            str = str + str1;
            textArea.innerHTML = str;
        }
        if(isOpti){
            wapper.style.transform="rotate("+(begin)+"deg)";
        }
        else{
            wapper.style.transform="rotate("+(-begin)+"deg)";
        }

        // 这是一个算法 可以出现转盘又很快到慢慢变慢的效果
        begin+=Math.ceil(basic+angle-begin)*rate;

    },70);
}


// 转轮开始旋转
function getLucky(){
    //获取30以内的随机数
    let weightRandom = parseInt(Math.random()*30);
    // 合并
    let concatAfterArr = prizeWeight.concat(weightRandom);
    // 排序
    let  sortedWeightArr  = concatAfterArr.sort(function(a,b){ return a-b });

    // randomIndex是奖项的索引 结果是【1,7】
    let randomIndex = sortedWeightArr.indexOf(weightRandom);
    randomIndex = Math.min(randomIndex, prize.length -1);

    // 获奖的内容
    prizeText = prize[model][randomIndex];
    console.log("中奖奖项"+prizeText);
    switch(randomIndex) {
        case 0:
            run(22.5);
            break;
        case 1:
            run(66.5);
            break;
        case 2:
            run(112.5);
            break;
        case 3:
            run(157.5);
            break;
        case 4:
            run(338.5);
            break;
        case 5:
            run(294.5);
            break;
        case 6:
            run(247.5);
            break;
        case 7:
            run(201.5);
            break;
    }
}


//祝贺弹窗
function showCongratulations() {
    // 显示弹窗
    var popup = document.getElementById('congratulationsPopup');
    popup.style.display = 'block';
}

function closeCongratulations() {
    // 关闭弹窗
    var popup = document.getElementById('congratulationsPopup');
    popup.style.display = 'none';
}