const app = getApp()

var cfg = {
  photo: {
    x: 0
  }
};

Page({
  data: {
    templates: [{
      key: '1',
    }, {
      key: '2',
    }, {
      key: '3',
    }, {
      key: '4',
    }, {
      key: '5',
    }, {
      key: '6',
    }, {
      key: '7',
    }, {
      key: '8',
    }, {
      key: '9',
    }, {
      key: '10',
    }, {
      key: '11',
    }, {
      key: '12',
    }, {
      key: '13',
    }, {
      key: '14',
    }, {
      key: '15',
    }, {
      key: '16',
    }, {
      key: '17',
    }, {
      key: '18',
    }, {
      key: '19',
    }, {
      key: '20',
    }, {
      key: '21',
    }, {
      key: '22',
    }, {
      key: '23',
    }, {
      key: '24',
    }, {
      key: '25',
    }, {
      key: '26',
    }, {
      key: '27',
    }, {
      key: '28',
    }, {
      key: '29',
    }, {
      key: '30'
    }],
    inputCurson: 0
  },



  onLoad: function () {

  },
  

  //点击"计算"时运行
  formSubmit(e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var value = e.detail.value;
    //获取value里数据的所有键名,组成一个数组
    var keys = Object.keys(value);
    // console.log(keys);

    //计算对象数组长度
    var i = 0;
    for (var j in value) {
      i++
    };
    var length = (i);

    //遍历value,得到"成绩","学分"加权以及学分和
    for (var i = 0, and = 0, xfand = 0, wxxf = 0; i < length && value[keys[i]] != ""; i++) {
      //把字符转化为数字
      var shujv = parseFloat(value[keys[i]]);
      // console.log(shujv);
      if (i % 2 == 0) {
        //i为偶数时运行
        //提取"成绩"
        var cj = shujv;
      } else {
        //提取"学分"
        var xf = shujv;
        if (cj < 60) {
          //"成绩"小于60时计算"无效学分"
          var wxxf = xf + wxxf
        };
        var chengji = cj * xf;
        //学分和
        var xfand = xf + xfand;
        //加权
        var and = chengji + and;
      }
    };

    var jqpjf = and / xfand;
    var sxxf = xfand - wxxf;

    if (sxxf < 16) {
      //"实修学分"小于16时运行
      var kf = jqpjf * (1 - (xfand - wxxf) / 16);
      var g21 = jqpjf - kf;
      var kfqk = "未满16需要扣分"
    } else {
      var kf = 0;
      var g21 = jqpjf;
      var kfqk = "已满16无需扣分"
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
    // console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      inputCurson: 0.1
    });

    this.setData({
      g21: '',
      kfqk: '',
      jqpjf: '',
      kf: '',
      jq: '',
      kcxf: '',
      sxxf: ''
    })
  },

  //输入字符时运行
  bindKeyInput: function (e) {
    // console.log(e);
    var length = e.detail.cursor;
    var value = e.detail.value;
    var index = e.target.dataset.index;
    var item = e.target.dataset.item;

    //判断输入字符长度,光标是在成绩还是学分,输入中是否有小数点
    if (item == "0" && length == 2 && value.indexOf(".") == -1 && length > cfg.photo.x) {
      //光标在"成绩"栏字符的长度是2,并且没有小数点,字符长度增加时是运行
      var zhuangtai = index + 0.2;
      this.setData({
        inputCurson: zhuangtai
      });
      cfg.photo.x = 0
    } else if (item == "1" && length == 1 && value != 0 && value.indexOf(".") == -1 && length > cfg.photo.x) {
      //光标在"学分"栏,字符长度是1,输入的值不是0,没有小数点,字符长度增加时运行
      var zhuangtai = index + 1.1;
      this.setData({
        inputCurson: zhuangtai
      });
      cfg.photo.x = 0
    } else {
      cfg.photo.x = length
    }
  }

})