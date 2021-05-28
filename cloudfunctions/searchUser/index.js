// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const{
    key
  } = event;
  return db.collection('user').where({//在“user”中的“nickname”中查询“key”
    nickName: db.RegExp({
      regexp: key,
      options: 'i',
    })
  }).get()
  .then(res=>{
    console.log("success",res);
    return {
      code:200,
      data:res.data
    }
  }).catch(err=>{
    console.log("fail",err);
    return {
      code:201,
      errMsg:err.errMsg
    }
  })
    
}