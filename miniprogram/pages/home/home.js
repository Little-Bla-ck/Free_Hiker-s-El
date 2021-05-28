// pages/home/home.js
const dateFormatUtil = require('../../utils/dateFormatUtil')
const db = wx.cloud.database()
const _ = db.command
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    currentIndex:0,
    showOperationPannel:false,
    operationList:[],
    userInfo:null,
    msgList:[],
    grade:0,
    list: [
      {
        "text": "首页",
        "iconPath": "https://img0.baidu.com/it/u=2840506344,792246033&fm=26&fmt=auto&gp=0.jpg",
         "selectedIconPath": "https://img2.baidu.com/it/u=2765674314,1712114289&fm=26&fmt=auto&gp=0.jpg",
      },
{
  "text": "碳友",
  "iconPath": "https://img0.baidu.com/it/u=2902377516,2179184509&fm=26&fmt=auto&gp=0.jpg",
   "selectedIconPath": "https://img2.baidu.com/it/u=2208392688,1091329718&fm=26&fmt=auto&gp=0.jpg",
},
{
  "text": "消息",
  "iconPath": "https://img1.baidu.com/it/u=4239642980,3366861903&fm=26&fmt=auto&gp=0.jpg",
   "selectedIconPath": "https://img0.baidu.com/it/u=795391264,3025636472&fm=26&fmt=auto&gp=0.jpg",
},

{
    "text": "我的",
    "iconPath": "https://img0.baidu.com/it/u=2481029322,4160976754&fm=26&fmt=auto&gp=0.jpg",
   "selectedIconPath": "https://img0.baidu.com/it/u=2740484780,1239230878&fm=26&fmt=auto&gp=0.jpg",
}]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
    //首页是一个消息列表
    //1、首先要建立一个数据集合 sys_msg
    //  type（0，系统消息，1，聊天消息）
    //  icon（私聊时，这个icon就是好友的头像）
    //  title(私聊时，就是好友的昵称)
    //  content（私聊时，和好友聊天的最后一条消息内容）
    //  time
    //  sentTimeTS
    //  userId(这条消息属于哪个用户)
    //  groupId(聊天消息的群组id，如果消息是聊天消息，才存在)
    //  unreadCount(未读消息数，暂时放一下不做)
    //2、插入消息集合
    //  发送聊天消息成功后
    //     先查询消息是否存在，查询条件
    //      type:1
    //      groupId,
    //      userId(私聊时，好友的openid)
    //      如果能查询到，去更新
    //        content 聊天内容
    //        time
    //        sendTimeTS
    //      如果查询不到，去添加
    //        type:1
    //        groupId
    //        userId
    //        icon（私聊时，这个icon就是好友的头像）
    //        title(私聊时，就是好友的昵称)
    //        content（私聊时，和好友聊天的最后一条消息内容）
    //        time
    //        sendTimeTS
    //3、首页 获取消息列表
    //    并且监听消息列表的更新  ， 监听的条件 userId 是自己
    //    监听到返回结果，去对比、添加、替换 等等 刷新列表
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that.setData({
      userInfo:getApp().globalData.userInfo,
      openid: getApp().globalData.userInfo._openid
    })
    console.log('hhh',getApp().globalData.userInfo);
    
    // that.getCitys();
    that.getAddressBook();
    that.getMsgList();
    that.initOperationList();
    that.getGrade();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  initOperationList(){
    var list = [];
    for(var i =0;i<2;i++){
      var item = {};
      if(i==0){
        item.imageUrl = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3861253449,1777174108&fm=26&gp=0.jpg",//群聊的图标
        item.text = "发起群聊";
      }
      if(i==1){
        item.imageUrl = "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2135159063,1441198696&fm=26&gp=0.jpg",//添加好友
        item.text = "添加好友";
      }
      list.push(item);
    }

    that.setData({
      operationList:list,
    })
  },

  tabChange(e) {
    console.log('tab change', e);
    that.setData({
      title:e.detail.item.text,
      currentIndex:e.detail.index,
    })
},
onChoose(e) {
  console.log('onChoose', e)
  wx.navigateTo({
    url: '../user/userInfo?openid=' + e.detail.item.openid + '&nickName=' + e.detail.item.name + '&avatarUrl=' + e.detail.item.avatarUrl,
  })
},
getMsgList(){
  // var msg = {};
  // msg.icon='';
  // msg.title='昵称';
  // msg.time = '2021-05-20 18.00';
  // msg.text= '内容';

  // that.data.msgList.push(msg);
  // that.setData({
  //   msgList:that.data.msgList
  // })
  console.log("before get message list",getApp().globalData.userInfo._openid);
  db.collection('sys_msg')
  .where({
    data:{
      _openid: _.all([getApp().globalData.userInfo._openid])
    }
  })
  .orderBy('sendTimeTS','desc')
  .get()
  .then(res=>{
    console.log('sys_msg',res);
    if(res.data.length>0){
      console.log('msg list success',res);
      const msgs = [...that.data.msgList];
      for(var i = 0 ;i<res.data.length;i++){
        res.data[i].time = dateFormatUtil.formatTimeStampToBefore(res.data[i].time)
        var msg = res.data[i];
        console.log("123",msg,that.data.userInfo._openid);
        if(msg.type==1){
          //如果是聊天消息
          var icon = "";
          var title= "";
            icon = msg.users[1].avatarUrl;
            title = msg.users[1].nickName;
            if(msg.users[0]._openid!=that.data.userInfo._openid){
                icon = msg.users[0].avatarUrl;
                title = msg.users[0].nickName;
            }
          //下面这几行代码稍微改一下，改成了上面的暂时没啥事儿。
          // if(msg.users[0]._openid==that.data.userInfo._openid){
          //   icon = msg.users[1].avatarUrl;
          //   title = msg.users[1].nickName;
          // }else{
          //   icon = msg.users[0].avatarUrl;
          //   title = msg.users[0].nickName;
          // }
          msg.icon = icon;
          msg.title = title;
        }
        if(msg.type==2){
          var icon = "https://img1.baidu.com/it/u=1363149554,3491312364&fm=26&fmt=auto&gp=0.jpg";//群聊的一个头像
          var content = msg.content;
          if(msg.creator._openid==that.data.userInfo._openid){
            //如果发起群聊的是当前用户
            if(msg.childType == 'chat_sys'){
              //如果群聊中的消息是系统聊天消息
              content = '您 ' + content;
              //如果是删除群聊成员
              if(msg.groupType=='group_delete'){
                content = "";
                content = "您将 " + msg.content +" 移出群聊";
              }
              //如果是添加群聊成员
              if(msg.groupType=='group_add'){
                content = "";
                content = "您邀请 " + msg.content +" 加入群聊";
              }
              //如果是退出者
              if(msg.groupType=='group_quit'){
                if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                  content = '您已退出群聊';
                }else{
                  content = msg.content +'退出群聊';
                }
              }
            }
          }else{
            var str = msg.creator.nickName +": ";
            console.log('nickName 是：',msg.creator.nickName);
            if(msg.childType=='chat_sys'){
              str = msg.creator.nickName +" ";
            }
            content = str + content;
            if(msg.childType =='chat_sys'&&msg.groupType=='group_delete'){
              //被移除人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '';
                content = "您被 " +msg.creator.nickName +'移出群聊';
              }else{
              // 其他群成员
              content =  msg.creator.nickName+' 将 ' +msg.content +'移出群聊'; 
              }

            }
            if(msg.childType =='chat_sys'&&msg.groupType=='group_add'){
              content = '';
              //被邀请人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '';
                content = msg.creator.nickName +'邀请您 '+'加入群聊';
              }else{
              // 其他群成员
              content =  msg.creator.nickName+' 邀请 ' +msg.content +'加入群聊'; 
              }

            }
            if(msg.childType =='chat_sys'&&msg.groupType=='group_quit'){
              content = '';
              //退出人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '您已退出群聊';
              }else{
              // 其他群成员
              content =  msg.content +'退出群聊'; 
              }

            }
          }
          msg.content = content;
            msg.icon = icon;
        }
      }
      that.setData({
        msgList:res.data
      })
      console.log('that.data.msgList',that.data.msgList);
    }

    that.initWatch();
  }).catch(err=>{

  })
},

