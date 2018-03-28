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
      component: dynamicWrapper(app, ['member'], () => import('../routes/Dashboard/AcesHome')),
    },
    // 提测录入
    '/member/physical': {
      component: dynamicWrapper(app, ['member', 'manage'], () => import('../routes/Member/Physical')),
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
    '/member/add/card': {
      component: dynamicWrapper(app, ['member', 'manage'], () => import('../routes/Member/AddCard')),
    },
    '/member/manage': {
      component: dynamicWrapper(app, ['member', 'manage'], () => import('../routes/Member/Manage')),
    },
    '/member/search': {
      component: dynamicWrapper(app, ['member', 'manage'], () => import('../routes/Member/Search')),
    },
    '/member/transfer': {
      component: dynamicWrapper(app, ['member', 'manage'], () => import('../routes/Member/Transfer')),
    },
    '/member/statistics': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/Statistics')),
    },
    '/member/checkin': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Member/CheckIn')),
    },

    // 私教管理
    '/teacher/add': {
      component: dynamicWrapper(app, ['manage', 'teacher', 'member'], () => import('../routes/Teacher/Add')),
    },
    '/teacher/search': {
      component: dynamicWrapper(app, ['manage', 'teacher', 'member'], () => import('../routes/Teacher/Search')),
    },
    '/teacher/statistics': {
      component: dynamicWrapper(app, ['member'], () => import('../routes/Teacher/Statistics')),
    },
    '/teacher/change': {
      component: dynamicWrapper(app, ['teacher', 'manage', 'member'], () => import('../routes/Teacher/ChangeTeacher')),
    },

    // 后勤管理
    '/manage/lesson': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/Lesson')),
    },
    '/manage/addLesson': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/AddLesson')),
    },
    '/manage/worker': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/Worker')),
    },
    '/manage/leaveWorker': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/LeaveWorker')),
    },
    '/manage/addWorker': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/AddWorker')),
    },
    '/manage/notice': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/Notice')),
    },
    '/manage/releaseNotice': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/ReleaseNotice')),
    },
    '/manage/addNotice': {
      component: dynamicWrapper(app, ["gym", 'manage', 'member'], () => import('../routes/Manage/AddNotice')),
    },
    '/manage/feedback': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/Feedback')),
    },
    '/manage/addFeedback': {
      component: dynamicWrapper(app, ['manage', 'member'], () => import('../routes/Manage/AddFeedback')),
    },

    // 系统配置
    '/system/noticeManage': {
      component: dynamicWrapper(app, ['system'], () => import('../routes/System/NoticeManage')),
    },
    '/system/noticeAdd': {
      component: dynamicWrapper(app, ['system'], () => import('../routes/System/NoticeAdd')),
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
