//与view层自动映射，连接view层和Model层的关键,视图模型层
define(function(){
    PINGAN.BvmEvent.indexVM = {}; //首页的回调链
    PINGAN.BvmEvent.overTimeVM = {};//超时登录
    PINGAN.BvmEvent.ad_adviseVM = {}; //推荐广告说明页面
    PINGAN.BvmEvent.page_lotteryVM = {}; //抽奖页面
    PINGAN.BvmEvent.acceptVM = {}; //领奖的回调链
    PINGAN.BvmEvent.bannerVm = {}; //业务加挂页
    PINGAN.BvmEvent.checkUser = {}; //检测用户是否领取过奖励
    PINGAN.BvmEvent.myRecord = {}; //我的战绩回调链
    PINGAN.BvmEvent.drawVM = {};//获取抽奖码页面
    PINGAN.BvmEvent.testRe = {};
    PINGAN.BvmEvent.myPrize = {};

    function selectPage () {
        showLoading();
        //定义多个回调链,async:true表示是异步,false表示是同步
        PINGAN.BvmEvent.indexVM = new Bvm({
            interFace: {func:PINGAN.interFace.indexInter, async:true},
            viewChain:PINGAN.view.indexPage,
            modelChain:PINGAN.model.indexM,
            callBack:indexEvnt,
            autoRun:true
        });
        //我的战绩
        showLoading();
        PINGAN.BvmEvent.testRe = new Bvm({
            interFace: {func:PINGAN.interFace.getRecord, async:true},
            viewChain:PINGAN.view.myRecordPage,
            modelChain:PINGAN.model.modelRe,
            callBack:myRepage,
            autoRun:false
        });
        //推荐广告说明页面
        PINGAN.BvmEvent.ad_adviseVM = new Bvm({
            viewChain:PINGAN.view.ad_adviseV,
            modelChain:PINGAN.model.ad_adviseM,
            callBack:ad_adviseEvnt,
            autoRun:false
        });
           //抽奖页
        PINGAN.BvmEvent.page_lotteryVM = new Bvm({
            interFace: {func:PINGAN.interFace.page_lottery, async:true},
            viewChain:PINGAN.view.page_lotteryV,
            modelChain:PINGAN.model.page_lotteryM,
            callBack:page_lotteryEvnt,
            autoRun:false
        });
        //推荐抽奖码
        PINGAN.BvmEvent.drawVM = new Bvm({
            interFace: {func:PINGAN.interFace.drawInter, async:true},
            viewChain:PINGAN.view.drawPage,
            modelChain:PINGAN.model.drawM,
            callBack:drawEvnt,
            autoRun:false
        });
        //超时浮层
        PINGAN.BvmEvent.overTimeVM = new Bvm({
            //interFace: {func:PINGAN.interFace.overTimeInter, async:true},
            viewChain:PINGAN.view.overTimePage,
            modelChain:PINGAN.model.overTimeM,
            autoRun:false
        });
        //领取接口的逻辑,先判断当前用户的状态,是否为新用户,是否领过奖
        PINGAN.BvmEvent.acceptVM = new Bvm({
            interFace: {func:PINGAN.interFace.checkUserRewardType, async:true},
            modelChain:{func:PINGAN.model.acceptM, async:true},
            viewChain:PINGAN.view.acceptPage,
            callBack:acceptEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.lotteryVM = new Bvm({
            interFace: {func:PINGAN.interFace.acceptInter, async:true},
            modelChain:{func:PINGAN.model.lotteryM, async:true},
            viewChain:PINGAN.view.lotteryPage,
            callBack:lotteryEvnt,
            autoRun:false
        });
        PINGAN.BvmEvent.guideVm = new Bvm({
            viewChain:PINGAN.view.guidePage,
            modelChain:PINGAN.model.guideM,
            callBack:goBannerEvnt,
            autoRun:false
        });
        //一账通宝加挂
        PINGAN.BvmEvent.bannerVm = new Bvm({
            interFace:{func:PINGAN.interFace.getBannerList, async:true},
            viewChain:PINGAN.view.bannerPage,
            modelChain:PINGAN.model.bannerM,
            autoRun:false
        });
        PINGAN.BvmEvent.checkUser = new Bvm({
            interFace: {func:PINGAN.interFace.checkUserRewardType, async:true},
            modelChain: PINGAN.model.checkUser,
            autoRun:false
        });
        //推荐码填写
        PINGAN.BvmEvent.showOcr = new Bvm({
            callBack:showReCode,
            autoRun:false
        });
        //我的战绩:推荐奖,新人奖
        PINGAN.BvmEvent.myRecord = new Bvm({
            interFace: {func:PINGAN.interFace.myRecordInter, async:true},
            modelChain:{func:PINGAN.model.myRecordM, async:true},
            callBack:showMyRecord,
            autoRun:false
        })
        //做任务赢大奖
        PINGAN.BvmEvent.myPrize = new Bvm({
           // interFace:{func:PINGAN.interFace.PagePrize, async:true},
            viewChain:PINGAN.view.myPagePrize,
           // modelChain:{func:PINGAN.model.myPrizeto, async:true},
            callBack:showmyPze,
            autoRun:false
        })
}
    function indexEvnt(){
        $(".main_explain").tap(function(){
            $('input').blur();
            showActiveRule();

        });

    }
    function myRepage(){

        $('.bot-hide').on("click",function(){
            $('.bot-fixed-f').hide();
        });

        //$('.sibemit').on("click",function(){
        //
        //});
        $('#x-hide').on("click",function(){
            $('#info-page').hide();
            $('.info-page').off('touchmove');
            App.call(["webCloseButtonShowOrHidden"],function(data){
                },function(error){
                    console.log("失败");
                },{
                    isShow: 'y'

                },{returnType: 'Object'}
            );
            //姓名为空隐藏
            $('.p-bottom-null-name').hide();
            $('.p-bottom-null-size').hide();
            //收货地址为空隐藏
            $('.p-bottom-null-code').hide();
            //身份证为空隐藏
            $('.sim-color').css('display','none');
            $('.p-bottom-null-rie').hide();
            //手机号为空隐藏
            $('.sim-colorph').css('display','none');
            $('.p-bottom-null-phon').hide();
            //所以val值清空
            $('#name').val('');
            $('#address').val('');
            $('#cardId').val('');
            $('#mobaileNo').val('');
           // localStorage.setItem("inviteCode", body.mobaileNo);
        });

        //姓名失去焦点事件
        $("#name").on('blur',function(){
            validateName();
        })
        $("#name").on('focus',function(){
            $('body').scrollTop(100);
        })
        //收货地址不能为空
        $("#address").on('blur',function(){
            validatefeil();
        })
        //身份证失去焦点时间
        $("#cardId").on('blur',function(){
            validateIdCard();
        })
        //手机号码失去焦点事件
        $("#mobaileNo").on('blur',function(){
            validateMabble();
        })





        //提交按钮点击事件
        $("#p-page-sibmit").on('click',function(){
            $('input').blur();
            if(PINGAN.isSubmiting){
                return;
            }else {
                PINGAN.isSubmiting = true;
                submitConvertPrize();
                //showLoading();
                PINGAN.BvmEvent.testRe.backZero(); //重置当前回调链
            }
            App.call(["webCloseButtonShowOrHidden"],function(data){
                },function(error){
                    console.log("失败");
                },{
                    isShow: 'y'

                },{returnType: 'Object'}
            );
            MaiDian("0802-点击确认提交");
        })


    }


    //验证身份证号码
    function validateIdCard(){
        var idCard = $('#cardId').val();
        if(idCard==null||idCard=='') {
            //提示身份证号码不能为空
            $('.p-bottom-null-rie').show();
            $('.sim-color').css('display','none');
            return false;
        }
        //15位数身份证正则表达式
        var arg1 =/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
        //18位数身份证正则表达式
        var arg2 =/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
        if (arg1.test(idCard) || arg2.test(idCard)) {
            $('.sim-color').css('display','none');
            $('.p-bottom-null-rie').hide();
            return true;
        }else {
            $('.sim-color').css('display','block');
            $('.p-bottom-null-rie').hide();
            return false;
        }
    }

    //验证手机号码
    function validateMabble(){
        var mobileNo = $('#mobaileNo').val();
        if(mobileNo==null||mobileNo=='') {
            //提示身份证号码不能为空
            $('.p-bottom-null-phon').show();
            $('.sim-colorph').css('display','none');
            return false;
        }
        var str = /^1[3|4|5|6|7|8]\d{9}$/;
        if (str.test(mobileNo)) {
            $('.sim-colorph').css('display','none');
            $('.p-bottom-null-phon').hide();
            return true;
        } else {
            $('.sim-colorph').css('display','block');
            $('.p-bottom-null-phon').hide();
            return false;
        }
    }

    //姓名不能为空
    function validateName(){
        var name = $('#name').val();
        if(name == null || name ==''){
            $('.p-bottom-null-name').show();
            $('.p-bottom-null-size').hide();
            return false;
        }else if(name.length > 5){
            $('.p-bottom-null-size').show();
            $('.p-bottom-null-name').hide();
        }else if(name.length > 1 || name.length < 5){
            $('.p-bottom-null-name').hide();
            $('.p-bottom-null-size').hide();
            return true;
        }
    }
    //收货地址不能为空
    function validatefeil(){
        var code = $('#address').val();
        if(code == null || code ==''){
            $('.p-bottom-null-code').show();
            return false;
        }else if(code.length > 1 || code.length < 100){
            $('.p-bottom-null-code').hide();
            return true;
        }
    }
    //身份证不能为空
    function validaterie(){
        var rie = $('#cardId').val();
        if(rie == null || rie ==''){
            $('.p-bottom-null-rie').show();
            return false;
        }else if(rie.length > 1){
            $('.p-bottom-null-rie').hide();
            return true;
        }
    }

    //封装领取奖品信息
    function getsubmitConvertPrize(){
        var prizeCode = PINGAN.prizeId;
        var drawCode = PINGAN.drawCode;
      //console.log(prizeCode);
      //  console.log(drawCode);
        var name = document.getElementById("name").value;
        var address = document.getElementById("address").value;
        var cardId = document.getElementById("cardId").value;
        var mobaileNo = document.getElementById("mobaileNo").value;
        //var prizeCode=document.getElementById("prizeId").dataset.prizeid;
        //var drawCode=document.getElementById("Idcody").data.drawcode;

        var data = {
            name:name,
            address:address,
            cardId:cardId,
            mobaileNo:mobaileNo,
            prizeCode:prizeCode,
            drawCode:drawCode
        }

        return data;

    }

    //提交表单数据
    function submitConvertPrize(){
        if(validateName() && validatefeil() && validaterie() && validateIdCard() && validateMabble()) {

            var data = getsubmitConvertPrize();//获得领取奖品信息
            PINGAN.interFace.getConvertPrize(data);
        }else{
            PINGAN.isSubmiting = false;
        }
    }

    function  showmyPrize() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myPrize = $("#myPrize");
        var $myprizeClose = $("#myprizeClose");
        $mask.show();
        $popScene.show();
        $myPrize.show();
        myprizeClose.one("click",function(){
          //  console.log("事件发生了绑定");
            hideMyPrize();
            PINGAN.BvmEvent.myRecord.backZero(); //重置当前回调链
        });
    }
    function hideMyPrize() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myPrize = $("#myPrize");
        $mask.hide();
        $popScene.hide();
        $myPrize.hide();
    }
    function showmyPze(){
        var $simbot = $("#p-pop-bt-popup");
         $simbot.tap(function(){
           // PINGAN.BvmEvent.page_lotteryVM.reset();
            PINGAN.BvmEvent.page_lotteryVM.run();
        });

        $('.p-pop-bt-reward').on("click",function(){
            $('.p-Popup').hide();
            $('.x-hide-option').hide();
        });

    }


    //验证登陆验证码
    function maincode(codeTypes){
        //debugger
        var phon_code = $('#main_phon_code').val();
        if(codeTypes==1){
            if(phon_code==null||phon_code=="") {
                $('.main-phon-err-code').hide();
                return true;
            }
        }else{
            if(phon_code==null||phon_code==""){
                $('.main-phon-err-code').show();
                return false;
            }
            return true;
        }
    }

    //验证登陆手机号码
    function mainphon(businessType){
       // debugger
        var phon_input = $('#main_phon_input').val();
        if(businessType==1){

            if(phon_input==null||phon_input=="") {
                $('.main-phon-err').hide();
                return true;
            }
        }else{
            if(phon_input==null||phon_input==""){
                $('.main-phon-err').show();
                return false;
            }
        }
        var str = /^1[3|4|5|6|7|8]\d{9}$/;
        if (str.test(phon_input)) {
            $('.main-phon-err').hide();
            gettime();
            return true;
        } else {
            $('.main-phon-err').show();
            return false;
        }


    }
    //提交表单数据
    function loginsubmit(){
        if(mainphon(2) && maincode(2)) {
            var date = {};//请求接口数据
            //var $main_accbtn = $(".main_accBtn");//从弹出框单击到我的战绩
            var submitLogUrl = "script/mock/Login.json";
           // var submitLogUrl = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/ checkUserRewardType.do";

        }
    }

    function gettime(){
            //短信验证码
            var wait = 60;
            document.getElementById("main-codes").disabled = "";
            function time(o) {
                var temp_time=null;
                if (wait === 0) {
                    o.removeAttribute("disabled");
                    o.value = "重新获取验证码";
                    wait = 60;
                } else {
                    o.setAttribute("disabled", true);
                    o.value = "重新发送(" + wait + ")";
                    wait--;

                    temp_time=setTimeout(function () {
                            time(o);
                        },
                        1000);

                }

            }
            $("#main-codes").tap(function () {
                if (wait < 60) {
                    return;
                } else(wait == 60)
                {
                    time(this);

                var getInputId = document.getElementById("main_phon_input").value;
                var a = getInputId;
                var o = a.replace(a.substr(3, 4), '****');
                $("#main-close").html("已发送至" + o);
            }
            });

    }

    function ad_adviseEvnt(response){


        var $ad_role_captures = $("#ad_role_captures");
        var $ad_role_btn = $("#ad_role_btn");
        var $ad_goPageLottery_btn = $("#ad_goPageLottery_btn");

        $ad_role_captures.tap(function() {
            $('.ad_role_captures_content').show();
            $('.ad_role_bg_page').show();
            App.call(["webCloseButtonShowOrHidden"],function(data){
                },function(error){
                    console.log("失败");
                },{
                    isShow: 'n'

                },{returnType: 'Object'}
            );

            $('.ad_role_bg_page').css('position', 'fixed');

        });

        $ad_role_btn.tap(function(){
            $('.ad_role_captures_content').hide();
            $('.ad_role_bg_page').hide();
            App.call(["webCloseButtonShowOrHidden"],function(data){
                },function(error){
                    console.log("失败");
                },{
                    isShow: 'y'

                },{returnType: 'Object'}
            );
        });

        $ad_goPageLottery_btn.tap(function(){
            //PINGAN.BvmEvent.page_lotteryVM.reset();
            MaiDian("0402-点击'进入抽奖区'");
            PINGAN.BvmEvent.page_lotteryVM.backZero();

            App.call(["sendMessage"],function(data){
                var ssoticket;
                try{
                    ssoticket=JSON.parse(data);
                }catch(e){
                    ssoticket=data;
                }
                showLoading ();
                PINGAN.BvmEvent.page_lotteryVM.run(ssoticket);
            },function(){},["getSSOTicket"]);

        });
    }

    function page_lotteryEvnt (response) {
         //到后台提取客户抽奖次数
        var drawNum = response.body.drawNum;
        $("#numberOfTime").html(drawNum);

            //单击领取抽奖码按钮操作
        MaiDian("0504-点击'领取抽奖码'");
        var midContent = $("#midContent");
        midContent.on('tap',function(e) {
            var target = e.target;//被指向单击的对象

            if (target.className == "draw_btn" || target.className == "draw_btn_code") {

                PINGAN.startTime = target.getAttribute("startDate");
                PINGAN.endtime = target.getAttribute("overdate");
                PINGAN.prizecode = e.target.dataset.prizecode;
                var prizeNum = target.getAttribute("prizeNum");

                if(prizeNum == "0"){
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.interFace.prizeList(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);

                    $('body').on('touchmove', function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });

                }else if(PINGAN.startTime > PINGAN.endtime){
                    newAlert('正在开奖中,敬请期待');
                }else{
                    showLoading();
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.interFace.drawActivityCode(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                }

            }
        });
        //抽奖页面-邀请好友
        MaiDian("0502-点击'邀请好友'");
        var taskBtn = $("#taskBtn");
        taskBtn.tap(function(e){
            var target = e.target;//被指向单击的对象
            if (target.className == "taskBtn2" || target.className == "doTask") {
                //PINGAN.BvmEvent.ad_adviseVM.reset();
                PINGAN.BvmEvent.ad_adviseVM.backZero();
                PINGAN.BvmEvent.ad_adviseVM.run();
            }
        });

        var $recordBtn = $("#recordBtn");//我的战绩
        var $backPic = $("#backPic");//抽奖页返回按钮
        var $backmain = $("#backmain");//关闭弹出框,回到主页面

        var $myrecordbtn = $("#myrecordbtn");//从弹出框单击到我的战绩
        var $mainpage_close = $("#mainpage_close");//活动结束关闭按钮

        //抽奖页返回按钮
        $backPic.tap(function(){
            PINGAN.BvmEvent.ad_adviseVM.backZero();
            PINGAN.BvmEvent.ad_adviseVM.run();
        });

        $recordBtn.tap(function(){
            showLoading();
            //我的战绩
            MaiDian("0503-点击'我的战绩'");

            App.call(["sendMessage"],function(data){
                var ssoticket;
                try{
                    ssoticket=JSON.parse(data);
                }catch(e){
                    ssoticket=data;
                }
                showLoading();
                PINGAN.BvmEvent.testRe.run(response);
                PINGAN.BvmEvent.testRe.backZero();
            },function(){
                alert('error');
            },["getSSOTicket"]);


        });
        //关闭弹出框,回到主页面
        $backmain.tap(function(){
            $('.continueTask').hide();
            $('.mainHideOption').hide();
            $('body').off('touchmove');
        });


        ////从弹出框单击到邀请好友页面
        MaiDian("0603-点击'邀请好友'");
        var task = $("#mytaskbtn");
        task.tap(function(e) {
            var target = e.target;//被指向单击的对象
            if (target.className == "taskBtn" || target.className == "ct_invitate") {

                PINGAN.BvmEvent.ad_adviseVM.backZero();
                PINGAN.BvmEvent.ad_adviseVM.run();
            }
            $('body').off('touchmove');
        });

        ////从弹出框单击到我的战绩
        MaiDian("0602-点击'我的战绩'");
        $myrecordbtn.tap(function(){
            showLoading();
            PINGAN.BvmEvent.testRe.run();
            PINGAN.BvmEvent.testRe.backZero();
            $('body').off('touchmove');
        });
        //查看中奖号码关闭
        $mainpage_close.tap(function(){
            $('.activityOver').hide();
            $('.mainHideOption').hide();
            $('body').off('touchmove');
        });
    };



    function drawEvnt(response){
        var drawNum = response.body.drawNum;
        localStorage.setItem("drawNum",drawNum);
        var callback_inviteCode = localStorage.getItem("inviteCode");
        var $recordBotton = $("#recordBotton");//我的战绩
        var $draw_backPic = $("#draw_backPic");//返回page_lottery页面
        //刷新抽奖页次数
        $("#numberOfTime").html(drawNum);

        MaiDian("0602-点击'我的战绩'");
        $recordBotton.tap(function(){
            showLoading();

            PINGAN.BvmEvent.testRe.run();
            PINGAN.BvmEvent.testRe.backZero();

        });
        MaiDian("0603-点击'邀请好友'");
        var task1 = $("#task1");
        task1.tap(function(e) {
            var target = e.target;//被指向单击的对象
            if (target.className == "task1" || target.className == "invitate") {
                PINGAN.BvmEvent.ad_adviseVM.backZero();
                PINGAN.BvmEvent.ad_adviseVM.run(callback_inviteCode);
            }
        });

        $draw_backPic.tap(function(){
           var dramNum =  localStorage.getItem("drawNum");
            history.back(dramNum);
        });

    }

    function showActiveRule () {
        MaiDian("0102-点击'活动规则'按钮");
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $activeRule = $("#activeRule");
        //var $activeRuleClose = $("#activeRuleClose");
        var $main_hide_size = $(".main_hide_size");
        var $rule_desc = $(".rule_desc");//监听的滑动区域
        var $rule_font_block = $(".rule_font_block"); //实际滑动区域
        var $drop_block = $(".drop_block"); //跟随连动的区域
        var $prizeList = $("#prizeList");
        $mask.show();
        $popScene.show();
        $activeRule.show();
        $main_hide_size.on('click',function(){
           // $('input').blur();
            hideActiveRule();
        });
        //$activeRuleClose.tap(function(){
        //    hideActiveRule();
        //});
        scrollBar($rule_desc,$rule_font_block,$drop_block,$prizeList); //添加滚动条监听
    }
    function hideActiveRule() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $activeRule = $("#activeRule");
        $mask.hide();
        $popScene.hide();
        $activeRule.hide();
    }
    function scrollBar(scrollBlock, scrollCont, dropBlock) {
        var dpr = 1;
        if(document.querySelectorAll("html")[0].getAttribute("data-dpr")){
            dpr = document.querySelectorAll("html")[0].getAttribute("data-dpr");
        }
        var startX = 0;
        var startY = 0;
        var scrollY = 0; //当前可滑动部分的高度
        var maxHeight = scrollCont.height() - scrollBlock.height(); //下拉最大高度
        scrollBlock.on("touchstart", function(e) {
            if(scrollCont[0].style.cssText!=="") {
                scrollY = parseFloat(scrollCont[0].style.cssText.split(",")[1]);
            }
            if(e.touches.length > 0) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }else{
                startX = e.changedTouches[0].clientX;
                startY = e.changedTouches[0].clientY;
            }
        });
        scrollBlock.on("touchmove", function(e) {
            var moveX = e.touches[0].clientX;
            var moveY = e.touches[0].clientY;
            var absX = moveX - startX;
            var absY = moveY - startY;
            var moveScrollY = scrollY + absY;
            scrollCont.attr("style","-webkit-transform:translate3d(0,"+moveScrollY+"px,0)");
            e.preventDefault(); //修复android低版本的touchemove只触发一次的bug
        });
        scrollBlock.on("touchend", function(e) {
            var endX = 0;
            var endY = 0;
            if(e.touches.length > 0) {
                endX = e.touches[0].clientX;
                endY = e.touches[0].clientY;
            }else{
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
            }
           // console.log(endY - startY);
            if(endY -startY > 0) {
                //上拉的边界
                if(endY - startY + scrollY > 0) {
                    scrollCont.attr("style","-webkit-transform:translate3d(0,0,0)");
                }
            }else if(endY - startY < 0) {
                //下拉的边界
                if(Math.abs(endY - startY) > maxHeight || (Math.abs(endY - startY) + Math.abs(scrollY) > maxHeight)) {
                    scrollCont.attr("style","-webkit-transform:translate3d(0,-"+maxHeight+"px,0)");
                }
            }
        });

    }
    function  showMyRecord() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myRecord = $("#myRecord");
        var $myRecordClose = $("#myRecordClose");
        $mask.show();
        $popScene.show();
        $myRecord.show();
        $myRecordClose.one("click",function(){
            //console.log("事件发生了绑定");
            hideMyRecord();
            PINGAN.BvmEvent.myRecord.backZero(); //重置当前回调链
        });
    }
    function hideMyRecord() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $myRecord = $("#myRecord");
        $mask.hide();
        $popScene.hide();
        $myRecord.hide();
    }
    function showReCode() {
        MaiDian("0201-进入'推荐码填写页面'");
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $reCode = $("#reCode");
        var $reCodeClose = $("#reCodeClose");
        var $recom_code = $(".recom_code");
        var $recom_submit = $(".recom_submit");
        var $recom_no_code = $(".recom_no_code");
        $mask.show();
        $popScene.show();
        $reCode.show();
        $recom_submit.tap(function(){
            if($recom_code.val()=="") {
                newAlert("提交时,推荐码不能为空");
            }else{
                var recomCode = $recom_code.val();
                 //App.call(["sendMessage"],function(ticketInfo){
                 //    var ssoTickInfo = JSON.parse(ticketInfo);
                localStorage.setItem("recomCode",recomCode);
                 //    PINGAN.BvmEvent.lotteryVM.run(ssoTickInfo,"");
                 //},function(){},["getSSOTicket"]);
                MaiDian("0202-点击'提交'按钮");
                //PINGAN.BvmEvent.acceptVM.run();
                PINGAN.BvmEvent.lotteryVM.run();
               // hideReCode();
            }
        });
        $recom_no_code.tap(function(){
            hideReCode();
            App.call(["sendMessage"],function(ticketInfo){
                var ssoTickInfo = JSON.parse(ticketInfo);
                PINGAN.BvmEvent.lotteryVM.run(ssoTickInfo,"");
                //PINGAN.BvmEvent.acceptVM.run();

            },function(){},["getSSOTicket"]);

            MaiDian("0203-点击'没有推荐码'按钮");
        });
        $reCodeClose.tap(function(){
            hideReCode();
        });
    }
    function hideReCode() {
        var $mask = $("#mask-color-opacity-black");
        var $popScene = $("#pop-scene");
        var $reCode = $("#reCode");
        $mask.hide();
        $popScene.hide();
        $reCode.hide();
    }
    function copyText () {
        var $copy_recode = $(".copy_recode");

        //console.log("这是列表页的数据行为");
    }
    function acceptEvnt() {
        var $accept_submit = $(".accept_submit"); //点击立即下载
        $accept_submit.tap(function(){

            App.call(["sendMessage"],function(data){
                var ssoticket;
                try{
                    ssoticket=JSON.parse(data);
                }catch(e){
                    ssoticket=data;
                }
                PINGAN.BvmEvent.page_lotteryVM.backZero();
                PINGAN.BvmEvent.page_lotteryVM.run(ssoticket);
            },function(){
                alert('error');
            },["getSSOTicket"]);
        });


        closeWebView();
        MaiDian("0301-进入'流量领取页面'");
    }
    function lotteryEvnt () {
        var $accept_submit = $(".accept_submit"); //点击立即下载

        $accept_submit.tap(function(){
            MaiDian("0302-点击'立即开通'按钮");
            App.call(["sendMessage"],function(data){
                var ssoticket;
                try{
                    ssoticket=JSON.parse(data);
                }catch(e){
                    ssoticket=data;
                }
                PINGAN.BvmEvent.page_lotteryVM.backZero();
                PINGAN.BvmEvent.page_lotteryVM.run(ssoticket);
            },function(){
                alert('error');
            },["getSSOTicket"]);
        });

        closeWebView();
    }
    function goBannerEvnt () {
        var $guide_submit = $(".guide_submit"); //点击立即开通
        var $guide_skip_span = $(".guide_skip_span"); //跳过一账通宝页面逻辑
        $guide_submit.tap(function(){
            MaiDian("0402-点击'立即开通'按钮");
            location.href = PINGAN.appDownUrl;
        });
        $guide_skip_span.tap(function(){
            PINGAN.BvmEvent.page_lotteryVM.run();
            MaiDian("0403-点击'请点击直接跳过'按钮");
        });
        closeWebView();
        MaiDian("0401-进入'一账通宝引导页面'");
    }

    return {
        selectPage:selectPage,
        hideReCode:hideReCode,
        hideMyPrize:hideMyPrize,

    };
});