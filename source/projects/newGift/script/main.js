//配置路径
require.config({
    baseUrl:"script/",
    shim: {
        "zepto": {
            exports: "$"
        }
    },
    paths: {
        "interface": "app/interface",
        "zepto": "libs/zepto/v1.1.6/zepto.min",
        "nativeJS":"utils/native",
        "model": "app/model",
        "view": "app/view",
        "viewModel": "app/viewModel",
        "bvm":"utils/bvm/v0.0.1/bvm",
        "text": "libs/require/require-plugin/text"
    }
});

//定义一个全局变量，如果需要用到全局变量，可扩展属性添加到该对象上
var PINGAN = {};
PINGAN.alertTime = 0; //用户等待信息加载的标识
PINGAN.userInfo = {}; //存储用户设备信息
PINGAN.serverUrl = ""; //接口地址
PINGAN.timeLine = {};   //时间轴，用来存放相关动画的定时器，统一管理
PINGAN.mask = document.getElementById("mask-color-opacity-black");
PINGAN.loading = document.getElementById("mask-loading");
PINGAN.maskNoBg = document.getElementById("mask-no-color");
PINGAN.netOver = document.getElementById("netOver");
PINGAN.newAlert = document.getElementById("newAlert"); //上面几个变量应该是比较长用的，取一次就存下来，节省时间
PINGAN.interFace = {}; //接口对应的返回
PINGAN.model = {}; //model对应的返回
PINGAN.view = {};  //view对应的返回
PINGAN.viewModel = {}; //viewModel对应的返回
PINGAN.response = [];  //把接口返回数据暴露到全局，供相关回调链进行操作，要注意对该变量的清空处理，避免取到就数据
PINGAN.respThread = {}; //存储回调的线程相关的字段
PINGAN.oneIdLink = ""; //一账通宝的注册地址
PINGAN.pluginId = "PA02100000000_02_XRLD"; //当前的插件Id
PINGAN.pluginName = "RYM_XRLD 新人有礼"; //当前的插件名称
PINGAN.BvmEvent = {}; //回调链控制台
PINGAN.appDownUrl = "http://m.pingan.com/c2/sys/tuiguang/weixin/index.html?app=yzt-wtg18"; //一账通下载地址
//PINGAN.temporary={};
PINGAN.activityPic = [];//
PINGAN.IS_ANDROID = navigator.userAgent.toUpperCase().indexOf('ANDROID') != -1;
PINGAN.IS_IOS = navigator.userAgent.toUpperCase().indexOf('IPHONE OS') != -1;
PINGAN.isSubmiting = false;

if(location.href.indexOf("localhost")>-1){
    PINGAN.serverUrl = "https://maam-dmzstg3.pingan.com.cn:56443";
}else{
    PINGAN.serverUrl = "";
    //PINGAN.oneIdLink = "http://toa-sa-dmzstg3.pingan.com.cn:12380/toasa/fund/tonglian/login/fourLogin.screen?activity=60007&activityUrl="
    PINGAN.oneIdLink = "http://toa-sa.pingan.com.cn/toasa/fund/tonglian/login/fourLogin.screen?activity=60007&activityUrl="
}
PINGAN.oneIdLink = PINGAN.oneIdLink + location.origin + location.pathname; //一账通宝的地址

