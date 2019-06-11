//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    currentRank: 'tab1',
    targetTime1: 0,
    myFormat1: ['天', '时', '分', '秒'],
    status: '进行中...',
    clearTimer: false,
    current: 'homepage',
    scrollTop: 0,
    imgUrls: [
      '/resources/images/1.jpg',
      '/resources/images/2.jpg',
      '/resources/images/3.jpg',
    ],
  },

  // 首次载入
  onLoad() {
    this.setData({
      targetTime1: new Date().getTime() + 86430000,
    });
  },
  onUnload() {
    this.setData({
      clearTimer: true
    });
  },
  onPageScroll(event) {
    this.setData({
      scrollTop: event.scrollTop
    })
  },

  // 更改显示规则
  rankchange({
    detail
  }) {
    // console.log(detail.key)
    this.setData({
      currentRank: detail.key
    });
  },

  toPerson(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../person/person?id=' + id,
      success: function(res) {

      },
      fail: function(res) {
        // console.log("test")
      },

    })
  },
  doVote(e){
    let id = e.currentTarget.dataset.id;
    console.log('投了一票')
  }
})