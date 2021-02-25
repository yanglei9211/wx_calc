Page({
  data: {
    focus: false,
    inputValue: '',
    value_a: 0,
    value_h: 0,
    value_w: 0,
    value_ld: 0,
    total_k: 0,

    need_gf_w: 0,
    need_gf_w2: 0,
    need_p: 0,

    db_k: 0,
    db_p: 0,
    db_w: 0,

    zf_k: 0,
    zf_p: 0,
    zf_w: 0,

    ts_k: 0,
    ts_p: 0,
    ts_w: 0,

    h_items: [[0, 1, 2], Array.from({length: 100}, (x,i) => i)],
    w_items: [['', 1, 2], Array.from({length: 100}, (x,i) => i)],
    a_items: [[4, 5, 6, 7, 8, 9], Array.from({length: 10}, (x,i) => i)],
    ld_items: ["卧床", "轻体力", "中体力", "重体力"],
    h_picker_index: [1, 60],
    w_picker_index: [0, 80],
    a_picker_index: [0, 0],
    ld_picker_index: 1,
    checkboxItems: [
      { name: '男', value: '0' },
      { name: '女', value: '1' },
    ],
    value_sex: 0,
  },


  bind_h_picker_change: function (e) {
    this.setData({
      h_picker_index: e.detail.value
    })
    this.calc_value(e)
  },
  bind_w_picker_change: function(e) {
    this.setData({
      w_picker_index: e.detail.value
    })
    this.calc_value(e)
  },

  bind_a_picker_change: function(e) {
    this.setData({
      a_picker_index: e.detail.value
    })
    this.calc_value(e)
  },

  bind_ld_picker_change: function(e) {
    this.setData({
      ld_picker_index: e.detail.value
    })
    this.calc_value(e)
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
  calc_value: function(e) {
    var h = this.collect_input_h(e)
    var w = this.collect_input_w(e)
    var a = this.collect_input_a(e)
    var ld = this.collect_input_ld(e)
    // var input = {'h': h, 'w': w, 'a': a, 'ld': ld}
    var res = calc_total(h, w, a, ld)
    var ts_w = res['ts_w']
    var need_res = calc_need(ts_w)
    this.set_response(res)
    this.set_need_response(need_res)
  },

  collect_input_h: function(e) {
    var h_items = this.data['h_items']
    var h_index = this.data['h_picker_index']
    var h = h_items[0][h_index[0]] + h_items[1][h_index[1]] / 100.0
    // console.log('h: ', h)
    return h
  },

  collect_input_w: function(e) {
    var w_items = this.data['w_items']
    var w_index = this.data['w_picker_index']
    var w = w_items[0][w_index[0]] * 10 + w_items[1][w_index[1]]
    // console.log('w: ', w)
    return w
  },

  collect_input_a: function(e) {
    var a_items = this.data['a_items']
    var a_index = this.data['a_picker_index']
    var age = a_items[0][a_index[0]] * 10 + a_items[1][a_index[1]]
    // console.log('age: ', age)
    return age
  },

  collect_input_ld: function(e) {
    var ld_index = Number(this.data['ld_picker_index'])
    var ld = ld_index + 1
    // console.log('ld: ', ld)
    return ld
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
  },

  set_need_response: function(data_map) {
    console.log(data_map)
    if (data_map == 0) {
      return
    }
    this.setData({
      need_gf_w: data_map['gf_w'],
      need_gf_w2: data_map['gf_w2'],
      need_p: data_map['p'],
    })
  }
})

function calc_need(ts_w) {
    if (ts_w == 0) {
      return 0
    }
    var zao_ts_w = ts_w * 0.2
    var wu_ts_w = ts_w * 0.4
    var wan_ts_w = ts_w * 0.4
    var zao_gf_w = zao_ts_w * 1.18
    var wu_gf_w = wu_ts_w * 1.18
    var wan_gf_w = wan_ts_w * 1.18
    var gf_w = zao_gf_w + wu_gf_w + wan_gf_w
    var gf_w2 = gf_w / 50.0
    var p = gf_w * 0.03
    gf_w = gf_w.toFixed(1)
    gf_w2 = gf_w2.toFixed(1)
    p = p.toFixed(2)
    var res = {'gf_w': gf_w, 'gf_w2': gf_w2, 'p': p}
    return res
}

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
    
    console.log(total_k)
    k3 = total_k * 0.2 / 4.0

    var db_w, db_k, zf_k, ts_k, db_p, zf_p, ts_p, zf_w, ts_w, res
    db_w = Math.max(h3, k3)
    
    db_k = db_w * 4
    zf_k = total_k * 0.25
    ts_k = total_k - db_k - zf_k

    db_p = db_k / total_k
    zf_p = 0.25
    // ts_p = ts_k / total_k
    ts_p = 1 - db_p - zf_p
    console.log(ts_p, db_p, zf_p)
    zf_w = zf_k / 9.0
    ts_w = ts_k / 4.0
    

    total_k = total_k.toFixed(1)
    db_k = db_k.toFixed(1)
    // db_p = db_p.toFixed(1)
    db_w = db_w.toFixed(1)
    
    zf_k = zf_k.toFixed(1)
    // zf_p = zf_p.toFixed(1)
    zf_w = zf_w.toFixed(1)

    ts_k = ts_k.toFixed(1)
    // ts_p = ts_p.toFixed(1)
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
   
