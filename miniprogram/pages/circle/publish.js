// pages/circle/publish.js
const dateFormatUtil = require('../../utils/dateFormatUtil');
var db = wx.cloud.database();
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     content:'',
     textLength:0,
     sendType:-1,
     images:[],
     maxCount:9,
     images_upload_success:[],//图片上传成功后的云端图片地址数组
     images_upload_success_size:0,//图片上传成功的数量
     userInfo:null,
     groupId:'',
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       that=this;
       that.setData({
        userInfo:getApp().globalData.userInfo,
      })
       wx.getStorage({
         key:'userInfo',
         success(res){
           that.setData({
             userInfo:JSON.parse(res.data)
           })
         }
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
  bindInput(e){
    // that=this;
    that.setData({
      content:e.detail.value,
      textLength:e.detail.value.length
    })
  },
  chooseImage(){
    wx.chooseImage({
      count: that.data.maxCount,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images:res.tempFilePaths
        })
      }
    })
  },
  previewImage(e){
    wx.previewImage({
      current: that.data.images[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: that.data.images// 需要预览的图片http链接列表
    })
  },
  uploadImage(index){
    wx.cloud.uploadFile({
      cloudPath: 'circle_'+ new Date().getTime+"_"+Math.floor(Math.random()*1000)+".jpg",
      filePath: that.data.images[index], // 文件路径
      success: res => {
        // get resource ID
        console.log(res.fileID)
        that.data.images_upload_success[index]=res.fileID;
        that.data.images_upload_success_size=that.data.images_upload_success_size+1;
        if(that.data.images_upload_success_size==that.data.images.length){
          console.log("success:",that.data.images_upload_success);
          that.circleAdd();
        }else{
          that.uploadImage(index+1);
        }
      },
      fail: err => {
        that.setData({
          images_upload_success:[],
          images_upload_success_size:0,
        })
      wx.hideLoading()
        wx.showToast({
          icon:'none',
          title: '图片上传失败，请重试',
        })
        // handle error
      }
    })
  },
  clickSend(e){
    //如果文字填写内容为空，并且没有添加图片 给用户提示
    var type = e.currentTarget.dataset.index;
    that.setData({
      sendType:type
    })
    console.log('sendType',that.data.sendType);
    console.log('send',e);
    if(that.data.content.trim().length==0 && that.data.images.length==0){//.trim()是去除空格
      wx.showToast({
        title: '请发布点内容吧',
        icon:'none',
      })
      return;
    }
    wx.showLoading({
      title: '上传数据中。。。',
    })
    if(that.data.images.length>0){
      that.setData({
        images_upload_success:that.data.images
      })
      that.uploadImage(0)
    }else{
      that.circleAdd();//如果没有图片，直接调用circleAdd（）将朋友圈内容插入到数据库中
    }
  },
  circleAdd(e){
    if(that.data.sendType==1){
      var groupId;
      // 1.创建群聊
      var title = getApp().globalData.userInfo.nickName;
    db.collection('chat_group')
    .add({
      data: {
        type: 2,
        chat_members: [that.data.userInfo._openid]
      }
    })
    .then(res => {
      that.setData({
        groupId:res._id
      })
      groupId = res._id;
      console.log("res._id",res._id,that.data.groupId);
      db.collection('circle').add({
        data:{
          content:that.data.content,
          images:that.data.images_upload_success,
          time:new Date(),
          loveList:[],
          commentList:[],
          userInfo:that.data.userInfo,
          sendType:that.data.sendType,
          groupId:that.data.groupId
        }
      }).then(res=>{
        console.log("add circle success",res);
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        let pages = getCurrentPages();//获取当前的页面们
        let before = pages[pages.length-2];//获取列表页面索引
        before.refresh();//刷新列表页面
        wx.navigateBack({
          delta: 1,
        })
      }).catch(error=>{
        console.log("fail");
        wx.hideLoading()
      })
      // 2.创建群聊成功后，会向聊天中发送一个系统聊天消息(谁 发起群聊)
      var time = new Date();
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
      }).then(res => {
        // 3.消息列表中添加群聊消息
        that.addSysMsg('发起群聊', time, timeTS, groupId, [that.data.userInfo._openid], title);
      })
    })
    console.log("that.data.groupId",that.data.groupId);
    
    console.log(that.data.userInfo);

    }
    if(that.data.sendType==0){
//将发布的朋友圈信息添加进云端数据库
db.collection('circle').add({
  data:{
    content:that.data.content,
    images:that.data.images_upload_success,
    time:new Date(),
    loveList:[],
    commentList:[],
    userInfo:that.data.userInfo,
    sendType:that.data.sendType,
    groupId:''
  }
}).then(res=>{
  console.log("add circle success",res);
  wx.hideLoading()
  wx.showToast({
    title: '发布成功',
  })
  let pages = getCurrentPages();//获取当前的页面们
  let before = pages[pages.length-2];//获取列表页面索引
  before.refresh();//刷新列表页面
  wx.navigateBack({
    delta: 1,
  })
}).catch(error=>{
  console.log("fail");
  wx.hideLoading()
})
console.log(that.data.userInfo);

    }
    
    
  },

  addSysMsg(text, time, timeTS, groupId, ids, title) {
    db.collection('sys_msg')
      .add({
        data: {
          type: 2,
          groupId: groupId,
          userIds: ids,
          title: title,
          content: text,
          time: time,
          sendTimeTS: timeTS,
          unreadCount: 0,
          creator: getApp().globalData.userInfo,
          childType: 'chat_sys'
        }
      })
      .then(res => {
        console.log('add msg success', res)
        // 1.创建群组时，除了群主，给群组其他成员发送未读数
        // for(var id of ids){
        //   if(id != getApp().globalData.userInfo._openid){
        //     that.sendUnreadCount(groupId, id, timeTS);
        //   }
        // }
        wx.navigateTo({
          url: '../im/room/room?title=' + title +
            "&groupId=" + groupId + "&chatType=2",
        })
      })

  },
})