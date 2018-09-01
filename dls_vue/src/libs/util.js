
import Cookies from 'js-cookie'

import axios from "axios";

import objectPath from "object-path";

import SortUrl from 'csqz-encrypt';


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
      res[key] = _decode(val);
    }
  });
  return res;
}
let util = {};

util.http = ({ url, params, auto, openCache, vm }) => {

  let argument = '';
  // console.log(params, url)
  params.source = "pc";

  for (var i in params) {
    argument += i + '=' + params[i] + '&';
  }
  argument = argument.substr(0, argument.length - 1);
  url = url.indexOf('?') == -1 ? url + '?' : url;
  //需要缓存的键名
  let urls = SortUrl(`https://api.ppkao.com${url}${argument}`);
  // let urls = SortUrl(`http://192.168.1.220:8081${url}${argument}`);
  // console.log(urls);
  return new Promise((resolve, reject) => {
    let cacheData = sessionStorage.getItem('cacheData') ? JSON.parse(sessionStorage.getItem('cacheData')) : {};
    if (cacheData[urls] && openCache) {
      //缓存数据存在就返回
      console.log('缓存数据存在');
      resolve(cacheData[urls])
    } else {
      axios({
        method: "get",
        url: urls
      })
        .then(res => decode(res.data))
        .then(res => {
          cacheData[urls] = res;
          cacheData = JSON.stringify(cacheData);
          sessionStorage.setItem('cacheData', cacheData);
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

util.parseInfo = () => {
  let UserInfo = Cookies.get("QZ_FXLoginInfo");
  return UserInfo ? JSON.parse( UserInfo ) : {};
};



util.initRoleMenu = function (groupMenuList, allMenuList) {
  console.log(groupMenuList, allMenuList);

  function addProp(allMenuList) {
      let res;

      if (Array.isArray(allMenuList)) {
        res = [];
      } else if (allMenuList instanceof Object) {
        res = {};
      }
      
      Object.keys(allMenuList).forEach((key) => {
        let value = allMenuList[key];
        if (Array.isArray(value)) {

          res[key] = addProp(value);

        } else if (value instanceof Object) {

          value = Object.assign(value, {
            indeterminate: false,
            checked: false
          });

          res[key] = addProp(value);

        } else {
          res[key] = value;
        }
      });
      return res;      
  }

  allMenuList = addProp(allMenuList);


  function getMenuId(menuList) {
      let menuId = [];
      get(menuList);
      function get(menuList) {
        Object.keys(menuList).forEach((item, index) => {
          const value = menuList[item];
          if (Array.isArray(value)) {
              get(value);
          } else if (value instanceof Object) {
              menuId.push(value.ID);
              if (value['children']) {
                get(value['children']);
              }
          }
        }); 
      }
      return menuId;
  }
  let menuId = getMenuId(groupMenuList);
  console.log(menuId);

  function hasMenuId(id, menuId) {
    return menuId.find((item, index) => {
      if (item === id) {
        return true;
      }
    });
  }

  function setMenuProp(allMenuList) {
      let res;

      if (Array.isArray(allMenuList)) {
        res = [];
      } else if (allMenuList instanceof Object) {
        res = {};
      }
      
      Object.keys(allMenuList).forEach((key) => {
        let value = allMenuList[key];
        if (Array.isArray(value)) {
          res[key] = setMenuProp(value);
        } else if (value instanceof Object) {
          if (value.ID === hasMenuId(value.ID, menuId)) {
            value = Object.assign(value, {
              checked: true
            });
          }
          res[key] = setMenuProp(value);
        } else {
          res[key] = value;
        }
      });
      return res;
  }

  console.log(setMenuProp(allMenuList));
  
  function setInitMenu(allMenuList) {
      let res;

      if (Array.isArray(allMenuList)) {
        res = [];
      } else if (allMenuList instanceof Object) {
        res = {};
      }
      
      Object.keys(allMenuList).forEach((key) => {
        let value = allMenuList[key];
        if (Array.isArray(value)) {

          res[key] = setInitMenu(value);

        } else if (value instanceof Object) {
          let children = value.children;
          let length = children.length;
          let count = 0;
          if (children) {
            children.forEach((item, index) => {
              if (item.checked) {
                count += 1;
              }
              if (index === (length - 1)) {
                if (count === length) {
                  value.indeterminate = false;
                  value.checked = true;
                } else if (count > 0) {
                  value.indeterminate = true;
                  value.checked = true;
                } else {
                  value.indeterminate = false;
                  value.checked = false;
                }
              }
            });
          }

          res[key] = setInitMenu(value);

        } else {
          res[key] = value;
        }
      });
      return res;      
  }

  return setInitMenu(setMenuProp(allMenuList));
}


util.roleMenuSelect = async function (data, newVal) {
  console.log(data, newVal, '/////////////////////////////////////////');
  function roleMenuOneSelect(data, newVal) {
      let res;

      if (Array.isArray(data)) {
        res = [];
      } else if (data instanceof Object) {
        res = {};
      }
      
      Object.keys(data).forEach((key) => {
        let value = data[key];
        if (Array.isArray(value)) {
          res[key] = roleMenuOneSelect(value, newVal);
        } else if (value instanceof Object) {
          if (value.ID === newVal.ID) {
            console.log(value.ID)
            value = Object.assign(value, {
              checked: newVal.checked,
              indeterminate: newVal.indeterminate
            });
            res[key] = downTrans(value);
          } else {
            res[key] = roleMenuOneSelect(value, newVal);
          }
        } else {
          res[key] = value;
        }
      });
      return res;
  }

  function downTrans(data) {
    console.log(data);

    let checked = data.checked;

    let children = data.children;

    if (children.length) {
      console.log('有children');
      data.children = setChildren(children);
    } else {
      console.log('没有children');
      return data;
    }

    function setChildren(children) {
      let res;

      if (Array.isArray(children)) {
        res = [];
      } else if (children instanceof Object) {
        res = {};
      }
      Object.keys(children).forEach((key) => {
        let value = children[key];
        if (Array.isArray(value)) {
          res[key] = setChildren(value);
        } else if (value instanceof Object) {

          if (checked) {
            value.indeterminate = false;
            value.checked = true;
          } else {
            value.checked = false;
            value.indeterminate = false;
          }
          
          res[key] = setChildren(value);
        } else {
          res[key] = value;
        }
      });

      return res;
    }
    console.log(data);
    return data;
  }

  let upTransMenu = roleMenuOneSelect(data, newVal);
  console.log(upTransMenu);

  let currentId = newVal.ParentID;

  // let ParentID = newVal.ParentID;

  
  let forReturn = false;

  async function getLastMenu(upTransMenu, [], currentId) {
    console.log('currentId', currentId);
    if (currentId !== '0') {
      console.log('继续');
      await upTrans(upTransMenu, [], currentId);
    } else {
      console.log('不向上');
      upTransMenu.forEach((item, index) => {
        upTransMenu[index] = Object.assign(item, {
          time: newTime()
        });
      });
      return;
    }
  }
  


  await getLastMenu(upTransMenu, [], currentId);

  console.log('不向上');

  function upTrans(transMenu, props, currentId) {
    // console.log(props);
    return new Promise((resolve, reject) => {
        // console.log('寻找currentId:', currentId);
        if (currentId === '0') {
          resolve('');
          return;
        }
        transMenu.forEach((item, index) => {
          if (forReturn) {
            resolve('');
            return;
          }
          let prop = props;
          prop.push(`${index}`);
          // console.log(prop);
          if (currentId === item.ID) {
              console.log('找到currentId', currentId, '-------', 666, '***************************');
              let level = '';
              prop.forEach((item, index) => {
                if (index === 0) {
                  level = level + `${item}`
                } else {
                  level = level + `.${item}`
                }
              });
              console.log(level);
              console.log(objectPath.get(upTransMenu, level));
              let children = objectPath.get(upTransMenu, level).children;
              let length = children.length;
              let count = 0;
              if (children) {
                children.forEach((item, index) => {
                  if (item.checked) {
                    count += 1;
                  }
                  if (index === (length - 1)) {
                    if (count === length) {
                      objectPath.set(upTransMenu, `${level}.indeterminate`, false);
                      objectPath.set(upTransMenu, `${level}.checked`, true);
                    } else if (count > 0) {
                      objectPath.set(upTransMenu, `${level}.indeterminate`, true);
                      objectPath.set(upTransMenu, `${level}.checked`, true);
                    } else {
                      objectPath.set(upTransMenu, `${level}.indeterminate`, false);
                      objectPath.set(upTransMenu, `${level}.checked`, false);
                    }
                  }
                });
              }
              console.log(objectPath.get(upTransMenu, level));
              currentId = item.ParentID;
              console.log('currentId', currentId);
              getLastMenu(upTransMenu, [], currentId);
              resolve('');
              forReturn = true;
              return;
          } else {
            if (item.children && item.children.length) {
              prop.push('children');
              console.log(prop);
              upTrans(item.children, prop, currentId);
            } else {
              prop.pop()
              // console.log(prop, '/--------------------------------/');
            }
          }
          if (index === (transMenu.length - 1)) {
            prop.pop();
            prop.pop();
            // console.log(prop, '/--------------------------------/');
            resolve('');
            return;
          }
        });
    });
        
  }

  function newTime() {
    return (new Date).getTime();
  }

  console.log(upTransMenu);

  return upTransMenu;
}


import { forEach, hasOneOf } from '@/libs/tools'


export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (routeMetched) => {
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hide
  }).map(item => {
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: item.meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{
    name: '首页',
    to: '/home'
  }, ...res]
}

export const showTitle = (item, vm) => ((item.meta && item.meta.title) || item.name)

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = routers => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children)
      if (res.name) return res
    } else {
      if (item.name === 'home') homeRoute = item
    }
  }
  console.log(homeRoute);
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  console.log(route)
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}


/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextName = (list, name) => {
  let res = ''
  if (list.length === 2) {
    res = 'home'
  } else {
    if (list.findIndex(item => item.name === name) === list.length - 1) res = list[list.length - 2].name
    else res = list[list.findIndex(item => item.name === name) + 1].name
  }
  return res
}






export default util;