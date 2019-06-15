// pages/index2/index.js
const {
  $Toast
} = require('../../dist/base/index');
const db = wx.cloud.database()
const _ = db.command
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: '',
    scrHeight: '',
    motto: '',
    flag: false,
    star: [],
    chooseId: '',
    value: '',
    rank: 0,
    page:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    // console.log(app.globalData)
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

  onShow: function() {
    this.setData({
      page:0,
      star:[]
    })
    this.getstar();
  },

//下拉刷新
  onPullDownRefresh() {
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getstar();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

// 展示悬浮层
  showMask: function(e) {
    console.log(e)
    this.setData({
      flag: true,
      motto: e.currentTarget.dataset.choose,
      chooseId: e.currentTarget.dataset.chooseid
    })
  },

  // 关闭悬浮层
  closeMask: function() {
    this.setData({
      flag: false,
      motto: ''
    })
  },

  onReady: function() {

  },

  // 展示所有，从搜索后返回执行
  showall() {
    $Toast({
      content: 'loading',
      type: 'loading',
      duration: 1,
      mask: false
    });
    this.setData({
      star:[],
      rank:0
    })
    this.getstar();
  },

  // 分页获取嘉宾信息
  getstar() {
    var that = this;
    // console.log(this.data.page)
    if(this.data.page!=-1){
      db.collection('star').orderBy('votes', 'desc').skip(this.data.page * 19).limit(19).where({
        isvalid: true
      }).get({
        success: function (res) {
          console.log(res)
          if (res.data.length ==0) {
            // $Toast({
            //   content: '没有了',
            //   type: 'warning',
            //   duration: 1,
            //   mask: false
            // });
            that.setData({
              page: -1
            })
          } else {
            that.setData({
              star: that.data.star.concat(res.data),
              page: that.data.page + 1
            })
          }

        }
      })
    }else{
      console.log("没有了")
    }

    // wx.cloud.callFunction({
    //   name: 'getStar',
    //   complete: res => {
    //     //mmp 原来可以直接显示存储地址的图片的
    //     // res = res.result.data
    //     // var res_deal = res.map(item => {
    //     //   wx.cloud.getTempFileURL({
    //     //     fileList: [item.photo],
    //     //     success: res2 => {
    //     //       // get temp file URL
    //     //       item.photo = res2.fileList[0].tempFileURL
    //     //     },
    //     //     fail: err => {
    //     //       // handle error
    //     //     }
    //     //   })
    //     //   return item
    //     // })
    //     // console.log(res_deal)
    //     that.setData({
    //       star: res.result.data
    //     })
    //   }
    // })
  },

  // 页面触底执行
  lower(){
    console.log('getnew')
    if(this.data.page!=-1){

      if (this.data.rank == 0) {
        // $Toast({
        //   content: '加载更多',
        //   type: 'loading',
        //   duration: 1,
        //   mask: false
        // });
        this.getstar();
      }else{

      }
    }else{
      // $Toast({
      //   content: '没有了',
      //   type: 'warning',
      //   duration: 1,
      //   mask: false
      // });
    }

  },

  // 搜索确认
  search_confirm(e) {
    $Toast({
      content: '正在搜索',
      type: 'loading',
      duration: 1,
      mask: false
    });
    // console.log(e.detail.value)
    var that = this;
    db.collection('star').where({
      name: e.detail.value
    }).get({
      success: function(res) {
        console.log(res)
        if (res.data.length == 0) {
          $Toast({
            content: '查无此人',
            type: 'error',
            duration: 2,
          });
        } else {
          db.collection('star').where({
            votes: _.gt(res.data[0].votes)
          }).count({
            success: function(res2) {
              console.log(res2.total)
              that.setData({
                star: res.data,
                rank: res2.total + 1,
                page:0
              })
            }
          })
        }

      }
    })

  },

// 投票
  doVote(e) {
    var that=this;
    var pickid=e.currentTarget.dataset.chooseid
    var upup='star['+pickid+'].votes'
    var upup2 = 'star[' + this.data.chooseId+'].votes'
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
        console.log(pickid)
        console.log(upup)
        if (res.result.code === 1) {
          if (pickid==0||pickid){
            that.setData({
              [upup]: that.data.star[pickid].votes + 1
            })
          }else{
            that.setData({
              [upup2]: that.data.motto.votes + 1,
              'motto.votes':that.data.motto.votes+1
            })
          }

          // this.getstar()
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