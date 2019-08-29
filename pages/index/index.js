//获取音频上下文
const backgroundAudioManager = wx.getBackgroundAudioManager();
var mtabW;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoadedAll: false,
    musicIndex: null,
    videoIndex: null,
    // tab切换  
    currentTab: 0,
    tabW: 0,
    pageIndex: 1,
    videoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //加载数据
    this.onVideoData();
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        mtabW = res.windowWidth / 2;
        that.setData({
          tabW: mtabW
        })
      }
    });
  },
  //滑动切换
  swiperTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      });
      //tab切换时停止音乐播放
      backgroundAudioManager.stop();

      //tab切换时停止视频播放
      var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex);
      videoContextPrev.stop();

      //将当前播放视频、音频的index设置为空
      this.setData({
        musicIndex: null,
        videoIndex: null,
      })
    }
  },

  //展开
  //原本没有upStatus这个字段，所以默认值为false
  upDown(event) {
    var index = event.currentTarget.dataset['index'];
    this.data.videoList[index].upStatus = !this.data.videoList[index].upStatus;
    this.setData({
      videoList: this.data.videoList
    })
  },
  //播放音频
  musicPlay(event) {
    var src = event.currentTarget.dataset['src'];
    var index = event.currentTarget.dataset['index'];
    this.setData({
      musicIndex: index,
      audioSrc: src
    });

    backgroundAudioManager.src = src;
    backgroundAudioManager.play()

  },
  //停止音频
  musicPause(event) {
    this.setData({
      musicIndex: null
    });
    backgroundAudioManager.pause();
  },
  //播放视频
  videoPlay(event) {
    var length = this.data.videoList.length;
    var index = event.currentTarget.dataset['index'];

    if (!this.data.videoIndex) { // 没有播放时播放视频
      this.setData({
        videoIndex: index
      })
      var videoContext = wx.createVideoContext('video' + index)
      videoContext.play()
    } else {
      //停止正在播放的视频
      var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex)
      videoContextPrev.stop()
      //将点击视频进行播放
      this.setData({
        videoIndex: index
      })
      var videoContextCurrent = wx.createVideoContext('video' + index)
      videoContextCurrent.play()
    }
  },
  //评论
  onCommentClick: function(e) {
    wx.navigateTo({
      url: '../video/videodetail',
    })
  },
  //点赞
  onGiveClick: function(e) {
    wx.navigateTo({
      url: '../video/videodetail',
    })
  },
  //分享
  onShareAppMessage: function(res) {
    if (res.from === 'button') {

    }
    return {
      title: '分享',
      path: '/pages/index/index.js',
      success: function(res) {
        console.log('成功', res)
      }
    }
  },
  //获取数据
  onVideoData: function() {
    var that = this;
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'http://192.168.25.20:81/zhuanzhuan/video/select',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            videoList: res.data.data
          })
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常！',
        })
      }
    })
  }
})