clickMsg(e){
  var index = e.currentTarget.dataset.index;
  var msg =that.data.msgList[index];
  var chatType = '';
  if(msg.type==1||msg.type==2){
    chatType = "&chatType="+msg.type;
  }
  var title = msg.title;
  if(msg.type==2){
    title = "群聊("+msg.userIds.length+")"; 
    console.log("群聊：",msg.userIds.length);
  }
  wx.navigateTo({
    url: '../im/room/room?title='+title+'&groupId='+msg.groupId + chatType,
  })
},
/**
 * push_msg(1、暂时只有删除群成员，给删除的群成员发推送消息；2、群成员退出群聊，给退出成员发送推送消息)
 * type 类型 1、系统消息 2、聊天消息
 * groupId
 * groupType group_delete group_quit 
 * userId
 * arrive 是否已经接收到消息（如果用户没有打开小程序，那么不会收到推送信息）
 */
initWatchPush(){
  var timeTS = Date.now();
  if(that.data.msgList.length>0){
    timeTS = that.data.msgList[0].sendTimeTS;
  }
  console.log('启动推送消息监听',timeTS);
  console.log(that.data.openid,timeTS);
  console.log(that.data);
  db.collection('push_msg')
  // 筛选语句
  .where({
    userId:that.data.userInfo._openid,
    sendTimeTS:_.gt(timeTS)
  })
  // 发起监听
  .watch({
    onChange: function(snapshot) {
      console.log('接收推送消息监听',snapshot);
      const msgs = [...that.data.msgList]
      for (const docChange of snapshot.docChanges) {
        switch (docChange.dataType) {
          case 'add':
          case 'update': {
            const ind = msgs.findIndex(msg => msg.groupId === docChange.doc.groupId)//查询是否有更新的消息，如果有id会相同
              docChange.doc.time = that.js_data_time(docChange.doc.time);
              var pushMsg = docChange.doc;
              console.log("123",msg,that.data.userInfo._openid);
              if(ind >-1){
                //如果是聊天类型
                if(pushMsg.type==2){
                  //如果是主动退出群聊，删除消息列表中消息
                  if(pushMsg.groupType=='group_quit'){
                    msgs.splice(ind,1);
                  }
                  //如果是被移出群聊，不删除消息列表中消息，添加一个被删除标记
                  if(pushMsg.groupType=='group_delete'){
                    msgs[ind].content = '您被'+msgs[ind].creator.nickName+'移出群聊';
                    msgs[ind].groupType = 'group_delete';
                  }
                }
              }
             break
          }
        }
      }
      that.setData({
        msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
      })
    },
    onError:function(err){

    }
  
   
  })
},
 
