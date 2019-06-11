// pages/index2/index.js
const {
  $Toast
} = require('../../dist/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    scrHeight: '',
    mottoImage: '',
    flag: false,
    star: null
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          //windowHeight 为屏幕可用高度
          winHeight: res.windowHeight,
          //screenHeight 为屏幕高度
          scrHeight: res.screenHeight
        })
      }
    })
   

  },

  onShow:function(){
    this.getstar();
  },

  onPullDownRefresh(){
    　　console.log('--------下拉刷新-------')
    　　wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getstar();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  showMask: function(e) {
    console.log(e)
    this.setData({
      flag: true,
      mottoImage: e.currentTarget.dataset.img
    })
  },
  closeMask: function() {
    this.setData({
      flag: false,
      mottoImage: ''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getstar() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getStar',
      complete: res => {
        //mmp 原来可以直接显示存储地址的图片的
        // res = res.result.data
        // var res_deal = res.map(item => {
        //   wx.cloud.getTempFileURL({
        //     fileList: [item.photo],
        //     success: res2 => {
        //       // get temp file URL
        //       item.photo = res2.fileList[0].tempFileURL
        //     },
        //     fail: err => {
        //       // handle error
        //     }
        //   })
        //   return item
        // })
        // console.log(res_deal)
        that.setData({
          star: res.result.data
        })
      }
    })
  },

  doVote(e) {
    // console.log(e.currentTarget.dataset.id)
    $Toast({
      content: '投票中',
      type: 'loading',
      mask: false
    });
    wx.cloud.callFunction({
      name: 'doVote',
      data: {
        uid: e.currentTarget.dataset.id
      },
      success: res => {
        console.log(res)
        if (res.result.code === 1) {
          this.getstar()
          $Toast({
            content: '投票成功',
            type: 'success',
            mask: false
          });
        } else if (res.result.code === 0) {
          $Toast({
            content: '投票超出限制',
            type: 'error',
            mask: false
          });
        }

      },
      fail: err => {
        console.log(err)
        $Toast({
          content: '投票失败',
          type: 'error',
          mask: false
        });
      },
      complete() {}
    })
  }
})