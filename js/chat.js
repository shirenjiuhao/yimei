/**
 * 消息初始化
 */
var msgInit = {
    el: '#dialog_chat', //消息容器
    senderAvatar: './img/WechatIMG8.png',  //发送者头像
    receiverAvatar: 'http://k1.jsqq.net/uploads/allimg/1612/140F5A32-6.jpg', //接收者头像
}
var msgInitHis = {
    el: '#dialog_chatHis', //消息容器
    senderAvatar: './img/WechatIMG8.png',  //发送者头像
    receiverAvatar: 'http://k1.jsqq.net/uploads/allimg/1612/140F5A32-6.jpg', //接收者头像
}
/**
 * @description 展示消息精简版
 * @param {String} who 消息来源,可选参数: {params} 'sender','receiver'
 * @param {Object} type 消息类型,可选参数: {params} 'text','url','img'
 * @param {Object} msg ('text'和'url'类型的msg是文字，img类型的msg是img地址)
 */
var msgShow = function(who,type,msg){
    appendMsg(who,type,{
        el: msgInit.el,
        senderAvatar: msgInit.senderAvatar,
        receiverAvatar: msgInit.receiverAvatar,
        msg: msg
    });
}
var msgShowHistory = function(who,type,msg){
    appendMsg(who,type,{
        el: msgInitHis.el,
        senderAvatar: msgInitHis.senderAvatar,
        receiverAvatar: msgInitHis.receiverAvatar,
        msg: msg
    });
}
var msgShowTime = function (el,msg){
    appendMsgTime({
        el:el,
        timer:msg
    })
}
function appendMsgTime(data){
    var domCreat = function(node){
        return document.createElement(node)
    };
    var timeBox = domCreat('div');
    //时间节点
    var msgTextNode = domCreat("span");
    var textnodeSpan=document.createTextNode(data.timer);
    msgTextNode.appendChild(textnodeSpan);
    timeBox.appendChild(msgTextNode);
    timeBox.className='counselor-timer';
    document.querySelector(data.el).appendChild(timeBox);
}
function appendMsg(who,type,data) {
    // 生成节点
    var domCreat = function(node){
        return document.createElement(node)
    };
    
    // 基本节点
    var msgItem = domCreat("div"),
        //timeBox = domCreat('div') 
        avatarBox = domCreat("div"),
        contentBox = domCreat("div"),
        avatar = domCreat("img");

    //时间节点
    /*var msgTextNode = domCreat("span");
    var textnodeSpan=document.createTextNode(data.timer);
    msgTextNode.appendChild(textnodeSpan);
    timeBox.appendChild(msgTextNode);
    timeBox.className='counselor-timer';*/
    

    // 头像节点
    avatarBox.className="chat-avatar";
    avatar.src = (who=="sender")?data.senderAvatar:data.receiverAvatar;
    avatarBox.appendChild(avatar);
    
    // 内容节点
    contentBox.className="chat-content";
    //triangle.className="chat-triangle";
    //contentBox.appendChild(triangle);
    
    // 消息类型
    switch (type){
        case "text":
            var msgTextNode = domCreat("span");
            var textnode=document.createTextNode(data.msg);
            msgTextNode.appendChild(textnode);
            contentBox.appendChild(msgTextNode);

            msgItem.className="chat-"+who;
            //msgItem.appendChild(timeBox);
            msgItem.appendChild(avatarBox);
            msgItem.appendChild(contentBox);
            break;
        case "info":
           var msgInfoNodeA = domCreat("a");//生成父元素a标签
           msgInfoNodeA.setAttribute("href",'#/tabs/mine/program/'+ data.msg.id);

           var msgInfoNodeP = domCreat("p");//生成方案名p标签
           var textnodeP=document.createTextNode(data.msg.schemeName);
           msgInfoNodeP.appendChild(textnodeP);

           var msgInfoNodeImg = domCreat("img");//生成img头像
           msgInfoNodeImg.src = data.msg.doctorImg;

           var msgInfoNodeDiv = domCreat("div");//生成右边盒子
           msgInfoNodeDiv.className="counselor-chat-prog-tex";
           var msgInfoNodeChildDiv = domCreat("div");//生成自盒子
           var textnodeChildDiv=document.createTextNode(data.msg.doctorName);
           var msgInfoNodeChildI = domCreat("i");//生成图标
           msgInfoNodeChildI.className="line-ion-zhuan";
           msgInfoNodeChildDiv.appendChild(textnodeChildDiv);
           msgInfoNodeChildDiv.appendChild(msgInfoNodeChildI);
           msgInfoNodeDiv.appendChild(msgInfoNodeChildDiv);//放到父盒子里

           var msgInfoNodeDivSpan = domCreat("span");//生成医生职位span标签
           var textnodeChildDivSpan=document.createTextNode(data.msg.doctorLevel);
           msgInfoNodeDivSpan.appendChild(textnodeChildDivSpan);//放到父盒子里
           msgInfoNodeDiv.appendChild(msgInfoNodeDivSpan);
            //分别添加到父盒子a标签中
            msgInfoNodeA.appendChild(msgInfoNodeP);
            msgInfoNodeA.appendChild(msgInfoNodeImg);
            msgInfoNodeA.appendChild(msgInfoNodeDiv);
            msgItem.className="counselor-chat-prog";
            //msgItem.appendChild(timeBox);
            msgItem.appendChild(msgInfoNodeA);
            break;
        case "img":
            var msgImgNode = domCreat("img");
            msgImgNode.src = data.msg;
            contentBox.appendChild(msgImgNode);

            msgItem.className="chat-"+who;
            //msgItem.appendChild(timeBox);
            msgItem.appendChild(avatarBox);
            msgItem.appendChild(contentBox);
            break;
        case "program":
            var msgInfoNodeA = domCreat("a");//生成父元素a标签
            msgInfoNodeA.setAttribute("href",'#/tabs/mine/order/'+data.msg.id );
            
            var msgInfoNodeP = domCreat("p");//生成医院名p标签
            var textnodeP=document.createTextNode(data.msg.hospitalName);
            msgInfoNodeP.appendChild(textnodeP);

            var msgInfoNodeDiv = domCreat("div");//生成第一行盒子
            msgInfoNodeDiv.style = 'display:flex';

            var msgInfoNodeSpan1 = domCreat("span");
            var textnodeInfoSpan1 = document.createTextNode('医生 ');
            msgInfoNodeSpan1.appendChild(textnodeInfoSpan1);

            var msgInfoNodeSpan2 = domCreat("span");
            var textnodeInfoSpan2 = document.createTextNode(data.msg.doctorName);
            msgInfoNodeSpan2.style = 'color:#333;'
             msgInfoNodeSpan2.appendChild(textnodeInfoSpan2);

            var msgInfoNodeI = domCreat("i");
            msgInfoNodeI.className = 'line-ion-zhuan';

            var msgInfoNodeSpan3 = domCreat("span");
            var textnodeInfoSpan3 = document.createTextNode('¥' + data.msg.payment);
            msgInfoNodeSpan3.appendChild(textnodeInfoSpan3);
            msgInfoNodeSpan3.style = 'flex: 1;color: #FF8EA2;font-size:1.42rem;text-align:right';

            msgInfoNodeDiv.appendChild(msgInfoNodeSpan1);
            msgInfoNodeDiv.appendChild(msgInfoNodeSpan2);
            msgInfoNodeDiv.appendChild(msgInfoNodeI);
            msgInfoNodeDiv.appendChild(msgInfoNodeSpan3);

            var msgInfoNodeDiv1 = domCreat("div");//生成第二行盒子
            var msgInfoNodeSpan4 = domCreat("span");
            var textnodeInfoSpan4 = document.createTextNode('时间');
            msgInfoNodeSpan4.appendChild(textnodeInfoSpan4);

            var msgInfoNodeSpan5 = domCreat("span");
            var textnodeInfoSpan5 = document.createTextNode(data.msg.reserveTime);
            msgInfoNodeSpan5.appendChild(textnodeInfoSpan5);

            msgInfoNodeDiv1.appendChild(msgInfoNodeSpan4);
            msgInfoNodeDiv1.appendChild(msgInfoNodeSpan5);

            var msgInfoNodeDiv2 = domCreat("div");//生成第三行盒子
            var msgInfoNodeSpan6 = domCreat("span");
            var textnodeInfoSpan6 = document.createTextNode("方案");
            msgInfoNodeSpan6.appendChild(textnodeInfoSpan6);

            var msgInfoNodeSpan7 = domCreat("span");
            var textnodeInfoSpan7 = document.createTextNode(data.msg.schemeName);
            msgInfoNodeSpan7.style = 'color:#333';
            msgInfoNodeSpan7.appendChild(textnodeInfoSpan7);

            msgInfoNodeDiv2.appendChild(msgInfoNodeSpan6);
            msgInfoNodeDiv2.appendChild(msgInfoNodeSpan7);

            msgInfoNodeA.appendChild(msgInfoNodeP);
            msgInfoNodeA.appendChild(msgInfoNodeDiv);
            msgInfoNodeA.appendChild(msgInfoNodeDiv1);
            msgInfoNodeA.appendChild(msgInfoNodeDiv2);
            msgItem.className = 'counselor-chat-prog counselor-chat-h';
            msgItem.appendChild(msgInfoNodeA);
            break;
        default:
            break;
    }
    
    // 节点连接
    //document.querySelector(data.el).appendChild(timeBox);
    document.querySelector(data.el).appendChild(msgItem);
}
//生成日期
function getShowDate(){
    let date =  new Date();
    let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate();
    let month = date.getMonth()+1  < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1 ;
    let hour = date.getHours() <10 ? '0'+ date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds()
    return string = date.getFullYear() +'-'+ month +'-'+ day +' '+ hour + ':' + minutes;//  + ':' + seconds 
}
//只是单个属性值比较的对象去重
var listUsers = function(item){
    var arr = [],result = [];
    for (let i = 0; i < item.length; i++) {
        if(arr.indexOf(item[i].tel) == -1){
             arr.push(item[i].tel)
             result.push(item[i])
        }
    };
    return result  
}
//有消息来滚动定位
/*var msgScrollTop = function(){
    $(msgInit.el)[0].scrollTop = $(msgInit.el)[0].scrollHeight + $(msgInit.el)[0].offsetHeight;
}*/