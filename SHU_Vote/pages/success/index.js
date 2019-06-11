Page({
  data: {
      buttons: [{
              type: 'royal',
              block: true,
              text: '去投票',
          },
          // {
          //     type: 'light',
          //     block: true,
          //     text: '返回',
          // },
      ],
  },
  onClick(e) {
      console.log(e)
      const { index } = e.detail

      index === 0 && wx.reLaunch({
        url: '/pages/index3/index'
      })
      // index === 1 && wx.navigateBack()               type: 'balanced',
  },
})