//app.js

App({
  onLaunch: function() {


    wx.cloud.init({
      env: 'shu-xs36f'
    })
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'addUser',
      // 传递给云函数的参数
      data: {},
      success: res => {
        // output: res.result === 3
        console.log(res.result)
        this.globalData.user_uid=res.result;
      },
      fail: err => {
        // handle error
      },
      complete: () => {
        // ...
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})