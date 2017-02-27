/**
 * Created by Administrator on 2017/2/14.
 */
angular.module('app.controllers',['app.servers'])
.controller('tabsCtrl',['$scope','$interval','tabsServer',function($scope,$interval,tabsServer){
        var url = "json/yimei.json";
        var callback = function (data) {
            $scope.data = data;
        };
        tabsServer.getData(callback,url);
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
            lineServer.getData(callback,url)
        })
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
        var count = 0;
        $scope.show = function () {
            return true;
        };
        $scope.change = function () {
            count = 0;
            console.log(count);
            $('.diyInfo-thr').find('a').eq(count).addClass("diyInfo-thr-act").siblings().removeClass("diyInfo-thr-act");
            $scope.show = function () {
                return true;
            }
        };
        $scope.change1= function () {
            count = 1;
            console.log(count);
            $('.diyInfo-thr').find('a').eq(count).addClass("diyInfo-thr-act").siblings().removeClass("diyInfo-thr-act");
            $scope.show = function () {
                return false;
            }
        };
    }])
.controller('loginCtrl',['$scope','$interval','$timeout',function ($scope,$interval,$timeout) {
        var text = $('.login-get');
        var reg = /^1(3|4|5|7|8)\d{9}$/ig;
        var str1 = "";
        $scope.getInfo = function () {
            var name = $('.login-input').find("input[type='tel']").val();
            var text1 = "";
            if(!reg.test(name)){
                alert('手机号有误，请输入正确的手机号');
                return false;
            }else {
                str1 = "";
                for (var i = 1; i <= 6; i++) {
                    str1 = str1 + parseInt(Math.random() * 10);
                }
                console.log(str1);
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
        var url = '';
        $scope.yanzhengma = function () {
            var pwd = $('.login-input').find("input[type='text']").val();
            if(pwd == '' && pwd != str1){
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
            var registers = {
                username:username ,
                password:password ,
                appKey: WebIM.config.appkey,
                success: function () {
                    alert('注册成功')
                },
                error: function (e) {console.log(e.error)},
                apiUrl: WebIM.config.apiURL
            };
            conn.registerUser(registers) ;//注册用户名
            console.log('1121-------------------------------');
            var signIn = {
                apiUrl: WebIM.config.apiURL,
                user: username,
                pwd: password,
                appKey: WebIM.config.appkey,
                success: function (token) {
                    alert('登陆成功');
                    /*var token = token.access_token;
                    WebIM.utils.setCookie('webim_' + encryptUsername, token, 1);*/
                    $('#login-btn').attr('href','#/tabs/messages');
                },
                error: function(){
                }
            };
            conn.open(signIn);
            $timeout(function () {
                $('#login-btn').attr('href','#/tabs/messages/counselor');
            },3000)
            console.log('------------------------------------------------------------')
        }
    }])
.controller('mineCtrl',['$scope', function ($scope) {
        $scope.signOut = function () {
            var signOut = $("#signOut");
            var r = window.confirm('是否退出登录');
            if(r == true){
                signOut.attr('href','#/tabs');
                conn.close();
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
.controller('counselorCtrl',['$scope', function ($scope){}])
.controller('messagesCtrl',['$scope',function($scope){
        $scope.sendPrivateText = function () {
            var id = conn.getUniqueId();                 // 生成本地消息id
            var msg = new WebIM.message('txt', id);      // 创建文本消息
            msg.set({
                msg: 'message content',                  // 消息内容
                to: 'username',                          // 接收消息对象（用户id）
                roomType: false,
                success: function (id, serverMsgId) {
                    console.log('send private text Success');
                }
            });
            msg.body.chatType = 'singleChat';
            conn.send(msg.body);
        };
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
        }
    }])
.controller('programInfoCtrl',['$scope',function($scope) {
        $scope.appay = function () {
            alert(1);
        }
    }])
.controller('orderInfoCtrl',['$scope',function($scope){}])