initWatch(){
  var timeTS = Date.now();
  if(that.data.msgList.length>0){
    timeTS = that.data.msgList[0].sendTimeTS;
  }
  console.log('启动消息列表监听',timeTS);
  console.log(that.data.openid,timeTS);
  console.log(that.data);
  db.collection('sys_msg')
  // 筛选语句
  .where({
    userIds:_.all([that.data.userInfo._openid]),
    sendTimeTS:_.gt(timeTS)
  })
  // 发起监听
  .watch({
    onChange: function(snapshot) {
      console.log('snapshot', snapshot)
      const msgs = [...that.data.msgList]
        for (const docChange of snapshot.docChanges) {
          switch (docChange.dataType) {
            case 'add':
            case 'update': {
              const ind = msgs.findIndex(msg => msg._id === docChange.doc._id)//查询是否有更新的消息，如果有id会相同
              docChange.doc.time = that.js_data_time(docChange.doc.time);
              var msg = docChange.doc;
        console.log("123",msg,that.data.userInfo._openid);
        if(msg.type==1){
          //如果是聊天消息
          var icon = "";
          var title= "";
            icon = msg.users[1].avatarUrl;
            title = msg.users[1].nickName;
            if(msg.users[0]._openid!=that.data.userInfo._openid){
                icon = msg.users[0].avatarUrl;
                title = msg.users[0].nickName;
            }
          //下面这几行代码稍微改一下，改成了上面的暂时没啥事儿。
          // if(msg.users[0]._openid==that.data.userInfo._openid){
          //   icon = msg.users[1].avatarUrl;
          //   title = msg.users[1].nickName;
          // }else{
          //   icon = msg.users[0].avatarUrl;
          //   title = msg.users[0].nickName;
          // }
          msg.icon = icon;
          msg.title = title;
        }
        if(msg.type==2){
          var icon = "https://img1.baidu.com/it/u=1363149554,3491312364&fm=26&fmt=auto&gp=0.jpg";//群聊的一个头像
          var content = msg.content;
          if(msg.creator._openid==that.data.userInfo._openid){
            //如果发起群聊的是当前用户
            if(msg.childType == 'chat_sys'){
              //如果群聊中的消息是系统聊天消息
              content = '您 ' + content;
              //如果是删除群聊成员
              if(msg.groupType=='group_delete'){
                content = "";
                content = "您将 " + msg.content +" 移出群聊";
              }
              //如果是添加群聊成员
              if(msg.groupType=='group_add'){
                content = "";
                content = "您邀请 " + msg.content +" 加入群聊";
              }
              //如果是退出者
              if(msg.groupType=='group_quit'){
                if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                  content = '您已退出群聊';
                }else{
                  content = msg.content +'退出群聊';
                }
              }
            }
          }else{
            var str = msg.creator.nickName +": ";
            console.log('nickName 是：',msg.creator.nickName);
            if(msg.childType=='chat_sys'){
              str = msg.creator.nickName +" ";
            }
            content = str + content;
            if(msg.childType =='chat_sys'&&msg.groupType=='group_delete'){
              //被移除人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '';
                content = "您被 " +msg.creator.nickName +'移出群聊';
              }else{
              // 其他群成员
              content =  msg.creator.nickName+' 将 ' +msg.content +'移出群聊'; 
              }

            }
            if(msg.childType =='chat_sys'&&msg.groupType=='group_add'){
              content = '';
              //被邀请人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '';
                content = msg.creator.nickName +'邀请您 '+'加入群聊';
              }else{
              // 其他群成员
              content =  msg.creator.nickName+' 邀请 ' +msg.content +'加入群聊'; 
              }

            }
            if(msg.childType =='chat_sys'&&msg.groupType=='group_quit'){
              content = '';
              //退出人
              if(msg.opIds.indexOf(that.data.userInfo._openid)>=0){
                content = '您已退出群聊';
              }else{
              // 其他群成员
              content =  msg.content +'退出群聊'; 
              }

            }
          }
          msg.content = content;
            msg.icon = icon;
        }
              if (ind > -1) {
                msgs.splice(ind, 1, docChange.doc)//查询到的话，直接替换掉消息
                console.log("1");
              } else {
                msgs.push(docChange.doc)//如果没有，将这个消息加进来
                console.log("2");
              }
              break
            }
          }
        }
        that.setData({
          msgList: msgs.sort((x, y) => y.sendTimeTS - x.sendTimeTS),
        })
    },
    onError: function(err) {
      console.error('the watch closed because of error', err)
    }
  })
},

