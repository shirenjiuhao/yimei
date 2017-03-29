/**
 * Created by Administrator on 2017/2/27.
 */
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
        console.log(message);
        $('.counselor-content').append('<div class="counselor-chat" style="margin-top:2rem">'+
            '<img src="img/touxiang1.png" alt="加载中"/>'+
            '<div class="counselor-chat-text">'+ message.data+ '</div>'
            +'</div>' );
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

        var options = {url: message.url};
        options.onFileDownloadComplete = function () {
            // 图片下载成功
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

