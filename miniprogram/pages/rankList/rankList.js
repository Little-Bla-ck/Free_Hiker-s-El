// pages/rankList/rankList.js
var db = wx.cloud.database();
var that;
var _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList:[],
    userInfo:null,
    yourRank:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.getRankList();
    that.setData({
      userInfo:getApp().globalData.userInfo
    })
    that.setData({
      userInfo:that.data.userInfo
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

  getRankList(){
    var tempRankList = [];
    db.collection('user')
    .where({
      
        grade:_.gte(0)
      
    })
    
    .orderBy('grade','desc')
    .get()
    .then(res=>{
      console.log('data get success',res);
      tempRankList = res.data;
      that.setData({
        rankList:res.data
      })
      for(var i = 0;i<res.data.length;i++){
        if(res.data[i]._openid==that.data.userInfo._openid){
          that.setData({
            yourRank:i+1
          })
          break;
        }
      }
      console.log('tempRankList',tempRankList);
    })
    
    
    console.log('rankList',that.data.rankList);
  },
})