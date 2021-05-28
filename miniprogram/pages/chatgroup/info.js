// pages/chatgroup/info.js
import pinyin from 'wl-pinyin'
var db = wx.cloud.database()
var _ = db.command
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId: '',
    groupInfo: null,
    members: [],
    membersMap: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      groupId: options.groupId,
    })
    that.getMemberList();
    // that.data.members.push(1)
    // that.data.members.push(1)
    // that.data.members.push(1)
    // that.data.members.push(1)
    // that.data.members.push(1)

    // that.setData({
    //   members:that.data.members
    // })
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
  clickMemberAdd(){
    // 添加群成员
    // 将群组 成员列表ids传递过去
    var memberIds = [];
    for(var i=0; i<that.data.members.length; i++){
      if(that.data.members[i].type==1){
        memberIds.push(that.data.members[i]._openid);
      }
    }
    memberIds = JSON.stringify(memberIds);
    wx.navigateTo({
      url: '../chatgroup/create?type=1&groupId=' + that.data.groupId
      + "&memberIds=" + encodeURIComponent(memberIds),
    })
  },
  clickMemberDelete(){
    // 删除群成员
    // 将群成员列表传递过去
    var memberList = [];
    for(var i=0; i<that.data.members.length; i++){
      if(that.data.members[i].type==1){
        if(that.data.members[i]._openid == getApp().globalData.userInfo._openid){
          continue;
        }
        var member = {};
        member.friend_id = that.data.members[i]._openid;
        member.avatarUrl = that.data.membersMap[member.friend_id].avatarUrl;
        member.nickName = that.data.membersMap[member.friend_id].nickName;
        member.pinyin = pinyin.getPinyin(member.nickName).split(' ');

        memberList.push(member);
      }
    }

    var memberListStr = JSON.stringify(memberList);
    wx.navigateTo({
      url: '../chatgroup/create?type=2&groupId=' + that.data.groupId
      + "&memberList=" + encodeURIComponent(memberListStr),
    })
  },
  getMemberInfo(ids) {
    db.collection('user')
      .where({
        _openid: _.in(ids)
      })
      .get()
      .then(res => {
        for (var i = 0; i < res.data.length; i++) {
          that.data.membersMap[res.data[i]._openid] = res.data[i];
        }

        that.setData({
          membersMap: that.data.membersMap
        })
      })
  },
  getMemberList() {
    db.collection('chat_group')
      .where({
        _id: that.data.groupId
      })
      .get()
      .then(res => {
        that.setData({
          members:[],
          groupInfo: res.data[0]
        })
        for (var i = 0; i < res.data[0].chat_members.length; i++) {
          var member = {};
          member.type = 1; // type=1 正常显示的群成员
          member._openid = res.data[0].chat_members[i];

          that.data.members.push(member);
        }
        for (var i = 0; i < 2; i++) {
          var member = {};
          if(i==0){
            member.type = 3; // type=3 添加的加号按钮
          }
          if(i==1){
            member.type = 4; // type=4 删除的减号按钮
          }
          that.data.members.push(member);
        }
        // 用群成员的数量对5取余数，然后5-余数，就是占位item的数量
        var count = that.data.members.length % 5;
        if (count != 0) {
          count = 5 - count;
          for (var i = 0; i < count; i++) {
            var member = {};
            member.type = 2; // type=2 占位item
            that.data.members.push(member);
          }
        }

        that.setData({
          members: that.data.members
        })

        that.getMemberInfo(res.data[0].chat_members)

      })
  },
  
  setGroupName(name, timeTS){
    that.data.groupInfo.name = name;
    that.setData({
      groupInfo: that.data.groupInfo
    })
    // 4.修改群名时，除了群主，给群组其他成员发送未读数
    for(var id of that.data.members){
      if(id != getApp().globalData.userInfo._openid){
        that.updateUnreadCount(that.data.groupId, id, timeTS);
      }
    }
  },
  clickGroupName(){
    var name = '';
    if(that.data.groupInfo.name){
      name = '&name=' + that.data.groupInfo.name;
    }
    wx.navigateTo({
      url:'../chatgroup/editName?groupId=' + that.data.groupId + name
    })
    /**
     * 修改群名分析
     * 1.从groupInfo中获取name，如果没有群名显示未命名，info.wxml
     * 
     * 2.跳转修改群名页面，传递name，如果没有name 则不传递
     *  接收name
     * 
     * 3.修改群名
     *  1).修改群名
     *    chat_group
     *    where groupid
     *    update name
     *  2).修改群名成功后，发送一条系统聊天消息，谁 修改群名为“name”
     *    var time = new Date();
          var timeTS = Date.now();
          const doc = {
            _id: `${Math.random()}_${timeTS}`,
            groupId: groupId,
            msgType: 'sys',
            textContent: '发起群聊',
            sendTime: time,
            sendTimeTS: timeTS, // fallback
            creatorName: getApp().globalData.userInfo.nickName
          }
          db.collection('chat_msg').add({
            data: doc,
          })
     *  3).发送系统聊天消息成功后，修改消息列表中消息
          sys_msg
          where groupid
          update 
          updateSysMsg(text, time, timeTS) {
          db.collection('sys_msg')
            .where({
              type: this.data.chatType,
              groupId: this.data.groupId,
            })
            .update({
              data: {
                content: text,
                time: time,
                sendTimeTS: timeTS,
                childType:''
              }
            })
     */
  },
  clickQuit(){
    var groupType = 'group_quit';
    that.updateGroupMembers(groupType, [getApp().globalData.userInfo._openid], getApp().globalData.userInfo.nickName);
    console.log("we are here");
  },
  // updateGroupMembers(groupType, ids, title) {
  //   var doc = {};

  //     doc = {
  //       chat_members: _.pullAll(ids)
  //     }
    
  //   // 修改群成员
  //   db.collection('chat_group')
  //     .where({
  //       _id: that.data.groupId
  //     })
  //     .update({
  //       data:doc
  //     })
  //     .then(res => {
  //       console.log('updateGroupMembers', res)
  //       if (res.stats.updated == 1) {
  //         that.sendChatMsg(groupType, ids, title);
  //       }
  //     })
  // },

  // sendChatMsg(groupType, ids, title) {
  //   // 发送系统聊天消息
  //   // 为了统一删除和添加群成员，删除群成员的聊天消息，也合并成一条
  //   var time = new Date();
  //   var timeTS = Date.now();
  //   const doc = {
  //     _id: `${Math.random()}_${timeTS}`,
  //     groupId: that.data.groupId,
  //     msgType: 'sys',
  //     textContent: title,
  //     sendTime: time,
  //     sendTimeTS: timeTS, // fallback
  //     creatorName: getApp().globalData.userInfo.nickName,
  //     groupType: groupType,
  //     userIds: ids
  //   }
  //   db.collection('chat_msg').add({
  //       data: doc,
  //     })
  //     .then(res => {
  //       console.log('sendChatMsg', res)
  //       that.updateSysMsg(groupType, ids, title, time, timeTS);
  //     })
  // },
  // updateSysMsg(groupType, ids, text, time, timeTS) {
  //   // 修改消息列表中消息
  //   db.collection('sys_msg')
  //     .where({
  //       type: 2,
  //       groupId: that.data.groupId,
  //     })
  //     .update({
  //       data: {
  //         content: text,
  //         time: time,
  //         sendTimeTS: timeTS,
  //         childType: 'chat_sys',
  //         groupType: groupType,
  //         opIds: ids,
  //         userIds:_.pullAll([getApp().globalData.userInfo._openid])
  //       }
  //     })
  //     .then(res => {
  //       console.log('updateSysMsg', res)
  //       wx.hideLoading()
  //       that.sendPushMsg(groupType, time, timeTS);
  //       // 3.主动退出群聊时，除了退出者，给群组其他成员发送未读数
  //       for(var id of that.data.members){
  //         if(id != getApp().globalData.userInfo._openid){
  //           that.updateUnreadCount(that.data.groupId, id, timeTS);
  //         }
  //       }
  //       var pages = getCurrentPages();
  //       // 获取上个页面
  //       var prePage = pages[pages.length - 2];
  //       prePage.back();
  //       wx.navigateBack({
  //         delta: 1,
  //       })
  //     })
  // },
  // updateUnreadCount(groupId, userId, timeTS){
  //   db.collection('unread_count')
  //     .where({
  //       groupId:groupId,
  //       userId:userId
  //     })
  //     .update({
  //       data:{
  //         count:_.inc(1),
  //         sendTimeTS:timeTS
  //       }
  //     })
  //     .then(res=>{
  //       if(res.stats.updated>0){
  //         // 如果更新成功，已经存在所属用户所属群组的未读数
  //       } else {
  //         // 如果更新失败，不存在所属用户所属群组的未读数，去创建
  //         that.sendUnreadCount(groupId, userId, timeTS)
  //       }
  //     })
  // },xxx
  // sendUnreadCount(groupId, userId, timeTS){
  //   db.collection('unread_count')
  //     .add({
  //       data:{
  //         type:2,
  //         groupId:groupId,
  //         userId:userId,
  //         count:1,
  //         sendTimeTS:timeTS
  //       }
  //     })
  // },xxx
  
  sendPushMsg(groupType, time, timeTS){
    console.log('sendPushMsg');
    db.collection('push_msg')
      .add({
        data:{
          type:2,
          groupId:that.data.groupId,
          time:time,
          sendTimeTS:timeTS,
          groupType:groupType,
          userId:getApp().globalData.userInfo._openid
        }
      })
      .then(res=>{
        console.log('sendPushMsg success', res);
      })
  },
  updateGroupMembers(groupType, ids, title) {
    var doc = {};
    if(groupType == 'group_delete'){
      doc = {
        chat_members: _.pullAll(ids)
      }
    }
    if(groupType == 'group_add'){
      doc = {
        chat_members: _.push(ids)
      }
    }
    // 修改群成员
    console.log("we are here 3",that.data.groupId);
    db.collection('chat_group')
      .where({
        _id: that.data.groupId
      })
      .update({
        data:{doc}
      })
      .then(res => {
        console.log(" we are here 2");
        if (res.stats.updated == 1) {
          that.sendChatMsg(groupType, ids, title);
        }
      })
  },
  sendChatMsg(groupType, ids, title) {
    // 发送系统聊天消息
    // 为了统一删除和添加群成员，删除群成员的聊天消息，也合并成一条
    var time = new Date();
    var timeTS = Date.now();
    const doc = {
      _id: `${Math.random()}_${timeTS}`,
      groupId: that.data.groupId,
      msgType: 'sys',
      textContent: title,
      sendTime: time,
      sendTimeTS: timeTS, // fallback
      creatorName: getApp().globalData.userInfo.nickName,
      groupType: groupType,
      userIds: ids
    }
    db.collection('chat_msg').add({
        data: doc,
      })
      .then(res => {
        console.log('sendChatMsg', res)
        that.updateSysMsg(groupType, ids, title, time, timeTS);
      })
  },
  updateSysMsg(groupType, ids, text, time, timeTS) {
    // 修改消息列表中消息
    db.collection('sys_msg')
      .where({
        type: 2,
        groupId: that.data.groupId,
      })
      .update({
        data: {
          content: text,
          time: time,
          sendTimeTS: timeTS,
          childType: 'chat_sys',
          groupType: groupType,
          opIds: ids,
          userIds:_.pullAll([getApp().globalData.userInfo._openid])
        }
      })
      .then(res => {
        console.log('updateSysMsg', res)
        wx.hideLoading()
        that.sendPushMsg(groupType, time, timeTS);
        // 3.主动退出群聊时，除了退出者，给群组其他成员发送未读数
        for(var id of that.data.members){
          if(id != getApp().globalData.userInfo._openid){
            that.updateUnreadCount(that.data.groupId, id, timeTS);
          }
        }
        var pages = getCurrentPages();
        // 获取上个页面
        var prePage = pages[pages.length - 2];
        prePage.back();
        wx.navigateBack({
          delta: 1,
        })
      })
  },
  
  /**
   * 群聊成员的添加、删除、删除并退出
   * 简化，只有群主才能添加、删除群成员 + -
   * 1.微信的添加成员
   *  群主添加群成员
   *    聊天消息(消息列表中消息内容一致)
   *      群主显示 您 邀请 谁 加入群聊
   *      被邀请人显示 群主 邀请 您 加入群聊
   *      其他成员显示 群主 邀请 被邀请人 加入群聊
   *    对应修改表的操作
   *      修改群聊的成员
   *      发送系统聊天消息
   *      修改系统消息列表消息
   * 
   *    邀请多人的时候，系统聊天消息，显示 群主邀请多人昵称组合加入群聊
   * 2.微信的删除成员
   *  群主删除群成员
   *    聊天消息(消息列表中消息内容一致)
   *      群主显示 您 将 谁 移出群聊
   *      被移出人显示 群主 将 您 移出群聊
   *      其他成员显示 群主 将 被移出人 移出群聊
   *    对应修改表的操作
   *      修改群聊的成员
   *      发送系统聊天消息
   *      修改系统消息列表消息
   * 
   *    移出多人的时候，系统聊天消息，显示 群主移出每个人的多条聊天消息
   * 系统聊天消息最后一条的移出信息显示在消息列表消息内容中
   * 
   * 3.删除并退出，不模仿微信，
   *  聊天消息(消息列表中消息内容一致)
   *      退出人 直接删除系统消息列表中消息
   *      其他人显示 退出人 退出群聊
  
   *    对应修改表的操作
   *      修改群聊的成员
   *      发送系统聊天消息
   *      修改系统消息列表消息
   * 
   * 
   */
})