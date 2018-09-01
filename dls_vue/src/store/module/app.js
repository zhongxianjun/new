import { getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: getHomeRoute(routers),
    detailInfo: {},
    local: '',
    addMenuExtra: '',
    deleteMenuExtra: '',
    rolePowerExtra: ''
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, item, type = 'unshift') {
      if (state.tagNavList.findIndex(tag => tag.name === item.name) < 0) {
        if (type === 'push') state.tagNavList.push(item)
        else state.tagNavList.unshift(item)
        
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setDetailInfo (state, info) {
      state.detailInfo = info
    },
    setLocal (state, lang) {
      state.local = lang
    },
    addMenuExtra(state, data) {
        state.addMenuExtra = data;
        console.log(state.addMenuExtra);
    },
    deleteMenuExtra(state, data) {
        state.deleteMenuExtra = data;
        console.log(state.deleteMenuExtra);
    },
    rolePowerExtra(state, data) {
        state.rolePowerExtra = data;
        console.log(state.rolePowerExtra);
    },
  }
}
