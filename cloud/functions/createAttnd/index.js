const cloud = require('wx-server-sdk');
cloud.init();

// 生成签到口令
const buildPassWd = () => {
  // 返回 [min, max] 范围的整数
  const getRandomInt = (min, max) => {
    return Math.round(Math.random() * (max - min)) + min;
  }

  // 毫秒时间戳转成 62 进制
  const getTimeIn62 = (timeInLong) => {
    let timeIn62 = '';
    while (timeInLong !== 0) {
      timeIn62 += digits[timeInLong % 62];
      timeInLong = Math.floor(timeInLong / 62);
    }
    return timeIn62;
  }

  const digits = "0123456789abcdefghijk+mnopqrstuvwxyzABCDEFGH=JKLMNOPQRSTUVWXYZ";
  let passwd = '';

  passwd = digits[getRandomInt(0, 61)]
    + getTimeIn62(Date.now()).slice(0, 3)
    + digits[getRandomInt(0, 61)] + digits[getRandomInt(0, 61)];

  return passwd;
}

exports.main = async (event) => {
  const db = cloud.database();
  const _ = db.command;
  const attndCollection = db.collection('attnd');
  const userCollection = db.collection('user');
  const { attndName, location } = event;
  const { openId } = event.userInfo;
  console.log('event', event);

  if (typeof attndName !== 'string'
    || !attndName
    || typeof location !== 'object'
    || typeof location.lng !== 'number'
    || typeof location.lat !== 'number') {
    return { code: 4000 };
  }

  try {
    // 查询此用户是否存在
    const { data } = await userCollection.where({
      openId: _.eq(openId)
    }).get();
    console.log(data);
    if (Array.isArray(data) && data.length === 0) {
      return { code: 3003 };
    }

    // 计算签到口令
    let passWd = buildPassWd();

    // 查询是否存在与此口令相同的考勤
    // res = { data: [], errMsg }
    while (true) {
      const { data } = await attndCollection.where({
        passWd: _.eq(passWd)
      }).get();
      // 不存在该记录，可插入
      if (Array.isArray(data) && data.length === 0) {
        break;
      }
      if (!Array.isArray(data)) {
        console.log('查询数据库错误');
        throw new Error('查询数据库错误');
      }
      passWd = buildPassWd();
    }

    // 创建新的考勤
    const reqData = {
      attndName,
      location,
      passWd,
      hostOpenId: openId,
      attndStatus: 1, // 考勤状态 0-->已结束，1-->进行中
      createTime: new Date(),
      updateTime: new Date()
    }
    console.log(reqData);
    await attndCollection.add({
      data: reqData
    });
    return {
      code: 2000,
      data: { passWd }
    };
  } catch (e) {
    console.log(e);
    return { code: 5000, msg: e };
  }
}