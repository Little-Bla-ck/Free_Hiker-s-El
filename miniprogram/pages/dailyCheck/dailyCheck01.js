// pages/dailyCheck/dailyCheck01.js
var db = wx.cloud.database();
var that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    haveAnswered:0,
    userInfo:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that  = this;
    that.setData({
      userInfo:getApp().globalData.userInfo
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
  clickAnswer(e){
    // that.setData({
    //   haveAnswered:haveAnswered+1,
    // })
    
    var index = e.currentTarget.dataset.index;
    console.log(e.currentTarget.dataset.index);
    for(var i =0;i<4;i++){
      for(var j=0;j<4;j++){
        if(that.data.haveAnswered==i && index==j){
          db.collection('user')
          .where({
            _openid:that.data.userInfo._openid
          }).get()
          .then(res=>{
            var grade = res.data[0].grade +100-25*index;
            console.log( res.data[0].grade +100-25*index);
            db.collection('user').where({
              _openid:that.data.userInfo._openid
            })
            .update({
              data:{
                grade:grade
              }
            }).then(res=>{
              console.log('update grade success',res);
            })
            console.log(res.data[0]);
          })
          break;
        }
      }
    }
    that.data.haveAnswered = that.data.haveAnswered+1;
    that.setData({
      haveAnswered:that.data.haveAnswered
    })
    if(that.data.haveAnswered==5){
      var checkTime = new Date();
      var strCheckTime = JSON.stringify(checkTime);
      console.log("strCheckTime",strCheckTime);
      db.collection('user')
      .where({
        _openid:that.data.userInfo._openid
      })
      .update({
        data:{
          lastCheckTime:strCheckTime
        }
      }).then(res=>{
        console.log("chectime update success",res);
      }).catch(err=>{
        console.log("what is wrong",err);
      })
      

      console.log("每日打卡完成",strCheckTime);
      wx.navigateBack({
        delta: 1,
      })
    }
  }
})