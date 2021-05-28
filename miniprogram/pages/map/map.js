var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var db = wx.cloud.database();
var _ = db.command;

qqmapsdk = new QQMapWX({
  key: '2FCBZ-M4WLO-H3QW6-SAYBP-WTLEZ-OYFWY'
});
Page({
    data: {
        markers: [],
        "city": [
        {
        "name" : "山东济南",
        "latitude" : "117.000923",
        "longitude" : "36.675808",
        "quality" : 86
        },
        {
        "name" : "河北石家庄",
        "latitude" : "114.502464",
        "longitude" : "38.045475",
        "quality" : 95
        },
        {
        "name" : "吉林长春",
        "latitude" : "125.324501",
        "longitude" : "43.886841",
        "quality" : 36
        },
        {
        "name" : "黑龙江哈尔滨",
        "latitude" : "126.642464",
        "longitude" : "45.756966",
        "quality" : 36
        },
        {
        "name" : "辽宁沈阳",
        "latitude" : "123.429092",
        "longitude" : "41.796768",
        "quality" : 35
        },
        {
        "name" : "内蒙古呼和浩特",
        "latitude" : "111.751990",
        "longitude" : "40.841490",
        "quality" : 61
        },
        {
        "name" : "新疆乌鲁木齐",
        "latitude" : "87.616880",
        "longitude" : "43.826630",
        "quality" : 74
        },
        {
        "name" : "甘肃兰州",
        "latitude" : "103.834170",
        "longitude" : "36.061380",
        "quality" : 49
        },
        {
        "name" : "宁夏银川",
        "latitude" : "106.232480",
        "longitude" : "38.486440",
        "quality" : 52
        },
        {
        "name" : "山西太原",
        "latitude" : "112.549248",
        "longitude" : "37.857014",
        "quality" : 112
        },
        {
        "name" : "陕西西安",
        "latitude" : "108.948021",
        "longitude" : "34.263161",
        "quality" : 81
        },
        {
        "name" : "河南郑州",
        "latitude" : "113.665413",
        "longitude" : "34.757977",
        "quality" : 92
        },
        {
        "name" : "安徽合肥",
        "latitude" : "117.283043",
        "longitude" : "31.861191",
        "quality" : 48
        },
        {
        "name" : "江苏南京",
        "latitude" : "118.76741",
        "longitude" : "32.041546",
        "quality" : 60
        },
        {
        "name" : "浙江杭州",
        "latitude" : "120.15358",
        "longitude" : "30.287458",
        "quality" : 34
        },
        {
        "name" : "福建福州",
        "latitude" : "119.306236",
        "longitude" : "26.075302",
        "quality" : 33
        },
        {
        "name" : "广东广州",
        "latitude" : "113.28064",
        "longitude" : "23.125177",
        "quality" : 34
        },
        {
        "name" : "江西南昌",
        "latitude" : "115.892151",
        "longitude" : "28.676493",
        "quality" : 42
        },
        {
        "name" : "海南海口",
        "latitude" : "110.199890",
        "longitude" : "20.044220",
        "quality" : 17
        },
        {
        "name" : "广西南宁",
        "latitude" : "108.320007",
        "longitude" : "22.82402",
        "quality" : 33
        },
        {
        "name" : "贵州贵阳",
        "latitude" : "106.713478",
        "longitude" : "26.578342",
        "quality" : 42
        },
        {
        "name" : "湖南长沙",
        "latitude" : "112.982277",
        "longitude" : "28.19409",
        "quality" : 33
        },
        {
        "name" : "湖北武汉",
        "latitude" : "114.298569",
        "longitude" : "30.584354",
        "quality" : 37
        },
        {
        "name" : "四川成都",
        "latitude" : "104.065735",
        "longitude" : "30.659462",
        "quality" : 67
        },
        {
        "name" : "云南昆明",
        "latitude" : "102.71225",
        "longitude" : "25.040609",
        "quality" : 35
        },
        {
        "name" : "西藏拉萨",
        "latitude" : "91.11450",
        "longitude" : "29.644150",
        "quality" : 44
        },
        {
        "name" : "青海西宁",
        "latitude" : "101.777820",
        "longitude" : "36.617290",
        "quality" : 43
        },
        {
        "name" : "天津",
        "latitude" : "117.190186",
        "longitude" : "39.125595",
        "quality" : 61
        },
        {
        "name" : "上海",
        "latitude" : "121.472641",
        "longitude" : "31.231707",
        "quality" : 61
        },
        {
        "name" : "重庆",
        "latitude" : "106.504959",
        "longitude" : "29.533155",
        "quality" : 45
        },
        {
        "name" : "北京",
        "latitude" : "116.405289",
        "longitude" : "39.904987",
        "quality" : 32
        },
        {
        "name" : "香港",
        "latitude" : "114.165460",
        "longitude" : "22.275340",
        "quality" : 24
        },
        {
        "name" : "澳门",
        "latitude" : "113.549130",
        "longitude" : "22.198750",
        "quality" : 19
        }
      ]    
    },

    moveCenter:function(res){
      // console.log(res);
       let index_lat ="markers[0].latitude";
       let index_lng ="markers[0].longitude";
       this.setData({
         [index_lat]:res.detail.latitude,
         [index_lng]:res.detail.longitude
       })
     },
   
     getHightPlace:function(){
       var that=this;
       var latitude=this.data.markers[0].latitude;
       var longitude=this.data.markers[0].longitude;
   
        var result=that.data.city;
        for(var i=0;i<result.length;i++){
          let lat=result[i].longitude;
          let lng=result[i].latitude;
          let quality=result[i].quality;
          var index="markers["+(i+1)+"]";
          let city = result[i].name;
          let lat0 = that.data.markers[0].latitude;
          let lng0 = that.data.markers[0].longitude;

          that.setData({
            [index]:{
              latitude: lat,
              longitude: lng,
              //iconPath:"/miniprogram/images/map/location.png",
              width: 5,
              height: 5,
              iconPath:"../../images/map/location.png",
              callout: {
                content: city +'\n空气质量：' + quality,
                color: '#191970', 
                bgColor: '#7B68EE',
                fontSize: 13,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#0000ff',
                padding: 2,
                display: 'ALWAYS'
              }
            }            
          })
          console.log(this.data.markers)
        }
      },
      onLoad: function (options) {
        var that=this;
        wx.getLocation({
          success: function(res) {
            console.log(res);
            that.setData({
              markers:[
                {
                  latitude:res.latitude,
                  longitude:res.longitude,
                  iconPath:"../../images/map/location.png",
                  width:10,
                  height:10,
                }
              ]
            })
          },
        })
      }
    })
   