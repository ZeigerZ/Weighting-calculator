const app = getApp()

var cfg = {
  cursor: {
    x: 0
  }
};

Page({
  data: {
    templates: [],
    inputCurson: 0,
    current: 0,
    success: false
  },

  onLoad: function () {
    // console.log(wx.getSystemInfoSync().theme)
    //上传当前主题至自定义导航栏
    this.NewTheme(wx.getSystemInfoSync().theme)
    //监听主题变化上传至自定义导航栏
    wx.onThemeChange((result) => {
      this.NewTheme(result.theme);
    });
    //设置表单长度为20
    this.NewFormLength(20);
  },

  //小贴士（监听当期“Current”）
  ChangeCurrent(e) {
    //当前项为2，触发类型为"touch"，templates长度为20时运行
    if (e.detail.current == 2 && e.detail.source == "touch" && this.data.templates.length == 20) {
      this.setData({
        success: '💡默认行数为20行，行数会随输入增加'
      });
    }
  },

  // 更新自定义导航栏颜色
  NewTheme(theme) {
    this.setData({
      theme: theme
    });
  },

  //更新表单长度
  NewFormLength(length) {
    var templates = [];
    for (let i = 0; i < length; i++) {
      templates.push({
        key: (i + 1).toString()
      });
    };
    // console.log(templates);
    this.setData({
      templates: templates
    });
  },

  //点击"计算"时运行
  formSubmit(e) {

    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var value = e.detail.value;
    //获取value里数据的所有键名,组成一个数组
    var keys = Object.keys(value);
    // console.log(keys);
    //计算对象数组长度
    var length = keys.length
    // console.log("长度：",keys.length)
    //遍历value,得到"成绩","学分"加权以及学分和
    for (var i = 0, and = 0, xfand = 0, wxxf = 0, shujv, cj, xf, chengji; i < length && value[keys[i]] != ""; i++) {
      //把字符转化为数字
      shujv = parseFloat(value[keys[i]]);
      // console.log(shujv);
      if (i % 2 == 0) {
        //i为偶数时运行
        //提取"成绩"
        cj = shujv;
      } else {
        //提取"学分"
        xf = shujv;
        if (cj < 60) {
          //"成绩"小于60时累加"无效学分"
          wxxf = xf + wxxf
        };
        chengji = cj * xf;
        //学分和
        xfand = xf + xfand;
        //加权
        and = chengji + and;
      }
    };

    var jqpjf = and / xfand;
    var sxxf = xfand - wxxf;

    if (sxxf < 30) {
      //"实修学分"小于30时运行
      var kf = jqpjf * (1 - (xfand - wxxf) / 30);
      var g21 = jqpjf - kf;
      var kfqk = "未满30分需要扣分"
    } else {
      //"实修学分"大于30时运行
      var kf = 0;
      var g21 = jqpjf;
      var kfqk = "已满30分无需扣分"
    };

    //保存结果,结果保留两位小数
    this.setData({
      g21: Math.round(g21 * 100) / 100,
      kfqk: kfqk,
      jqpjf: Math.round(jqpjf * 100) / 100,
      kf: Math.round(kf * 100) / 100,
      jq: Math.round(and * 100) / 100,
      kcxf: xfand,
      sxxf: sxxf
    });
    this.showModal()
  },

  //弹窗
  showModal: function () {
    var that = this.data;
    wx.showModal({
      title: "G21=" + that.g21,
      showCancel: false,
      content: '扣分情况：' + that.kfqk + '，' +
        '扣分=' + that.kf + '，' +
        '加权平均分=' + that.jqpjf + '，' +
        '加权=' + that.jq + '，' +
        '课程学分=' + that.kcxf + '，' +
        '实修学分=' + that.sxxf,
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定')
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },

  //点击"归零"时运行
  formReset(e) {
    // console.log('form发生了reset事件，携带数据为：', e)
    this.NewFormLength(20);
    this.setData({
      current: 0,
      g21: '',
      kfqk: '',
      jqpjf: '',
      kf: '',
      jq: '',
      kcxf: '',
      sxxf: ''
    });
    setTimeout(() => this.setData({ 
      inputCurson: -1 
    }), 1000); 
  },

  //监听输入事件
  bindKeyInput: function (e) {
    // console.log(e);
    var length = e.detail.cursor;
    var value = e.detail.value;
    var index = e.target.dataset.index;
    var item = e.target.dataset.item;

    //判断输入字符长度,光标是在成绩还是学分,输入中是否有小数点
    if (item == "0" && length == 2 && value.indexOf(".") == -1 && length > cfg.cursor.x) {
      //光标在"成绩"栏字符的长度是2,并且没有小数点,字符长度增加时运行
      var zhuangtai = index + 0.2;
      this.setData({
        inputCurson: zhuangtai
      });
      cfg.cursor.x = 0
    } else if (item == "1" && length == 1 && value != 0 && value.indexOf(".") == -1 && length > cfg.cursor.x || value == 0.5 || value == 0.25) {
      //光标在"学分"栏,字符长度是1,输入的值不是0,没有小数点,字符长度增加时运行
      var zhuangtai = index + 1.1;
      var current = index - 2;
      //输入项-2大于等于0时（从第3项开始），增加表单长度，并更新当前swiper项
      if (current >= 0) {
        this.NewFormLength(index + 18);
        this.setData({
          current: current
        });
        // console.log(this.data.current)
      };
      //延时150ms跳转光标，以解决光标位置不对的问题
      setTimeout(() => this.setData({
        inputCurson: zhuangtai
      }), 150);
      cfg.cursor.x = 0
    } else {
      cfg.cursor.x = length
    }
  },

  //监听回车键事件
  doNext: function (e) {
    var index = e.target.dataset.index;
    var item = e.target.dataset.item;
    //判断光标是在成绩还是学分
    if (item == "0") {
      //光标在"成绩"栏加时运行
      var zhuangtai = index + 0.2;
      this.setData({
        inputCurson: zhuangtai
      });
      cfg.cursor.x = 0
    } else if (item == "1") {
      //光标在"学分"栏时运行
      var zhuangtai = index + 1.1;
      var current = index - 2;
      //第一行滑块项是小于33时，更新滑块项至输入项-2（32+18=50）
      if (current < 33) {
        this.setData({
          current: current
        });
        // console.log(this.data.current)
      };
      //延时100ms跳转光标，以解决光标位置不对的问题
      setTimeout(() => this.setData({
        inputCurson: zhuangtai
      }), 100);
      cfg.cursor.x = 0
    }
  },

});

//转发按钮
wx.showShareMenu({
  menus: ['shareAppMessage', 'shareTimeline']
})