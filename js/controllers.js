/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
    .controller('tabsCtrl',['$scope','$location','$ionicSlideBoxDelegate','tabsServer',function($scope,$location,$ionicSlideBoxDelegate,tabsServer){
        var url = "/api/beta/banner/list.aspx?platform=APP&num=6";
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
            $ionicSlideBoxDelegate.update();
        };
        tabsServer.getData(callback,url);
        var loginUsers = JSON.parse(localStorage.getItem('users'));
        $scope.speedChat = function(){
            if(loginUsers){
                var params = {
                    consumerId:loginUsers.consumer.consumerId,
                    page:'首页',
                    url:'"http://yifengbeauty.com/banner-info.html"',
                    deviceType:'2',
                    appType:'2'
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
                })
                .done(function(res) {
                    $location.path('/tabs/messages/'+ params.consumerId)
                    console.log(res);
                })
            }else{
                $location.path('/tabs/login')
            }
        }
    }])
//医生列表
    .controller('lineCtrl',['$scope','lineServer', function ($scope,lineServer) {
        //获取整形部位
        var url = "/api/beta/doctor/bodyList.aspx";
        var callback = function (res) {
            console.log(res)
            $scope.bodys = res.data ;
        }
        lineServer.getData(callback,url);
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
            return num > $scope.pageCount ? false : true ;
        }
    }])
//医生详情
    .controller('yishengCtrl',['$scope','yishengServer', function ($scope,yishengServer) {
        //console.log(location.hash)
        var id = location.hash.split('/')[location.hash.split('/').length-1]
        //console.log(id)
        var url = '/api/beta/doctor/info.aspx?id='+ id +'&';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
        };
        yishengServer.getData(callback,url);
    }])
    //医院列表
    .controller('diylistCtrl',['$scope','diylistServer', function ($scope,diylistServer) {
        var url = '/api/beta/hospital/list.aspx';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data.list;
        };
        diylistServer.getData(callback,url);
    }])
    //医院详情
    .controller('diyInfoCtrl',['$scope','diyInfoServer', function ($scope,diyInfoServer) {
        var id = location.hash.split('/')[location.hash.split('/').length-1]
        var url = '/api/beta/hospital/info.aspx?id='+ id +'&';
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
        };
        diyInfoServer.getData(callback,url);
        //医院的医生列表
        var url2 = '/api/beta/doctor/list.aspx?hospitalId='+ id +'&';
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
    }])
//登陆
    .controller('loginCtrl',['$scope','$interval',function ($scope,$interval) {
        var text = $('.login-get');
        var reg = /^1(3|4|5|7|8)\d{9}$/ig;
        var str1 = "";
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
        $scope.yanzhengma = function () {
            var pwd = $('.login-input').find("input[type='text']").val();
            if(pwd == ''){
                alert('验证码输入错误,请重新输入')
            }
        }
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
            })
            .done(function(res) {
                console.log(res);
                loginUsers = res.data;
                localStorage.setItem('users',JSON.stringify(loginUsers))
                var signIn = {
                    apiUrl: WebIM.config.apiURL,
                    user: loginUsers.consumer.uno,
                    pwd: loginUsers.consumer.easemobPwd,
                    appKey: WebIM.config.appkey,
                    success: function (token) {
                        alert('登陆成功');
                        window.history.go(-1)
                    },
                    error: function(){
                    }
                };
                conn.open(signIn);
                console.log('------------------------------------------------------------')
            })
        }
    }])
    .controller('mineCtrl',['$scope','$location', function ($scope,$location) {
        $scope.signOut = function () {
            //var signOut = $("#signOut");
            var r = window.confirm('是否退出登录');
            if(r == true){
                var hahh = JSON.parse(localStorage.getItem('users'));
                var loginUsers = JSON.parse(localStorage.getItem('users'));
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
                        $location.path('#/tabs');
                        localStorage.removeItem('users')
                        conn.close();
                    })
                }
            }
        }
    }])
    .controller('programCtrl',['$scope',function($scope){}])
    .controller('orderCtrl',['$scope','orderServer',function($scope,orderServer){
        var url = 'json/order.json';
        var callback = function (data) {
            $scope.data = data;
        };
        orderServer.getData(callback,url)
    }])
    .controller('messagesCtrl',['$scope','messagesServer',function($scope,messagesServer){
        var url = '/api/beta/easemob/chat/list.aspx';
        var callback = function (data) {
            $scope.data = data;
        };
        messagesServer.getData(callback,url)
    }])
    .controller('counselorCtrl',['$scope', function ($scope) {
        $scope.show = function () {
            return true
        };
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
        /*focus('info_text');*/
        $scope.flag = false;
        $scope.addPic = function () {//是否发送图片
            $scope.flag = ! $scope.flag;
            if($scope.flag){
                $('.counselor-foot').css('bottom','5.42rem')
            }else{
                $('.counselor-foot').css('bottom',0)
            }
        };
        /*发送消息*/
        $scope.sendPrivateText = function () {
            var messages = $('#info_text').val();
            console.log(messages);
            if(messages == ''){
                return false
            }
            $('#info_text').val("");
            focus('info_text');
            var id = conn.getUniqueId();                 // 生成本地消息id
            var msg = new WebIM.message('txt', id);      // 创建文本消息
            msg.set({
                msg: messages,                  // 消息内容
                to: 'admin123',                          // 接收消息对象（用户id）
                roomType: false,
                success: function (id, serverMsgId) {
                    console.log('send private text Success');
                    $('.counselor-content').append('<div class="counselor-chat-mine">' +
                        '<img src="img/WechatIMG8.png" alt="加载中"/>'+
                        '<div class="counselor-chat-mine-text">' + messages +'</div> '
                        + '</div>')
                }
            });
            msg.body.chatType = 'singleChat';
            conn.send(msg.body);
        };
        /*可以发送图片*/
        document.addEventListener('paste', function (e) {
            if (e.clipboardData && e.clipboardData.types) {
                if (e.clipboardData.items.length > 0) {
                    if (/^image\/\w+$/.test(e.clipboardData.items[0].type)) {
                        var blob = e.clipboardData.items[0].getAsFile();
                        var url = window.URL.createObjectURL(blob);
                        var id = conn.getUniqueId();             // 生成本地消息id
                        var msg = new WebIM.message('img', id);  // 创建图片消息
                        msg.set({
                            apiUrl: WebIM.config.apiURL,
                            file: {data: blob, url: url},
                            to: 'username',                      // 接收消息对象
                            roomType: false,
                            chatType: 'singleChat',
                            onFileUploadError: function (error) {
                                console.log('Error');
                            },
                            onFileUploadComplete: function (data) {
                                console.log('Complete');
                            },
                            success: function (id) {
                                console.log('Success');
                            }
                        });
                        conn.send(msg.body);
                    }
                }
            }
        });
    }])
    .controller('programInfoCtrl',['$scope',function($scope) {
        $scope.appay = function () {
            alert(1);
        }
    }])
    .controller('orderInfoCtrl',['$scope',function($scope){}])