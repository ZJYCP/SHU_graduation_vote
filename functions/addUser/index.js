const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async(event, context) => {
  const {
    OPENID,
    APPID,
    UNIONID,
    ENV,
  } = cloud.getWXContext()
  try {
    var ishas = await db.collection('user').where({
      openid: _.eq(OPENID)
    }).get()
    if (ishas.data.length == 0) {
      var uid = await db.collection('user').orderBy('uid', 'desc').field({ uid: true }).limit(1)
        .get()
      await db.collection('user').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          openid: OPENID,
          uid: uid.data[0].uid+1,
          postStar: [],
          voteToDay: 0
        }
      })
      return uid.data[0].uid+1;
    } else {
      return ishas.data[0].uid
    }
  } catch (e) {
    console.error(e)
  }
}