js_data_time(time){//将时间的格式转化为字符串形式
  var date = new Date(time);
  var y = date.getFullYear();
  var m = date.getMonth()+1;
  var d = date.getDate();
  var h = date.getHours();
  var s = date.getSeconds();
  var min = date.getMinutes();
  m = m<10 ? ('0'+m):m;
  d = d<10 ? ('0'+d):d;
  h = h<10 ? ('0'+h):h;
  s = s<10 ? ('0'+s):s;
  min = min<10? ('0'+min):min
  return y+"-"+m+"-"+d+" "+h+":"+min+":"+s
},

clickCircle(){
  wx.navigateTo({
    url: '../circle/list?friendIds=' + JSON.stringify(that.data.friendIds),
  })
},

dailyCheck(){
  var date = new Date();
  var strDate = JSON.stringify(date);
  var lastCheckTime = "" ;
  var isCheck=false;
  db.collection('user')
  .where({
    _openid:that.data.userInfo._openid
  }).get()
  .then(res=>{
     lastCheckTime =res.data[0].lastCheckTime;
     console.log(strDate,lastCheckTime);
     
     for(var i=0;i<11;i++){
      if(lastCheckTime[i]!=strDate[i]){
        isCheck=false;
        break;
      }
      if(i==10&&lastCheckTime[i]==strDate[i]){
        wx.showToast({
          title: '今天已经打过卡咯',
        })
        isCheck=true;
      }
     
    }
    if(!isCheck){
      wx.navigateTo({
        url: "../dailyCheck/dailyCheck01" ,
      })
    }
  })
  
  
},

