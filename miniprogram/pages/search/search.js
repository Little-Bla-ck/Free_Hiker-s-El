import pinyin from 'wl-pinyin'
var db = wx.cloud.database();
Page({
  data: {
      inputShowed: false,
      inputVal: ""
  },
  onLoad() {
      this.setData({
          search: this.search.bind(this)
      })
  },
  search: function (value) {
    console.log(value);
    if(value.trim().length==0){
      return
    }
      return wx.cloud.callFunction({
        name:'searchUser',
        data:{
          key:value
        }
      }).then(res=>{
        console.log("search success",res);
        var result = [];
        if(res.result.data.length>0){
          for(var i=0;i<res.result.data.length;i++){
            var item = {};
            item.text = res.result.data[i].nickName;
            item.value = i+1;
            item.user = res.result.data[i];
            item.user.pinyin=pinyin.getPinyin(item.text).split(' ');
            console.log(pinyin.getPinyin(item.text));
            result.push(item);
          }
          return result;
        }
      }).catch(err=>{
        console.log("search fail",err);
      })
  },
  selectResult: function (e) {
      console.log('select result', e.detail)
      db.collection('address_book').where({
        _openid:getApp().globalData.userInfo._openid,
        friend_id:e.detail.item.user._openid
      }).count()
      .then(res=>{
        console.log("查找完了",res);
        if(res.total>0){
          wx.showToast({
            title: '当前用户已经在通讯录',
            icon:'none',
          })
        } else{
          db.collection('address_book').add({
            data:{
              friend_id:e.detail.item.user._openid,
            nickName:e.detail.item.user.nickName,
            avatarUrl:e.detail.item.user.avatarUrl,
            pinyin:e.detail.item.user.pinyin,
            time: new Date()
            }
          }).then(res=>{
            wx.showToast({
              title: '添加用户到通讯录成功',
            })
          }).catch(err=>{

          })
        }
      }).catch(err=>{

      })
  },
});