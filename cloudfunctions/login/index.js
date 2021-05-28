// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  const {
    nickName,
    avatarUrl,
    gender
  }=event;

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  //   env: wxContext.ENV,
  // }
  return db.collection('user').where({
    _openid:wxContext.OPENID
  }).get()
  .then(res=>{
    if(res.data.length>0){
      return {
        code:200,
        errMsg:'用户已存在',
        userInfo:res.data[0],
      }
    } else{
      return db.collection('user').add({
        data:{
          _openid:wxContext.OPENID,
          nickName:nickName,
          avatarUrl:avatarUrl,
          gender:gender,
          grade:0,
          lastCheckTime:'',
          time: new Date()
        }
      }).then(res=>{
        return{
          code:201,
          errMsg:'用户注册成功',
          _openid:wxContext.OPENID,
        }
      })

    }
  })
  // return db.collection('user').add({
  //   data:{
  //     _openid:wxContext.OPENID,
  //     nickName:nickName,
  //     avatarUrl:avatarUrl,
  //     gender:gender,
  //     time: new Date()
  //   }

  // })
}

