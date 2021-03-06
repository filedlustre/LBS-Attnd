import Taro, { Component } from '@tarojs/taro';
import '@tarojs/async-await';
import "taro-ui/dist/style/index.scss";
import './app.less';

class App extends Component {

  config = {
    pages: [
      'pages/Home/index',
      'pages/List/index',
      'pages/Profile/index',
      'pages/EditAttnd/index',
      'pages/FindAttnd/index',
      'pages/EditAuth/index',
      'pages/EditUserInfo/index',
      'pages/SignIn/index',
      'pages/ShowPassWd/index',
      'pages/About/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    permission: {
      'scope.userLocation': {
        desc: "你的位置信息将用于小程序位置接口的效果展示"
      }
    },
    tabBar: {
      color: '#6d6d6d',
      selectedColor: '#78a4fa',
      // borderStyle: 'white',
      // backgroundColor:'#f7f7f7',
      list: [
        {
          pagePath: 'pages/Home/index',
          text: '考勤',
          iconPath: 'assets/images/home.png',
          selectedIconPath: 'assets/images/home-active.png'
        },
        {
          pagePath: 'pages/List/index',
          text: '列表',
          iconPath: 'assets/images/list.png',
          selectedIconPath: 'assets/images/list-active.png'
        },
        {
          pagePath: 'pages/Profile/index',
          text: '我的',
          iconPath: 'assets/images/profile.png',
          selectedIconPath: 'assets/images/profile-active.png'
        }
      ]
    }
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }

    // 弹窗询问用户是否同意授权小程序使用地理位置
    Taro.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          Taro.authorize({ scope: 'scope.userLocation' });
        }
      }
    });
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Home />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
