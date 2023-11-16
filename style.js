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

console.log(randomModel)

var isFlag = false;
var pauseRunBtnIsOk = false;
let timer = null;
var rate = 0.02;
let basic = 3600;
var isOpti = true;

let model = 0;//选择的抽奖类型
// 这里是奖项的名字
let prize = [["数码1号","数码2号","数码3号","数码4号","数码5号","数码6号","数码7号","未中奖"],
            ["家电1号","家电2号","家电3号","4号家电","5号家电","6号家电","7号家电","未中奖"],
            ["1号学习","2号学习","3号学习","4号学习","5号学习","6号学习","7号学习","未中奖"]];
    
// 权重数组 不同奖项的权重值，权重越高越容易中这个区域
let prizeWeight = [1,3,5,7,10,15,20,30];
    
//  权重之和
// let weightSum = prizeWeight.reduce(function(prevValue,curVal){
//     return prevValue + curVal;
// });
//给每一个div赋予文字
console.log(typeof (selectModel.value))

for(let i = 0 ; i < textAll.length ; i++){
    textAll[i].innerHTML = prize[model][i];
}

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
selectModel.onchange = function (){
    getText();
}


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
        //selectModel = num;
        getText();
    }, 200);



}





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



function getLucky(){

    let weightRandom = parseInt(Math.random()*30);
    // 合并
    let concatAfterArr = prizeWeight.concat(weightRandom);
    
    // 排序
    let  sortedWeightArr  = concatAfterArr.sort(function(a,b){ return a-b });

    // randomIndex是奖项的索引 结果是【1,7】
    var randomIndex = sortedWeightArr.indexOf(weightRandom); 
    randomIndex = Math.min(randomIndex, prize.length -1); 

    // 获奖的内容
    let text = prize[randomIndex];
    console.log(text);
    switch(randomIndex){
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
var isStart = true;
startGameBtn.onclick=function(){
    if(isStart){
        isStart=false;
        isFlag=true;
        let name = prompt("请输入您的名字：");
        while(!name){
            name = prompt("请重新输入您的名字：");
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


