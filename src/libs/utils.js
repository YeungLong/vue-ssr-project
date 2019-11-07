//import $ from 'jquery'

export default {
  /*
  * @param {Object || Array} obj：要克隆的对象
  */    
  clone: function(obj) {
    var o;
    if (typeof obj == "object") {
      if (obj === null) {
        o = null;
      } else {
        if (obj instanceof Array) {
          o = [];
          for (var i = 0, len = obj.length; i < len; i++) {
            o.push(this.clone(obj[i]));
          }
        } else {
          o = {};
          for (var j in obj) {
            o[j] = this.clone(obj[j]);
          }
        }
      }
    } else {
      o = obj;
    }
    return o;
  },

  // 数组去重
  unique: function(items, filterOn) {
    let newItems = []

    if (Array.isArray(items)) {
      items.forEach(item => {
        if (!newItems.includes(item[filterOn])) {
          newItems.push(item[filterOn])
        }
      })
    }
    return newItems
  },

  // 禁用页面滚动
  disableBodyScroll: function() {
    // document.body.style.position = "fixed";
  },

  // 启动页面滚动
  enableBodyScroll: function(size) {
    // document.body.style.position = "static";
    // window.scrollTo(0,size);
  },

  // 判断是否是安卓设备
  isAndroid: function() {
    let userAgent = navigator.userAgent
    return (userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1)
  },

  /*
   * 手机号验证2
   * @param  {String} number：手机号
   * @return {Object} 验证成功或失败
   */
  validateMobileNumber: function(number) {
    if (number === '') {
      return false;
    }
    let re = /^(13[0-9]|147|145|15[0-9]|17[0-9]|18[0-9])[0-9]{8}$/;
    if (!re.test(number)) {
      return false;
    }
    return true;
  },

  /**
   * 判断闰年
   * @param yy
   * @returns {boolean}
   */
  isLeapYear: function (yy) {
    if (((yy % 4) == 0) && ((yy % 100) != 0) || ((yy % 400) == 0)) {
      return true;
    } else {
      return false;
    }
  },
  
  /**
   * 判断是否是微信浏览器
   * @param 
   * @returns {boolean}
   */
  isWeixin: function () {
    let ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
  },

  // 转换日期格式
  formatDate(fmt) {
    var date = new Date();
    var o = {   
        "M+" : date.getMonth()+1,                 //月份   
        "d+" : date.getDate(),                    //日   
        "h+" : date.getHours(),                   //小时   
        "m+" : date.getMinutes(),                 //分   
        "s+" : date.getSeconds(),                 //秒   
        "q+" : Math.floor((date.getMonth()+3)/3), //季度   
        "S"  : date.getMilliseconds()             //毫秒   
    };   
    if(/(y+)/.test(fmt))   
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
    for(var k in o)   
        if(new RegExp("("+ k +")").test(fmt))   
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
    return fmt;   
  },
  /**
   * 计算年龄
   * @param date
   * @param flyDate
   * @returns {number}
   */
  checkAge: function (date, flyDate) {
    let yy = date.substr(0, 4)
    let mm = date.substr(5, 2)
    let dd = date.substr(8, 2)
    let main = "valid"

    if (date.indexOf('-1') != -1) {
      yy = date.substr(0, 4)
      mm = date.substr(5, 2)
      dd = date.substr(8, 2)
    }

    if ((mm < 1) || (mm > 12) || (dd < 1) || (dd > 31) || (yy < 1) || (mm == "") || (dd == "") || (yy == "")) main = "invalid"
    else if (((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) && (dd > 30)) main = "invalid"
    else if (mm == 2) {
      if (dd > 29) {
        main = "invalid"
      } else if ((dd > 28) && (!this.isLeapYear(yy))) {
        main = "invalid"
      }
    } else if ((yy > 9999) || (yy < 0)) main = "invalid";

    if (main == "valid") {
      var days = new Date(Date.parse(flyDate.replace(/-/g, "/")));

      var gdate = days.getDate();
      var gmonth = days.getMonth();
      var gyear = days.getFullYear();
      var age = gyear - yy;
      if ((mm == (gmonth + 1)) && (dd <= parseInt(gdate))) {
        age = age;
      } else {
        if (mm <= (gmonth)) {
          age = age;
        } else {
          age = age - 1;
        }
      }
      if (age == 0) age = age;
      return age;
    }
  },

  /**
   * 乘机人新增成人判断
   * @param cardtype
   * @param cardno
   * @param birth
   * @param flyDate
   * @returns {*}
   */
  isAgeType: function (cardtype, cardno, birth, flyDate) {
    let year = ""
    let month = ""
    let day = ""
    if (cardtype === "身份证") {
      year = cardno.substr(6, 4);
      month = cardno.substr(10, 2);
      day = cardno.substr(12, 2)
    } else {
      if (birth.indexOf('-') != -1) {
        year = birth.substr(0, 4);
        month = birth.substr(5, 2);
        day = birth.substr(8, 2)
      } else {
        year = birth.substr(0, 4);
        month = birth.substr(4, 2);
        day = birth.substr(6, 2);
      }
    }
    var age = this.checkAge(year + month + day, flyDate);

    if (age >= 18) {
      return "AA"; //完全成人
    } else if (age < 18 && age >= 12) {
      return "A"; //成人
    } else if (age < 12 && age >= 5) {
      return "BB"; //儿童1
    } else if (age < 5 && age >= 2) {
      return "B"; //儿童2
    } else {
      return "C"; //婴儿
    }
  },

  /**
   * 判断空对象
   */
  isEmptyObject: function(obj) {
    for (let key in obj) {
      return false
    }
    return true
  },

  // 平台ID： 手Q  519  微信  501  小程序  502
  platId : function () {
    return 519
  },

   /*
  * 设置PC端页面标题
  * @param {String} title：标题
  */
  title: function (title) {
    title = title || '';
      window.document.title = title;
  },

  /*
  * 设置移动端页面标题
  * @param {String} title：标题
  */
  // setTitle: function(title) {
  //     var u = navigator.userAgent
  //     var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
  //     var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  //     if (isAndroid) {
  //       document.title = title
  //     } else if (isiOS) {
  //       var $body = $('body')
  //       document.title = title
  //       var $iframe = $('<iframe src="/favicon.ico"></iframe>')
  //       $iframe.on('load', function () {
  //         window.setTimeout(function () {
  //           $iframe.off('load').remove()
  //         }, 0)
  //       }).appendTo($body)
  //     }
  // },

  /*
  * 获取cookie值
  * @param {String} name：键名
  */
   getCookie:function(name)  { 
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
     
        if(arr=document.cookie.match(reg))
     
            return unescape(arr[2]); 
        else 
            return null; 
  },

  /*
  * 添加cookie值
  * @param {String} name：键名
  * @param {any} value：键值
  * @param {Number} day：天数
  */    
  addCookie: function (name, value, day) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + day);
    //设置失效时间
    document.cookie = escape(name) + '=' + value +';path=/;expires=' + expireDate.toGMTString();
  },

  /**
   * 将json对象组装为form 数据类型
   * @param obj
     */
  setFormData:function(obj){
    var formData = new FormData();
    for (var Key in obj){
      formData.append(Key,obj[Key]);
    }
    return formData;
  },

  IdentityCodeValid: function(code) {
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;

    if(!code || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(code)){
        tip = "身份证号格式错误";
        pass = false;
    }

    else if(!city[code.substr(0,2)]){
        tip = "地址编码错误";
        pass = false;
    }
    else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
        //校验位
        var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++)
        {
            ai = code[i];
            wi = factor[i];
            sum += ai * wi;
        }
        var last = parity[sum % 11];
        if(parity[sum % 11] != code[17]){
            tip = "校验位错误";
            pass =false;
        }
        }
    }
    return pass;
    },
    /**
     * 按数组中某个属性排序，sort desc 降序 asc升序
     * @param property
     * @param sort
     * @returns {Function}
         */
    compare:function(property,sort){
        return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return sort == 'asc' ? value1 - value2:value2 - value1;
        }
    },

    /**
     * 计算两个时间相差天数
     * @param startDate
     * @param endDate
     * @returns {number}
         */
    getDateDiff: function(startDate,endDate)
    {
        var startTime = new Date(Date.parse(startDate.replace(/-/g,   "/"))).getTime();
        var endTime = new Date(Date.parse(endDate.replace(/-/g,   "/"))).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return  dates;
    },
    
    /**
     * 两个数组是否有共同元素
     * @param a1
     * @param a2
     * @returns {number}
     */
    ExistsSameValues: function(a1, a2) {
        var exists = false;
        if(a1 instanceof Array && a2 instanceof Array)
        {
        for (var i=0,iLen=a1.length; i<iLen; i++)
        {
            for (var j=0,jLen=a2.length; j<jLen; j++)
            {
            if (a1[i]===a2[j])
            {
                return true;
            }
            }
        }
        }
        return exists;
  },

  /**
   * 一个数组的元素是否完全在另一个数组中
   * @param arr 要验证的数组
   * @param targetArr 目标数组
   * @returns {boolean}
   */
  inOf: function (arr, targetArr) {
      let res = true;
      for (let i = 0; i < arr.length; i++) {
          if (targetArr.indexOf(arr[i]) < 0) {
              res = false;
              break;
          }
      };
      return res;
  },

  /**
   * 验证数组中是否包含目标元素
   * @param ele 要验证的元素
   * @param targetArr 目标数组
   * @param index 可选，Number类型 指定从数组的指定索引位置开始查找，默认为 0
   * @returns {boolean}
   */
  oneOf: function (ele, targetArr, index) {
      let start = index ? index: 0;
      for (let i = start; i < targetArr.length; i++) {
        if (targetArr[i] === ele) {
          return true;
        }
      }
      return false
  },

  /* 金额格式化
  * @params x 要格式化的金额
  */
  toDecimal2: function (x) {
      var f = parseFloat(x);
      if (isNaN(f)) {
          return false;
      }
      var f = Math.round(x * 100) / 100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
          rs = s.length;
          s += '.';
      }
      while (s.length <= rs + 2) {
          s += '0';
      }
      return s;
  },

  // 超出部分省略
  overflowOmit(str, len) {
    let tmp = '';
    tmp = tmp + str.substr(0, len) + '...';
    return str.length > len ? tmp : str;
  },
}
