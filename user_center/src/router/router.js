import Main from "@/views/Main.vue";

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: "/login",
  name: "login",
  meta: {
    title: "考试资料网 - 登录"
  },
  component: () => import("@/views/login.vue")
};

export const page404 = {
  path: "/*",
  name: "error-404",
  meta: {
    title: "404-页面不存在"
  },
  component: () => import("@/views/error-page/404.vue")
};

export const page403 = {
  path: "/403",
  meta: {
    title: "权限不足"
  },
  name: "error-403",
  component: () => import("@//views/error-page/403.vue")
};

export const page500 = {
  path: "/500",
  meta: {
    title: "500-服务端错误"
  },
  name: "error-500",
  component: () => import("@/views/error-page/500.vue")
};

// export const preview = {
//   path: "/preview",
//   name: "preview",
//   component: () => import("@/views/form/article-publish/preview.vue")
// };

export const locking = {
  path: "/locking",
  name: "locking",
  component: () =>
    import("@/views/main-components/lockscreen/components/locking-page.vue")
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: "/",
  name: "otherRouter",
  redirect: "/home",
  component: Main,
  children: [
    {
      path: "home",
      title: { i18n: "home" },
      name: "home_index",
      component: () => import("@/views/home/home.vue")
    },
    {
      path: "ownspace",
      title: "个人中心",
      name: "ownspace_index",
      component: () => import("@/views/own-space/own-space.vue")
    },
    {
      path: "message",
      title: "消息中心",
      name: "message_index",
      component: () => import("@/views/message/message.vue")
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: "/vip",
    icon: "ios-cart",
    name: "vip",
    title: "升级会员",
    component: Main,
    children: [
      {
        path: "index",
        title: "升级会员",
        name: "vip_index",
        component: () => import("@/views/vip/vip.vue")
      }
    ]
  },
  {
    path: "/subject",
    icon: "ios-bookmarks",
    name: "subject",
    title: "我的科目",
    component: Main,
    children: [
      {
        path: "index",
        title: "我的科目",
        name: "subject_index",
        component: () => import("@/views/subject/subject.vue")
      }
    ]
  },

  {
    path: "/money",
    icon: "social-yen",
    title: "我的钱包",
    name: "money",
    component: Main,
    children: [
      {
        path: "index",
        title: "我的钱包",
        name: "money_index",
        component: () => import("@/views/money/money.vue")
      }
    ]
  },
  {
    path: "/learning-record",
    icon: "ios-book",
    name: "learning-record",
    title: "学习记录",
    component: Main,
    children: [
      {
        path: "online-exam",
        icon: "ios-world-outline",
        name: "online-exam",
        title: "在线考试记录",
        component: () =>
          import("@/views/learning-record/online-exam/online-exam.vue")
      },
      {
        path: "chapter-practice",
        icon: "social-buffer",
        name: "chapter-practice",
        title: "章节练习记录",
        component: () =>
          import("@/views/learning-record/chapter-practice/chapter-practice.vue")
      },
      {
        path: "daily-practice",
        icon: "ios-calendar-outline",
        name: "daily-practice",
        title: "每日一练记录",
        component: () =>
          import("@/views/learning-record/daily-practice/daily-practice.vue")
      },
      {
        path: "look-answer",
        icon: "eye",
        name: "look-answer",
        title: "查看答案记录",
        component: () =>
          import("@/views/learning-record/look-answer/look-answer.vue")
      }
    ]
  },
  {
    path: "/collect",
    icon: "android-favorite",
    name: "collect",
    title: "我的收藏",
    component: Main,
    children: [
      {
        path: "questions",
        title: "试题收藏",
        name: "questions",
        icon: "compose",
        component: () => import("@/views/collect/questions/questions.vue")
      },
      {
        path: "paper",
        title: "试卷收藏",
        name: "paper",
        icon: "ios-paper-outline",
        component: () => import("@/views/collect/papers/papers.vue")
      }
    ]
  },

  {
    path: "/errors",
    icon: "close-round",
    name: "errors",
    title: "我的错题",
    component: Main,
    children: [
      {
        path: "online-errors",
        title: "在线考试错题",
        name: "online-errors",
        icon: "ios-world-outline",
        component: () =>
          import("@/views/errors/online-errors/online-errors.vue")
      },
      {
        path: "chapter-errors",
        title: "章节练习错题",
        name: "chapter-errors",
        icon: "social-buffer",
        component: () =>
          import("@/views/errors/chapter-errors/chapter-errors.vue")
      }
    ]
  },
  {
    path: "/my-service",
    icon: "ios-people",
    name: "my-service",
    title: "我的客服",
    component: Main,
    children: [
      {
        path: "common-problems",
        title: "常见问题",
        name: "common-problems",
        icon: "ios-help-outline",
        component: () =>
          import("@/views/my-service/common-problems/common-problems.vue")
      },
      {
        path: "contact-us",
        title: "联系我们",
        name: "contact-us",
        icon: "ios-telephone-outline",
        component: () => import("@/views/my-service/contact-us/contact-us.vue")
      }
    ]
  },

  {
    path: "/my-share",
    icon: "android-share",
    name: "my-share",
    title: "我的分享",
    component: Main,
    children: [
      {
        path: "index",
        title: "我的分享",
        name: "share_index",
        component: () => import("@/views/my-share/my-share.vue")
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  // preview,
  locking,
  ...appRouter,
  page500,
  page403,
  page404
];
