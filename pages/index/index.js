const app = getApp();

import { getIndexData, getCoupons } from '../../api/api.js';
import Util from '../../utils/util.js';
import { getGroomList } from '../../api/store.js';
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    itemNew:[],
    activityList:[],
    menus: [],
    bastBanner: [],
    bastInfo: '',
    bastList: [],
    fastInfo: '',
    fastList: [],
    firstInfo: '',
    firstList: [],
    salesInfo: '',
    likeInfo: [],
    lovelyBanner: {},
    benefit:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    parameter:{
      'navbar':'0',
      'return':'0'
    },
    window: false,
    iShidden:false,
    navH: "",
    /* is_switch:true, */
  },
  closeTip:function(){
    wx.setStorageSync('msg_key',true);
    this.setData({
      iShidden:true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'OKJBZ-PTSRP-YLWDY-LZPAH-5YFXS-3ZFUW'
    });
    this.get_location();
    this.setData({
      navH: app.globalData.navHeight
    });
    if (options.spid) app.globalData.spid = options.spid;
    if (options.scene) app.globalData.code = decodeURIComponent(options.scene);
    if (wx.getStorageSync('msg_key')) this.setData({ iShidden:true});
  },

  /* Changswitch:function(){
    var that = this;
    that.setData({
      is_switch: !this.data.is_switch
    })
 }, */
 
  catchTouchMove: function (res) {
    return false
  },
  onColse:function(){
    this.setData({ window: false});
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
    this.getIndexConfig();
    this.getIndexGroomList();
    this.get_location();
    if(app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
  },
  get_issue_coupon_list:function(){
    var that = this;
    getCoupons({page:1,limit:3}).then(res=>{
      console.log(res)
      that.setData({ couponList: res.data });
      if (!res.data.length) that.setData({ window: false });
    });
  },
  getIndexGroomList: function () {
    var that = this;
    getGroomList(1).then(res=>{
      /* console.log(res.data.list);
      let store_list = res.data.list;
      let store_show = [];
      for(let y=0;y<store_list.length;y++){
        qqmapsdk.geocoder({
          address: store_list[y].store_location, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
          success: function(res) {
            let store_distance = that.getDistance(res.result.location.lat,res.result.location.lng,that.data.user_location_lat,that.data.user_location_lon)
            console.log(store_distance);
            if(store_distance<=10){
              store_show.push(store_list[y])
            };
            console.log(store_show)
            that.setData({store_show:store_show})
          },
          fail: function(error) {
            console.error(error);
          }
        })
      }
      console.log(store_show)
      that.setData({store_show:store_show}) */
      that.setData({ imgUrls: res.data.banner, bastList: res.data.list })
    });
  },

  //计算位置距离
/*   getDistance: function(lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
  
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    var distance = r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
    console.log(distance)
    let distanceKm = `${(distance/1000).toFixed(2)}`;//转换成km
          
    this.setData({
      distanceKm:distanceKm
    })
    return distanceKm;
  }, */


  getIndexConfig:function(){
    var that = this;
    getIndexData().then(res=>{
      console.log(res)
      that.setData({
        imgUrls: res.data.banner,
        /* menus: res.data.menus, */
        itemNew: res.data.roll,
        activityList: res.data.activity,
        bastBanner: res.data.info.bastBanner,
        bastInfo: res.data.info.bastInfo,
        /* bastList: res.data.info.bastList, */
        fastInfo: res.data.info.fastInfo,
        fastList: res.data.info.fastList,
        firstInfo: res.data.info.firstInfo,
        firstList: res.data.info.firstList,
        salesInfo: res.data.info.salesInfo,
        likeInfo: res.data.likeInfo,
        lovelyBanner: res.data.lovely.length ? res.data.lovely[0] : {},
        benefit: res.data.benefit,
        /* logoUrl: "广东省东莞市", */
        couponList: res.data.couponList,
      });
      /* console.log(res.data.info.bastList); */
      wx.getSetting({
        success(res) {
          console.log(res)
          if (!res.authSetting['scope.userInfo']) {
            that.setData({ window: that.data.couponList.length ? true : false });
          } else {
            that.setData({ window: false, iShidden: true});
          }
        }
      });
    });

  },

  //获取当前位置
  get_location:function(){
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        // 逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: address => {
            /* this.setData({
              addressRes: address.result
            }) */
            console.log(address.result)
            let local_address = address.result.address_reference.town.title || address.result.address_reference.street.title || address.result.address_component.city ||address.result.address || "定位失败";
            that.setData({
              address:local_address,
              user_location_lat:res.latitude,
              user_location_lon:res.longitude,
            })
          },
          fail(error) {
            console.log('逆地址解析错误');
          }
        })
      },
      complete(e) {
        console.log(e)
        if (e.errMsg == 'getLocation:fail auth deny') {
          wx.showToast({
            icon: 'none',
            title: '您取消了定位,地图功能将受影响！！！',
          });
        }
      }
    })
  },

    /* //下拉刷新
    onPullDownRefresh() {//下拉刷新
      wx.showNavigationBarLoading();
      this.get_location;
  
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, */



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({ window:false});
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
    this.getIndexConfig();
    if (app.globalData.isLog && app.globalData.token) this.get_issue_coupon_list();
    wx.stopPullDownRefresh();
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

  }
})