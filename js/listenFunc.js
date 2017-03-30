/**
 * Created by Administrator on 2017/2/27.
 */
var infoMessages = [];
var conn = new WebIM.connection({
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});
conn.listen({
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
        message.ext.time = getShowDate();
        infoMessages.push(message)
        // msgShow('receiver','text',message.data,getShowDate());
        // msgScrollTop();
        sessionStorage.setItem(message.from,JSON.stringify(infoMessages))  
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
        infoMessages = JSON.parse(sessionStorage.getItem(message.from)) || [];
        var options = {url: message.url};
        options.onFileDownloadComplete = function () {
            // 图片下载成功
            message.ext.time = getShowDate();
            message.ext.imgSrc = message.url;
            infoMessages.push(message);
            /*msgShow('receiver','img',message.url,getShowDate());
            msgScrollTop();*/
            sessionStorage.setItem(message.from,JSON.stringify(infoMessages));
            console.log('Image download complete!');
        };
        options.onFileDownloadError = function () {
            // 图片下载失败
            console.log('Image download failed!');
        };
        WebIM.utils.download.call(conn, options);
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
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
            },
            onFileDownloadError: function () {
                console.log('File down load error.')
            }
        };
        WebIM.utils.download.call(conn, option);
    },   //收到视频消息
    onPresence: function ( message ) {},       //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
    onRoster: function ( message ) {},         //处理好友申请
    onInviteMessage: function ( message ) {},  //处理群组邀请
    onOnline: function () {},                  //本机网络连接成功
    onOffline: function () {},                 //本机网络掉线
    onError: function ( message ) {
        console.log(message);
        console.log('连接失败，请重新登录');
        window.location.replace('#/tabs/login')
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

var msgScrollTop = function(){
    $(msgInit.el)[0].scrollTop = $(msgInit.el)[0].scrollHeight + $(msgInit.el)[0].offsetHeight;
}
//发送文本消息
var sendPrivateText = function(messages,toUno){
    let id = conn.getUniqueId();                 // 生成本地消息id
    let msg = new WebIM.message('txt', id);      // 创建文本消息
    msg.set({
        msg: messages,                  // 消息内容
        to: toUno,    // 接收消息对象（用户id）
        ext: {"msgType":1,time:getShowDate()},
        roomType: false,
        success: function (id, serverMsgId) {
            console.log('send private text Success');
            console.log(msg)
            let content = msg.value;
            msgShow('sender','text',content,getShowDate());
            msgScrollTop();
        }
    });
    infoMessages = JSON.parse(sessionStorage.getItem(toUno)) || [];
    msg.body.chatType = 'singleChat';
    conn.send(msg.body);
    infoMessages.push(msg.body);
    sessionStorage.setItem(toUno,JSON.stringify(infoMessages));
 };
// 发送图片消息
var sendPrivateImg = function (imgSrc,toUno) {
        var id = conn.getUniqueId();
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
                    msgShow('sender','img',imgSrc,getShowDate());
                    msgScrollTop();
                },
                // flashUpload: WebIM.flashUpload               // 意义待查
            };
            infoMessages = JSON.parse(sessionStorage.getItem(toUno)) || [];
            infoMessages.push(option);
            sessionStorage.setItem(toUno,JSON.stringify(infoMessages));
            msg.set(option);
            conn.send(msg.body);
        }
};
$(function(){
    userInfo = sessionStorage.getItem('users')
    if(userInfo){
        userInfo = JSON.parse(userInfo)
        var signIn = {
            apiUrl: WebIM.config.apiURL,
            user: userInfo.consumer.uno,
            pwd: userInfo.consumer.easemobPwd,
            appKey: WebIM.config.appkey
        };
        conn.open(signIn);
    }
 });