function showLoading () {
    //加载页面
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.mask.style.display = "block";
    PINGAN.loading.style.display = "block";
    $('body').on('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
}
function hideLoading () {
    //隐藏加载页面
    PINGAN.mask.style.display = "none";
    PINGAN.loading.style.display = "none";
    PINGAN.maskNoBg.style.display = "none";
    $('body').off('touchmove');
}

function newAlert (str) {
    PINGAN.newAlert.innerHTML = str;
    PINGAN.maskNoBg.style.display = "block";
    PINGAN.newAlert.style.display = "block";
    if(str) {
        PINGAN.alertTime = setTimeout(function(){
                    //1.5秒后自动隐藏
            hideAlert();
        },1500);
    }
    //if(timeState) {
    //    PINGAN.alertTime = setTimeout(function(){
    //        PINGAN.newAlert.innerHTML = "您已经等待超过5秒，建议您检查网络连接后重新尝试";
    //    })
    //}else{
    //    PINGAN.alertTime = setTimeout(function(){
    //        //1.5秒后自动隐藏
    //        hideAlert();
    //    },1500);
    //}
}

function hideAlert(){
    PINGAN.maskNoBg.style.display = "none";
    PINGAN.newAlert.style.display = "none";
    if(PINGAN.alertTime) {
        clearTimeout(PINGAN.alertTime);
        PINGAN.alertTime = 0; //重置保证hideAlert逻辑正常
    }
}
function showNetOver(){

    PINGAN.netOver.style.display = "block";
    PINGAN.mask.style.display = "block";

    $('body').on('touchmove', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
}
function hideNetOver(){

    PINGAN.netOver.style.display = "none";
    PINGAN.mask.style.display = "none";
    $('body').off('touchmove');
}
//网络连接超时关闭
PINGAN.backPic = document.getElementById('netOver_backPic');
PINGAN.backPic.onclick = function(e){
    console.log(e);
    var target = e.target;//被指向单击的对象
    if (target.className == "netOver_close" || target.className  == "nv_backPic") {
        hideNetOver();
    }
}
/**
 * 弹出drop框
 * @参数 {string} dropCont {string} dropBtn
 * @返回 无返回
 */
function showPopDrop (dropCont,dropBtn){
    var $popDropBox = $("#pop-dropBox");
    var $dropCont = $("#dropCont");
    var $dropBoxBtn = $("#dropBoxBtn");
    $dropCont.html(dropCont);
    $dropBoxBtn.html(dropBtn);
    PINGAN.mask.style.display = "block";
    $popDropBox.attr("style","display:block");
    $popDropBox[0].classList.add("dropBox_to_rise");
    $dropBoxBtn.tap(function(){
        hidePopDrop();
    })
}
/**
 * 弹出drop框
 * @参数 {string} dropCont {string} dropBtn
 * @返回 无返回
 */
function hidePopDrop (){
    var $popDropBox = $("#pop-dropBox");
    PINGAN.mask.style.display = "none";
    $popDropBox.attr("style","display:none");
    $popDropBox[0].classList.remove("dropBox_to_rise");
}
function hideClose() {
    //隐藏关闭按钮
    App.call(["webCloseButtonShowOrHidden"],function(data){
        console.log(data)
    },function(error){
        console.log(error)
    },{isShow:"N"},{returnType:"JSON"});
}
function hideWebView() {
    App.call(["closeNativeWebview"],function(data){
        console.log(data);
    },function(error){
        console.log(error);
    },{});
}
function closeWebView () {
    var $guide_close = $(".guide_close");
    var $guide_back = $(".guide_back");
    $guide_close.tap(function(){
        hideWebView();
    });
    $guide_back.tap(function(){
        console.log("点击了返回");
        history.back();
    })
}
function callBackZero () {
    //所有回调链归零重置
    PINGAN.BvmEvent.indexVM.backZero();
    PINGAN.BvmEvent.acceptVM.backZero();
    PINGAN.BvmEvent.lotteryVM.backZero();
    PINGAN.BvmEvent.guideVm.backZero();
    PINGAN.BvmEvent.bannerVm.backZero();
    PINGAN.BvmEvent.checkUser.backZero();
    PINGAN.BvmEvent.showOcr.backZero();
    PINGAN.BvmEvent.myRecord.backZero();
    PINGAN.BvmEvent.testRe.backZero();

}
function getScreenInfo () {
    var width = window.screen.width;
    var height = window.screen.height;
    var dpr = window.devicePixelRatio;
    newAlert("width:"+width+";height:"+height+";dpr:"+dpr);
}
//埋点方法，依赖native.js，不进行埋点可删除
function MaiDian(lableStr){
    var _pluginid = PINGAN.pluginId;
    var _lableStr = lableStr;
    var _eventStr = PINGAN.pluginName;
    App.call(["saveTalkingData"],function(result){
        //do something success
        console.log(result);
    },function(error){
        //do something error
        console.log(error);
    },{
        label:_lableStr,//标签
        event:_eventStr,//事件
        pluginId:PINGAN.pluginId,
        map:{
            timestamp:new Date().getTime(),
            sourceId:_pluginid
        } //自定义参数
    });
}
window.loginsuccess=function(data){
    var res;
    try{
        res=JSON.parse(data);
    }catch(e){
        res=data;
    }
    console.log(res);
    if(res.code=="0"){
        hideLoading ();
        //把登录的用户登录手机号码存session
        //sessionStorage.setItem("loginMobileNo",PINGAN.loginMobileNo)
        localStorage.setItem("loginMobileNo",PINGAN.loginMobileNo);
        var opt={};
        opt.mamcId=res.data.mamcId;
        opt.key=res.data.sessionSecret;
        opt.SSOTicket=res.data.ssoTicket;
        App.call(["notifyLogin"],function(){
            //SDK拥有登陆态
            App.call(["sendMessage"],function(data){
                var ssoticket;
                try{
                    ssoticket=JSON.parse(data);
                }catch(e){
                    ssoticket=data;
                }
                PINGAN.userInfo.ssoTicket=ssoticket.SSOTicket;
                PINGAN.userInfo.timestamp=ssoticket.timestamp;
                PINGAN.userInfo.signature=ssoticket.signature;
                PINGAN.BvmEvent.indexVM.backRun();
            },function(){},["getSSOTicket"]);
        },function(){},opt);
    }else{
        $('.main-phon-err-code').show();
        $("#ot_showPh").show();
        $("#ot_showPh").html("短信验证码错误,请重新输入");
    }
}

define(function(require){
    require("zepto");
    require("nativeJS");
    require("bvm");

    PINGAN.interFace = require("interface");
    PINGAN.model = require("model");
    PINGAN.view = require("view");
    PINGAN.viewModel = require("viewModel");

    var ssoTickInfo = "";
    if(location.href.indexOf("localhost")>-1){
        success(JSON.stringify({
            deviceId:"deviceId00010134"+Math.random()*100,
            deviceType:"android_xxx",
            osVersion:"8.2",
            anyDoorSdkVersion:"2.2.1",
            appId:"SZDBK00000000_01_KDYH",
            appVersion:"4.4.0.0",
            pluginId:"PA02100000000_02_XRLD"
        }))
    }else{
        App.call(["sendMessage"],function(ticketInfo){
            ssoTickInfo = JSON.parse(ticketInfo);
            App.call(["sendMessage"],success,function(e){},["getDeviceInfo"]);
        },function(){},["getSSOTicket"]);
    }
    function success (r) {
        var deviceInfo = JSON.parse(r);
        PINGAN.userInfo.pluginId = "PA02100000000_02_XRLD";
        PINGAN.userInfo.deviceId = deviceInfo.deviceId||"";
        PINGAN.userInfo.deviceType = deviceInfo.deviceType||"";
        PINGAN.userInfo.osVersion = deviceInfo.osVersion||"";
        PINGAN.userInfo.appVersion = deviceInfo.appVersion||"";
        PINGAN.userInfo.sdkVersion = deviceInfo.anyDoorSdkVersion||"";
        PINGAN.userInfo.appId = deviceInfo.appId||"";
        if(ssoTickInfo) {
            PINGAN.userInfo.ssoTicket = ssoTickInfo.SSOTicket;
            PINGAN.userInfo.signature = ssoTickInfo.signature;
            PINGAN.userInfo.timestamp = ssoTickInfo.timestamp;
        }

        if(PINGAN.userInfo.appId == 'PA00800000000_01_EQY'|| PINGAN.userInfo.appId== 'PA00300000000_01_HCZ' || PINGAN.userInfo.appId== 'PA00200000000_01_APP'){
            PINGAN.toaAppId = 60021;
        }else if(PINGAN.userInfo.appId == 'PA02500000000_01_LJS' || PINGAN.userInfo.appId == 'PA00500000000_01_AELC' || PINGAN.userInfo.appId == 'PA00400000000_01_CFB'){
            PINGAN.toaAppId =60022;
        }else if(PINGAN.userInfo.appId == 'SZDBK00000000_01_KDYH' || PINGAN.userInfo.appId == 'PA01300000000_01_CZYH'){
            PINGAN.toaAppId =60023;
        }else if(PINGAN.userInfo.appId == 'PA01700000000_01_CFS'){
            PINGAN.toaAppId =60024;
        }else{
            PINGAN.toaAppId =60025;
        }
        PINGAN.viewModel.selectPage();
        MaiDian("0101-进入'新人有礼活动主页'");
    }

});