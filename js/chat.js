/**
 * 消息初始化
 */
var msgInit = {
    el: '#dialog_chat', //消息容器
    senderAvatar: './img/WechatIMG8.png',  //发送者头像
    receiverAvatar: './img/touxiang1.png', //接收者头像
}


/**
 * @description 展示消息精简版
 * @param {String} who 消息来源,可选参数: {params} 'sender','receiver'
 * @param {Object} type 消息类型,可选参数: {params} 'text','url','img'
 * @param {Object} msg ('text'和'url'类型的msg是文字，img类型的msg是img地址)
 */
var msgShow = function(who,type,msg,time){
    appendMsg(who,type,{
        el: msgInit.el,
        senderAvatar: msgInit.senderAvatar,
        receiverAvatar: msgInit.receiverAvatar,
        msg: msg,
        timer: time
    });
}

function appendMsg(who,type,data) {
    // 生成节点
    var domCreat = function(node){
        return document.createElement(node)
    };
    
    // 基本节点
    var msgItem = domCreat("div"),
        timeBox = domCreat('div') 
        avatarBox = domCreat("div"),
        contentBox = domCreat("div"),
        avatar = domCreat("img");

    //时间节点
    var msgTextNode = domCreat("span");
    var textnodeSpan=document.createTextNode(data.timer);
    msgTextNode.appendChild(textnodeSpan);
    timeBox.appendChild(msgTextNode);
    timeBox.className='counselor-timer';

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
            msgItem.appendChild(timeBox);
            msgItem.appendChild(avatarBox);
            msgItem.appendChild(contentBox);
            break;
        case "info":
           var msgInfoNodeA = domCreat("a");//生成父元素a标签
           msgInfoNodeA.setAttribute("href",'#/tabs/mine/program/2');

           var msgInfoNodeP = domCreat("p");//生成方案名p标签
           var textnodeP=document.createTextNode('方案2');
           msgInfoNodeP.appendChild(textnodeP);

           var msgInfoNodeImg = domCreat("img");//生成img头像
           msgInfoNodeImg.src = './img/touxiang1.png';

           var msgInfoNodeDiv = domCreat("div");//生成右边盒子
           msgInfoNodeDiv.className="counselor-chat-prog-tex";
           var msgInfoNodeChildDiv = domCreat("div");//生成自盒子
           var textnodeChildDiv=document.createTextNode('李敏');
           var msgInfoNodeChildI = domCreat("i");//生成图标
           msgInfoNodeChildI.className="line-ion-zhuan";
           msgInfoNodeChildDiv.appendChild(textnodeChildDiv);
           msgInfoNodeChildDiv.appendChild(msgInfoNodeChildI);
           msgInfoNodeDiv.appendChild(msgInfoNodeChildDiv);//放到父盒子里

           var msgInfoNodeDivSpan = domCreat("span");//生成医生职位span标签
           var textnodeChildDivSpan=document.createTextNode('主治医师');
           msgInfoNodeDiv.appendChild(msgInfoNodeDivSpan);//放到父盒子里
            //分别添加到父盒子a标签中
            msgInfoNodeA.appendChild(msgInfoNodeP);
            msgInfoNodeA.appendChild(msgInfoNodeImg);
            msgInfoNodeA.appendChild(msgInfoNodeDiv);
            msgItem.className="counselor-chat-prog";
            msgItem.appendChild(timeBox);
            msgItem.appendChild(msgInfoNodeA);
            break;
        case "img":
            var msgImgNode = domCreat("img");
            msgImgNode.src = data.msg;
            contentBox.appendChild(msgImgNode);

            msgItem.className="chat-"+who;
            msgItem.appendChild(timeBox);
            msgItem.appendChild(avatarBox);
            msgItem.appendChild(contentBox);
            break;
        default:
            break;
    }
    
    // 节点连接
    
    document.querySelector(data.el).appendChild(msgItem);
}
//生成日期
var getShowDate = function(){
    let date =  new Date();
    let day = date.getDate() < 10 ? '0'+ date.getDate() : date.getDate();
    let month = date.getMonth()+1  < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1 ;
    let hour = date.getHours() <10 ? '0'+ date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds()
    return string = month +'-'+ day +' '+ hour + ':' + minutes;//date.getFullYear()+'-'+  + ':' + seconds 
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