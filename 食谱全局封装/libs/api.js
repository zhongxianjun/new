import { HTTP } from '../libs/util.js';

//获取食物接口调用 函数封装
function Food(info, CloseCache) {
  return new Promise((resolve, reject) => {
    HTTP.get({
      url: '/Interface/PatientRecipes/Get_Eatables.ashx?',
      params: info,
      mask: true,
      CloseCache: CloseCache
    }).then(res => {
      resolve(res);
    });
  });
}

//产品种类 接口调用 函数封装
function getCategoryAllInfo() {
  return new Promise((resolve, reject) => {
    HTTP.get({
      url: '/Interface/PatientRecipes/Get_CategoryInfo.ashx?',
      params: { action: 'Get_CategoryAllInfo' },
      mask: true,
      CloseCache: false
    }).then(res => {
      // console.log(res, '产品种类,请求结果');
      resolve(res);
    });
  });
}

//获取所有疾病接口调用 函数封装
function getDiseaseAllInfo() {
  return new Promise((resolve, reject) => {
    HTTP.get({
      url: '/Interface/PatientRecipes/Get_CategoryInfo.ashx?',
      params: { action: 'Get_DiseaseAllInfo' },
      mask: true,
      CloseCache: true
    }).then(res => {
      resolve(res);
    });
  });
}

module.exports = {
  Food: Food,
  getCategoryAllInfo: getCategoryAllInfo,
  getDiseaseAllInfo: getDiseaseAllInfo
};
