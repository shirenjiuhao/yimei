/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
    //首页
    .controller('tabsCtrl',['$scope','$rootScope','$location','$ionicSlideBoxDelegate','tabsServer',function ($scope,$rootScope,$location,$ionicSlideBoxDelegate,tabsServer){
        var url = "/api/beta/banner/list.aspx?platform=APP&num=6";
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
            $ionicSlideBoxDelegate.update();
        };
        tabsServer.getData(callback,url);
        $rootScope.title('医美定制');
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        //快速聊天
        $scope.toMessages = function(){
           if(loginUsers){
                $location.path('/tabs/messages')
            }else{
                $location.path('/tabs/login')
            } 
        };
        $scope.speedChat = function(){
            if(loginUsers){
                var params = {
                    consumerId:loginUsers.consumer.id,
                    page:'首页',
                    //url:'http://yifengbeauty.com/banner-info.html',
                    deviceType:'2',
                    appType:'1'
                }
                var Authorization = "MEDCOS#"+ loginUsers.sessionKey
                //console.log(Authorization)
                $.ajax({
                    url: '/api/beta/counseling/fastRequest.aspx',
                    type: 'get',
                    data: params,
                    //contentType:{Authorization:Authorization}
                    headers:{
                        Authorization:Authorization
                    }
                }).done(function(res) {
                    console.log(res);
                    if(res.status ==200){
                         var counselorInfo = res.data;
                        var hospitalId = counselorInfo.counselor.hospitalId;//医院ID
                        var doctorId = counselorInfo.counselor.id;//医生ID
                        var counselorUno = counselorInfo.counselor.uno;//咨询师的环信ID
                        $location.path('/tabs/index/'+hospitalId+'/'+doctorId+'/'+counselorUno)
                    }else{
                         alert('登录超时，请重新登录')
                        $location.path('/tabs/login')
                    }
                })
            }else{
                $location.path('/tabs/login')
            }
        };
    }])
    //医生列表
    .controller('lineCtrl',['$scope','$rootScope','lineServer', function ($scope,$rootScope,lineServer) {
        $scope.pageNumber = 1;
        $scope.pageCount = 1;
        //获取整形部位
        var url = "/api/beta/doctor/bodyList.aspx";
        var callback = function (res) {
            console.log(res)
            $scope.bodys = res.data ;
        }
        lineServer.getData(callback,url);
        $rootScope.title('名医在线')
        //获取医生列表 ------------------------------start
        var url = "/api/beta/doctor/list.aspx";
        var callback = function (res) {
            console.log(res)
            $scope.lists = res.data.list ;
            //$scope.pager = res.data.pager;
            $scope.pageNumber = res.data.pager.pageNumber;//当前页
            $scope.pageCount = res.data.pager.pageCount;//总页数
            //console.log($scope.pageNumber+'---------------')
            //console.log($scope.pageCount+"+++++++++++++++++++++++++++")
        }
        lineServer.getDataList(callback,url);
        //根据分类选择医生 ------------------------------start
        var seleted = $('.line-selected');
        seleted.on('click','a',function(){
            $scope.lists =[] ;
            $(this).addClass("line-active").siblings().removeClass("line-active");
            $(this).addClass("line-active").parent(".line-item").siblings().find("a").removeClass("line-active");
            console.log($(this).attr('name'))
            if($(this).attr('name')){
                url = "/api/beta/doctor/list.aspx?partId=" + $(this).attr('name') +"&";
                lineServer.getDataList(callback,url);
            }else{
                url = "/api/beta/doctor/list.aspx";
                lineServer.getDataList(callback,url);
            }
        })
        /*--===================================================*/
        
        /*加载更多-------------------------------*/
        $scope.loadMore = function(){
            if (!$scope.hasMore($scope.pageNumber)) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
                return;
            }else{
                url = "/api/beta/doctor/list.aspx?pageNumber=" + $scope.pageNumber +"&";
                //console.log(url);
                var callback1 = function (res) {
                    console.log('第'+$scope.pageNumber+'次');
                    //console.log(res);
                    if(res.status == 200){
                        var moreList = res.data.list
                        for(var i in moreList){
                            $scope.lists.push(moreList[i])
                        }
                        $scope.pageNumber = res.data.pager.pageNumber;//当前页
                        $scope.pageCount = res.data.pager.pageCount;//总页数
                    }
                };
                lineServer.getDataList(callback1,url);
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        };
        /*下拉刷新--------------------------------------*/
        /*$scope.pullMore = function(){
            if (!$scope.hasMore(pageNumber)) {
                $scope.$broadcast("scroll.refreshComplete");
                return;
            }
            url = "/api/beta/doctor/list.aspx?pageNumber=" + pageNumber +"&";
            console.log(url);
            var callback2 = function (res) {
                console.log('第'+pageNumber+'次');
                var Ulist = res.data.list
                for(var i in Ulist){
                    $scope.lists.unshift(Ulist[i])
                }
                $scope.pager = res.data.pager;
            };
            lineServer.getData(callback2,url);
            $scope.$broadcast("scroll.refreshComplete");
        };*/
        $scope.hasMore = function (num) {
            return num >= $scope.pageCount ? false : true ;
        }
    }])
    //医生详情
    .controller('yishengCtrl',['$scope','$rootScope','yishengServer','$location', function ($scope,$rootScope,yishengServer,$location) {
        //console.log(location.hash)
        var hospitalId = location.hash.split('/')[location.hash.split('/').length-2];
        var doctorId = location.hash.split('/')[location.hash.split('/').length-1];
        var url = '/api/beta/doctor/info.aspx?id='+ doctorId +'&';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
        };
        yishengServer.getData(callback,url);
        $rootScope.title('名医风采')
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        $scope.speakChat = function(){
            if(loginUsers){
                var params = {
                    consumerId: loginUsers.consumer.id,
                    hospitalId: hospitalId,
                    page:'医生详情',
                    //url:'http://yifengbeauty.com/banner-info.html',
                    deviceType:2,
                    appType:1,
                    sourceType: 2
                }
                var Authorization = "MEDCOS#"+ loginUsers.sessionKey
                //console.log(Authorization)
                $.ajax({
                    url: '/api/beta/counseling/request.aspx',
                    type: 'get',
                    data: params,
                    //contentType:{Authorization:Authorization}
                    headers:{
                        Authorization:Authorization
                    }
                }).done(function(res) {
                    console.log(res);
                    if(res.status ==200){
                        var counselorInfo = res.data;
                        // var hospitalId = counselorInfo.counselor.hospitalId;//医院ID
                        // var doctorId = counselorInfo.counselor.doctorId;//医生ID
                        var counselorUno = counselorInfo.counselor.uno;//咨询师的环信ID
                        $location.path('/tabs/line/'+ hospitalId +'/'+doctorId +'/'+counselorUno)
                    }else{
                        alert('登录超时，请重新登录')
                        $location.path('/tabs/login')
                    }
                })
            }else{
                $location.path('/tabs/login')
            }
        }
    }])
    //医院列表
    .controller('diylistCtrl',['$scope','$rootScope','diylistServer', function ($scope,$rootScope,diylistServer) {
        $rootScope.title('优质医院')
        var url = '/api/beta/hospital/list.aspx';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data.list;
        };
        diylistServer.getData(callback,url);
    }])
    //医院详情
    .controller('diyInfoCtrl',['$scope','$rootScope','diyInfoServer','$location', function ($scope,$rootScope,diyInfoServer,$location) {
        $rootScope.title('医院详情')
        var hospitalId = location.hash.split('/')[location.hash.split('/').length-2];//医院ID
        var doctorId = location.hash.split('/')[location.hash.split('/').length-1];//医生ID
        var url = '/api/beta/hospital/info.aspx?id='+ hospitalId +'&';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
        };
        diyInfoServer.getData(callback,url);
        //医院的医生列表
        var url2 = '/api/beta/doctor/list.aspx?hospitalId='+ hospitalId +'&';
        var callback2 = function (res) {
            console.log(res)
            $scope.lists = res.data.list;
            $scope.pageNumber = res.data.pager.pageNumber;//当前页
            $scope.pageCount = res.data.pager.pageCount;//总页数
        };
        diyInfoServer.getData(callback2,url2);
        /*点击切换*/
        $scope.show = function () {
            return true;
        };
        $scope.change = function () {
            $scope.show = function () {
                return true;
            }
        };
        $scope.change1= function () {
            $scope.show = function () {
                return false;
            }
        };
        /*加载更多----------------------------------------------------*/
        $scope.loadMore = function(){
            if (!$scope.hasMore($scope.pageNumber)) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
                return;
            }else{
                url = "/api/beta/doctor/list.aspx?pageNumber=" + $scope.pageNumber +"&";
                //console.log(url);
                var callback1 = function (res) {
                    console.log('第'+$scope.pageNumber+'次');
                    //console.log(res);
                    if(res.status == 200){
                        var moreList = res.data.list
                        for(var i in moreList){
                            $scope.lists.push(moreList[i])
                        }
                        $scope.pageNumber = res.data.pager.pageNumber;//当前页
                        $scope.pageCount = res.data.pager.pageCount;//总页数
                    }
                };
                lineServer.getDataList(callback1,url);
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }
        };
        $scope.hasMore = function (num) {
            return num > $scope.pageCount ? false : true ;
        }
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        $scope.speakChat = function(){
            if(loginUsers){
                var params = {
                    consumerId:loginUsers.consumer.id,
                    hospitalId: hospitalId,
                    page:'医院详情',
                   // url:'http://yifengbeauty.com/banner-info.html',
                    deviceType:2,
                    appType:1,
                    sourceType: 1
                }
                var Authorization = "MEDCOS#"+ loginUsers.sessionKey
                //console.log(Authorization)
                $.ajax({
                    url: '/api/beta/counseling/request.aspx',
                    type: 'get',
                    data: params,
                    //contentType:{Authorization:Authorization}
                    headers:{
                        Authorization:Authorization
                    }
                })
                .done(function(res) {
                    console.log(res);
                    if(res.status ==200){
                        var counselorInfo = res.data;
                        // var hospitalId = counselorInfo.scheme.hospitalId;//医院ID
                        var doctorId = counselorInfo.counselor.id;//医生ID
                        var counselorUno = counselorInfo.counselor.uno;//咨询师的环信ID
                        $location.path('/tabs/diy/'+ hospitalId +'/'+doctorId +'/'+counselorUno)
                    }else{
                        alert('登录超时，请重新登录')
                        $location.path('/tabs/login')
                    }
                })
            }else{
                $location.path('/tabs/login')
            }
        }
    }])
    //登录
    .controller('loginCtrl',['$scope','$interval','$rootScope',function ($scope,$interval,$rootScope) {
        $rootScope.title('登录')
        var text = $('.login-get');
        var reg = /^1(3|4|5|7|8)\d{9}$/ig;
        var str1 = "";
        //获取验证码
        $scope.getInfo = function () {
            var name = $('.login-input').find("input[type='tel']").val();
            //var text1 = "";
            if(!reg.test(name)){
                alert('手机号有误，请输入正确的手机号');
                return false;
            }else {
                var loginPara = {
                    tel:name,
                    smsType:'login'
                }
                $.ajax({//发送验证码
                    url:'/api/beta/sms/send/code.aspx',
                    type:'post',
                    data:loginPara,
                    headers:{}
                }).done(function(res){console.log(res)})
            };
            var targetDate = new Date();
            targetDate.setMinutes(targetDate.getMinutes()+1);
            /*点击后的倒计时*/
            var timer = $interval(function () {
                var newDate = new Date();
                var result = targetDate.valueOf() - newDate.valueOf();
                var minute = Math.floor(result%(1000 * 60)/(1000));
                if(result > 0){
                    text1 = minute + 's后可发送';
                    text.removeAttr("ng-click")
                }else{
                    $interval.cancel(timer);
                    text.attr("ng-click","getInfo()")
                    text1 = '重新发送';
                }
                text.html(text1);
            },20);
            /*点击后的倒计时*/
        };
        //验证
        $scope.yanzhengma = function () {
            var pwd = $('.login-input').find("input[type='text']").val();
            if(pwd == ''){
                alert('验证码输入错误,请重新输入')
            }
        }
        //登录
        $scope.login = function () {
            var  username = $('#username').val();
            var password = $('#password').val();
            if (username == '' || password == '') {
                alert("用户名/验证码 不能为空");
                return;
            }
            var params = {
                tel:username,
                code:password,
                channel:'WEB'
            }
            var loginUsers = {}
            $.ajax({
                url: '/api/beta/consumer/loginByCode.aspx',
                type: 'post',
                data: params,
            }).done(function(res) {
                console.log(res);
                loginUsers = res.data;
                sessionStorage.setItem('users',JSON.stringify(loginUsers))
                var signIn = {
                    apiUrl: WebIM.config.apiURL,
                    user: loginUsers.consumer.uno,
                    pwd: loginUsers.consumer.easemobPwd,
                    appKey: WebIM.config.appkey,
                    success: function (token) {
                        console.log('登陆环信成功');
                        var token = token.access_token;
                        WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);
                    },
                    error: function(){
                    }
                };
                $rootScope.conn.open(signIn);
                window.history.go(-1)
            })
        }
    }])
    //退出登录
    .controller('mineCtrl',['$scope','$rootScope','$location', function ($scope,$rootScope,$location) {
        $rootScope.title('个人中心')
        $scope.signOut = function () {
            //var signOut = $("#signOut");
            var r = window.confirm('是否退出登录');
            if(r == true){
                var hahh = JSON.parse(sessionStorage.getItem('users'));
                if(hahh){
                   var Authorization = hahh.sessionKey 
                   $.ajax({
                    url: '/api/beta/consumer/logout.aspx',
                    type: 'get',
                    headers:{
                        Authorization:'MEDCOS#'+ Authorization
                        }
                    })
                    .done(function(res) {
                        console.log(res);
                        if(res.status == 200){
                            sessionStorage.removeItem('users')
                            $rootScope.conn.close();
                        }
                    })
                }
                $location.path('/tabs');
            }
        };
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        $scope.flag = true;//未登录状态
        //$scope.nicheng = '未登录'
        if(loginUsers){
            $scope.nicheng = loginUsers.consumer.nickname;
            $scope.flag = false;
        }else{
            $scope.flag = true;
        };
        $scope.toProgram = function (){
            if(loginUsers){
                $location.path('/tabs/mine/program');
            }else{
                alert('您尚未登录')
            }
        };
        $scope.toOrder = function (){
            if(loginUsers){
                $location.path('/tabs/mine/order');
            }else{
                alert('您尚未登录')
            }
        }
    }])
    //方案列表
    .controller('programCtrl',['$scope','$rootScope','$location','programServer',function ($scope,$rootScope,$location,programServer){
        $rootScope.title('方案列表')
        var url = '/api/beta/scheme/list.aspx';
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var callback = function (res) {
            console.log(res)
            if(res.status ==200){
                $scope.data = res.data;
            }else{
                 alert('登录超时，请重新登录')
                $location.path('/tabs/login')
            }
        };
        if(loginUsers){
            var Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
            programServer.getData(callback,url,Authorization)
        }
    }])
    //订单列表
    .controller('orderCtrl',['$scope','$rootScope','$location','orderServer',function ($scope,$rootScope,$location,orderServer){
        $rootScope.title('服务预约')
        var url = '/api/beta/order/list.aspx';
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var callback = function (res) {
            console.log(res)
           $scope.data = res.data; 
        };
        if(loginUsers){
            var Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
            orderServer.getData(callback,url,Authorization)
        }
    }])
    //消息列表
    .controller('messagesCtrl',['$scope','$rootScope','$location','messagesServer',function ($scope,$rootScope,$location,messagesServer){
        $rootScope.title('消息')
        var url = '/api/beta/consumer/counseling/list.aspx';
        //自己的环信ID
        var Authorization = '';
        var loginUsersUno = '';
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var callback = function (res) {
            console.log(res)
            if(res.status ==200){
                $scope.data = res.data;
            }else{
                alert('登录超时，请重新登录')
                $location.path('/tabs/login')
            }
        };
        if(loginUsers){
            loginUsersUno = loginUsers.consumer.uno;
            Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
            messagesServer.getData(callback,url,{fromUno: loginUsersUno},Authorization)
        };
        $rootScope.messageInfoNum_z = 0
    }])
    //聊天窗口
    .controller('counselorCtrl',['$scope','$ionicScrollDelegate','$rootScope','$timeout','$location','counselorServer', function ($scope,$ionicScrollDelegate,$rootScope,$timeout,$location,counselorServer) {
        $rootScope.title('咨询师')
        //自己的环信ID
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var loginUsersUno = loginUsers.consumer.uno;
        var Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
        //对方的环信ID
        var counselorUno = location.hash.split('/')[location.hash.split('/').length-1];
        //默认显示 + 号
        $scope.show = function () {
            return true
        };
        //回车发送消息
        /*$scope.keySendTxt = function($event){
            var add = $('#info_text');
            if ($event.keyCode == 13) {
                $rootScope.sendPrivateText(add.val(),counselorUno);
                $timeout($rootScope.msgScrollTop,1000)
                $('#info_text').val("");
            }
        };*/
        //失去焦点时是否显示发送按钮
        $scope.changeShow = function () {
            var add = $('#info_text');
            if(add.val() == ""){
                $scope.show = function () {
                    return true
                };
            }else{
                $scope.show = function () {
                    return false
                };
            }
        };
        //是否发送图片
        $scope.flag = false; //默认是否
        $scope.addPic = function () {
            $scope.flag = ! $scope.flag;
            if($scope.flag){
                $('.counselor-foot').css('bottom','5.42rem')
            }else{
                $('.counselor-foot').css('bottom',0)
            }
            $scope.show = function () {//显示发送按钮
                return false;
            };
        };
        //input聚焦时不能发送图片
        $scope.notPic = function(){
            $scope.flag = false;
            if($scope.flag){
                $('.counselor-foot').css('bottom','5.42rem')
            }else{
                $('.counselor-foot').css('bottom',0)
            }
            $scope.show = function () {//显示发送按钮
                return false;
            };
        };
        /*发送消息*/
        $scope.sendPrivateInfo = function () {
            if(!$scope.flag){
                var messages = $('#info_text').val();
                if(messages == ''){
                    return false
                }else{
                    $('#info_text').val("");
                    $rootScope.sendPrivateText(messages,counselorUno)
                    $timeout($rootScope.msgScrollTop,1000);
                    $scope.show = function () {//显示+号
                        return true;
                    };
                }
            }else{
                var file = $('#image')[0].files[0];
                //console.log(file)
                 if(file){
                    var reader = new FileReader();  
                    //将文件以Data URL形式读入页面  
                    reader.readAsDataURL(file);
                    reader.onload = function(e){  
                        //显示文件
                        var imageUrl = e.target.result;
                        $rootScope.sendPrivateImg(imageUrl,counselorUno);
                        $timeout($rootScope.msgScrollTop,2000)
                        var obj = $('#image')[0]; 
                        obj.outerHTML = obj.outerHTML;
                        $scope.addPic();
                    }
                    console.log('已经获取到图片')
                }
            }
        };
        var infoMsg = sessionStorage.getItem(counselorUno);
        if(infoMsg){
            infoMsg = JSON.parse(infoMsg);
            msgShowTime('#dialog_chat',infoMsg[0].ext.time);
            for(let i in infoMsg){
                //console.log(i)
                if(infoMsg[i].ext.msgType){
                    if(infoMsg[i].to != loginUsersUno){
                        if(infoMsg[i].ext.msgType != 2){
                            msgShow('sender','text',infoMsg[i].msg);
                        }else{
                            msgShow('sender','img',infoMsg[i].ext.imgSrc);
                        }
                    }else{
                        if(infoMsg[i].ext.msgType == 1){
                            msgShow('receiver','text',infoMsg[i].data);
                        }
                        if(infoMsg[i].ext.msgType == 2){
                            msgShow('receiver','img',infoMsg[i].ext.imgSrc);
                        }
                        if(infoMsg[i].ext.msgType == 3){
                           // console.log(infoMsg[i].data)
                            var infoText = JSON.parse(infoMsg[i].data);
                            msgShow('receiver','info',infoText);
                        }
                    }
                    $timeout($rootScope.msgScrollTop,1000)
                }
            }
        };
        /*下拉刷新--------------------------------------*/
        $scope.pageNumber = 1;
        $scope.pageSize = 10;
        $scope.pageCount = 2;
        $scope.pullMore = function(){
            if (!$scope.hasMore($scope.pageNumber)) {
                $scope.$broadcast("scroll.refreshComplete");
                return;
            }
            url = "/api/beta/easemob/chat/list.aspx";
            var params = {
                fromUno:loginUsersUno,
                toUno:counselorUno,
                pageNumber:$scope.pageNumber,
                pageSize:$scope.pageSize
            };
            var callback2 = function (res) {
                console.log(res);
                if(res.status && res.status != 200){
                    alert(res.message);
                    $location.path('/tabs/login')
                }else{
                    $scope.Ulist = res.list
                    if($scope.Ulist.length){
                        msgShowTime('#dialog_chatHis',$scope.Ulist[$scope.Ulist.length-1].ctime)
                        for(var i = $scope.Ulist.length-1;i>=0;i--){
                            if($scope.Ulist[i].msgtype){
                                if($scope.Ulist[i].touno != loginUsersUno){
                                    if($scope.Ulist[i].msgtype != 2){
                                        msgShowHistory('sender','text',$scope.Ulist[i].msg);
                                    }else{
                                        msgShowHistory('sender','img',$scope.Ulist[i].msg);
                                    }
                                }else{
                                    if($scope.Ulist[i].msgtype == 1){
                                        msgShowHistory('receiver','text',$scope.Ulist[i].msg);
                                    }
                                    if($scope.Ulist[i].msgtype == 2){
                                        msgShowHistory('receiver','img',$scope.Ulist[i].msg);
                                    }
                                    if($scope.Ulist[i].msgtype == 3){
                                       // console.log(infoMsg[i].data)
                                        var infoText = JSON.parse($scope.Ulist[i].msg);
                                        msgShowHistory('receiver','info',infoText);
                                    }
                                }
                                $timeout($rootScope.msgScrollTop,1000)
                            }
                        }
                    }
                    $scope.pager = res.pager;
                    $scope.pageNumber ++;
                }
            };
            counselorServer.getData(callback2,url,params,Authorization);
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.hasMore = function (num) {
            return num >= $scope.pageCount ? false : true ;
        }
    }])
    //方案详情
    .controller('programInfoCtrl',['$scope','$rootScope','programInfoServer',function ($scope,$rootScope,programInfoServer) {
        $rootScope.title('方案详情')
        //方案详情接口
        var url = '/api/beta/scheme/info.aspx';
        var Authorization = '';
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var schemeId = location.hash.split('/')[location.hash.split('/').length-1]
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
        };
        if(loginUsers){
            Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
            programInfoServer.getData(callback,url,{schemeId: schemeId},Authorization)
        };
        //支付接口
        var url2 = '/api/beta/scheme/affirm.aspx';
        var callback2 = function (res) {
            //console.log(res)
            window.location.href = res.data.payParams;
        };
        $scope.appay = function () {
            if(loginUsers){
                Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
                programInfoServer.payParams(callback2,url2,{schemeId: schemeId, appType: 2},Authorization)
            }
        }
    }])
    //订单详情
    .controller('orderInfoCtrl',['$scope','$rootScope','orderInfoServer',function ($scope,$rootScope,orderInfoServer){
        $rootScope.title('预约详情')
        var url = '/api/beta/scheme/info.aspx';
        var Authorization = '';
        var loginUsers = JSON.parse(sessionStorage.getItem('users'));
        var schemeId = location.hash.split('/')[location.hash.split('/').length-1]
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
            $scope.price = 0;
            for (var i in $scope.data.items) {
                $scope.price += $scope.data.items[i].amount
            };           
        };
        if(loginUsers){
            Authorization = 'MEDCOS#' + loginUsers.sessionKey ;
            orderInfoServer.getData(callback,url,{schemeId: schemeId},Authorization)
        };
    }])