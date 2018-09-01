import base64 from './base64.min.js';
import globalData from '../globalData.js';
import SortUrl from './sort.min.js';

//base64解密

function decode(obj) {
  const res = {};

  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (Array.isArray(val)) {
      res[key] = [];
      val.forEach(item => {
        res[key].push(decode(item));
      });
    } else if (val instanceof Object) {
      res[key] = decode(val);
    } else {
      res[key] = base64.decode(val);
    }
  });
  return res;
}

const path = 'https://api.ppkao.com';
var Http = {
  /**
   * [HTTP GET 请求]
   * @param [第1种使用方法是URL不带参数。第2种使用方法是在请求URL后带参数，如：?id=1&name=ming]
   * 1. HTTP.get(url).then((data) => {}).catch((error) => {})
   * 2. HTTP.get({url: url, params: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  get: function(requestHandler) {
    if (typeof requestHandler === 'string') {
      requestHandler = {
        url: path + String(requestHandler),
        params: {}
      };
    }
    return this.Request('GET', requestHandler);
  },

  /**
   * [HTTP POST 请求]
   * @param [可自定义 headers，如需 Authorization 等，默认：'Content-Type': 'application/json']
   * HTTP.post({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  post: function(requestHandler) {
    return this.Request('POST', requestHandler);
  },

  /**
   * [HTTP PATCH 请求]
   * HTTP.patch({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  patch: function(requestHandler) {
    return this.Request('PATCH', requestHandler);
  },

  /**
   * [HTTP PUT 请求]
   * HTTP.put({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  put: function(requestHandler) {
    return this.Request('PUT', requestHandler);
  },

  /**
   * [HTTP DELETE 请求]
   * HTTP.delete({url: url, params: [JSON Object], headers: [JSON Object] }).then((data) => {}).catch((error) => {})
   */
  delete: function(requestHandler) {
    return this.Request('DELETE', requestHandler);
  },

  // request
  Request: function(method, requestHandler) {
    let { url, params, headers, mask, CloseCache } = requestHandler;
    const { action, cid, title, did, page, count, type } = params;
    url = path + url; //  https://data.api.ppkao.com/Interface/PatientRecipes/Get_CategoryInfo.ashx

    //完整的接口参数，使其索引变成唯一
    // console.log(globalData, '全局数据');

    let argument = '';
    var add = 0;
    // console.log(params)
    for (var i in params) {
      argument += i + '=' + params[i] + '&';
      add++;
    }

    argument = argument.substr(0, argument.length - 1);
    // console.log(argument);

    url = url + argument;
    // console.log(url, '请求地址');

    return new Promise((resolve, reject) => {
      if (globalData[url] && !CloseCache) {
        //使用缓存数据
        resolve(decode(globalData[url]));
        wx.hideLoading && wx.hideLoading();
        // console.log('没有发起请求');
      } else {
        wx.showLoading &&
          wx.showLoading({
            title: 'Loading...',
            mask: mask ? mask : false
          });
        //调用接口获取新的数据
        globalData[action] = {
          //以唯一的action为索引，将接口的参数传入globalData
          action,
          cid,
          title,
          did,
          page,
          count,
          type
        };
        wx.request({
          url: SortUrl(url),
          // data: params,
          method:
            ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].indexOf(method) > -1
              ? method
              : 'GET',
          header: Object.assign(
            {
              'Content-Type': 'application/json'
              /*
            这里可以自定义全局的头信息，这是一个栗子
            'Authorization': 'Bearer ' + wx.getStorageSync('token'),
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded'
            */
            },
            headers
          ),
          success: function(res) {
            // console.log(res, '请求数据');
            const { data, statusCode } = res;
            globalData[url] = data;

            // 处理数据
            statusCode === 200 ? resolve(decode(data)) : '';
          },
          fail: async function(res) {
            let data = await NetworkType();

            if (data) {
              resolve(data);
            } else {
              resolve(true);
            }
          },
          complete: function() {
            wx.hideLoading && wx.hideLoading();
          }
        });
      }
    });
  }
};

function NetworkType() {
  var noDataState = false;
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        const { networkType } = res;

        if (networkType == 'none') {
          noDataState = true;
        } else {
          noDataState = false;
        }

        resolve(noDataState);
      },
      fail: function() {
        reject('检测网络状况失败!');
      },
      complete: function() {
        // wx.hideLoading && wx.hideLoading();
      }
    });
  });
}

module.exports = {
  decode: decode,
  HTTP: Http,
  NetworkType: NetworkType
};
