/**
 * Created by Master on 2017/02/13.
 */
angular.module('app',['ionic','app.controllers'])
    .config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('tabs',{
                url:'/tabs',
                templateUrl:'views/yimei.html',
                controller:'tabsCtrl'
            })
            .state('mine',{
                url:'/tabs/mine',
                templateUrl:'views/mine.html',
                controller:'mineCtrl'
            })
            .state('program',{
                url:'/tabs/mine/program',
                templateUrl:'views/program.html',
                controller:'programCtrl'
            })
            .state('programid',{
                url:'/tabs/mine/program/:id',
                templateUrl:'views/programInfo.html',
                controller:'programInfoCtrl'
            })
            .state('order',{
                url:'/tabs/mine/order',
                templateUrl:'views/order.html',
                controller:'orderCtrl'
            })
            .state('orderid',{
                url:'/tabs/mine/order/:id',
                templateUrl:'views/orderInfo.html',
                controller:'orderInfoCtrl'
            })
            .state('line',{
                url:'/tabs/line',
                templateUrl:'views/yimeiLine.html',
                controller:'lineCtrl'
            })
            .state('lineid',{
                url:'/tabs/line/:hospitalId/:doctorId',
                templateUrl:'views/lineyisheng.html',
                controller:'yishengCtrl'
            })
            .state('diy',{
                url:'/tabs/diy',
                templateUrl:'views/diylist.html',
                controller:'diylistCtrl'
            })
            .state('diyid',{
                url:'/tabs/diy/:hospitalId/:doctorId',
                templateUrl:'views/diyInfo.html',
                controller:'diyInfoCtrl'
            })
            .state('login',{
                url:'/tabs/login',
                templateUrl:'views/login.html',
                controller:'loginCtrl'
            })
            .state('messages',{
                url:'/tabs/messages',
                templateUrl:'views/messages.html',
                controller:'messagesCtrl'
            })
            .state('counselor',{
                url:'/tabs/:page/:hospitalId/:doctorId/:counselorUno',
                templateUrl:'views/counselor.html',
                controller:'counselorCtrl'
            })
        $urlRouterProvider.otherwise('/tabs');
    }])
    .run(function ($rootScope,loginServer,$location,$timeout,$ionicScrollDelegate) {
        $rootScope.backPgUp = function(){
            window.history.go(-1);
        };
        $rootScope.msgScrollTop = function(){
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
        };
        $rootScope.title = function(value){
            var $body = $('body');
            document.title = value;
            var $iframe = $('<iframe src="./favicon.ico"></iframe>');
            $iframe.on('load',function() {
              setTimeout(function() {
                  $iframe.off('load').remove();
              }, 100);
            }).appendTo($body);
        };
        /*$rootScope.$on('$routeChangeStart', function(evt, next, current) {
            var status = sessionStorage.getItem('users')
            // var loginUsers = JSON.parse()
            // 如果用户未登录
            if (!status) {
                if (next.templateUrl === "login.html") {
                    // 已经转向登录路由因此无需重定向
                } else {
                    $location.path('/tabs/login');
                }
            }
        });*/
        /**
         * Created by Administrator on 2017/2/27.
         环信方法调用
         */
        $rootScope.messageInfoNum_z = 0;
        $rootScope.messageInfoNum_o = 0;
        $rootScope.messageInfoNum_s = 0;
        $rootScope.messageInfoNum_t = 0;
        var infoMessages = [];//存储历史聊天记录
        $rootScope.conn = new WebIM.connection({
            https: WebIM.config.https,
            url: WebIM.config.xmppURL,
            isAutoLogin: WebIM.config.isAutoLogin,
            isMultiLoginSessions: WebIM.config.isMultiLoginSessions
        });
        $rootScope.conn.listen({
            onOpened: function ( message ) {          //连接成功回调
                // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
                // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
                // 则无需调用conn.setPresence();
                console.log('连接成功');
            },
            onClosed: function ( message ) {
                console.log('已退出登录')
            },         //连接关闭回调
            onTextMessage: function ( message ) {
                infoMessages = JSON.parse(sessionStorage.getItem(message.from)) || [];
                console.log(message);
                $rootScope.messageInfoNum_z ++;
                message.ext.time = getShowDate();
                infoMessages.push(message);
                    if(message.ext.msgType ==1){
                        msgShow('receiver','text',message.data);
                    }
                    if(message.ext.msgType ==3){
                        var infoText = JSON.parse(message.data);
                        msgShow('receiver','info',infoText);
                    }
                    if(message.ext.msgType ==4){
                        var programText = JSON.parse(message.data);
                        msgShow('receiver','program',programText);
                    }
                // msgScrollTop();
                $timeout($rootScope.msgScrollTop,1000);
                sessionStorage.setItem(message.from,JSON.stringify(infoMessages))  ;
            },    //收到文本消息
            onEmojiMessage: function ( message ) {
                console.log('Emoji');
                var data = message.data;
                for(var i = 0 , l = data.length ; i < l ; i++){
                    console.log(data[i]);
                }
            },   //收到表情消息
            onPictureMessage: function ( message ) {
                console.log('Picture');
                $rootScope.messageInfoNum_z ++;
                infoMessages = JSON.parse(sessionStorage.getItem(message.from)) || [];
                var options = {url: message.url};
                options.onFileDownloadComplete = function () {
                    // 图片下载成功
                    message.ext.time = getShowDate();
                    message.ext.imgSrc = message.url;
                    infoMessages.push(message);
                    msgShow('receiver','img',message.url);
                    /*msgScrollTop();*/
                    $timeout($rootScope.msgScrollTop,1000);
                    sessionStorage.setItem(message.from,JSON.stringify(infoMessages));
                    console.log('Image download complete!');
                };
                options.onFileDownloadError = function () {
                    // 图片下载失败
                    console.log('Image download failed!');
                };
                WebIM.utils.download.call($rootScope.conn, options);
            }, //收到图片消息
            onCmdMessage: function ( message ) {},     //收到命令消息
            onAudioMessage: function ( message ) {},   //收到音频消息
            onLocationMessage: function ( message ) {},//收到位置消息
            onFileMessage: function ( message ) {},    //收到文件消息
            onVideoMessage: function (message) {
                var node = document.getElementById('privateVideo');
                var option = {
                    url: message.url,
                    headers: {
                        'Accept': 'audio/mp4'
                    },
                    onFileDownloadComplete: function (response) {
                        var objectURL = WebIM.utils.parseDownloadResponse.call($rootScope.conn, response);
                        node.src = objectURL;
                    },
                    onFileDownloadError: function () {
                        console.log('File down load error.')
                    }
                };
                WebIM.utils.download.call($rootScope.conn, option);
            },   //收到视频消息
            onPresence: function ( message ) {},       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
            onRoster: function ( message ) {},         //处理好友申请
            onInviteMessage: function ( message ) {},  //处理群组邀请
            onOnline: function () {},                  //本机网络连接成功
            onOffline: function () {},                 //本机网络掉线
            onError: function ( message ) {
                console.log(message);
                console.log('环信回调失败，请刷新页面');
                //localStorage.removeItem('users')
                //alert('会话超时，请重新登录');
                //$location.path('/tabs/login')
                //window.location.replace('#/tabs/login')
                //window.location.href = '#/tabs/login'
            },          //失败回调
            onBlacklistUpdate: function (list) {       //黑名单变动
                // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
                console.log(list);
            }
        });
        //是否能上传file
        WebIM.utils.isCanUploadFile;
        //是否能下载file
        WebIM.utils.isCanDownLoadFile ;
        //是否设置header
        WebIM.utils.hasSetRequestHeader;
        //是否设置mimetype
        WebIM.utils.hasOverrideMimeType;

        //发送文本消息
        $rootScope.sendPrivateText = function(messages,toUno){
            var id = $rootScope.conn.getUniqueId();                 // 生成本地消息id
            var msg = new WebIM.message('txt', id);      // 创建文本消息
            msg.set({
                msg: messages,                  // 消息内容
                to: toUno,    // 接收消息对象（用户id）
                ext: {"msgType":1,time:getShowDate()},
                roomType: false,
                success: function (id, serverMsgId) {
                    console.log('send private text Success');
                    console.log(msg)
                    var content = msg.value;
                    msgShow('sender','text',content);
                    //msgScrollTop();
                }
            });
            infoMessages = JSON.parse(sessionStorage.getItem(toUno)) || [];
            msg.body.chatType = 'singleChat';
            $rootScope.conn.send(msg.body);
            infoMessages.push(msg.body);
            sessionStorage.setItem(toUno,JSON.stringify(infoMessages));
         };
        // 发送图片消息
        $rootScope.sendPrivateImg = function (imgSrc,toUno) {
            var id = $rootScope.conn.getUniqueId();
            var msg = new WebIM.message('img', id);
            var input = document.getElementById('image');            // 选择图片的input
            var file = WebIM.utils.getFileUrl(input);                   // 将图片转化为二进制文件
            var allowType = {
                'jpg': true,
                'gif': true,
                'png': true,
                'bmp': true
            };
            if (file.filetype.toLowerCase() in allowType) {
                console.log('send');
                //console.log(file);
                var option = {
                    apiUrl: WebIM.config.apiURL,
                    file: file,
                    to: toUno ,
                    ext: {"msgType":2,time:getShowDate(),imgSrc: imgSrc},
                    roomType: false,
                    chatType: 'singleChat',
                    onFileUploadError: function () {
                        console.log('onFileUploadError');
                    },
                    onFileUploadComplete: function () {
                        console.log('onFileUploadComplete'+' 发送成功');
                    },
                    success: function () {
                        console.log('Success');
                        msgShow('sender','img',imgSrc);
                        //msgScrollTop();
                    }
                    // flashUpload: WebIM.flashUpload               // 意义待查
                };
                infoMessages = JSON.parse(sessionStorage.getItem(toUno)) || [];
                infoMessages.push(option);
                sessionStorage.setItem(toUno,JSON.stringify(infoMessages));
                msg.set(option);
                $rootScope.conn.send(msg.body);
            }
        };
        $(function(){
            var userInfo = localStorage.getItem('users')
            if(userInfo){
                userInfo = JSON.parse(userInfo)
                var signIn = {
                    apiUrl: WebIM.config.apiURL,
                    //accessToken: 'token',
                    user: userInfo.consumer.uno,
                    pwd: userInfo.consumer.easemobPwd,
                    appKey: WebIM.config.appkey
                };
                $rootScope.conn.open(signIn);
            }
         });
    })
