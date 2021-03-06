import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => namespace === model)
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    // 首页
    '/home': {
      component: dynamicWrapper(app, ['member', 'checkin'], () => import('../routes/Dashboard/Home')),
    },
    // 私教预约
    '/booking': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Dashboard/AcesHome')),
    },
    // 提测录入
    '/member/physical': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/Physical')),
    },
    '/teacher/lessonRecord': {
      component: dynamicWrapper(app, ['member', 'worker', 'lesson'], () => import('../routes/Member/Lesson')),
    },
    '/member/add': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/Add')),
    },
    '/member/editUser': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/EditUser')),
    },
    '/member/add/user': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/AddUser')),
    },
    // '/member/add/card': {
    //   component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Member/AddRecharge')),
    // },
    '/member/search': {
      component: dynamicWrapper(app, ['member', 'worker', 'lesson'], () => import('../routes/Member/Search')),
    },
    '/member/checkin': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/CheckIn')),
    },
    '/member/manage': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Member/Manage')),
    },
    '/member/add/card': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Member/AddCard')),
    },
    '/member/transfer': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Member/Transfer')),
    },
    '/member/statistics': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/Statistics')),
    },


    // 充值管理
    '/buy/memberBuy': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Buy/MemberBuy')),
    },
    '/buy/memberBuySearch': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Buy/MemberBuySearch')),
    },

    // 教练管理
    '/system/worker': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Teacher/Worker')),
    },
    '/system/workerAdd': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Teacher/WorkerAdd')),
    },
    '/system/askLeave': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Teacher/AskLeave')),
    },
    '/system/askLeaveAdd': {
      component: dynamicWrapper(app, ['member', 'worker'], () => import('../routes/Teacher/AskLeaveAdd')),
    },

    // 课程管理
    '/teacher/lessonBuy': {
      component: dynamicWrapper(app, ['worker', 'lesson', 'member'], () => import('../routes/Lesson/LessonBuy1')),
    },
    '/teacher/lessonBuySearch': {
      component: dynamicWrapper(app, ['member', 'worker', 'lesson'], () => import('../routes/Lesson/LessonBuySearch')),
    },
    '/teacher/lessonSearch': {
      component: dynamicWrapper(app, ['member', 'worker', 'lesson'], () => import('../routes/Lesson/LessonSearch')),
    },
    '/teacher/lessonAdd': {
      component: dynamicWrapper(app, ['member', 'worker', 'lesson'], () => import('../routes/Lesson/LessonAdd')),
    },
    '/teacher/statistics': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Teacher/Statistics')),
    },

    // 系统配置
    '/system/noticeManage': {
      component: dynamicWrapper(app, ['member', 'system'], () => import('../routes/System/NoticeManage')),
    },
    '/system/noticeAdd': {
      component: dynamicWrapper(app, ['member', 'system'], () => import('../routes/System/NoticeAdd')),
    },
    '/system/lesson': {
      component: dynamicWrapper(app, ['member', 'groupLesson'], () => import('../routes/System/Lesson')),
    },
    '/system/addLesson': {
      component: dynamicWrapper(app, ['groupLesson', 'worker', 'member'], () => import('../routes/System/LessonAdd')),
    },
    '/system/feedback': {
      component: dynamicWrapper(app, ['feedback', 'member'], () => import('../routes/System/Feedback')),
    },
    '/system/addFeedback': {
      component: dynamicWrapper(app, ['feedback', 'member'], () => import('../routes/System/FeedbackAdd')),
    },


    // 系统配置
    '/gym/main': {
      component: dynamicWrapper(app, ['gym', 'member'], () => import('../routes/System/Main')),
    },
    '/gym/teacher': {
      component: dynamicWrapper(app, ['gym', 'member'], () => import('../routes/System/Teacher')),
    },
    '/gym/member': {
      component: dynamicWrapper(app, ['gym', 'member'], () => import('../routes/System/Member')),
    },

    '/gym/mainTain': {
      component: dynamicWrapper(app, ['member', 'gym'], () => import('../routes/System/MainTain')),
    },
    '/gym/mainTainAdd': {
      component: dynamicWrapper(app, ['member', 'gym'], () => import('../routes/System/MainTainAdd')),
    },






    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },

    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },

  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};
  Object.keys(routerConfig).forEach((item) => {
    const menuItem = menuData[item.replace(/^\//, '')] || {};
    routerData[item] = {
      ...routerConfig[item],
      name: routerConfig[item].name || menuItem.name,
      authority: routerConfig[item].authority || menuItem.authority,
    };
  });
  return routerData;
};
