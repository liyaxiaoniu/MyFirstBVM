//接口调用，用回调的方式构建起接口层和视口模式层直接的联系
define(function () {
    function backUserInfo(jsonDate) {
        //返回通用参数的
        jsonDate.pluginId = PINGAN.userInfo.pluginId;
        jsonDate.deviceId = PINGAN.userInfo.deviceId;
        jsonDate.deviceType = PINGAN.userInfo.deviceType;
        jsonDate.osVersion = PINGAN.userInfo.osVersion;
        jsonDate.appVersion = PINGAN.userInfo.appVersion;
        jsonDate.sdkVersion = PINGAN.userInfo.sdkVersion;
        jsonDate.appId = PINGAN.userInfo.appId;
        return jsonDate;
    }

    function indexInter(ssoticket) {
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        //var getSummaryUrl ="https://maam.pingan.com.cn/lottery/api/newUserReward/checkUserRewardType.do";
        var getSummaryUrl ="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/checkUserRewardType.do";
        var data = {};
        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;

        $.ajax({
            type: "POST",
            url: getSummaryUrl,
            data: data,
            timeout: 10000,
            dataType: 'json',
            success: function (response) {
                hideLoading();
                var code = response.code;
                if (code == '0') {
                    localStorage.setItem("inviteCode",response.body.inviteCode);
                    if (response.body.isNewUser == 'Y') {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            //console.log("1");

                            PINGAN.BvmEvent.acceptVM.run(response.body);
                        },function(){
                        },["getSSOTicket"]);

                        //PINGAN.BvmEvent.acceptVM.run(response.body);
                    } else if (response.body.isNewUser == 'N') {
                        //领取抽奖码
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.page_lotteryVM.backRun(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    }
                }else if (code == '1') {
                    //系统错误,具体code要按接口文档来
                    showNetOver();
                    //newAlert("登陆失败");
                }else if (code == "7201" || code == "7202") {
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.indexVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                }else if (code == "7204") {
                    //当前用户未登陆,直接登陆
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                } else if (code == "7207") {
                    location.href=response.body.toaUpgradeUrl;
                }else if(code == "6321"){
                    newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                }
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }
            }
        })
        MaiDian("0101-进入新人有礼主页");
    }
    //获取登录信息签名窜
    function getSignatureInfo() {
        //var getSignatureInfoUrl="https://maam.pingan.com.cn/lottery/api/newUserReward/getSignatureInfoV2.do";
        var getSignatureInfoUrl="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/getSignatureInfoV2.do";
        var data = {};
        data = backUserInfo(data);
        data.toaAppId = PINGAN.toaAppId;
        $.ajax({
            type: "POST",
            url: getSignatureInfoUrl,
            data: data,
            timeout: 20000,
            dataType: 'json',
            success: function (response) {
                hideLoading();
                if(response.code == '0'){
                    PINGAN.signature = response.body.signature;
                    PINGAN.timestamp = response.body.timestamp;
                }
            },
            error:function(){
                hideLoading();
                newAlert("获取登录信息失败");
            }
        })
    }
    //获取图形验证码
    function getPicCode() {
        //获取图形验证码
        var data = {};
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id\
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.userId = PINGAN.userInfo.mobileNo;//接口对应的参数
        sessionStorage.setItem("mobileNo",PINGAN.userInfo.mobileNo);
        //var getPicUrl = 'https://mobilemember.pingan.com.cn/api/getVCod
        var getPicUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/getVCode';
        $.ajax({
            type: "GET",
            url: getPicUrl,
            data: data,
            "timeout":20000,
            dataType: "jsonp",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                var res;
                try{
                    res=JSON.parse(response);
                }catch(e){
                    res=response;
                }
              //  console.log(res);
                if (response.code == '0') {
                    var vCodeUrl = response.img;
                    PINGAN.validCodeId = response.id;

                    document.getElementById('main-codes').removeAttribute("disabled");
                    //重新获取图形验证码:倒计时清零
                    if (response.type == '1') {
                        //不展示图形验证码
                        PINGAN.userInfo.useImg=false;
                        $('#main-hide').hide();
                    } else {
                        PINGAN.userInfo.useImg=true;
                        //展示图形验证码
                        $('#main-hide').show();
                        $("#vCode").attr('src',vCodeUrl);
                    }
                } else {
                    newAlert("信息验证失败");
                }
            },
            error: function (xhr, errorType) {
               // console.log(errorType);
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }
            }
        });
    }

    //点击重新获取图形验证码
    function getAgainPicCode() {
        //获取图形验证码
        var data = {};
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id\
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.userId = PINGAN.userInfo.mobileNo;//接口对应的参数
        sessionStorage.setItem("mobileNo",PINGAN.userInfo.mobileNo);
        var getPicUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/getVCode';
        //var getPicUrl = 'https://mobilemember.pingan.com.cn/api/getVCode';
        $.ajax({
            type: "GET",
            url: getPicUrl,
            data: data,
            "timeout":20000,
            dataType: "jsonp",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                var res;
                try{
                    res=JSON.parse(response);
                }catch(e){
                    res=response;
                }
               // console.log(res);
                if (response.code == '0') {
                  //  console.log('成功回调');
                    var vCodeUrl = response.img;
                    PINGAN.validCodeId = response.id;
                    //重新获取图形验证码:倒计时清零
                    document.getElementById('main-codes').removeAttribute("disabled");
                    document.getElementById('main-codes').value = "获取验证码";
                    initTime = 120;
                    clearInterval(timer);

                    if (response.type == '1') {
                        //不展示图形验证码
                        PINGAN.userInfo.useImg=false;
                        $('#main-hide').hide();
                    } else {
                        PINGAN.userInfo.useImg=true;
                        //展示图形验证码
                        $('#main-hide').show();
                        $("#vCode").attr('src',vCodeUrl);
                    }
                } else {
                    newAlert("获取图形验证码失败");
                    //newAlert("请输入手机号码");
                }
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }
            }
        });
    }

    function getIdentifyCode() {
        //获取验证码接口
        var data = {};
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.mobileNo = document.getElementById("main_phon_input").value;
        data.validCodeId = PINGAN.validCodeId;
        if(PINGAN.userInfo.useImg){
            data.validCode = document.getElementById("main-phon-input-m").value;
        }
        data.otpType = 'MAMCOTP_01';
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id
        //var getMsgUrl = 'https://mobilemember.pingan.com.cn/api/sendOTPCode';
        var getMsgUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/sendOTPCode';
        $.ajax({
            type: "GET",
            url: getMsgUrl,
            data: data,
            dataType: "jsonp",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                var res;
                try{
                    res=JSON.parse(res);
                }catch(e){
                    res=response;
                }
             //   console.log(res);
                if (res.code == '0') {
                    newAlert("短信验证码已发送到您的手机，请注意查收");
                   // console.log('成功获取短信验证码');
                    PINGAN.activeId = response.activeId;//OPT短信验证码ID
                    //sendMobileCodetimer();

                    sendTime();
                } else{
                    newAlert("请重新输入图形验证码");
                    PINGAN.interFace.getAgainPicCode();
                    //newAlert("获取短信验证码失败");
                    $('.main-phon-err-co').show();
                }

            },
            error: function (xhr, errorType) {
                hideLoading();
                //console.log(errorType);
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }
            }
        });
    }
    //短信验证码倒计时
    var initTime = 120;//可重新发送短信时间
    var timer = null;//定时器
    function sendTime(){
        timer = setInterval(function(){
            initTime --;
            //that.value = times + "秒后重试";
            document.getElementById('main-codes').value = "重新发送(" + initTime + ")";
            //document.getElementById('main-codes').removeAttribute("disabled");
            document.getElementById('main-codes').disabled = 'disabled';
            if(initTime <= 0){
                document.getElementById('main-codes').removeAttribute("disabled");
                document.getElementById('main-codes').value = "重新获取验证码";
                clearInterval(timer);
                initTime = 120;
            }
        },1000);
    }