/*
.config(function($routeProvider){
        $routeProvider
            .when('/tabs',{
                templateUrl: 'views/yimei.html',
                controller:'tabsCtrl'
            })
            .when('/tabs/mine',{
                templateUrl:'views/mine.html',
                controller:'mineCtrl'
            })
            .when('/tabs/mine/program',{
                templateUrl:'views/program.html',
                controller:'programCtrl'
            })
            .when('/tabs/mine/program/:id',{
                templateUrl:'views/programInfo.html',
                controller:'programInfoCtrl'
            })
            .when('/tabs/mine/order',{
                templateUrl:'views/order.html',
                controller:'orderCtrl'
            })
            .when('/tabs/mine/order/:id',{
                templateUrl:'views/orderInfo.html',
                controller:'orderInfoCtrl'
            })
            .when('/tabs/line',{
                templateUrl:'views/yimeiLine.html',
                controller:'lineCtrl'
            })
            .when('/tabs/line/:id',{
                templateUrl:'views/lineyisheng.html',
                controller:'yishengCtrl'
            })
            .when('/tabs/diy',{
                templateUrl:'views/diylist.html',
                controller:'diylistCtrl'
            })
            .when('/tabs/diy/:id',{
                templateUrl:'views/diyInfo.html',
                controller:'diyInfoCtrl'
            })
            .when('/tabs/login',{
                templateUrl:'views/login.html',
                controller:'loginCtrl'
            })
            .when('/tabs/messages',{
                templateUrl:'views/messages.html',
                controller:'messagesCtrl'
            })
            .when('/tabs/messages/counselor',{
                templateUrl:'views/counselor.html',
                controller:'counselorCtrl'
            })
        .otherwise({redirectTo:'/tabs'});*/
/*默认的路由*//*
})*/
