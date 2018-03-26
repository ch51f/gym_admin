const menuData = [
{
  name: '首页',
  icon: 'home',
  path: 'home'
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
    name: '会员管理',
    path: 'manage',
  }, {
    name: '会员查询',
    path: 'search',
  }, {
    name: '会员转移',
    path: 'transfer',
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
    name: '添加私教',
    path: 'add',
  }, {
    name: '私教查询',
    path: 'search',
  }, {
    name: '私教统计',
    path: 'statistics',
  }]
},
{
  name: '后勤管理',
  path: 'manage',
  icon: 'book',
  children: [{
    name: '操课管理',
    path: 'lesson',
  }, {
    name: '员工管理',
    path: 'worker',
  }, {
    name: '通知管理',
    path: 'notice',
  }, {
    name: '反馈管理',
    path: 'feedback',
  }]
},
{
  name: '系统配置',
  path: 'system',
  icon: 'setting',
  children: [{
    name: '基础配置',
    path: 'main',
  }, {
    name: '体测私教',
    path: 'teacher',
  }, {
    name: '会籍会员',
    path: 'member',
  }]
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
