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
    name: '会员管理',
    path: 'search',
  }, {
    name: '上课记录',
    path: '',
  }, {
    name: '体测录入',
    path: '',
  }]
},
{
  name: '充值管理',
  icon: 'book',
  path: 'pay',
  children: [{
    name: '会员充值',
    path: ''
  }, {
    name: '充值记录',
    path: ''
  }] 
},
{
  name: '私教管理',
  icon: 'form',
  path: 'teacher',
  children: [{
    name: '教练管理',
    path: 'search',
  }, {
    name: '教练请假',
    path: '',
  }]
},
{
  name: '课程管理',
  path: 'manage',
  icon: 'book',
  children: [{
    name: '购买课程',
    path: '',
  }, {
    name: '购课记录',
    path: '',
  }, {
    name: '课程管理',
    path: '',
  }]
},
{
  name: '后勤管理',
  path: 'system',
  icon: 'setting',
  children: [{
    name: '通知管理',
    path: 'noticeManage',
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