//验证码登陆成功回调
    function getLogin() {
        var phoninput = document.getElementById("main_phon_input").value;
        var activeNo = document.getElementById("main_phon_code").value;
        //var toaotploginUrl = 'https://mobilemember.pingan.com.cn/api/toaotplogin';
        var toaotploginUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/toaotplogin';
        var data = {};
        data.returnURL= '';
        data.registerURL='';
        data.deviceId = PINGAN.userInfo.deviceId;  //设备id
        data.deviceType = PINGAN.userInfo.deviceType; //设备类型
        data.osVersion = PINGAN.userInfo.osVersion;  //系统版本
        data.appVersion = PINGAN.userInfo.appVersion; //当前平安app的版本号
        data.sdkVersion = PINGAN.userInfo.sdkVersion;  //任意们客户端sdk版本号
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id
        data.timestamp = PINGAN.timestamp;  //时间戳
        data.signature = PINGAN.signature; //参数签名串
        data.activeId = PINGAN.activeId;//短信验证码id
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.mobileNo = phoninput;
        data.activeNo = activeNo;//短信验证码
        data.callback="loginsuccess";
        PINGAN.loginMobileNo = data.mobileNo;//缓存登录手机号码

        $.ajax({
            type: "GET",
            url: toaotploginUrl,
            data: data,
            dataType: "jsonp"
        });
    }

    function page_lottery(ssoticket) {
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        var data = {};
        var rewardActivityInfoUrl = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/rewardActivityInfoV2.do";

        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        $.ajax({
            type: 'POST',
            url: rewardActivityInfoUrl,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                console.log(response);
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "0") {
                        PINGAN.BvmEvent.page_lotteryVM.run(response);
                    }else if (code == "1") {
                        //系统错误,具体code要按接口文档来
                        showNetOver();
                    } else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);

                    } else if (code == "7201" || code == "7202") {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.indexVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    }else if (code == "6309") {
                        newAlert('操作太频繁,请稍后再试,谢谢');
                    } else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    }else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    } else {
                        //其他情况就是正常状态
                        PINGAN.BvmEvent.page_lotteryVM.run(response);

                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }
    function prizeList(ssoticket) {
        //这是DEMO，函数名要和接口文档中的对应接口名一直
        var data = {};
        var getPrizeWinnerInfosV2Url = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/getPrizeWinnerInfosV2.do";

        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        data.prizeCode = PINGAN.prizecode;
        $.ajax({
            type: 'POST',
            url: getPrizeWinnerInfosV2Url,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "0") {
                        //系统错误,具体code要按接口文档来
                        var result = "";
                        var prizelist = response.body;

                        for(var i=0;i<prizelist.length;i++){
                            if(prizelist.length > 5){
                                var item = prizelist[i];
                                if(i%2){
                                    result += '<span>'+item+'</span>' + '<br>';
                                }else {
                                    result += '<span>'+item+'</span>';
                                }
                                $("#prizeList").html(result);

                            }else{
                                var item = prizelist[i];
                                result += '<p>'+item+'</p>';
                                $("#prizeList").html(result);
                            }

                        }
                        $('.activityOver').show();
                        $('.mainHideOption').show();
                        $('.mainHideOption').css('position', 'fixed');
                    } else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7201" || code == "7202") {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.indexVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    }else if(code == "1") {
                        //系统错误,具体code要按接口文档来
                        showNetOver();
                    }else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    } else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    }

            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }
    function drawActivityCode(ssoticket){
        var data = {};
        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        var drawRewardv2Url = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/rewardActivityInfoV2.do";

        $.ajax({
            type: "POST",
            url: drawRewardv2Url,
            data: data,
            dataType: 'json',
            success: function (response) {
                hideLoading();
                if (response.code == "0") {

                    var drawNumber = response.body.drawNum;
                    if (drawNumber <= 0) {
                        $('.continueTask').show();
                        $('.mainHideOption').show();
                        $('.mainHideOption').css('position', 'fixed');

                        $('body').on('touchmove', function (e) {
                            e.stopPropagation();
                            e.preventDefault();
                        });

                    } else {
                        PINGAN.BvmEvent.drawVM.backZero();
                        PINGAN.BvmEvent.drawVM.run();
                    }
                }else if(response.code == "1") {
                    //系统错误,具体code要按接口文档来
                    hideLoading();
                    showNetOver();
                }else if (response.code == "7204") {
                    //当前用户未登陆,直接登陆
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                } else if (code == "7201" || code == "7202") {
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.indexVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                } else if (response.code == "7001"){
                    //系统错误,具体code要按接口文档来
                    hideLoading();
                    showNetOver();

                } else if (response.code == "7207") {
                    var toaUpgradeUrl = response.body.toaUpgradeUrl;
                    location.replace(toaUpgradeUrl);
                    localStorage.setItem("userState", response.code); //标记下用户状态
                } else if(response.code == "6321"){
                    newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                }

            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }

        });
    }

    function drawInter(ssoticket) {

        //这是DEMO，函数名要和接口文档中的对应接口名一直
        //var getSummaryUrl = serverUrl+"/lottery/api/leftOrRight/getSummary.do";
        var drawRewardV2Url = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/drawRewardV2.do";

        var data = {
        };
        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        data.prizeDate = PINGAN.endtime;
        data.prizeCode = PINGAN.prizecode;

        $.ajax({
            type: 'POST',
            url: drawRewardV2Url,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "0") {
                        //系统错误,具体code要按接口文档来
                        PINGAN.BvmEvent.drawVM.run(response);

                    }else if (code == "1"){
                        //系统错误,具体code要按接口文档来
                        hideLoading();
                        showNetOver();

                    }else if (code == "7001"){
                        //系统错误,具体code要按接口文档来
                        hideLoading();
                        showNetOver();

                    } else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7201" || code == "7202") {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.indexVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    } else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }
    //超时登录接口

    function  getGraphicsCode() {
        //登录超时——获取图形验证码
        var data = {};
        data = backUserInfo(data);
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id\
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.userId = PINGAN.userInfo.mobileNo;//接口对应的参数
        var getPicUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/getVCode';
        $.ajax({
            type: "GET",
            url: getPicUrl,
            data: data,
            dataType: "jsonp",
            success: function (response) {
                //把相关返回传给相关数据方进行处理
                if (response.code == '0') {
                  //  console.log('成功回调');
                    PINGAN.validCodeId = response.id;
                    PINGAN.img = response.img;
                    var vCodeUrl = response.img;

                    //重新获取图形验证码:倒计时清零
                    document.getElementById('ot_obtain').removeAttribute("disabled");

                    if (response.type == '0') {
                        //展示图形验证码
                        PINGAN.userInfo.useImg=true;
                        $('#ot_box_2').show();
                        $("#ot_graphics_code").attr('src',vCodeUrl);

                    } else {
                        //不展示图形验证码
                        PINGAN.userInfo.useImg=false;
                        $('#ot_box_2').hide();

                    }
                }else if(response.code == "1") {
                    //系统错误,具体code要按接口文档来
                    showNetOver();
                } else {
                    newAlert("信息验证失败");
                }
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }

        });
    }
    function getAgainGraphicsCode() {
        //获取图形验证码
        var data = {};
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id\
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.userId = PINGAN.userInfo.mobileNo;//接口对应的参数
        sessionStorage.setItem("mobileNo",PINGAN.userInfo.mobileNo);
        var getPicUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/getVCode';
        $.ajax({
            type: "GET",
            url: getPicUrl,
            data: data,
            "timeout":20000,
            dataType: "jsonp",
            success: function (response) {
                //把相关返回传给相关数据方进行处理
                hideLoading();
                var res;
                try{
                    res=JSON.parse(response);
                }catch(e){
                    res=response;
                }
                // console.log(res);
                if (response.code == '0') {
                    //  console.log('成功回调');
                    var vCodeUrl = response.img;
                    PINGAN.validCodeId = response.id;
                    $("#ot_graphics_err").css('display','none');
                    //重新获取图形验证码:倒计时清零
                    document.getElementById('ot_obtain').removeAttribute("disabled");
                    document.getElementById('ot_obtain').value = "获取验证码";
                    initTime = 120;
                    clearInterval(timer);

                    if (response.type == '1') {
                        //不展示图形验证码
                        PINGAN.userInfo.useImg=false;
                        $('#ot_box_2').hide();
                    } else {
                        //展示图形验证码
                        PINGAN.userInfo.useImg=true;
                        $('#ot_box_2').show();
                        $("#ot_graphics_code").attr('src',vCodeUrl);
                    }
                } else {
                    newAlert("获取图形验证码失败");
                    //newAlert("请输入手机号码");
                }
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }
            }
        });
    }

    function getMessageCode() {
        var otGraphicsInput = document.getElementById("ot_graphics_input").value;//获取图形验证码值
        var phoneInput = document.getElementById("phoneInput").value;//获取手机号码值

        //获取验证码接口
        var data = {};
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.mobileNo = phoneInput;
        data.validCodeId = PINGAN.validCodeId;
        data.validCode = otGraphicsInput;
        data.otpType = 'MAMCOTP_01';
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id

        var getMsgUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/sendOTPCode';
        $.ajax({
            type: "GET",
            url: getMsgUrl,
            data: data,
            dataType: "jsonp",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                var res;
                try{
                    res=JSON.parse(res);
                }catch(e){
                    res=response;
                }
                //console.log(res);
                if (res.code == '0') {
                    $("#ot_graphics_err").css('display','none');
                    newAlert("短信验证码已发送到您的手机，请注意查收");
                    // console.log('成功获取短信验证码');
                    PINGAN.activeId = response.activeId;//OPT短信验证码ID
                    sendMesTime();
                    document.getElementById('ot_float_login').removeAttribute("disabled");
                    $(".ot_float_login").css('background','#EF6F0A');


                }else{
                    //newAlert("请重新输入图形验证码");
                    $("#ot_graphics_err").css('display','block');
                    PINGAN.interFace.getGraphicsCode();



                }
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }

        });
    }
    var initTime = 120;//可重新发送短信时间
    var timer = null;//定时器
    function sendMesTime(){
        timer = setInterval(function(){
            initTime --;
            //that.value = times + "秒后重试";
            document.getElementById('ot_obtain').value = "重新发送(" + initTime + ")";
            document.getElementById('ot_obtain').disabled = 'disabled';
            if(initTime <= 0){
                document.getElementById('ot_obtain').removeAttribute("disabled");
                document.getElementById('ot_obtain').value = "重新获取验证码";
                clearInterval(timer);
                initTime = 120;
            }
        },1000);
    }
    function getOverLogin() {
        var phoneInput = document.getElementById("phoneInput").value;
        var messageInput = document.getElementById("messageInput").value;
        var toaotploginUrl = 'https://mamc-dmzstg2.pingan.com.cn:43443/api/toaotplogin';
        var data = {};
        data.returnURL= '';
        data.registerURL='';
        data.deviceId = PINGAN.userInfo.deviceId;  //设备id
        data.deviceType = PINGAN.userInfo.deviceType; //设备类型
        data.osVersion = PINGAN.userInfo.osVersion;  //系统版本
        data.appVersion = PINGAN.userInfo.appVersion; //当前平安app的版本号
        data.sdkVersion = PINGAN.userInfo.sdkVersion;  //任意们客户端sdk版本号
        data.mamcAppId = PINGAN.pluginId; //当前平安app的唯一id
        data.timestamp = PINGAN.timestamp;  //时间戳
        data.signature = PINGAN.signature; //参数签名串
        data.activeId = PINGAN.activeId;//短信验证码id
        data.appId = PINGAN.toaAppId;  //一账通分配的appid
        data.mobileNo = phoneInput;
        data.activeNo = messageInput;//短信验证码
        data.callback="loginsuccess";
        PINGAN.loginMobileNo = data.mobileNo;

        $.ajax({
            type: "GET",
            url: toaotploginUrl,
            data: data,
            dataType: "jsonp"
        });
    }


    function acceptInter(ssoTickInfo) {
        //领取
        var acceptInterUrl = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/acceptReward.do";
        //var acceptInterUrl = "script/mock/acceptReward.json";
        var data = {};
        data = backUserInfo(data);
        var recommendCode = localStorage.getItem("recomCode");
            data.recommendCode = recommendCode;
            localStorage.removeItem("recomCode");

        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        $.ajax({
            type: 'POST',
            url: acceptInterUrl,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "1") {
                        //系统错误,具体code要按接口文档来
                        showNetOver();
                    } else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    }else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    } else {
                        //其他情况就是正常状态
                        hideLoading ();
                        var body = response.body;
                        PINGAN.BvmEvent.lotteryVM.run(body);
                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }

    function checkUserRewardType(ssoTicket) {
        //var checkUserRewardUrl = PINGAN.serverUrl+"/lottery/api/newUserReward/checkUserRewardType.do";
        //var checkUserRewardUrl = "script/mock/checkUserRewardType.json";
        var checkUserRewardUrl ="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/checkUserRewardType.do";
        var data = {};
        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;
        $.ajax({
            type: 'POST',
            url: checkUserRewardUrl,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "1") {
                        showNetOver();
                    } else if (code == "7201" || code == "7202") {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.indexVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    }else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    } else if (code == "0") {
                        hideLoading ();
                        //接口成功返回
                        PINGAN.BvmEvent.acceptVM.run(response.body);
                    }else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }


    function myRecordInter(ssoTickInfo) {
        var myRecordUrl ="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/getRewardRecord.do";
        //var myRecordUrl = "script/mock/getRewardRecord.json";
        var data = {};
        data = backUserInfo(data);
        if (ssoTickInfo) {
            data.ssoTicket = ssoTickInfo.SSOTicket;
            data.signature = ssoTickInfo.signature;
            data.timestamp = ssoTickInfo.timestamp;
        }
        $.ajax({
            type: 'POST',
            url: myRecordUrl,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                    var code = response.code;
                    if (code == "1") {
                        //系统错误,具体code要按接口文档来
                        showNetOver();
                    } else if (code == "7204") {
                        //当前用户未登陆,直接登陆
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7201" || code == "7202") {
                        App.call(["sendMessage"],function(data){
                            var ssoticket;
                            try{
                                ssoticket=JSON.parse(data);
                            }catch(e){
                                ssoticket=data;
                            }
                            PINGAN.BvmEvent.indexVM.run(ssoticket);
                        },function(){
                            alert('error');
                        },["getSSOTicket"]);
                    } else if (code == "7207") {
                        var toaUpgradeUrl = response.body.toaUpgradeUrl;
                        location.replace(toaUpgradeUrl);
                        localStorage.setItem("userState", code); //标记下用户状态
                    } else if (code == "0") {
                        //接口成功返回
                        hideLoading ();
                        PINGAN.BvmEvent.myRecord.run(response.body);
                    }else if(code == "6321"){
                        newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }

    function getBannerList() {
        var bannerUrl ="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/v2/getBannerList.do";
        //var myRecordUrl = "script/mock/getRewardRecord.json";
        var data = {};
        data = backUserInfo(data);
        data.location = "newUserReward";
        $.ajax({
            type: 'POST',
            url: bannerUrl,
            data: data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                //把相关返回传给相关数据方进行处理
                (function () {
                    //通过立即执行函数构建一个独立作用域
                   // console.log(response);
                    var code = response.code;
                    if (code == "0") {
                        //接口成功返回
                        PINGAN.BvmEvent.bannerVm.run(response.body);
                    }
                })();
            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();
                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
    }

    function getRecord(response) {

         //var getMyRecordUrl = "script/mock/getRecord.json";//模拟数据
        var getMyRecordUrl = "https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/getRewardRecordV2.do";
        //var getMyRecordUrl = "https://maam.pingan.com.cn/lottery/api/newUserReward/getRewardRecordV2.do";

        var data = {};//请求接口数据
        data = backUserInfo(data);

        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;

        $.ajax({
            type: 'POST',
            url: getMyRecordUrl,
            data: data,
            timeout: 10000, //设定20秒为接口访问的超时时间
            dataType: "json",
            success: function (response) {
                hideLoading();
                var code = response.code;
                if (code == "0") {//判断请求接口是否成功
                    //接口成功返回
                    showLoading();
                    PINGAN.BvmEvent.testRe.run(response.body);
                } else if(code == "1"){
                    //系统错误,具体code要按接口文档来
                    showNetOver();
                } else if (code == "7204") {
                    //当前用户未登陆,直接登陆
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                } else if (code == "7201" || code == "7202") {
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.indexVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                } else if (code == "7207") {
                    var toaUpgradeUrl = response.body.toaUpgradeUrl;
                    location.replace(toaUpgradeUrl);
                    localStorage.setItem("userState", code); //标记下用户状态
                } else if(code == "6321"){
                    newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                }

            },
            error: function (xhr, errorType) {
                hideLoading();
                if (errorType == "timeout") {
                    //网络超时
                    showNetOver();

                } else {
                    //把接口出错，都归结于网络问题，暂不细化
                    showNetOver();
                }

            }
        });
        MaiDian("0801-进入我的战绩页面");

    }

    function getConvertPrize(convertData){
       // console.log(convertData);
        var data = getsubmitConvertPrize(convertData) || {};

        data.securityKey = "3044534452906A9AE054000B5DE0B7FC";//双方约定的密钥
        var suffix = "PingAnJimRon";//加密后缀
        //var paramSha1Str = paramSha1(data);//参数加密串
        var suffixBase64 = paramBase64(suffix);//对后缀进行base64加密
        data.sign = paramSha1(data);
        //对敏感参数进行加密
        data.name = paramBase64(data.name)+suffixBase64;
        data.address = paramBase64(data.address)+suffixBase64;
        data.cardId = paramBase64(data.cardId)+suffixBase64;
        data.mobaileNo = paramBase64(data.mobaileNo)+suffixBase64;
        //var submitUrl = "script/mock/submitRecord.json";
        var submitUrl ="https://maam-dmzstg3.pingan.com.cn:56443/lottery/api/newUserReward/acceptRewardV2.do";
        //var submitUrl ="https://maam.pingan.com.cn/lottery/api/newUserReward/acceptRewardV2.do";
      // debugger;
        $.ajax({
            type: "POST",
            url: submitUrl,
            data:data,
            timeout: 20000, //设定20秒为接口访问的超时时间
            dataType: 'json',
            success: function (responseData) {
                hideLoading();
                PINGAN.isSubmiting = false;

                var resultCode = responseData.code;
                if(resultCode == "1"){
                    newAlert("提交失败");
                    return false;
                }else if(resultCode == "0"){
                    //$('.main_succcess_s').show();
                    newAlert("提交成功");
                        PINGAN.interFace.getRecord();
                    $('#info-page').hide();
                    return true;
                }else if(resultCode == "6303"){
                    newAlert("验签失败",3000);
                }else if(resultCode == "6309"){
                    newAlert("操作太频繁,请稍后再试");
                }else if(resultCode == "6315"){
                    newAlert("已领取过奖品");
                }else if(resultCode == "6311"){
                    newAlert("领取失败,请稍后再试");
                }else if(resultCode == "6314"){
                    newAlert("手机号非法");
                }else if (resultCode == "7204") {
                    //当前用户未登陆,直接登陆
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.overTimeVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                }else if(resultCode == "6321"){
                    newAlert("本次活动已结束,活动结果将公布在微信公众号'平安好生活'尽情关注.",36000);
                }
            },
            error: function (error) {
                hideLoading();
                PINGAN.isSubmiting = false;
                console.log(error);
            }
        });
        MaiDian("0902-点击确认提交");
    }

    function getsubmitConvertPrize(convertData){
        var data = {};
        data = backUserInfo(data);
        data.ssoTicket = PINGAN.userInfo.ssoTicket;
        data.timestamp = PINGAN.userInfo.timestamp;
        data.signature = PINGAN.userInfo.signature;

        data.name = convertData.name;
        data.address = convertData.address;
        data.cardId = convertData.cardId;
        data.mobaileNo = convertData.mobaileNo;
        data.prizeCode = convertData.prizeCode;
        data.drawCode = convertData.drawCode;
        return data;

    }


    //计算参数加密串
    function paramSha1(data){
        //拼接加密串参数
        var dataStr = "address"+data.address+"cardId"+data.cardId+
            "drawCode"+data.drawCode+"mobaileNo"+data.mobaileNo+
            "name"+data.name+"prizeCode"+data.prizeCode+"securityKey"+data.securityKey;
        var sha = new jsSHA("SHA-1","TEXT");
        sha.update(dataStr);
        var sign=sha.getHash("HEX");
        sign = sign.toUpperCase();

        return sign;
    }

    //参数base64加密
    //paramStr：待加密参数
    function paramBase64(paramStr){
        var paramBase64 = BASE64.encoder(paramStr);
        return paramBase64;
    }


    return {
        indexInter: indexInter,
        page_lottery: page_lottery,
        prizeList:prizeList,
        acceptInter: acceptInter,
        checkUserRewardType: checkUserRewardType,
        myRecordInter: myRecordInter,
        getBannerList: getBannerList,
        getRecord: getRecord,
        drawInter: drawInter,
        getIdentifyCode: getIdentifyCode,
        getPicCode:getPicCode,
        getLogin:getLogin,
        getGraphicsCode:getGraphicsCode,
        getMessageCode:getMessageCode,
        getOverLogin:getOverLogin,
        getSignatureInfo:getSignatureInfo,
        drawActivityCode:drawActivityCode,
        getConvertPrize:getConvertPrize,
        getAgainPicCode:getAgainPicCode,
        getAgainGraphicsCode:getAgainGraphicsCode
    };

});