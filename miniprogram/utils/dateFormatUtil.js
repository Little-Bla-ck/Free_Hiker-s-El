// 转换时间戳格式 获取 几分钟、几小时、几天前
function formatTimeStampToBefore(time) {
  var result = '';
  // console.log('formatTimeStamp', time)
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var now = new Date().getTime();
  var diffValue = now - time;
  if (diffValue < 0) {
    console.log("时间不对劲,服务器创建时间与当前时间不同步");
    return result = "刚刚";
  }
  var dayC = diffValue / day;
  var hourC = diffValue / hour;
  var minC = diffValue / minute;
  // console.log(diffValue, dayC, hourC, minC)
  if (parseInt(dayC) > 30) {
    console.log('dayC', dayC, time.getTime())
    var year = time.getFullYear();
    // 获取当前月份的日期，不足10补0
    var month = (time.getMonth() + 1) < 10 ? "0" + (time.getMonth() + 1) : (time.getMonth() + 1);
    // 获取当前几号，不足10补0
    var daya = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    return year + "-" + month + "-" + daya;
    // result = "" + time.getFullYear() + "-" + time.getMonth() + "-" + time.getDate();
    // result = "" + this.$format(time.getTime(), "yyyy-MM-dd");
  } else if (parseInt(dayC) > 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (parseInt(dayC) == 1) {
    result = "昨天";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 5) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  // console.log('result', result)
  return result;
}

/**
 * js时间格式化工具
 * 
 * console.log(dateFormat('1980-02-03 22:22:22', 'yyyy年MM月dd日'))
 * console.log(dateFormat('1980-02-03T22:22:22', 'yyyy年MM月dd日'))
 * console.log(dateFormat('1573653506', 'yyyy年MM月dd日'))
 * console.log(dateFormat(1573653506, 'yyyy年MM月dd日'))
 * console.log(dateFormat(new Date(), 'yyyy年MM月dd日'))
 * console.log(getDateDiff('2019-11-14 14:10:50'))
 * console.log(getBeforeDate(-50))
 */

/**
 * 时间格式化
 * @param {*} inputDate  输入时间（string:dateS or string timestamp or number:timestamp）
 * @param {*} formatter  格式化类型，默认yyyy-MM-dd hh:mm:ss
 */
function dateFormat(inputDate, formatter = "yyyy-MM-dd hh:mm:ss") {
  let date = strToDate(inputDate);
  const o = {
      "M+": date.getMonth() + 1,  // 月
      "d+": date.getDate(),       // 日
      "h+": date.getHours(),      // 时
      "m+": date.getMinutes(),    // 时
      "s+": date.getSeconds(),    // 秒
      "q+": Math.floor((date.getMonth() + 3) / 3),      // 季度
      "S": date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(formatter)) {
      formatter = formatter.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
      if (new RegExp("(" + k + ")").test(formatter)) formatter = formatter.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  }
  return formatter;
}

/**
* 获取时间差，刚刚、几分钟前、几小时前、几个月前
* @param {输入时间} inputDate 
*/
function getDateDiff(inputDate) {
  let result;
  let date = strToDate(inputDate);
  let inputTimeStamp = date.getTime();
  let nowTimeStamp = new Date().getTime();
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let week = day * 7;
  let month = day * 30;
  let diffTime = nowTimeStamp - inputTimeStamp;
  if (diffTime < 0) {
      return;
  }
  let diffMinute = diffTime / minute;
  let diffHour = diffTime / hour;
  let diffDay = diffTime / day;
  let diffWeek = diffTime / week;
  let diffMonth = diffTime / month;
  if (diffMonth >= 1 && diffMonth <= 3) {
      result = parseInt(diffMonth) + "月前";
  } else if (diffWeek >= 1 && diffWeek <= 3) {
      result = parseInt(diffWeek) + "周前";
  } else if (diffDay >= 1 && diffDay <= 6) {
      result = parseInt(diffDay) + "天前";
  } else if (diffHour >= 1 && diffHour <= 23) {
      result = parseInt(diffHour) + "小时前";
  } else if (diffMinute >= 1 && diffMinute <= 59) {
      result = parseInt(diffMinute) + "分钟前";
  } else if (diffTime >= 0 && diffMinute <= minute) {
      result = "刚刚";
  } else {
      result = dateFormat(inputTimeStamp);
  }
  return result;
}

/**
* 获取几天前的时间
* @param {天数} days 
*/
function getBeforeDate(days) {
  var today = new Date();
  // 获取AddDayCount天后的日期
  today.setDate(today.getDate() + days);
  var year = today.getFullYear();
  // 获取当前月份的日期，不足10补0
  var month = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
  // 获取当前几号，不足10补0
  var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
  return year + "-" + month + "-" + day;
}

/**
* 字符串转Date类型
* @param {} dateStr 
*/
function strToDate(dateStr) {
  if (!dateStr) {
      return null;
  }
  let date;
  // 字符串格式
  if (dateStr instanceof Date) {
      date = dateStr;
  } else {
      // 时间戳
      if (!isNaN(dateStr)) {
          // 时间戳
          if (dateStr.toString().length == 10) {
              date = new Date(dateStr * 1000);
          } else if (dateStr.toString().length == 13) {
              date = new Date(dateStr);
          } else {
              return "";
          }
      } else {
          if (dateStr.indexOf(".") > -1) {
              // 有些日期接口返回数据中带有".0"
              dateStr = dateStr.substring(0, dateStr.indexOf("."));
          }
          // 解决localtime T
          dateStr = dateStr.replace("T", " ");
          // 解决ios系统无法格式化问题
          dateStr = dateStr.replace(/-/g, "/");
          date = new Date(dateStr);
      }
  }
  return date;
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTimeTwo(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}



module.exports = {
  formatTimeStampToBefore: formatTimeStampToBefore
}

