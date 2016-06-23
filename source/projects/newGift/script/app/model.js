//业务数据处理
define(function(){
    function indexM () {
        PINGAN.interFace.getSignatureInfo();
        //电话不能为空
        var $main_phon_input=$('#main_phon_input');
        if(PINGAN.IS_ANDROID){//安卓
            $('body').height(620)
        }

        $main_phon_input.on('keyup',function(){
            //获得我要调按钮
            var main_accBtn = $("#main_accBtn");
            var main_accBtn_hidden = $("#main_accBtn_hidden");
           // debugger;
            if(this.value.length == '11'){
                var reg = /^1[3|4|5|6|7|8]\d{9}$/;
                if(reg.test(this.value)){
                    //把我要领取按钮设置为可用
                    main_accBtn.css("display","block");
                    main_accBtn_hidden.css("display","none");
                    //调获取验证码接口
                    PINGAN.userInfo.mobileNo=this.value;
                    PINGAN.interFace.getPicCode();
                    $('.main-phon-err-code').hide();
                    $('.main-phon-err').hide();

                }else {
                    //把我要领取的按钮设置为不可用
                    main_accBtn.css("display","none");
                    main_accBtn_hidden.css("display","block");
                    $('.main-phon-err').show();
                }
            }else{
                //把我要领取的按钮设置为不可用
                main_accBtn.css("display","none");
                main_accBtn_hidden.css("display","block");
               // $('.main-phon-err').show();
            }
        });
        $main_phon_input.on('blur',function(){
            var $phon_input=$("#main_phon_input").val();
            var reg = /^1[3|4|5|6|7|8]\d{9}$/;
            if(!reg.test($phon_input)){
                $('.main-phon-err').show();
                //$main_phon_input.focus();
            }
        });


        $("#vCode").on('tap',function(e){
            PINGAN.interFace.getAgainPicCode();
            e.stopPropagation();
            e.preventDefault();
        });

        $('#main-codes').on('click',function(e){
            MaiDian("0103-点击获取验证码");
            if(PINGAN.userInfo.useImg){
                //需要图片验证码的
                var $getphoncode = $('#main-phon-input-m').val();
                if($getphoncode!="" && $getphoncode.length=="4") {
                    $('.main-phon-err-co').hide();
                    PINGAN.interFace.getIdentifyCode();
                }
                //else{
                //    $('.main-phon-err-code').show();
                //}
            }else{
                //不需要图片验证码的
                PINGAN.interFace.getIdentifyCode();
            }
            e.preventDefault();
            e.stopPropagation();
        });

        $('.main_accBtn').change(function(event) {
            var txtVal = $(this).val();
            if (txtVal === '') {
                $('.main_accBtn').attr('disabled', "true");
                $('.main_accBtn').css("background","#464646");
            } else {
                $('.main_accBtn').attr('disabled', "false");
                $('.main_accBtn').css("background","red");
            }
        })
        //var $phon_input=$("#main_phon_input").val();
        //$("#main_phon_code").change(function(){
        //    if($phon_input == $phon_input.val) {
        //        $('.main-phon-err-code').hide();
        //    }
        //});
            $(".main_accBtn").on('tap',function(e){
                //showLoading();
                var $phon_code = $('#main_phon_code').val();
                if($phon_code !="" && $phon_code.length=="6"){
                    PINGAN.interFace.getLogin();
                    MaiDian("0102-点击我要领取");
                    $('input').blur();
                    $('.main-phon-err-code').hide();
                   // PINGAN.BvmEvent.indexVM.backZero();
                }else{
                    $('.main-phon-err-code').show();
                }
                e.preventDefault();
                e.stopPropagation();
            });
    }

    function modelRe(response){
        var phonecode=document.getElementById("cody-ph");
        var phonerie=document.getElementById("cody-rie");
        var phonebot = document.getElementById("p-bottom-phon");
        var wrongphone=document.getElementById("tel-tip");
        var phonname = document.getElementById("Name");
        var phonfeil = document.getElementById("feil");
        var phonmycody = document.getElementById("cody");
        showLoading();
        var recordList = document.getElementById("recordList");
        var elementVar = "";
        var newReward ; //新人奖励
        var recommendNo; //推荐人数
        var recommendReward; //推荐奖励
        var totleReward;//总共获得得的奖励
        var prizeNum;  //推荐奖励抽奖次数
        var extrasPrizeNum;   //推荐额外奖励抽奖次数
        var totePrize; //奖励次数
       // console.log(response);
        prizeNum = parseInt(response.prizeNum);
        if(isNaN(response.extrasPrizeNum)){
           extrasPrizeNum = 0 ;
        }else{
            extrasPrizeNum = parseInt(response.extrasPrizeNum);
           // extrasPrizeNum = isNaN(extrasPrizeNum)?0:extrasPrizeNum;  三目运算
        }

        totePrize = prizeNum + extrasPrizeNum;
   //18081460000
        $("#MyForCoe").html(totePrize);
        //计算流量
        newReward = parseInt(response.newReward);
        recommendNo = parseInt(response.recommendNo);
        recommendReward = parseInt(response.recommendReward);
        $("#Mymobli").html(recommendNo);
        //$("#Mymobli").html();
        //计算总共获得的奖励 = 新人奖励 + 推荐人数 * 每推荐一个人的奖励
        totleReward = newReward + recommendNo * recommendReward;
        $("#newReward").html(totleReward);
        //奖品排序
        var prizeArray = prizePort(response.drawInfos);
        //var activityPic=JSON.parse(localStorage.getItem('activityPic'));
        //console.log(activityPic,activityPic.length);
        if(prizeArray.length == 0){
            elementVar = elementVar + '\<div class="main_zoo">您目前还没有领取过抽奖码噢</div>';

            recordList.innerHTML = elementVar;

        }else {
            //遍历中奖纪录
            $.each(prizeArray,function(index,obj){
              //  console.log(prizeArray);
                //根据奖品码获得奖品图片
                var prizeImagePath = getActivityPic(obj.prizeCode);
                elementVar = elementVar + '\<div class="cen-draw-s">'+
                    '\<div class="cen-draw-i"><img src="'+prizeImagePath+'"/> </div>';
                if(obj.prizeStatus=='0' && obj.drawStatus =='3'){
                    elementVar = elementVar + '\<div class="sibemit" id="sibemit">领取奖品</div><input class="prizeId" id="prizeId" name="prizeCode" type="hidden" data-prizeId="'+obj.prizeCode +'" >';
                }else if(obj.prizeStatus=='1' && obj.drawStatus =='3'){
                    elementVar = elementVar + '\<div class="sibemitNo" id="sibemitNo">已领取</div><input name="prizeCode" type="hidden" data-prizeId="'+obj.prizeCode +'" >';
                }
                elementVar = elementVar + '\<div class="cen-draw-text">'+
                    //'\<div class="cen-draw-code"><label class="p-feil">抽奖码</label> <label id="Idcody" data-drawCode="'+obj.drawCode+'"></label></div>'+
                    '\<div class="cen-draw-code"><label class="p-feil">抽奖码</label> <label id="Idcody" class="Idcody" data-drawCode="'+obj.drawCode+'">'+obj.drawCode+'\</label></div>'+
                    '\<div class="cen-draw-y-n"><label class="p-feil">是否中奖</label> <label id="NoweCody">';
                if(obj.drawStatus =='0'){
                    elementVar = elementVar + '未开奖';
                }else if(obj.drawStatus =='1'){
                    elementVar = elementVar + '开奖中';
                }else if(obj.drawStatus =='2'){
                    elementVar = elementVar + '未中奖';
                }else if(obj.drawStatus =='3'){
                    elementVar = elementVar + '中奖';
                }
                elementVar = elementVar + '\</label></div></div>'+
                    '\</div>';
            })
            recordList.innerHTML = elementVar;
        }
        MaiDian("0801-进入我的战绩页面");
        gettarget();

        $('.guide_back').on('click',function(){
            closeWebView();

        })

    }

    //奖品排序
    function prizePort(prizeArray){
        var sortArray = [];//排序后的对象数据
        var sortArrayIndex = 0;//对象数组初始化索引
        //排序规则数据
        var sortFlag = new Array(3,1,0,2);
        $.each(sortFlag,function(index,flagObj){
            $.each(prizeArray,function(prizeIndex,prizeObj){
                if(prizeObj.drawStatus==flagObj){
                    sortArray[sortArrayIndex]=prizeObj;
                    sortArrayIndex++;
                }
            })
        })
     return sortArray;
    }
   //点击领奖按钮把奖品码和抽奖码传入到填写领取奖品信息页面
    function gettarget(){
        $(".sibemit").click(function(){
            MaiDian("0801-点击领取奖品");
            $('#info-page').show();
            MaiDian("0801-进入领取页面");
            App.call(["webCloseButtonShowOrHidden"],function(data){
                },function(error){
                    console.log("失败");
                },{
                    isShow: 'n'

                },{returnType: 'Object'}
            );

            $('.info-page').on('touchmove', function (e) {
                //$('body').scrollTop(100);
                e.stopPropagation();
                e.preventDefault();
            });
            var self = $(this);
            PINGAN.prizeId = self.siblings('.prizeId').data('prizeid');
            PINGAN.drawCode = self.siblings().find('.Idcody').data('drawcode');
            //var prizeId=document.getElementById("prizeId").dataset.prizeid;
            //var drawCode=document.getElementById("Idcody").dataset.drawcode;
            $("#prizeCode").val(prizeId);
            $("#drawCode").val(drawCode);
            $("#mobaileNo").val(localStorage.getItem("loginMobileNo"));
        });
        $(".bot_b").click(function(){
            MaiDian("0702-点击领取奖品");
        })
    }

    function ad_adviseM(response){
        var ad_inviteCode = localStorage.getItem("inviteCode");
        $("#ad_inviteCode").val(ad_inviteCode);
    }

    function page_lotteryM (response) {
        //机会用完页面邀请码
        var guideReCodeNo = localStorage.getItem("inviteCode");
        $("#guideReCodeNo").val(guideReCodeNo);

        var rewardActivityInfo = response.body.rewardActivityInfo;
        var result = "";
        var activityPicArr = [];
        for (var i = 0; i < rewardActivityInfo.length; i++) {
            var item = rewardActivityInfo[i];
            var activityNum = item.activityNum,
                prizeCode = item.prizeCode,
                prizeNum = item.prizeNum,
                winnerCode = item.winnerCode,
                overDate = item.lotteryTime,
                startDate = item.nowTime;

                if(winnerCode == undefined){
                    var area_winnerCode = "公布区";
                    winnerCode = area_winnerCode;
                }

            // 获取开奖时间格式的时间戳
            var date = new Date();
            var endDate = item.lotteryTime;
            endDate = endDate.substring(0,19);
            endDate = endDate.replace(/-/g,'/');
            var endTime = Date.parse(new Date(endDate));

            var activityPic = getActivityPic(prizeCode);
            activityPicArr.push(activityPic);
            localStorage.setItem("activityPic", JSON.stringify(activityPicArr));
            $("#activityPic").html(activityPic);

            result += '<div class="Content" id="changeContent"><div class="Content_Pic"><div id="activityPic" class="activityPic"><img src="' + activityPic + '"></div></div><div class="Mid"><div class="midleft"><p>已参与的人数:' + activityNum + '</p><p>库存数量:' + prizeNum + '</p><p id="countdown" class="countdown" endTime=' + endTime + ' ></p></div></div>';
            if (prizeNum == 0){
                result+='<div id="Bottom" class="Bottom">抽奖活动结束</div>';
            }else{
                result+='<div id="Bottom" class="Bottom">上期中奖号码:' + winnerCode + '</div>';
            }
            result+='<div class="draw_btn" prizeCode=' + prizeCode + '  overDate = "'+ overDate + '" startDate = "'+ startDate + '" prizeNum = "'+ prizeNum + '">';
            if (prizeNum == 0){
                result+=' <span id="draw_btn_code" class="draw_btn_code" data-prizeCode=' + prizeCode +' overDate = "'+ overDate + '"  startDate = "'+ startDate + '" prizeNum = "'+ prizeNum + '">查看中奖号码</span></div></div>';
            }else {
                result +=' <span id="draw_btn_code" class="draw_btn_code" data-prizeCode=' + prizeCode + ' overDate = "' + overDate + '"  startDate = "' + startDate + '" prizeNum = "' + prizeNum + '">领取抽奖码</span></div></div>';

            }
        }
        $("#midContent").append(result);


        expire_time();

    }

    function getActivityPic(prizeCode) {
            var prizeCode = prizeCode;
            var activityPic = "";
            if(prizeCode == "MAAMMKT_BEWUSERREWARD_BIGBANG_CONCERTTICKETS") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1977";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IPHONE6S") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1976";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_PROJECTOR") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1980";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IWATCH") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1978";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IPADPRO") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1975";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_1000FUELCARD") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1974";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_MACBOOKAIR") {
                activityPic = "http://maam-prd.qiniudn.com/MAAM_BANNERIMG_1979";
            }
            return activityPic;
        }
    /**
     * 批量倒计时方法
     */
    //倒计时
    //不足两位补0
            function timeS(num){
                return ('0'+num).slice(-2);
            }
            function counterClock(endDate) {

                var endDate = parseInt(endDate);//结束时间

                var now = new Date();
                var leftTime=endDate-now.getTime();
                var leftsecond = parseInt(leftTime/1000); //parseInt解析字符串并返回一个整数
                var day1=Math.floor(leftsecond/(60*60*24));
                var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
                var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
                var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
                if(day1 > 0){
                    cc ="剩余时间:"+day1+"天"+" "+timeS(hour)+":"+timeS(minute)+":"+timeS(second);

                }else if(day1 == 0){
                    cc = "剩余时间:"+timeS(hour)+":"+timeS(minute)+":"+timeS(second);
                }else {
                    cc = "剩余时间:00:00:00";
                }
                return cc;
            }
             var timeOut_ID=null;
            function expire_time() {

                $('#midContent').each(function(index) {
                    var time_obj = $(this).find('.countdown');
                    for(var i=0;i<time_obj.length;i++){
                        var endTime = $(time_obj[i]).attr('endTime');
                        if(endTime) {
                            var time_string = counterClock(endTime);
                                $(time_obj[i]).html(time_string);
                                $(time_obj[i]).attr('endTime', endTime - 1);
                        }
                    }
                });
                timeOut_ID=window.setTimeout(function() {
                    expire_time();
                }, 1000);
            }//倒计时结束



    function drawM (response) {

        //将对应的抽奖活动在抽奖码页面显示出来
        var $activity_prize = $("#activity_prize");
        var $drawCode = $("#dramCode");
        var $drawNum = $("#residueDegree");
        var $reCodeNo = $("#accept_code");

        //抽取奖品名
        var prizeCode = response.body.prizeCode;
        var prizeTxt = getPrizeCodeTxt(prizeCode);
        $activity_prize.html(prizeTxt);
        //获取抽奖码
        var drawCode = response.body.drawCode;
        $drawCode.html(drawCode);
        //剩余领奖次数
        var drawNum = response.body.drawNum;
        $drawNum.html(drawNum);

        //推荐码
        var inviteCode = response.body.inviteCode;
        $reCodeNo.val(inviteCode);

    }

        function getPrizeCodeTxt(prizeCode) {
            var prizeCode = prizeCode;
            var prizeTxt = "";
            if(prizeCode == "MAAMMKT_BEWUSERREWARD_BIGBANG_CONCERTTICKETS") {
                prizeTxt = "BIGBANG演唱会门票";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IPHONE6S") {
                prizeTxt = "iPhone 6S";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_PROJECTOR") {
                prizeTxt = "投影仪";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IWATCH") {
                prizeTxt = "iwatch";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_IPADPRO") {
                prizeTxt = "ipad pro";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_1000FUELCARD") {
                prizeTxt = "1000元加油卡";
            }else if(prizeCode == "MAAMMKT_BEWUSERREWARD_MACBOOKAIR") {
                prizeTxt = "MacBook Air";
            }
            return prizeTxt;
        }


    function overTimeM () {

        PINGAN.interFace.getSignatureInfo();
        //PINGAN.interFace.getGraphicsCode();

        var b = /^1[3|4|5|6|7|8]\d{9}$/;
        var phoneinput = document.getElementById("phoneInput");//手机号码输入框
        var wrongphone = document.getElementById("phoneNumErr");//手机号码报错框
        var ot_graphics_input = document.getElementById("ot_graphics_input");
        var messageInput = document.getElementById("messageInput");//短信输入框

        wrongphone.style.visibility = "hidden";



        //手机号输入框事件
        $("#phoneInput").on({
            "change": inputTelNum,
            "input":  inputTelNum
        });
        //$("#ot_graphics_input").on({
        //    "change": inputgraphicsNum,
        //    "input":  inputgraphicsNum
        //});
        //手机输入框失去聚焦事件
        phoneinput.onblur = function () {
            if (this.value == "" || this.value == null) {
                wrongphone.innerHTML = "手机号码不能为空";
                wrongphone.style.visibility = "visible";

            }else if(!b.test(this.value)){
                wrongphone.innerHTML = "号码格式错误";
                wrongphone.style.visibility = "visible";
            } else {
                wrongphone.style.visibility = "hidden";
                //ot_graphics_err.style.visibility = "hidden";
            }
        };


        // 登录超时图形验证码
        $('#phoneInput').on('keyup',function(){
            if(this.value.length == '11'){
                //var reg = /1\d{10}$/;
                var b = /^1[3|4|5|6|7|8]\d{9}$/;
                if(b.test(this.value)){
                    PINGAN.userInfo.mobileNo=this.value;
                    PINGAN.interFace.getGraphicsCode();
                    $('.ot_message-err').hide();
                }else{
                    $('.ot_message-err').show();
                    return false;
                }
            }
        });
        $("#ot_graphics_code").on('click',function(e){
            PINGAN.interFace.getAgainGraphicsCode();
            e.stopPropagation();
            e.preventDefault();
        });

            //单击获取短信验证码按钮
            $("#ot_obtain").on('click',function(e){
                if(PINGAN.userInfo.useImg){
                    var $graphicsInput = $('#ot_graphics_input').val();
                    if($graphicsInput!="" && $graphicsInput.length=="4") {
                        PINGAN.interFace.getMessageCode();
                    }
                }
                else
                {//不需要图片验证码的
                    PINGAN.interFace.getMessageCode();
                }
                e.preventDefault();
                e.stopPropagation();

            });
        //超时登录-我要领取按钮

        $("#ot_float_login").on('click',function(e){
            var self = $(this);
            if(self.attr('disabled') == 'disabled'){
                return;
            }
            $("#ot_showPh").hide();
            var $messageInput = $('#messageInput').val();
            if($messageInput!="" && $messageInput.length=="6"){

                PINGAN.interFace.getOverLogin();

                MaiDian("0104-点击我要领取");
            }else{
                $("#ot_showPh").show();
                $("#ot_showPh").html("短信验证码错误,请重新输入");
                return false;
            }
            e.preventDefault();
            e.stopPropagation();
        });
    }

    //超时model结束点

        function checkTepNumm(telNum){
            var b = /^1[3|4|5|6|7|8]\d{9}$/;
            return b.test(telNum);
        }
        function inputTelNum(e){
            var val = this.value || e.value,
                isChange = e.type === 'change';
            //移开键盘有值
            //如果未验证通过
            !isChange  && $("#phoneNumErr").text('').css("visibility","hidden");
            if(!checkTepNumm(val)){
                $("#ot_box_2").css("display","none");
            }
        }


        function acceptM(body) {
            var isNewUser = body.isNewUser;
            var inviteCode = localStorage.getItem("inviteCode");
            var reCodeNo = $("#accept_code"); //推荐码
            var isAccept = body.isAccept;
            reCodeNo.html(inviteCode);
            //var isAccept = ""; //纪录用户是否领过奖
            var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
            if (isNewUser == 'Y') {
                //是新用户,在判断用户是否领过奖
                //isAccept = body.isAccept;

                if (isAccept == 'Y') {
                    //如果用户已经领过奖,这样就把用户当作老用户处理
                    localStorage.setItem("inviteCode", body.inviteCode);
                    //PINGAN.BvmEvent.guideVm.run();
                    userAcceptInfo.inviteCode = body.inviteCode;
                    userAcceptInfo.newReward = body.newReward;
                    App.call(["sendMessage"],function(data){
                        var ssoticket;
                        try{
                            ssoticket=JSON.parse(data);
                        }catch(e){
                            ssoticket=data;
                        }
                        PINGAN.BvmEvent.page_lotteryVM.run(ssoticket);
                    },function(){
                        alert('error');
                    },["getSSOTicket"]);
                }else {
                    //弹出填写推荐码的弹窗
                    PINGAN.BvmEvent.showOcr.run();
                }
            } else {
                //是老用户
                if (body.inviteCode) {
                    //如果有推荐码
                    localStorage.setItem("inviteCode", body.inviteCode);
                    PINGAN.BvmEvent.page_lotteryVM.run();
                }
            }
        }

        function lotteryM(body) {
            var isNewUser = body.isNewUser;
            var userAcceptInfo = {}; //纪录用户的推荐码和领取流量的纪录
            if (isNewUser == "Y") {
                //是新用户
                localStorage.setItem("inviteCode", body.inviteCode);
                userAcceptInfo.inviteCode = body.inviteCode;
                userAcceptInfo.newReward = body.newReward;
                PINGAN.BvmEvent.lotteryVM.run(userAcceptInfo);
                PINGAN.viewModel.hideReCode();
            } else {
                //是老用户
                if (body.inviteCode) {
                    //如果有推荐码
                    localStorage.setItem("inviteCode", body.inviteCode);
                    PINGAN.BvmEvent.page_lotteryVM.run();
                    PINGAN.viewModel.hideReCode();

                }
            }
        }

        function checkUser(body) {
            var isAccept = body.isAccept;
            if (isAccept == "Y") {
                //表示当前用户已经填写过推荐码
                PINGAN.BvmEvent.acceptVM.run(); //继续acceptVM的回调链
            } else {
                //用户未填写过推荐码
                PINGAN.BvmEvent.showOcr.run(); //弹起填写Ocr的页面
            }
        }

        //function testM() {
        //    console.log("testM");
        //    console.log(PINGAN.response);
        //    console.log("test模型链");
        //}

        function myRecordM(body) {
            var main_pop_content = $(".main_pop_content");
            var recom = $(".recom");
            var recom_new = $(".recom_new");
            if (body.inviteCode) {
                //当前用户有推荐码
                localStorage.setItem("inviteCode", body.inviteCode);
                var newReward = body.newReward; //新人奖领了多少流量
                var recommendNo = body.recommendNo; //推荐了多少人
                var recommendReward = body.recommendReward; //推荐奖领了多少流量
                var inviteCode = body.inviteCode; //当前用户有推荐码
                var newAward = $("#newAward"); //新人领了多少流量
                var recomAward = $("#recomAward"); //推荐奖
                var recomNum = $("#recomNum"); //推荐了多少人
                var reCodeNo = $("#reCodeNo"); //推荐码
                newAward.html(newReward);
                recomAward.html(recommendReward);
                recomNum.html(recommendNo);
                reCodeNo.html(inviteCode);
                main_pop_content.show();
                recom.show();
                recom_new.hide();
                PINGAN.BvmEvent.myRecord.run();
            } else {
                //当前用户没有推荐码,认为是新用户
                main_pop_content.hide();
                recom.hide();
                recom_new.show();
                PINGAN.BvmEvent.myRecord.run();
            }
        }

        function guideM() {
            var reCodeNo = $("#guideReCodeNo"); //推荐码
            var inviteCode = localStorage.getItem("inviteCode");
            reCodeNo.val(inviteCode);
        }

        function bannerM() {
            var reCodeNo = $("#bannerReCodeNo"); //推荐码
            var inviteCode = localStorage.getItem("inviteCode");
            reCodeNo.val(inviteCode);
            closeWebView();
            MaiDian("0501-进入'业务加挂页面'");
        }

        return {
            indexM: indexM,
            ad_adviseM:ad_adviseM,
            page_lotteryM: page_lotteryM,
            acceptM: acceptM,
            checkUser: checkUser,
            myRecordM: myRecordM,
            guideM: guideM,
            bannerM: bannerM,
            lotteryM: lotteryM,
            drawM: drawM,
            modelRe: modelRe,
            overTimeM: overTimeM
        };

});


