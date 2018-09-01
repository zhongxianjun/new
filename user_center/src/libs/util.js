import axios from "axios";
import env from "../../build/env";
import SortUrl from "csqz-encrypt";
import {
  router
} from "../router/index";
import Cookies from "js-cookie";
import store from "../store";

function _decode(str) {

  const res = Buffer.from(str, "base64").toString();
  return res;
}

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
      if (val) {

        res[key] = _decode(val);
      }
    }
  });
  return res;
}
let util = {};
//跳转页面无阻碍
util.openPage = async (url) => {
  let newWindow = null;

  newWindow = window.open("about:blank");
  // await util.sleep(500)
  console.log(url, '支付链接')
  newWindow.location = url;

  // href.location = url;
};
//获取优惠券列表
util.GroupNum = async () => {
  return new Promise(async (resolve, reject) => {
    const groupList = await util.http({
      url: "/Interface/ShopCouponUserApi.ashx?",
      params: {
        action: "GetShopCouponUserList",
        UseFlag: 0
      },
      auto: true
    });
    if (groupList.S == 1 && groupList.ShopCouponUserList) {
      resolve(groupList.ShopCouponUserList);
    } else {
      resolve('');
    }

  })

}
util.http = ({
  url,
  params,
  auto,
  openCache,
  vm
}) => {

  let argument = '';
  console.log(params, url)
  params.source = "api_pc";
  if (auto) {
    const {
      UserID,
      UserToken
    } = util.parseInfo();
    params.UserID = UserID;
    params.UserToken = UserToken;
  }
  for (var i in params) {
    argument += i + '=' + params[i] + '&';
  }
  argument = argument.substr(0, argument.length - 1);
  url = url.indexOf('?') == -1 ? url + '?' : url;
  let urls = `https://data.api.ppkao.com${url}${argument}`; //需要缓存的键名
  console.log(SortUrl(urls), urls, '打印的链接')
  urls = SortUrl(urls);
  return new Promise((resolve, reject) => {
    if (store.state.app.cache[urls] && openCache) {
      //缓存数据存在就返回
      resolve(store.state.app.cache[urls])
    } else {
      axios({
          method: "get",
          url: urls
        })
        .then(res => decode(res.data))
        .then(res => {
          store.commit("setCacheData", {
            data: res,
            url: urls
          }); //缓存数据
          resolve(res);
        })
        .catch(function (error) {
          resolve("");
          if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            // console.error(error.response.data);
            // console.error(error.response.status);
            // console.error(error.response.headers);
            if (error.response.status === 404) {
              vm && vm.$router.push("/404");
            } else if (error.response.status === 500) {
              vm && vm.$router.push("/500");
            }
          } else {
            vm && vm.$router.push("/500");
            // Something happened in setting up the request that triggered an Error
            // console.error("Error", error.message);
          }
          console.error(error, "报错的信息");
        });

    }
  });
};
//等待
util.sleep = time =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
//轮询
util.polling = async (vm, {
  timing,
  allTime,
  fn
}) => {
  console.log('开始轮询')
  let count = 0;
  //处理结果返回
  return new Promise(resolve => {
    vm.$store.state.user.time = setInterval(() => {

      if (count >= allTime) {
        //定时任务完成
        clearInterval(vm.$store.state.user.time);
        resolve(1); //任务失败 未在规定时间内完成任务
      } else {
        fn && fn();
      }
      count += timing;
    }, timing * 1000)

  })

}
util.parseInfo = () => {
  let UserInfo = `${Cookies.get("QZ_KSUser")}`,
    url = UserInfo, //获取url中"?"符后的字串
    theRequest = new Object(),
    strs = UserInfo.split("&");
  for (var i = 0; i < strs.length; i++) {
    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
  }
  return theRequest;
};
util.decode = _decode;
util._decode = decode;
//更新用户状态
util.updateUserInfo = async vm => {
  const {
    UserID,
    UserToken
  } = util.parseInfo();
  const Rnd = Cookies.get("Rnd");
  let data = await util.http({
    url: "/Interface/UserApi.ashx?",
    params: {
      action: "GetUserModel"

    },
    auto: true,
    vm
  });

  if (data.S == 1) {
    const UserInfo = data.UserList[0];

    if (Rnd && Rnd != UserInfo.RndPassword) {

      vm.$router.push("/403?permissions=none");
      // vm.$Modal.warning({
      //     title: "请注意账号安全切勿借给他人使用",
      //     content: "系统检测到您的账号在别处登录,请重新输入用户名密码进行登录",
      //     onOk: ()=>{
      //         vm.$store.commit("logout", this);
      //         vm.$store.commit("clearOpenedSubmenu");
      //         vm.$router.push({ name: "login" });

      //     }
      // });
    } else {
      vm.$store.commit("SetUserInfo", UserInfo);

      vm.$store.commit("setAvator", UserInfo.UserFace);
      vm.$store.commit("SetUserInfo", UserInfo);
      if (env === "development") {
        Cookies.set(
          "QZ_KSUser",
          `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
          UserInfo.UserToken
          }`, {
            expires: 7
          }
        );
      } else if (env === "production") {
        Cookies.set(
          "QZ_KSUser",
          `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
          UserInfo.UserToken
          }`, {
            expires: 7,
            domain: ".ppkao.com"
          }
        );
      } else {
        Cookies.set(
          "QZ_KSUser",
          `UserID=${UserInfo.UserID}&UserName=${UserInfo.UserName}&UserToken=${
          UserInfo.UserToken
          }`, {
            expires: 7,
            domain: ".ppkao.com"
          }
        );
      }
    }
  } else {}
};
axios.defaults.headers["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
util.ajax = url => {
  return new Promise((resolve, reject) => {
    axios({
        method: "get",
        url,
        timeout: 20000
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(function (error) {
        resolve("哎呀服务器有点忙稍等一下~");
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          // console.error(error.response.data);
          // console.error(error.response.status);
          // console.error(error.response.headers);
          if (error.response.status === 404) {
            console.log(router);
          } else if (error.response.status === 500) {}
        } else {
          // Something happened in setting up the request that triggered an Error
          // console.error("Error", error.message);
        }
        // console.error(error.config);
      });
  });
};
util.title = function (title) {
  title = title || "考试资料网-用户中心";
  window.document.title = title;
};

const ajaxUrl =
  env === "development" ?
  "http://127.0.0.1:8888" :
  env === "production" ?
  "https://www.url.com" :
  "https://debug.url.com";

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.showThisRoute = function (itAccess, currentAccess) {
  if (typeof itAccess === "object" && Array.isArray(itAccess)) {
    return util.oneOf(currentAccess, itAccess);
  } else {
    return itAccess === currentAccess;
  }
};

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  // debugger;
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === "object") {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function (vm, name) {
  let title = "";
  let isOtherRouter = false;
  vm.$store.state.app.routers.forEach(item => {
    if (item.children.length === 1) {
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === "otherRouter") {
          isOtherRouter = true;
        }
      }
    } else {
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === "otherRouter") {
            isOtherRouter = true;
          }
        }
      });
    }
  });
  let currentPathArr = [];
  if (name === "home_index") {
    currentPathArr = [{
      title: util.handleTitle(
        vm,
        util.getRouterObjByName(vm.$store.state.app.routers, "home_index")
      ),
      path: "",
      name: "home_index"
    }];
  } else if (
    (name.indexOf("_index") >= 0 || isOtherRouter) &&
    name !== "home_index"
  ) {
    currentPathArr = [{
        title: util.handleTitle(
          vm,
          util.getRouterObjByName(vm.$store.state.app.routers, "home_index")
        ),
        path: "/home",
        name: "home_index"
      },
      {
        title: title,
        path: "",
        name: name
      }
    ];
  } else {
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      } else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
        while (i < len) {
          if (childArr[i].name === name) {
            return true;
          }
          i++;
        }
        return false;
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === "home") {
      currentPathArr = [{
        title: "首页",
        path: "",
        name: "home_index"
      }];
    } else if (
      currentPathObj.children.length <= 1 &&
      currentPathObj.name !== "home"
    ) {
      currentPathArr = [{
          title: "首页",
          path: "/home",
          name: "home_index"
        },
        {
          title: currentPathObj.title,
          path: "",
          name: name
        }
      ];
    } else {
      let childObj = currentPathObj.children.filter(child => {
        return child.name === name;
      })[0];
      currentPathArr = [{
          title: "首页",
          path: "/home",
          name: "home_index"
        },
        {
          title: currentPathObj.title,
          path: "",
          name: currentPathObj.name
        },
        {
          title: childObj.title,
          path: currentPathObj.path + "/" + childObj.path,
          name: name
        }
      ];
    }
  }
  vm.$store.commit("setCurrentPath", currentPathArr);

  return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) {
      // 页面已经打开
      vm.$store.commit("pageOpenedList", {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter(item => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];
    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit("increateTag", tag);
    }
  }
  vm.$store.commit("setCurrentPageName", name);
};

util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (
      routers[i].name === name &&
      routers[i].children &&
      routers[i].redirect === undefined
    ) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    console.log(routers, name, )
    next();
  }
};

util.fullscreenEvent = function (vm) {
  vm.$store.commit("initCachepage");
  // 权限菜单过滤相关
  vm.$store.commit("updateMenulist");
  // 全屏相关
};

util.checkUpdate = function (vm) {
  // axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
  //     let version = res.data.tag_name;
  //     vm.$Notice.config({
  //         duration: 0
  //     });
  //     if (semver.lt(packjson.version, version)) {
  //         vm.$Notice.info({
  //             title: 'iview-admin更新啦',
  //             desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
  //         });
  //     }
  // });
};

export default util;