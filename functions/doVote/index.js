// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

//检查用户今日投票数
// 嘉宾投票数自增1
// 用户今日投票数自增1

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const starID = event.uid

  try {
    var voteToDay = await db.collection('user').where({
      openid: wxContext.OPENID,
    }).get()

    voteToDay = voteToDay.data[0].voteToDay

    if (voteToDay < 6) {
      //嘉宾+1
      await db.collection('star').where({
          uid: starID
        })
        .update({
          data: {
            votes: _.inc(1)
          },
        })
      await db.collection('user').where({
          openid: wxContext.OPENID,
        })
        .update({
          data: {
            voteToDay: _.inc(1)
          },
        })
      return {
        code: 1,
        msg: '投票成功'
      }
    } else {
      return {
        code: 0,
        msg: '超出票数限制'
      }
    }
  } catch (e) {
    return {
      code: -1,
      msg: '投票失败'
    }
  }


}