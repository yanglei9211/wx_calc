Page({
  data: {
    focus: false,
    inputValue: '',
    ld_index: 0,

    value_a: 0,
    value_h: 0,
    value_w: 0,
    value_ld: 0,
    total_k: 0,

    db_k: 0,
    db_p: 0,
    db_w: 0,

    zf_k: 0,
    zf_p: 0,
    zf_w: 0,

    ts_k: 0,
    ts_p: 0,
    ts_w: 0,

    ld_items: [
      "000", "111", "222", "333"
    ],
    checkboxItems: [
      { name: '男', value: '0' },
      { name: '女', value: '1' },
    ],
    value_sex: 0,
    listData:[
      {"code":"01","text":"text1","type":"type1"},
      {"code":"02","text":"text2","type":"type2"},
      {"code":"03","text":"text3","type":"type3"},
      {"code":"04","text":"text4","type":"type4"},
      {"code":"05","text":"text5","type":"type5"},
      {"code":"06","text":"text6","type":"type6"},
      {"code":"07","text":"text7","type":"type7"}
      ]
  },

  checkboxChange: function (e) {
    var that = this;
    var value_sex = 0
    // let checkboxValues=null;
    let checkboxItems = this.data.checkboxItems, values = e.detail.value
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      if(checkboxItems[i].value==values[values.length-1]){
        checkboxItems[i].checked=true;
        value_sex = checkboxItems[i].value;
      }
      else{
        checkboxItems[i].checked = false;
      }
    }
    console.log(value_sex)
    that.setData({ checkboxItems, value_sex })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  bind_vw: function(e) {
    this.setData({
      value_w: Number(e.detail.value),
    })
  },
  bind_vh: function(e) {
    this.setData({
      value_h: Number(e.detail.value),
    })
    var res = calc_total(this.data['value_h'], this.data['value_w'], this.data['value_a'], this.data['value_ld'])
    this.set_response(res)
  },
  bind_va: function(e) {
    this.setData({
      value_a: Number(e.detail.value)
    })
    var res = calc_total(this.data['value_h'], this.data['value_w'], this.data['value_a'], this.data['value_ld'])
    this.set_response(res)
  },
  bind_vld: function(e) {
    this.setData({
      value_ld: Number(e.detail.value)
    })
    var res = calc_total(this.data['value_h'], this.data['value_w'], this.data['value_a'], this.data['value_ld'])
    this.set_response(res)
  },
  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }

    // 直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },
  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },

  bindPickerChange: function (e) {
    console.log('picker current', e.detail.value)
    console.log(typeof(e.detail.value))
    this.setData({ld_index: e.detail.value})
  },

  valid_input_h: function(h) {
      
  },

  valid_input_w: function(w) {

  },

  valid_input_a: function(a) {

  },

  valid_input_ld: function(ld) {

  },

  set_response: function (data_map) {
    console.log(data_map)
    if (data_map == 0) {
      return
    }
    this.setData({
      total_k: data_map['total_k'],
      db_k: data_map['db_k'],
      db_p: Math.round(data_map['db_p'] * 100),
      db_w: data_map['db_w'],
      zf_k: data_map['zf_k'],
      zf_p: Math.round(data_map['zf_p'] * 100),
      zf_w: data_map['zf_w'],
      ts_k: data_map['ts_k'],
      ts_p: Math.round(data_map['ts_p'] * 100),
      ts_w: data_map['ts_w'],
    })
  }
})

function calc_total(h, w, age, ld) {
  if (h == 0 || w == 0 || ld==0 || age == 0) {
    return 0
  }
  console.log(h, w, age, ld)
  var bmi, yy, hd, h2, h3, p2, total_k, k3
  bmi = w / h / h
  if (bmi > 25){
      yy = 15
  }
  else if (bmi >= 22) {
    yy = 20
  }
  else {
    yy = 25
  }
        
  if (ld > 3){
    hd = 20
  } else if (ld > 2) {
    hd = 15
  } else if (ld > 1) {
    hd = 10
  } else {
    hd = 0
  }

    h2 = (h - 1.05) * 100.0
    h3 = h2 * 1.2
    if (age > 70) {
      p2 = 0.9
    } else if (age > 60) {
      p2 = 1.0
    } else if (age > 50) {
      p2 = 1.0
    } else {
      p2 = 1.0
    }

    total_k = (yy + hd) * h2 * p2
    total_k = total_k.toFixed(1)
    console.log(total_k)
    k3 = total_k * 0.2 / 4.0

    var db_w, db_k, zf_k, ts_k, db_p, zf_p, ts_p, zf_w, ts_w, res
    db_w = Math.max(h3, k3)
    db_w = db_w.toFixed(1)
    db_k = db_w * 4
    zf_k = total_k * 0.25
    ts_k = total_k - db_k - zf_k

    db_p = db_k / total_k
    zf_p = 0.25
    // ts_p = ts_k / total_k
    ts_p = 1 - db_p - zf_p

    zf_w = zf_k / 9.0
    zf_w = zf_w.toFixed(1)
    ts_w = ts_k / 4.0
    ts_w = ts_w.toFixed(1)

    res = {
        'total_k': total_k,
        'db_k': db_k,
        'zf_k': zf_k,
        'ts_k': ts_k,
        'db_w': db_w,
        'zf_w': zf_w,
        'ts_w': ts_w,
        'db_p': db_p,
        'zf_p': zf_p,
        'ts_p': ts_p,
    }
    return res
}
   
