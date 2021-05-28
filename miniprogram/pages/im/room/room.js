const app = getApp()
var that;
Page({
  data: {
    title:'',
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'chat_msg',//聊天室的数据集合，存储消息
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '聊天室',
    userId:'',
    chatType:1,
    userAvatar:'',
    userNickName:'',
    chatTitle:'',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function(options) {
    that = this;
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      chatTitle:options.title
    })
    this.setData({
      avatarUrl:getApp().globalData.userInfo.avatarUrl,
      userInfo:getApp().globalData.userInfo,
      chatRoomGroupId:options.groupId,
      chatType:options.chatType,
      userId:options.userId,
      userAvatar:options.userAvatar,
      userNickName:options.userNickName,
      title:options.title,
    })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserProfile({
    //         desc: 'desc',
    //         success:(res)=>{
    //           this.setData({
    //             avatarUrl: res.userInfo.avatarUrl,
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })

    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          // this.setData({
          //   containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          // })
        }
      },
    })
  },

  getOpenID: async function() {
    // if (this.openid) {
    //   return this.openid
    // }

    // const { result } = await wx.cloud.callFunction({
    //   name: 'login',
    // })

    // return result.openid
    return getApp().globalData.userInfo._openid;//我们登录的时候就已经把信息存在globaldata里面了
  },

  onGetUserInfo: function(e) {
    this.setData({
      logged: true,
      avatarUrl: getApp().globalData.userInfo.avatarUrl,
      userInfo: getApp().globalData.userInfo
    })
    // if (!this.logged && e.detail.userInfo) {
    //   this.setData({
    //     logged: true,
    //     avatarUrl: e.detail.userInfo.avatarUrl,
    //     userInfo: e.detail.userInfo
    //   })
    // }
  },

  onShareAppMessage() {
    return {
      title: '即时通信 Demo',
      path: '/pages/im/room/room',
    }
  },

  back(){
    wx.navigateBack({
      delta: 1,
    })
  },

clickInfo(){
  /**
   * 1、里面有群组成员列表
   * 2、修改群聊名称
   * 3、删除并且退出
   */
  wx.navigateTo({
    url: '../../chatgroup/info?groupId='+that.data.chatRoomGroupId,
  })
}
})
