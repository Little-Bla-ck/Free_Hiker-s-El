// pages/user/userInfo.js
var that;
var db = wx.cloud.database();
var _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    nickName:null,
    avatarUrl:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    that = this;
    that.setData({
      openid:options.openid,
      nickName:options.nickName,
      avatarUrl:options.avatarUrl,
    })
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
  sendMsg(){
    var currentId = getApp().globalData.userInfo._openid;
    var friendId  = that.data.openid;
    console.log(friendId);
    //查询和好友的聊天群组是否存在，若存在，则直接进入聊天页面，若不存在，创建
    //type 1 私聊 2 群聊（用type来区分私聊和群聊）
    db.collection('chat_group')
    .where({
      type:1,
      chat_members:_.all([currentId, friendId]),
    }).get()
    .then(res=>{
      console.log("query success",res);
      if(res.data.length==0){
        //不存在,需要创建聊天群组
        db.collection('chat_group')
        .add({
          data:{
            type:1,
            chat_members:[currentId,friendId],
            time:new Date()
          }
        }).then(res=>{
          console.log("add success",res);
          wx.navigateTo({
            url: '../im/room/room?nickName='+that.data.nickName+'&groupId='+res._id + "&userId="+friendId+'&userAvatar='+ that.data.avatarUrl+'&userNickName='+that.data.nickName +"&chatType=1",
          })
        }).catch(err=>{

        })
      }else{
        //存在
        wx.navigateTo({
          url: '../im/room/room?nickName='+that.data.nickName+'&groupId='+res.data[0]._id+ "&userId="+friendId+'&userAvatar='+that.data.avatarUrl+'&userNickName='+that.data.nickName+"&chatType=1",
        })
      }
    })
    .catch(err=>{

    })
    
  }
})