//获取音频上下文
const backgroundAudioManager = wx.getBackgroundAudioManager();
var mtabW;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前请求数据是第几页
    page: 1,
    //每页数据条数
    pageSize: 10,
    //上拉时是否继续请求数据，即是否还有更多数据
    hasMoreData: true,
    //tab切换数据
    state: "",
    hideHeader: false,
    hideBottom: false,
    //是否显示视频内容
    videohidden: false,
    //是否显示马甲包内容
    phonehidden: true,
    refreshTime: '', // 刷新的时间 
    loadMoreData: '加载更多……',
    loading: false,
    allloaded: false,

    isLoadedAll: false,
    musicIndex: null,
    videoIndex: null,
    dayvideoIndex: null,
    // tab切换  
    currentTab: 0,
    tabW: 0,
    pageIndex: 1,
    //获取的数据列表，以追加的形式添加进去
    videoList: [],
    videorbList: [],

    //输入的手机号
    inputiphone: '',
    //手机归属地
    iphoneaddress: '',
    //实时播放
    palytime: 0,
    //设置起始播放位置
    startime: 0,
    flag: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //加载数据
    var that = this;
    // that.onContentShow()
    that.onVideoData("Loading...")
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
    if (this.data.currentTab == 1) {
      //tab切换时停止视频播放
      var videoContextPrev = wx.createVideoContext('day-video' + this.data.dayvideoIndex);
      videoContextPrev.stop();
      this.setData({
        videorbList: [],
        page: 1,
        dayvideoIndex: null
      })
      this.onVideorbData("loading...")
    } else {
      //tab切换时停止视频播放
      var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex);
      videoContextPrev.stop();
      this.setData({
        videoList: [],
        page: 1,
        videoIndex: null
      })
      this.onVideoData("loading...")
    }
  },
  //点击切换
  clickTab: function(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current,
      })
      if (this.data.currentTab == 0) {
        //tab切换时停止视频播放
        var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex);
        videoContextPrev.stop();
      } else {
        //tab切换时停止视频播放
        var videoContextPrev = wx.createVideoContext('day-video' + this.data.dayvideoIndex);
        videoContextPrev.stop();
      }
      this.setData({
        //将当前播放视频的index设置为空
        videoIndex: null,
        dayvideoIndex: null
      })



    }
  },
  /**
   * 上拉加载更多
   */
  // loadmore
  //展开
  //原本没有upStatus这个字段，所以默认值为false
  // upDown(event) {
  //   var index = event.currentTarget.dataset['index'];
  //   this.data.videoList[index].upStatus = !this.data.videoList[index].upStatus;
  //   if (this.data.currentTab == 1) {
  //     this.setData({
  //       videorbList: this.data.videorbList
  //     })
  //   } else {
  //     this.setData({
  //       videoList: this.data.videoList
  //     })
  //   }
  // },

  //精选播放视频
  videoPlay(event) {
    var length = this.data.videoList.length;
    var index = event.currentTarget.dataset['index'];
    console.log("点击的下标：" + index);
    if (!this.data.videoIndex) { // 没有播放时播放视频
      this.setData({
        videoIndex: index
      })
      console.log("播放精选：" + this.data.currentTab)
      var videoContext = wx.createVideoContext('video' + index)
      videoContext.play()
    } else {
      console.log("停止精选：" + this.data.currentTab)
      //停止正在播放的精选视频
      var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex)
      videoContextPrev.stop()
      // 将点击视频进行播放
      this.setData({
        videoIndex: index
      })
      console.log("播放精选：" + this.data.currentTab)
      var videoContextCurrent = wx.createVideoContext('video' + index)
      videoContextCurrent.play()
    }
  },
  //日榜播放视频
  dayvideoPlay(event) {
    var length = this.data.videorbList.length;
    var index = event.currentTarget.dataset['index'];
    console.log("点击的下标：" + index);
    if (!this.data.dayvideoIndex) { // 没有播放时播放视频
      this.setData({
        dayvideoIndex: index
      })
      console.log("播放日榜：" + index)
      var videoContext = wx.createVideoContext('day-video' + index)
      videoContext.play()
    } else {
      console.log("停止日榜：" + index)
      //停止正在播放的视频
      var videoContextPrev = wx.createVideoContext('day-video' + this.data.dayvideoIndex)
      videoContextPrev.stop()
      // 将点击视频进行播放
      this.setData({
        dayvideoIndex: index
      })
      console.log("播放日榜：" + index)
      var videoContextCurrent = wx.createVideoContext('day-video' + index)
      videoContextCurrent.play()
    }
  },
  //实时获取播放进度
  // videoTimeUpdate(res) {
  //   console.log('bindtimeupdate', res.detail.currentTime, '时间总时长-->', parseInt(res.detail.duration));
  //   var that = this;
  //   if (that.data.flag) return;
  //   if (parseInt(res.detail.currentTime) == 5) {
  //     that.setData({
  //       flag: true
  //     })
  //     //停止正在播放的视频
  //     var videoContextPrev = wx.createVideoContext('video' + that.data.videoIndex)
  //     videoContextPrev.stop()
  //     wx.showModal({
  //       title: '提示！',
  //       content: '观看广告后可继续观看' + Math.floor(Math.random() * 50 + 50),
  //       showCancel: true,
  //       cancelText: '取消',
  //       cancelColor: '',
  //       confirmText: '确定',
  //       confirmColor: '',
  //       success: function(res) {
  //         //确定
  //         if (res.confirm) {
  //           videoContextPrev.play()
  //         } else if (res.cancel) {
  //           videoContextPrev.seek(0);
  //           that.setData({
  //             flag: false,
  //           })
  //         }
  //       },
  //     })
  //   }
  // },
  // screenChange(e) {
  //   let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
  //   if (!fullScreen) { //退出全屏
  //     this.setData({
  //       controls: false
  //     })
  //   } else { //进入全屏
  //     this.setData({
  //       controls: true
  //     })
  //   }
  // },
  //评论
  onCommentClick: function(e) {
    var indexs = parseInt(e.currentTarget.dataset.index);
    var videoDetailHref = this.data.videoList[indexs].videoDetailHref
    wx.navigateTo({
      url: '../video/videodetail?videoDetailHref=' + videoDetailHref,
    })
  },
  //点赞
  onGiveClick: function(e) {
    var indexs = parseInt(e.currentTarget.dataset.index);
    var videoDetailHref = this.data.videoList[indexs].videoDetailHref
    wx.navigateTo({
      url: '../video/videodetail?videoDetailHref=' + videoDetailHref,
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
  //获取精选数据
  onVideoData: function(message) {
    var that = this;
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: message,
    })
    wx.request({
      url: 'https://yszz.scysy888.com/zhuanzhuan/video/select',
      // url: 'http://192.168.25.20:81/zhuanzhuan/video/select',
      method: 'POST',
      data: {
        page: that.data.page,
        limit: that.data.pageSize,
        state: ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success(res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        var videoListTem = that.data.videoList;
        if (res.data.data.records.length > 0) {
          if (that.data.page == 1) {
            videoListTem = [];
          }

          var videoList = res.data.data.records

          // console.log("数据：", videoList + "   " + res.data.data.records)
          if (videoList.length < that.data.pageSize) {
            that.setData({
              videoList: videoListTem.concat(videoList),
              hasMoreData: false
            })
          } else {
            that.setData({
              videoList: videoListTem.concat(videoList),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        }

      },
      fail(res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常！',
        })
      }
    })
  },
  //获取日榜数据
  onVideorbData: function(message) {
    var that = this;
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading()
    wx.showLoading({
      title: message,
    })
    wx.request({
      url: 'https://yszz.scysy888.com/zhuanzhuan/video/select',
      // url: 'http://192.168.25.20:81/zhuanzhuan/video/select',
      method: 'POST',
      data: {
        page: that.data.page,
        limit: that.data.pageSize,
        state: "1"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success(res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        var videorbListTem = that.data.videorbList;
        if (res.data.data.records.length > 0) {
          if (that.data.page == 1) {
            videorbListTem = [];
          }

          var videorbList = res.data.data.records

          // console.log("数据：", videoList + "   " + res.data.data.records)
          if (videorbList.length < that.data.pageSize) {
            that.setData({
              videorbList: videorbListTem.concat(videorbList),
              hasMoreData: false
            })
          } else {
            that.setData({
              videorbList: videorbListTem.concat(videorbList),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        }

      },
      fail(res) {
        wx.hideNavigationBarLoading()
        wx.hideLoading()
        wx.showToast({
          title: '服务器异常！',
        })
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  refresh() {
    this.data.page = 1
    this.onVideoData('Loading...')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  loadMore() {
    if (this.data.hasMoreData) {
      this.onVideoData('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },

  //////////////////////////////////////////////////////////////////////马甲包内容////////////////////////////////////////////////////////////////

  /**
   * 监听手机号的输入
   */
  listenerPhoneInput: function(e) {
    this.data.inputiphone = e.detail.value;
  },
  /**
   * 监听查询按钮
   */
  listenerquery: function() {
    var that = this;
    wx.showLoading({
      title: '查询中...',
    })
    wx.request({
      url: 'https://yszz.scysy888.com/zhuanzhuan/phoneNumberAttribution',
      data: {
        phone: that.data.inputiphone,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var province = res.data.data.province;
          var city = res.data.data.city;
          var company = res.data.data.company;
          that.setData({
            iphoneaddress: province + "  " + city + "  " + company
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您输入手机号码格式有误',
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
  },
  /**
   * 是否显示当前内容 1显示马甲包，0显示中转站
   */
  onContentShow: function() {
    var that = this;
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.getUserInfo();
      }
    })
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: 'https://yszz.scysy888.com/zhuanzhuan/wexinAppletVest',
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (res.data.data == 0) {
            that.setData({
              videohidden: false
            })
          } else {
            that.setData({
              phonehidden: false
            })
          }
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常！',
        })
      }
    })
  },
})