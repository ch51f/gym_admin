const menuData = [
{
  name: '首页',
  icon: 'home',
  path: 'home'
},
{
  name: '私教预约',
  icon: 'idcard',
  path: 'booking',
},
{
  name: '会员管理',
  icon: 'user',
  path: 'member',
  children: [{
    name: '添加会员',
    path: 'add',
  }, {
    name: '入场记录',
    path: 'checkin',
  }, {
    name: '会员查询',
    path: 'manage',
  }, {
    name: '会员管理',
    path: 'search',
  }, {
    name: '会员转移',
    path: 'transfer',
  }, {
    name: '体测录入',
    path: 'physical',
  }, {
    name: '会员统计',
    path: 'statistics',
  }]
},
{
  name: '私教管理',
  icon: 'form',
  path: 'teacher',
  children: [{
    name: '上课记录',
    path: 'lessonRecord'
  }, {
    name: '购买课程',
    path: 'lessonBuy',
  }, {
    name: '购课记录',
    path: 'lessonBuySearch',
  }, {
    name: '课程管理',
    path: 'lessonSearch',
  }, {
    name: '课程统计',
    path: 'statistics'
  },
  {
    name: '教练请假',
    path: 'askLeave'
  }, {
    name: '操课管理',
    path: 'lesson'
  }, {
    name: '员工管理',
    path: 'worker'
  }, {
    name: '通知管理',
    path: 'noticeManage',
  }, {
    name: '反馈管理',
    path: 'feedback'
  }]
},
// {
//   name: '充值管理',
//   icon: 'book',
//   path: 'buy',
//   children: [{
//     name: '会员充值',
//     path: 'memberBuy'
//   }, {
//     name: '充值记录',
//     path: 'memberBuySearch'
//   }]
// },
// {
//   name: '后勤管理',
//   path: 'system',
//   icon: 'setting',
//   children: [{
//     name: '教练请假',
//     path: 'askLeave'
//   }, {
//     name: '操课管理',
//     path: 'lesson'
//   }, {
//     name: '员工管理',
//     path: 'worker'
//   }, {
//     name: '通知管理',
//     path: 'noticeManage',
//   }, {
//     name: '反馈管理',
//     path: 'feedback'
//   }]
// },
{
  name: '系统设置',
  path: 'gym',
  icon: 'setting',
  children: [{
    name: '基础配置',
    path: 'main',
  }, {
    name: '私教配置',
    path: 'teacher',
  }, {
    name: '会籍配置',
    path: 'member',
  },
  // {
  //   name: '系统维护记录',
  //   path: 'mainTain',
  // }
  ]
},
{
  name: '账户',
  icon: 'user',
  path: 'user',
  authority: 'guest',
  children: [{
    name: '登录',
    path: 'login',
  }],
}
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    const result = {
      ...item,
      path: `${parentPath}${item.path}`,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
