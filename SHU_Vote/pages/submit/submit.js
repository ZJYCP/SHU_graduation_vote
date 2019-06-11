// pages/submit/submit.js
const isTel = (value) => !/^1[34578]\d{9}$/.test(value)
import { $wuxToast } from '../../wux/index'
const db = wx.cloud.database()
var photo=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postmsg: {
      name: '',
      tag: '',
      story: '',
      img: '',
      contact: '',
      tel: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    photo=[];
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      error: false
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  },

  uploadimg() {
    photo=[]
    var that = this
    wx.chooseImage({
      count: 2,
      sizeType: 'compressed',
      sourceType: ['album', 'camera'],
      success(res) {
        var timestamp = new Date().getTime();

        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          'imglist': tempFilePaths
        })

        for (let index = 0; index < that.data.imglist.length; index++) {
          wx.cloud.uploadFile({
            cloudPath: timestamp + '' + parseInt(Math.random() * 10), //防止并发重名
            filePath: that.data.imglist[index], // 文件路径
            success: res => {
              // get resource ID
              photo.push(res.fileID);
            },
            fail: err => {
              // handle error
            }
          }) 
        }

        // console.log(tempFilePaths)
      }
    })
  },

  // 提交信息
  doSubmit() {
    
    console.log(this.data)
    wx.showLoading({
      title: '上传中',
    })
    //有错误的情况下不能提交
    // if (this.data.error==true){
    //   $wuxToast().show({
    //     type: 'cancel',
    //     duration: 1500,
    //     color: '#fff',
    //     text: '信息有误',
    //     success: () => console.log('信息有误')
    // })
    // return;
    // }

    var uid
    db.collection('star').orderBy('uid', 'desc').field({ uid: true }).limit(1)
      .get()
      .then(res=>{
        if (res.data.length==0){
          uid=0
        }else{
          uid=res.data[0].uid||1
        }
        
        db.collection('star').add({
          // data 字段表示需新增的 JSON 数据
          data: {
            // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
            create_time: new Date().getTime(),
            introduction: this.data.postmsg.story,
            isvalid: true,
            name: this.data.postmsg.name,
            photo: photo,
            tag: this.data.postmsg.tag,
            votes: 0,
            uid:uid+1,
            contact:this.data.postmsg.contact,
            posttel:this.data.postmsg.tel
          },
          success: function (res) {
            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            console.log(res)

            
            wx.redirectTo({
              url: '../success/index'
            })
          },
          fail: console.error
        })
      })
      .catch(console.error)



    // console.log(img)

  },

  nameCheck(e) {
    var that=this;
    db.collection('star').where({
      name: e.detail.value
    }).get({
      success: function(res) {
        console.log(res.data)
        if (res.data.length!=0&&e.detail.value!=''){
          console.log('已存在')
          that.setData({
            error: true
          })
        }else {
          that.setData({
            error: false,
            'postmsg.name': e.detail.value
          })
        }
      }
    })
  },
  tagcheck(e) {
    this.setData({
      'postmsg.tag': e.detail.value
    })
  },
  storyCheck(e) {
    this.setData({
      'postmsg.story': e.detail.value
    })
  },
  contactCheck(e) {
    this.setData({
      'postmsg.contact': e.detail.value
    })
  },
  telCheck(e) {
    this.setData({
      'postmsg.tel': e.detail.value
    })
  }
})