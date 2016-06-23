//与viewModel自动映射，视图展示层
define(function(require){
    //现在的模版策略有问题，这个地方一定要改，先暂时用require插件text库来处理
    //路由
    function route (pageName,state) {
        var hash = location.href;
        var hisState = {"pageName":pageName};
        var hisTitle = "";
        var hisUrl = hash + "#pageName=" + pageName;
        var hisPageName = "";
        if(hash.indexOf("pageName")>-1) {
            //如果url中带pageName认为是已经是有路由页，要分别处理
            hisUrl = hisUrl.split("#pageName")[0] +  "#pageName=" + pageName;
            hisPageName = hash.split("pageName=")[1];
            if(hisPageName!=pageName) {
                if(state==0) {
                    //不插入历史记录
                    history.replaceState(hisState,hisTitle,hisUrl);
                }else if(state==1) {
                    //插入历史记录
                    history.pushState(hisState,hisTitle,hisUrl);
                }
            }
            //goPageRouter(hisPageName,state);
        }else{
            //如果url中不带pageName认为暂时没插入路由先根据情况插入
            if(state==0) {
                //不插入历史记录
                history.replaceState(hisState,hisTitle,hisUrl);
            }else if(state==1) {
                //插入历史记录
                history.pushState(hisState,hisTitle,hisUrl);
            }
        }
    }
    window.addEventListener("popstate",function(evnt){
        if(evnt.state.pageName) {
            var pageName = evnt.state.pageName;
            showHisPage(pageName);
            console.log("发生了返回");
            $('body').off('touchmove');
            hideNetOver();
            callBackZero();
        }else{
            //如果是首页刷新，不做任何跳转,直接显示某个页面
            showAptPage("page_main",0,0);
        }
    });

    function showHisPage (pageName) {
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageDom = document.getElementById(pageName);
        if(pageDom.innerHTML == "") {
            //如果是跳出返回后的页面
            if(pageName=="page_main") {
                PINGAN.viewModel.indexVM(); //跳到首页
            }else if(pageName=="page_list") {
                PINGAN.viewModel.listVM(); //跳到列表页
            }
        }else{
            //如果是正常加载进入的页面
            var showPageDom=setTimeout(function(){//加载的延时
                pageDom.style.display = "block";
                clearTimeout(showPageDom);
            },100);
        }

    }

    function showAptPage (pageName,state,loadState) {
        //展示某一页面,pageName是对应page的ID
        //对历史记录的操控写到这里
        var pageMode = $(".pageMode");
        pageMode.css("display","none");
        var pageDom = document.getElementById(pageName);
        var showPageDom=setTimeout(function(){//等待滚动条加载完成再显示
            pageDom.style.display = "block";
            clearTimeout(showPageDom);
        },600);
        route(pageName,state);
        if(loadState) {
            //是否要立刻隐藏loading页，参数是0或者1，1表示立即隐藏，0反之，如果为0需要在对应
            //的model回调中写入相关隐藏逻辑
            var showPageTime = setTimeout(function(){
                hideLoading();
                clearTimeout(showPageTime);
            },10); //加上100毫秒的延时加载
        }
    }
    function indexPage () {
        console.log("加载首页了");
        //主游戏界面
        showLoading();
        var pageHtml = require("text!template/main.html");
        var pageDom = document.getElementById("page_main");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_main",0,1); //首页不纪录游戏纪录
    }
    function ad_adviseV (response) {
        //推荐广告说明页面
        //showLoading();
        var pageHtml = require("text!template/ad_advise.html");
        var pageDom = document.getElementById("ad_advise");
        pageDom.innerHTML = pageHtml;
        showAptPage("ad_advise",0,1); //首页不纪录游戏纪录
    }

    function page_lotteryV (response) {
        //抽奖页
        MaiDian("0501-进入抽奖页面");
        showLoading();
        var pageHtml = require("text!template/mainPage.html");
        var pageDom = document.getElementById("page_lottery");
        pageDom.innerHTML = pageHtml;
        var clientHeight = window.document.body.clientHeight;
        var domeHeight = clientHeight+"px";

        $("#page_lottery").css('height',domeHeight);
        showAptPage("page_lottery",1,1); //首页不纪录游戏纪录
    }
    function drawPage () {
        //领取抽奖码界面
        MaiDian("0601-进入抽奖码浮层页面");
        showLoading();
        var pageHtml = require("text!template/draw.html");
        var pageDom = document.getElementById("page_draw");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_draw",1,1); //首页不纪录游戏纪录
    }
    function overTimePage () {
        //领取抽奖码界面
        showLoading();
        var pageHtml = require("text!template/overTime.html");
        var pageDom = document.getElementById("page_overTime");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_overTime",1,1); //首页不纪录游戏纪录
    }

    function acceptPage(userAcceptInfo) {
        showLoading();
        var pageHtml = require("text!template/accept.html");
        var pageDom = document.getElementById("page_accept");
        pageDom.innerHTML = pageHtml;

        console.log(userAcceptInfo);
        var accept_code = userAcceptInfo.inviteCode;
        var newReward = userAcceptInfo.newReward;
        var $accept_m = $("#accept_m");
        var $accept_code = $("#accept_code");
        $accept_m.html(newReward);
        $accept_code.val(accept_code);
        showAptPage("page_accept",0,1); //首页不纪录游戏纪录
    }
    function lotteryPage(userAcceptInfo) {
        showLoading();
        var pageHtml = require("text!template/accept.html");
        var pageDom = document.getElementById("page_accept");
        pageDom.innerHTML = pageHtml;
        var accept_code = userAcceptInfo.inviteCode;
        var newReward = userAcceptInfo.newReward;
        var $accept_m = $("#accept_m");
        var $accept_code = $("#accept_code");
        $accept_m.html(newReward);
        $accept_code.val(accept_code);
        showAptPage("page_accept",1,1); //首页不纪录游戏纪录
    }
    function bannerPage(body) {
        showLoading();
        var pageHtml = require("text!template/banner.html");
        var pageDom = document.getElementById("page_banner");
        pageDom.innerHTML = pageHtml;
        var imgUrl = ""; //图片地址
        var hdUrl = ""; //点击后的跳转地址
        var context = ""; //广告配置的文案
        if(body.data.length>0) {
            var i = 0;
            for(i;i<body.data.length;i++) {
                var objData = body.data[i];
                var type = objData.type;
                if(type=="text") {
                    var $bannerText = $("#bannerText");
                    context = body.data[i].context;
                    $bannerText.html(context);
                }else if(type=="img") {
                    imgUrl = body.data[i].imgUrl[0];
                    hdUrl = body.data[i].url[0];
                    var $banner_add = $(".banner_add");
                    var banner_attend = $(".banner_attend"); //我要参加
                    $banner_add.attr("style","background-image:url('"+imgUrl+"');background-size:100% 100%;background-repeat: no-repeat;");
                    $banner_add.tap(function(){
                        MaiDian("0503-点击'banner'");
                        location.href = hdUrl;
                    });
                    banner_attend.tap(function(){
                        MaiDian("0502-点击'我要参加'按钮");
                        location.href = hdUrl; //跳到一账通下载页
                    });
                }
            }
        }
        showAptPage("page_banner",1,1); //首页不纪录游戏纪录
        $bannerText[0].classList.add("text_ease_in_out"); //添加滚动条
    }
    function guidePage() {
        showLoading();
        var pageHtml = require("text!template/guide.html");
        var pageDom = document.getElementById("page_guide");
        pageDom.innerHTML = pageHtml;


        showAptPage("page_guide",1,1); //首页不纪录游戏纪录
    }

    function myRecordPage() {
        showLoading();
        var pageHtml = require("text!template/myRecord.html");
        var pageDom = document.getElementById("page_myRecord");
        pageDom.innerHTML = pageHtml;

         $('#sibemit').on("click",function(){
            $('.p-sim').show();
            $('#p-sim').css('display','block');
        });
        $('#x-hide').on("click",function(){
            $('#p-sim').hide();
        });showAptPage("page_myRecord",1,1); //首页不纪录游戏纪录
    }

    function myPagePrize(pageName) {
       // showLoading();
        var pageHtml = require("text!template/myPrize.html");
        var pageDom = document.getElementById("page_myPrize");
        pageDom.innerHTML = pageHtml;
        showAptPage("page_myPrize",1,1); //首页不纪录游戏纪录

        $('#pr-banner').on("click",function(){
            $('.p-Popup').show();
            $('.x-hide-option').show();
           $('.x-hide-option').css('position','fixed');

            });
        $('.x-hide-clos').on("click",function(){
            $('.p-Popup').hide();
            $('.x-hide-option').hide();
        });


    }

    //function errorPage (state) {
    //    showLoading();
    //    var pageHtml = "";
    //    if(state=="0"){
    //        //接口出错或者长时间不返回数据
    //        pageHtml = "<p class='errorP font-h2'>亲，网络连接出错，请检测网络后，稍后访问</p>"
    //        pageHtml = "  <div class='guide_back' onclick='history.back();'></div>"
    //    }else if(state=="1"){
    //        //接口返回code为1的错误
    //        pageHtml = "<p class='errorP font-h2'>亲，由于不可预知的错误，网络出现异常，请稍后访问</p>"
    //    }else if(state=="3") {
    //        //游戏未开始
    //        pageHtml = "<p class='errorP font-h2'>亲，您来早了，游戏还未开始</p>"
    //    }else if(state=="4") {
    //        //游戏积分用完
    //        pageHtml = "<p class='errorP font-h2'>当日积分已领完，明天再来吧</p>"
    //    }else if(state=="5") {
    //        //网络超时
    //        pageHtml = "<p class='errorP font-h2'>亲，你的网络连接超时，请确认网络后请重新尝试</p>"
    //    }
    //    var pageDom = document.getElementById("page_error");
    //    pageDom.innerHTML = pageHtml;
    //    showAptPage("page_error",0,1);
    //    hideAlert();
    //}

    return {
        indexPage:indexPage,
        ad_adviseV:ad_adviseV,
        acceptPage:acceptPage,
        bannerPage:bannerPage,
        //errorPage:errorPage,
        guidePage:guidePage,
        lotteryPage:lotteryPage,
        myRecordPage:myRecordPage,
        myPagePrize:myPagePrize,
        page_lotteryV: page_lotteryV,
        drawPage:drawPage,
        overTimePage:overTimePage
    };
});