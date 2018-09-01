import Main from '@/views/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'PP题库分销系统 - 登录',
      hideInMenu: true
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: false,
      access: ['4']
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          hideInMenu: true,
          notCache: false,
          title: '首页',
        },
        component: () => import('@/views/home/home.vue')
      }
    ]
  },
  {
    path: "/agent-distribution",
    name: "agent-distribution",
    meta: {
      showAlways: true,
      icon: "md-globe",
      title: "代理分销",
      access: ['49']
    },
    component: Main,
    children: [
      {
        path: "agent",
        name: "agent",
        meta: {
          title: "代理商管理",
          access: ['50']
        },
        component: () => import("@/views/agent-distribution/agent.vue")
      },
      {
        path: "detail",
        name: "detail",
        meta: {
          title: "代理详情",
          access: ['51']
        },
        component: () => import("@/views/agent-distribution/components/detail/detail.vue")
      },
      {
        path: "userList",
        name: "userList",
        meta: {
          title: "用户列表",
          access: ['52']
        },
        component: () => import("@/views/agent-distribution/userList.vue")
      },
      {
        path: "revenueOutturn",
        name: "revenueOutturn",
        meta: {
          title: "收入结算",
          access: ['53']
        },
        component: () => import("@/views/agent-distribution/revenueOutturn.vue")
      },
      {
        path: "promoteLinks",
        name: "promoteLinks",
        meta: {
          title: "推广链接",
          access: ['54']
        },
        component: () => import("@/views/agent-distribution/promoteLinks.vue")
        
      },
      // {
      //   path: "promoteLinks",
      //   name: "promoteLinks",
      //   meta: {
      //     title: "帮助文档",
      //     access: ['55']
      //   },
      //   component: () => import("@/views/agent-distribution/promoteLinks.vue")
        
      // }
    ]
  },
  
  {
    path: "/withdrawal-audit",
    name: "withdrawal-audit",
    meta: {
      // showAlways: true,
      icon: "logo-yen",
      title: "提现审核",
      access: ['57']
    },
    component: Main,
    children: [
      {
        path: "withdrawal",
        meta: {
          title: "提现审核",
          icon: "logo-yen",
        },
        name: "withdrawal",
        component: () => import("@/views/withdrawal-audit/withdrawal.vue")
      }
    ]
  },

  {
    path: "/marketing-settings",
    name: "marketing-settings",
    meta: {
      showAlways: true,
      icon: "md-trending-up",
      title: "营销设置",
      access: ['58']
    },
    component: Main,
    children: [
      {
        path: "coupons",
        meta: {
          title: "优惠券",
          access: ['59']
        },
        name: "coupons",
        component: () => import("@/views/marketing-settings/coupons.vue")
      },
      {
        path: "activity",
        meta: {
          title: "活动设置",
          access: ['60']
        },
        
        name: "activity",
        component: () => import("@/views/marketing-settings/activity.vue")
      },
      {
        path: "advertisement",
        
        meta: {
          title: "客户端广告",
          access: ['61']
        },
        name: "advertisement",
        component: () => import("@/views/marketing-settings/advertisement.vue")
      },
      {
        path: "invoice",
        meta: {
          title: "发票信息",
          access: ['73']
        },
        
        name: "invoice",
        component: () => import("@/views/marketing-settings/invoice.vue")
      }
    ]
  },
  // {
  //   path: "/announcement-pub",
    
  //   name: "announcement-pub",
    
  //   meta: {
  //     // showAlways: true,
  //     icon: "ios-megaphone",
  //     title: "公告推送",
  //     access: ['63']
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: "announcement",
  //       name: "announcement",
  //       meta: {
  //         title: "公告推送",
  //         icon: "ios-megaphone",
          
  //       },
        
  //       component: () => import("@/views/marketing-settings/announcement.vue")
  //     }
  //   ]
  // },
  {
    path: "/system-management",
    name: "system-management",
    meta: {
      showAlways: true,
      icon: "md-settings",
      title: "系统管理",
      // access: ['12']
    },
    component: Main,
    children: [
      {
        path: "menu",
        name: "menu",
        meta: {
          title: "菜单管理",
          // access: ['13']
        },
        
        component: () =>
          import("@/views/system-management/menu.vue")
      },
      {
        path: "role",
        name: "role",
        meta: {
          title: "角色管理",
          // access: ['14']
        },
        
        component: () =>
          import("@/views/system-management/role.vue")
      },
      {
        path: "member",
        name: "member",
        meta: {
          title: "成员列表",
          access: ['64']
        },
        component: () =>
          import("@/views/system-management/member.vue")
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error-page/404.vue')
  }
]
