/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
    .controller('tabsCtrl',['$scope','$location','$interval','tabsServer',function($scope,$location,$interval,tabsServer){
        var url = "/api/beta/banner/list.aspx?platform=APP&num=6";
        var callback = function (res) {
            console.log(res)
            $scope.data = res.data;
            //console.log()
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
                    header:{
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
    .controller('lineCtrl',['$scope','lineServer', function ($scope,lineServer) {
        var url = "json/yishenglist0.json";
        var callback = function (data) {
            $scope.lists = data ;
        }
        lineServer.getData(callback,url);
        var seleted = $('.line-selected');
        seleted.on('click','a',function(){
            $scope.lists =[] ;
            $(this).addClass("line-active").siblings().removeClass("line-active");
            $(this).addClass("line-active").parent(".line-item").siblings().find("a").removeClass("line-active");
            $scope.$index = $(this).index();
            console.log($scope.$index)
            url = "json/yishenglist" +$scope.$index + ".json";
            lineServer.getData(callback,url);
        })
        /*--===================================================*/
        $scope.pageNumber =1;//当前页
        var pageCount = 3;//总页数
        $scope.pageNumber1 = 1;//当前页
        /*加载更多-------------------------------*/
        $scope.loadMore = function(){
            if (!$scope.hasMore($scope.pageNumber)) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
                return;
            }
            var url1 = 'json/yishenglist'+ $scope.pageNumber +'.json';
            console.log(url1);
            var callback1 = function (data) {
                console.log('第'+$scope.pageNumber+'次');
                for(var i in data){
                    $scope.lists.push(data[i])
                }
                $scope.pageNumber ++;
            };
            lineServer.getData(callback1,url1);
            $scope.$broadcast("scroll.infiniteScrollComplete");
        };
        /*下拉刷新--------------------------------------*/
        $scope.pullMore = function(){
            if (!$scope.hasMore($scope.pageNumber1)) {
                $scope.$broadcast("scroll.refreshComplete");
                return;
            }
            var url2 = 'json/yishenglist'+ $scope.pageNumber1 +'.json';
            console.log(url2);
            var callback2 = function (data) {
                console.log('第'+$scope.pageNumber1+'次');
                for(var i in data){
                    $scope.lists.unshift(data[i])
                }
                $scope.pageNumber1 ++;
            };
            lineServer.getData(callback2,url2);
            $scope.$broadcast("scroll.refreshComplete");
        };
        $scope.hasMore = function (num) {
            return num > pageCount ? false : true ;
        }
    }])
    .controller('yishengCtrl',['$scope','yishengServer', function ($scope,yishengServer) {
        var url = 'json/yisheng.json';
        var callback = function (data) {
            $scope.data = data;
        };
        yishengServer.getData(callback,url);
    }])
    .controller('diylistCtrl',['$scope','diylistServer', function ($scope,diylistServer) {
        var url = 'json/diylist.json';
        var callback = function (data) {
            $scope.data = data;
        };
        diylistServer.getData(callback,url);
    }])
    .controller('diyInfoCtrl',['$scope','diyInfoServer', function ($scope,diyInfoServer) {
        var url = 'json/diyInfo.json';
        var callback = function (data) {
            $scope.data = data;
        };
        diyInfoServer.getData(callback,url);
        var url2 = 'json/yishenglist0.json';
        var callback2 = function (data) {
            $scope.lists = data
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
        $scope.pageNumber =1;//当前页
        var pageCount = 3;//总页数
        $scope.loadMore = function(){
            if (!$scope.hasMore($scope.pageNumber)) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
                return;
            }
            var url1 = 'json/yishenglist'+ $scope.pageNumber +'.json';
            console.log(url1);
            var callback1 = function (data) {
                console.log('第'+$scope.pageNumber+'次');
                for(var i in data){
                    $scope.lists.push(data[i])
                }
                $scope.pageNumber ++;
            };
            diyInfoServer.getData(callback1,url1);
            $scope.$broadcast("scroll.infiniteScrollComplete");
        };
        $scope.hasMore = function (num) {
            return num > pageCount ? false : true ;
        }
    }])
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
                $.ajax({
                    url:'/api/beta/sms/send/code.aspx',
                    type:'post',
                    data:loginPara,
                    header:{}
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
                if(hahh){
                   var Authorization = hahh.sessionKey 
                   $.ajax({
                    url: '/api/beta/consumer/logout.aspx',
                    type: 'get',
                    header:{
                        Authorization:'MEDCOS#'+ Authorization
                        }
                    })
                    .done(function(res) {
                        console.log(res);
                        localStorage.removeItem('users')
                        $location.path('#/tabs');
                        conn.close();
                    })
                }
            }else{
                signOut.attr('href');
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
    .controller('messagesCtrl',['$scope',function($scope){

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