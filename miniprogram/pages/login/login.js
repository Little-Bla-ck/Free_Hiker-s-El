// pages/login/login.js
var that ;
var db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (!getApp().globalData.userInfo) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // if(wx.getUserProfile){
    //   // wx.navigateTo({
    //   //   url: '../home/home',
    //   // })
    //   wx.getUserProfile({
    //     desc: 'desc',
    //     success:(res) => {
    //       console.log('w',res);
          
    //       that.setData({
    //         userInfo:res.userInfo,
    //       })
    //       console.log("login onload1",this.userInfo);
    //     }
        
    //   })
      
    //   // that.setData({
    //   //   userInfo:getApp().globalData.userInfo,
    //   // })
    // }
    // wx.getStorage({
    //   key:'userInfo',
    //   success(res){
    //     console.log('get storage success',JSON.parse(res.data));
    //     wx.navigateTo({
    //       url:'../circle/list',
    //     })
    //     that.setData({
    //       userInfo:JSON.parse(res.data)
    //     })
    //   }
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
  bindGetUserInfo:function(e){
    var that = this;
    console.log(e);
    if(true){
      wx.getUserProfile({
        desc: 'desc',
        success:(res)=>{
          console.log("profile success",res);
          that.setData({
            userInfo:res.userInfo,
            
          })
          getApp().globalData.userInfo=res.userInfo;
          that.addUser(res.userInfo);
          wx.navigateTo({
            url: '../home/home',
          })
        }
      })
      
    }else{
      wx.showToast({
        icon:'none',
        title: '拒绝授权',
      })
    }
    // wx.getUserProfile({
    //   //获取登录信息成功
    //   success: (e) =>{
    //     if(e.userInfo){
    //        wx.setStorage({
    //          data:JSON.stringify(e.userInfo),
    //           key:'userInfo',
    //           success(res){
    //             console.log('set storage success',res);
    //             that.addUser(e.userInfo);

    //           }
    //        })
           
    //        wx.getStorage({
    //          key:'userInfo',
    //          success(res){
    //            console.log('get storage success',JSON.parse(res.data));
    //            that.setData({
    //              userInfo:JSON.parse(res.data)
    //            })
    //          }
    //        })
    //     }else{
    //       //获取登录信息失败
    //     }
    //     console.log(e)

    //   },
    //   desc: 'desc',
    // })
    // console.log("bindGetUserInfo",e)
  },
  addUser(userInfo){
    getApp().globalData.userInfo=userInfo;
    wx.showLoading({
      title: '正在登录...',
    })
    wx.cloud.callFunction({
      name:'login',
      data:userInfo
    }).then(res=>{
      console.log('callFunction success',res);
      if(res.result.code==200){
        userInfo._openid = res.result.userInfo._openid;
      }
      if(res.result.code==201){
        userInfo._openid = res.result._openid;
      }
      wx.getStorage({
        data:JSON.stringify(userInfo),
        key:"userInfo",
        success(res){
           
           console.log("ok");
           wx.hideLoading({
             success: (res) => {
               console.log("enenen");
             },
           })
          //  wx.navigateTo({
          //   url: '../circle/list',
          //  })

        }

      })
      // wx,wx.navigateTo({
      //   url: '../circle/list',
        
      //   success: (result) => {},
      //   fail: (res) => {},
      //   complete: (res) => {},
      // })
    })
    // db.collection('user').add({
    //   data:{
    //     nickName:userInfo.nickName,
    //     avatarUrl:userInfo.avatarUrl,
    //     gender:userInfo.gender,
    //     time: new Date()
    //   }

    // })
    // .then(res => {
    //   console.log('add user success',res)
    // })
    // .catch(console.error)

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})