clickMap(){
  wx.navigateTo({
    url: '../map/map' ,
  })
},

getAddressBook(e){
  db.collection('address_book').where({
    _openid:that.data.userInfo._openid
  })
  .get()
  .then(res=>{
    console.log("addressbook",getApp().globalData.userInfo._openid,res);
    if(res.data.length>0){
      console.log('yes');
      var friendList = res.data;
      //下面是个假数据，不要管它
      // var fakeFriend={
      //   nickName:"假好友",
      //   pinyin:['jia','hao','you']
      // };
      // friendList.push(fakeFriend); 
     //上面是个假数据，不要管它
      const _this = this
      friendList.sort((c1, c2) => {
        let pinyin1 = c1.pinyin.join('')
        let pinyin2 = c2.pinyin.join('')
        return pinyin1.localeCompare(pinyin2)
      })
      // 添加首字母
      const map = new Map()
      for (const friend of friendList) {
        const alpha = friend.pinyin[0].charAt(0).toUpperCase()
        if (!map.has(alpha)) map.set(alpha, [])
        map.get(alpha).push({ //在这里上传了点击好友后返回的内容
          name: friend.nickName,
          avatarUrl:friend.avatarUrl,
          openid:friend.friend_id,//这里我改过了，把_openid改成了friend_id,目前没什么事儿
         })
      }
  
      const keys = []
      for (const key of map.keys()) {
        keys.push(key)
      }
      keys.sort()
  
      const listFriend = []
      for (const key of keys) {
        listFriend.push({
          alpha: key,
          subItems: map.get(key)
        })
      }

      _this.setData({
        listFriend
      })
    }
  })
  .catch(err=>{

  })
},

// getCitys() {
//   const _this = this
//   const cities = res.result[0]
//       // 按拼音排序
//       cities.sort((c1, c2) => {
//         let pinyin1 = c1.pinyin.join('')
//         let pinyin2 = c2.pinyin.join('')
//         return pinyin1.localeCompare(pinyin2)
//       })
//       // 添加首字母
//       const map = new Map()
//       for (const city of cities) {
//         const alpha = city.pinyin[0].charAt(0).toUpperCase()
//         if (!map.has(alpha)) map.set(alpha, [])
//         map.get(alpha).push({ name: city.fullname })
//       }
  
//       const keys = []
//       for (const key of map.keys()) {
//         keys.push(key)
//       }
//       keys.sort()
  
//       const listCity = []
//       for (const key of keys) {
//         listCity.push({
//           alpha: key,
//           subItems: map.get(key)
//         })
//       }

//       _this.setData({listCity})
// },
addFriend(){
  if(that.data.showOperationPannel){//如果面板已经显示了，再点击一次就将它隐藏
    that.setData({
      showOperationPannel:false,
    })
  }else{
    that.setData({
      showOperationPannel:true,
    })
  }
  // wx.navigateTo({
  //   url: '../search/search',
  // })
},

clickOperationItem(e){
  var index = e.currentTarget.dataset.index;
  if(index==0){
    //跳转发起群聊页面
    wx.navigateTo({
      url: '../chatgroup/create',
    })
  }
  if(index==1){
    //跳转添加好友页面
      wx.navigateTo({
      url: '../search/search',
    })
  }
  that.setData({
    showOperationPannel:false,
  })
},

getGrade(){
  var tempGrade=0;
  console.log('get grade',that.data.userInfo);
  db.collection('user').where({
    nickName:that.data.userInfo.nickName
  }).get()
  .then(res=>{
    console.log('res.data',res.data);
    tempGrade = res.data[0].grade;
    that.setData({
      grade:tempGrade
    })
  })
},

clickRank(){
  wx.navigateTo({
    url: '../rankList/rankList',
  })
},
aboutUs(){
  wx.navigateTo({
    url: '../aboutUs/aboutUs',
  })
},

})
