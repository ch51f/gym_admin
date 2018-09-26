// 接口文档 https://szrdev.noark9.com/gym/doc/
export const GYM_URL = 'https://demogym.szrdev.noark9.com/gym/api/';
// export const GYM_URL = 'https://dev.aaafitness.cn/gym/api/';
// export const GYM_URL = '/gym/api/';
// dev.aaafitness.cn
export const PAGE_SIZE = 10;

export const DAY_OF_WEEK = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
export const DAY_OF_WEEK_1 = ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const DEPARTMENT = ['销售部', '教练部', '后勤部'];

export const LESSON_STATUS = ['正常', '下架', '删除'];

// export const WORKER_TYPE = ['经理', '教练', '销售顾问', '其他'];
export const WORKER_TYPE = ['经理', '普通员工'];
export const WORKER_STATUS = ['在职', '离职'];

export const CARD_STATUS = ['未激活', '使用中', '暂停中', '销卡', '未激活'];
export const CARD_UNIT = ['年', '月', '日', '次'];

export const PAY_METHODS = ['刷卡', '支付宝', '微信', '现金', '其他'];

export const LESSON_SUBSCRIBE_STATUS = ['正常', '已上完', '未上完'];
export const LESSON_SHOW_STATUS = ['显示', '隐藏'];

export const NOTICE_STATUS = ['正常发布', '草稿', '删除'];

export const ASK_LEAVE_REASON = ['休息', '临时有事', '生病', '上体验课', '其他'];

export const LESSON_TYPE = ['私教课', '小团体课', '训练营'];
export const USER_LESSON_TYPE = ['预约', '取消预约', '完成', '过期未到', '教练请假'];

export const MAIN_TAIN_STATUS = ['正常', '取消', '完成'];

export const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: {span: 24}, 
    sm: {span: 7}, 
  }, 
  wrapperCol: {
    xs: {span: 24}, 
    sm: {span: 12}, 
  },
} 

export const FORM_ITEM_BUTTON = {
  wrapperCol: {
    xs: {span: 24, offset: 0}, 
    sm: {span: 10, offset: 7}, 
  },
}

export const exportUsersUrl = `${GYM_URL}admin/v1/export/card_subscribe/users`;
