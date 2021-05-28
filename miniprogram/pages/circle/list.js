// pages/circle/list.js
const dateFormatUtil = require('../../utils/dateFormatUtil')
var that;
var db=wx.cloud.database()
var _ = db.command
var _animation;//动画实体
var _animationIndex = 0;//动画执行次数index（当前执行了多少次）
var _animationIntervalId=-1;//动画定时任务id， 通过setInternal来达到无限旋转， 记录id，用于结束时任务
const _ANIMATION_TIME=300;//动画一次播放的时长（ms） 
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null,
      list:[],
      showOperationPannelIndex:-1,
      love:'赞',
      currentCircleIndex:-1,
      showCommentAdd:false,
      commentContent:'',
      heightBottom:'',
      refresh:false,
      loading:false,
      loadMore:false,
      haveMoreData:true,
      page:0,
      pageCount:10,
      reply:'',
      touchStartOperation:false,
      touchStartOperationPannel:false,
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;

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
    console.log('lallala',that.data.userInfo);

    // wx.getStorage({
    //   key:'userInfo',
    //   success(res){
    //     that.setData({
    //       userInfo:JSON.parse(res.data)
    //     })
    //   }
    // })

    // for(var i=1;i<10;i++){
    //   var circleData={};
    //   circleData.nickName="朋友-"+i;
    //   circleData.content="朋友发布内容-"+i;
    //   circleData.time="2021-5-5"+i;
    //   var imageList= [];
    //   var loveList=[];
    //   var commentList=[];
    //   circleData.imageList=imageList;
    //   circleData.loveList=loveList;
    //   circleData.commentList=commentList;
    //   for(var j=1;j<i;j++){
    //     imageList.push(j);
    //     var loveData={};
    //     loveData.nickName= '点赞-'+j;
    //     loveList.push(loveData);
    //     var commentData={};
    //     commentData.nickName='兰陵王-'+j+":";
    //     commentData.content="评论内容-"+j;
    //     commentList.push(commentData);
    //   }
    //   that.data.list.push(circleData);
    // }
    // that.setData({
    //   list:that.data.list
    // })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    _animationIndex=0;
    _animationIntervalId=-1;
    this.data.animation='';

    _animation=wx.createAnimation({
      delay: 0,
      duration:_ANIMATION_TIME,
      timingFunction:'linear',
      transformOrigin:'50% 50% 0'
    })

    that.refresh();
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
    if(that.data.loading){
      return;
    }else{
      that.setData({
        loadMore:true,
      })
      console.log('onreachbottom');
    }
    setTimeout(()=>{//延迟的时间，函数的调用会在该延迟之后发生，单位 ms。
      that.getList();
    },3000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showOperationPannel(e){
    console.log("showOperationPannel",e);
    var index=e.currentTarget.dataset.index;
    if(this.data.showOperationPannelIndex==index){
      that.setData({
        showOperationPannelIndex:-1
      })
    }else{
      that.setData({
        showOperationPannelIndex:index
      })
    }
  },
  clickLove(e) {
    var index = e.currentTarget.dataset.index;
    var circleData = that.data.list[index];
    var loveList = circleData.loveList;

    var isHaveLove = false;
    for (var i = 0; i < loveList.length; i++) {
      if (that.data.userInfo._openid == loveList[i]._openid) {
        isHaveLove = true;
        loveList.splice(i, 1);
        // 如果已经点赞，取消赞
        wx.cloud.callFunction({
            name: 'updateCircleLove',
            data: {
              type: 0,
              circleId: circleData._id
            }
          })
          .then(res => {
            console.log('取消赞成功', res)
          })
          .catch(err => {
            console.log('取消赞失败', err)
          })
        circleData.isLove = false;
        break;
      }
    }

    if (!isHaveLove) {
      loveList.push({
        nickName: that.data.userInfo.nickName,
        _openid: that.data.userInfo._openid
      });
      // 如果未点赞，去点赞
      wx.cloud.callFunction({
          name: 'updateCircleLove',
          data: {
            type: 1,
            circleId: circleData._id,
            nickName: that.data.userInfo.nickName
          }
        })
        .then(res => {
          console.log('点赞成功', res)
        })
        .catch(err => {
          console.log('点赞失败', err)
        })
      circleData.isLove = true;
    }

    that.setData({
      list: that.data.list,
      showOperationPannelIndex: -1
    })


  },

  clickComment(e){
    console.log("hhhh",e);
    that.setData({
      currentCircleIndex:e.currentTarget.dataset.index,
      showCommentAdd:true,
      showOperationPannelIndex:-1,
    })
    console.log(that.data.currentCircleIndex);
  },
    bindInput(e){
    that.setData({
      commentContent:e.detail.value,
    })
  },

  bindFocus(e){
    that.setData({
      heightBottom:e.detail.height,
    })
  },

  clickSend(e){
    var circleData=that.data.list[that.data.currentCircleIndex];
    var commentList=circleData.commentList;
    var commentData={};
    commentData.nickName=that.data.userInfo.nickName+":";
    commentData.content=that.data.commentContent;
    commentData._openid = that.data.userInfo._openid;
    commentData.reply = that.data.reply;
    if(that.data.reply.length>0){
      commentData.nickName= that.data.userInfo.nickName;
    }
    console.log(that.data.userInfo._openid);
    commentList.push(commentData)
    that.setData({
      list:that.data.list,
      showCommentAdd:false,
      commentContent:'',
      reply:'',//发布成功后，reply也要重置
    })
    db.collection('circle').doc(circleData._id).update({
      data:{
        commentList:_.push(commentData)
      }
    }).then(res=>{
         console.log("comment add success",res);
    }).catch(err=>{
         console.log("comment add fail",err);
    })
  },

  goPublish(){
     wx.navigateTo({
       url: 'publish',
     })
  },

  refresh(){
    if(that.data.loading){
      return
    }
    // wx.showLoading({
    //   title: '正在刷新...',
    // })
    that.setData({
      refresh:true,
    })
    that.startAnimationInterval();
    that.getList();
  },

  getList(){
    if(that.data.loading){
      return;
    }else{
      that.setData({
        loading:true,
      })
    }
    var currentPage = that.data.page;
    if(that.data.refresh){//如果是刷新，要设置请求页码为0（？）
      currentPage = 0;
    }
    db.collection('circle')
    .orderBy('time','desc')
    .skip(currentPage*that.data.pageCount)//分页
    .limit(that.data.pageCount)
    .get()//按时间降序排列，每次返回10条数据
    .then(res=>{
      if(that.data.refresh){//如果刷新了的话要清空列表，不然的话就会把之前的再次输出
        that.setData({
          list:[],
        })
      }
      if(res.data.length>0){
         for(var i =0;i<res.data.length;i++){
          res.data[i].isLove = false;
          for(var j=0;j<res.data[i].loveList.length;j++){
            if(that.data.userInfo._openid==res.data[i].loveList[j]._openid){
              
              /*去除这个位置的元素*/ //如果点过赞，改变islove状态
              res.data[i].isLove = true;

              break;
            }
          }

          res.data[i].time = dateFormatUtil.formatTimeStampToBefore(res.data[i].time)

           that.data.list.push(res.data[i])
         }
         that.setData({
           list:that.data.list,
           refresh:false,
           loading:false,
           page:currentPage+1,
         })
         that.stopAnimationInterval();
        //  wx.hideLoading();
         if(res.data.length==that.data.pageCount){
           that.setData({
             haveMoreData:true,
           })
           console.log("havemoredata");
         }else{
           that.setData({
           haveMoreData:false,
        })
        console.log("false");
         }
      }
        console.log("getList",res,that.data.haveMoreData,res.data.length);
    }).catch(error=>{
        console.log("getList error",error);
        that.stopAnimationInterval();
        that.setData({
          refresh:false,
          loading:false,
        })
        // wx.hideLoading();
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
    return y+"-"+m+"-"+d+" "+h+":"+m+":"+s
  },
  startAnimationInterval:function(){
    var that =this;
    that.rotateAni(++_animationIndex);//进行一次旋转
    _animationIntervalId = setInterval(function(){
      that.rotateAni(++_animationIndex);
    },_ANIMATION_TIME);//每隔_ANIMATION_TIME进行一次旋转
  },
  stopAnimationInterval:function(){
    if(_animationIntervalId>0){
      clearInterval(_animationIntervalId);
      _animationIntervalId=0;
    }
  },
  rotateAni:function(n){
    _animation.rotate(120*(n)).step()
    this.setData({
      animation:_animation.export()
    })
  },

  clickCommentItem(e){//点击评论列表条目
    var circleIndex = e.currentTarget.dataset.index; //获取评论所属的朋友圈信息index
    var commentIndex = e.currentTarget.dataset.commentindex; //获取评论在评论列表中的索引
    var circleData = that.data.list[circleIndex];
    var commentList = circleData.commentList;
    var commentData = commentList[commentIndex];
    var nickName =commentData.nickName;
    
    that.setData({
      currentCircleIndex:e.currentTarget.dataset.index,
      showCommentAdd:true,
      showOperationPannelIndex:-1,
      reply:nickName,
    })
    
  },

  bindTouchStart(e){
    //当触摸朋友圈列表视图时，隐藏评论输入框
    that.setData({
      showCommentAdd:false,
    })
    if(that.data.touchStartOperation||that.data.touchStartOperationPannel){

    }else{
      that.setData({
        showOperationPannelIndex:-1,
      })
    }
  },
  bindTouchStartOperation(e){
    //触摸操作按钮开始
    that.setData({
      touchStartOperation:true,
    })
  },
  bindTouchStartOperationPannel(e){
    that.setData({
      touchStartOperationPannel:true,
    })
    //触摸点赞和评论操作按钮开始
  },
  bindTouchEndOperation(e){
    //触摸操作按钮结束
    that.setData({
      touchStartOperation:false,
    })
    
  },
  bindTouchEndOperationPannel(e){
    //触摸点赞和评论操作按钮结束
    that.setData({
      touchStartOperationPannel:false,
    })
  },
  back(){
    wx.navigateBack({
      delta: 1,
    })
  },

  join(e){
    console.log('join',e);
    var index = e.currentTarget.dataset.index;
    var title;
    
    db.collection('chat_group').where({
      _id:that.data.list[index].groupId
    }).update({
      data:{
        chat_members:_.push(that.data.userInfo._openid)
      }
    })
    .then(res=>{
      console.log("加入活动",res.data);
      wx.navigateTo({
        url:  '../im/room/room?title=' + '碳中和活动' +
        "&groupId=" + that.data.list[index].groupId + "&chatType=2",
      })
    })
  }
})
