/**
 * Created by li-nan on 16/2/23
 * 版本:v0.0.1
 * 插件目标是解决js回调的问题
 * **/
(function(global){
    'use strict';
    var proto = {};
    var loki = create(proto);
    loki.version = "0.0.1"; //当前版本
    loki.pluginName = "Bvm"; //当前插件的名称

    /**
     * 创建一个原型
     * @参数 {string} proto
     * @返回 {function} Dummy
     */
    function create(proto) {
        function Dummy() {}
        Dummy.prototype = proto;
        return new Dummy();
    }
    /**
     * 判断某一个数组是否有重复元素
     * @参数 {array} arr
     * @返回 {boolean}
     */
    function isRepeat(arr) {
        var hash = {};
        for(var i in arr) {
            if(hash[arr[i]]){
                return true;
            }
            // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
            hash[arr[i]] = true;
        }
        return false;
    }
    /**
     * 判断某一个参数是否存在于某个参数数组中
     * @参数 {string} paramName
     * @返回 {array} paramList
     */
    function checkParam (paramName, paramList) {
        var flag = false,i = 0;
        for(i; i<paramList.length; i++) {
            if(paramName == paramList[i]) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    /**
     * 判断某一个参数是否是否为数组对象
     * @参数 {Object/String} obj
     * @返回 {Boolean}
     */
    function isArray (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    /**
     * 判断某一个参数是否是否为对象
     * @参数 {Object/String} obj
     * @返回 {Boolean}
     */
    function isObject (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    /**
     * 判断某一个参数是否是否为Function
     * @参数 {Object/String} obj
     * @返回 {Boolean}
     */
    function isFunction (obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    function extend (obj1,obj2) {
        for(var p in obj2){
            if(obj2.hasOwnProperty(p) && (!obj1.hasOwnProperty(p))){
                obj1[p]=obj2[p];
            }
        }
        return obj1;
    }

    /**
     * 用于控制回调链,解决回调问题和all in one的打包策略
     * @参数 {object} obj
     *
     * **/
    loki.callBackChain = function (obj) {
        /**
         * 该方法充当viewModel层功能,用于联系view层和model层
         * obj最多只接受五个参数设置
         * interFace:表示当前的接口调用
         * viewChain:表示当前对象的视图操作
         * modelChain:表示当前对象的模型操作
         * callBack:回调函数
         * autoRun:表示回调链是否自动执行
         * 方法的执行会根据传参的顺序来执行
         * **/
        this.init();
        if(obj.constructor == Object) {
            //只接受对象形式传参
            var evNameArr = Object.keys(obj); //得到当前配置可执行的方法名的数组
            var evName = "";
            var i = 0;
            var runArray = ["interFace","viewChain","modelChain","callBack","autoRun"];//参数可接受的参数
            var objCanUse = ["func","async"]; //配置项可接受参数
            var runFlag = true;
            var autoRun = true; //函数是否自动运行
            if(evNameArr.length>0) {
                if(!isRepeat(evNameArr)) {
                    //判断参数是否有重复的
                    for(i;i<evNameArr.length;i++){
                        evName = evNameArr[i];
                        if(checkParam(evName,runArray)){
                            //判断当前参数是否在可接受的参数范围
                            if(isArray(obj[evName])){
                                //先判断是不是数组,如果是宿主
                                var cloneObjArr = obj[evName];
                                var j = 0;
                                for(j;j<cloneObjArr.length;j++) {
                                    if(!(isObject(cloneObjArr[j])||isFunction(cloneObjArr[j]))) {
                                        //如果参数既不是对象也不是Function
                                        runFlag = false;
                                        break;
                                    }else if(isObject(cloneObjArr[j])) {
                                        var checkObj = cloneObjArr[j];
                                        var checkNameObj = Object.keys(checkObj);
                                        if(checkNameObj.length==2) {
                                            if(!(checkParam(checkNameObj[0],objCanUse)&&checkParam(checkNameObj[1],objCanUse)&&(checkNameObj[0]!=checkNameObj[1]))) {
                                                runFlag = false;
                                            }
                                        }else{
                                            runFlag = false;
                                        }
                                    }else if(isFunction(cloneObjArr[j])) {
                                        //如果是Function.暂不做相关判断
                                    }
                                }
                                if(!runFlag) {
                                    console.log("当前配置参数有重复项,请参考Api重新编写");
                                }else{
                                    this.runEvent[evName] =  cloneObjArr;
                                }
                            }else if(typeof obj[evName] == "function") {
                                this.runEvent[evName] = obj[evName];
                            }else if(typeof obj[evName] == "object") {
                                var objArr = obj[evName];
                                var objNameArr = Object.keys(objArr);
                                if(objNameArr.length==2){
                                    if(checkParam(objNameArr[0],objCanUse)&&checkParam(objNameArr[1],objCanUse)&&objNameArr[0]!=objNameArr[1]) {
                                        this.runEvent[evName] = obj[evName];
                                    }else{
                                        runFlag = false;
                                    }
                                }else{
                                    runFlag = false;
                                }
                            }else if(typeof obj[evName] == "boolean"&&evName=="autoRun") {
                                autoRun = obj[evName];
                            }
                        }else{
                            runFlag = false;
                        }
                    }
                    if(runFlag) {
                        if(autoRun) {
                            this.run(); //运行可运行函数
                        }
                    }else{
                        console.log("参数配置出错")
                    }
                }else{
                    console.log("当前配置参数有重复项,请参考Api重新编写")
                }
            }else{
                console.log("当前配置为空,方法不进行任何操作")
            }
        }else{
            console.log("传参有误,请参考Api编写");
        }
    };
    loki.callBackChain.prototype = {
        init:function(){
            //初始化,重置runEvent和deleteEvent
            this.runEvent = {};
            this.deleteEvent = {};
        },
        runEvent:{},         //可运行函数
        deleteEvent:{},      //运行后被删除的函数
        cloneEvent:{},       //克隆当前可执行链
        backData:[],         //存放各个层临时存储的数据,方便调用,避免走到哪传到哪,同时返回值可以跨链使用
        run:function(response) {
            var obj = this.runEvent;
            var evNameArr = Object.keys(obj); //之所以会这么麻烦的重新获取,主要是引入暂停机制解决回调
            var evName = "";
            var i = 0;
            if(evNameArr.length>0){
                for(i;i<evNameArr.length;i++) {
                    evName = evNameArr[i];
                    if(isArray(this.runEvent[evName])) {
                        //如果可执行参数是数组对象
                        var j = 0;
                        var arrObj = this.runEvent[evName];
                        var arrObjLength = arrObj.length;
                        for(j;j<arrObjLength;j++) {
                            //这里不用arrObj.length动态换取,是因为arrObj的长度在方法运行过一次后,值是会变的
                            var runEvt = this.runEvent[evName].shift(); //把运行的第一个数组对象移除
                            if(this.deleteEvent[evName] == undefined) {
                                this.deleteEvent[evName] = [];
                            }
                            this.deleteEvent[evName].push(runEvt);
                            if(isFunction(runEvt)) {
                                //如果是一个参数是Function
                                if(response) {
                                    runEvt(response);
                                }else{
                                    runEvt();
                                }
                            }else if(isObject(runEvt)) {
                                var runAsync = runEvt.async;
                                if(response) {
                                    runEvt.func(response);
                                }else{
                                    runEvt.func();
                                }
                                if(runAsync) {
                                    break;
                                }
                            }
                        }

                    }else if(typeof this.runEvent[evName] == "function") {
                        //如果是可执行参数就直接执行
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                        if(response){
                            //如果有参数传入就把参数传入执行
                            this.deleteEvent[evName](response);
                        }else{
                            this.deleteEvent[evName]();
                        }

                    }else if(typeof this.runEvent[evName] == "object") {
                        //如果是对象就是有配置项的
                        var async = this.runEvent[evName].async;
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                        //上面实时删除回调链的代码,但会把删除的回调链代码放到已删除事件中,下面直接调用已删除事件链中的对应事件
                        if(response) {
                            this.deleteEvent[evName].func(response);
                        }else{
                            this.deleteEvent[evName].func();
                        }
                        if(async) {
                            //false表示是异步,如果是异步,代码会先暂停下,等待再次调用
                            break;
                        }
                    }else{
                        console.log("参数有误,请参考Api编写");
                        break;
                    }
                }
            }else{
                console.log("当前回调链不存在可执行函数");
            }
        },
        reset:function () {
            //重置
            this.runEvent = this.deleteEvent;
            this.deleteEvent = {};
        },
        backZero:function () {
            //归零
            var middleEvent = {};
            var i = 0,j = 0;
            var delArr = Object.keys(this.deleteEvent);
            var runArr = Object.keys(this.runEvent);
            if(delArr.length!=0) {
                //回调链可运行的条件是回调链有运行过
                if(runArr.length==0) {
                    //如果回调链可运行部分为空,证明该回调链,无可运行部分,直接重置
                    this.reset();
                }else{
                    middleEvent = extend(this.deleteEvent,this.runEvent);
                    this.runEvent = middleEvent;
                    this.deleteEvent = {};
                }
            }
        },
        cloneChain:function () {
            //再保留当前链条的情况下,克隆一条新的可执行链条,暂不引用,后续基于这个扩展功能
            var i = 0,j = 0;
            var delArr = Object.keys(this.deleteEvent);
            var runArr = Object.keys(this.runEvent);
            if(delArr.length!=0) {
                //回调链可运行的条件是回调链有运行过
                if(runArr.length==0) {
                    //如果回调链可运行部分为空,证明该回调链,无可运行部分,直接重置
                    this.cloneEvent = this.deleteEvent;
                }else{
                    this.cloneEvent = extend(this.deleteEvent,this.runEvent);
                }
            }
        },
        backRun:function (response) {
            this.backZero(); //重置当前链条
            if(response) {
                this.run(response);
            }else{
                this.run();
            }
        },
        removeEvent:function () {
            var obj = this.runEvent;
            var evNameArr = Object.keys(obj); //之所以会这么麻烦的重新获取,主要是引入暂停机制解决回调
            var evName = "";
            var i = 0;
            if(evNameArr.length>0){
                for(i;i<evNameArr.length;i++) {
                    evName = evNameArr[i];
                    if(typeof this.runEvent[evName] == "function"||typeof this.runEvent[evName] == "object") {
                        //删除当前回调链的后续执行方法,但把其保存在已删除事件中
                        this.deleteEvent[evName] = this.runEvent[evName];//后面考虑设计一个容错机制,函数执行出错后可以继续执行
                        delete this.runEvent[evName]; //执行完成后就从待执行数组中删除
                    }else{
                        console.log("参数有误,请参考Api编写");
                        break;
                    }
                }
            }else{
                console.log("当前回调链已清空");
            }
        },
        pluginInfo: function() {
            return "您在使用的插件是:"+loki.pluginName+",当前的版本是"+loki.version;
        }
    };

    global.Bvm = loki.callBackChain;

})(this);