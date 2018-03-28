import { stringify } from 'qs';
import request from '../utils/request';
import requestApi from '../utils/requestApi'
import {getToken, getOperatorId} from '../utils/load';

import {GYM_URL} from '../config';


function setToken(params) {
  return {
    token: getToken(),
    operator_id: getOperatorId(),
    ...params,
  }
}

// 登录接口
export async function login(params) {
  return requestApi(`${GYM_URL}admin/v1/operator/login`, {
    body: stringify(params)
  });
}

export async function upyun_sign(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/basic/upyun_sign`, {
    body: stringify(params)
  });
}

export async function upyun(params) {
  return request('https://v0.api.upyun.com/acesgirl', {
    headers: {
      // 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      // 'Content-Type': 'multipart/form-data',
    },
    body: params
  })
}





// Body_Check - 根据用户 id 获取体测数据
export async function body_check_query_by_id(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/body_check/by_user_id`, {
    body: stringify(params)
  })
}

// Body_Check - 添加体测数据
export async function body_check_add(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/body_check/add`, {
    body: stringify(params)
  })
}
// Body_Check - 更新体测数据
export async function body_check_update(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/body_check/update`, {
    body: stringify(params)
  })
}



// 通知列表
export async function notice_query(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/notice/list`, {
    body: stringify(params)
  })
}
// 添加通知
export async function notice_add(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/notice/add`, {
    body: stringify(params)
  })
}
// 更新通知
export async function notice_update(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/notice/update`, {
    body: stringify(params)
  })
}






























// 获取健身房信息
export async function gym_get_config(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/system_config/configs`, {
    body: stringify(params)
  })
}
// 更新健身房基础设置
export async function gym_update_config(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/system_config/configs/gym/update`, {
    body: stringify(params)
  })
}
// 更新健身房体测私教设置
export async function gym_update_teacher(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/system_config/configs/teacher/update`, {
    body: stringify(params)
  })
}
// 更新健身房会籍会员设置
export async function gym_update_member(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/system_config/configs/update`, {
    body: stringify(params, {arrayFormat: 'repeat'})
  })
}




// 查询操课列表
export async function lesson_query(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/group_lesson/list`, {
    body: stringify(params)
  })
}
// 添加操课
export async function lesson_add(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/group_lesson/add`, {
    body: stringify(params)
  })
}
// 修改操课
export async function lesson_update(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/group_lesson/update`, {
    body: stringify(params)
  })
}



// 查询员工列表
export async function worker_query(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/worker/list`, {
    body: stringify(params)
  })
}
// 查询离职员工列表
export async function worker_query_leaved(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/worker/list/leaved`, {
    body: stringify(params)
  })
}
// 添加员工列表
export async function worker_add(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/worker/add`, {
    body: stringify(params)
  })
}
// 更新员工列表
export async function worker_update(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/worker/update`, {
    body: stringify(params)
  })
}



// 反馈列表
export async function feedback_query(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/feedback/list`, {
    body: stringify(params)
  })
}
// 回复反馈
export async function feedback_reply(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/feedback/reply`, {
    body: stringify(params)
  })
}
// 添加反馈
export async function feedback_add(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/feedback/add`, {
    body: stringify(params)
  })
}
// 删除反馈
export async function feedback_delete(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/feedback/delete`, {
    body: stringify(params)
  })
}




// 查询会员相关配置
export async function queryMemberConfig(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/system_config/configs/user_add`, {
    body: stringify(params)
  })
}

// 查询会员列表
export async function queryMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/users`, {
    body: stringify(params)
  })
}

// 创建会员
export async function addMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/add`, {
    body: stringify(params)
  })
}

// 更新会员
export async function updateMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/update`, {
    body: stringify(params)
  })
}

// 会员签到
export async function checkinMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/checkin`, {
    body: stringify(params)
  })
}

// 查找会员
export async function findMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/find`, {
    body: stringify(params)
  })
}

// 签到记录
export async function queryCheckin(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/checkin/list`, {
    body: stringify(params)
  })
}

// 获取随机卡号
export async function randomCard(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/random_card_id`, {
    body: stringify(params)
  })
}

// 首页签到记录
export async function queryHomeCheckin(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/checkin/list/home`, {
    body: stringify(params)
  })
}

// 购买或续购健身卡
export async function buyCard(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/buy`, {
    body: stringify(params, {arrayFormat: 'repeat'})
  })
}

// 获取卡类列表
export async function queryCard(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card/list`, {
    body: stringify(params)
  })
}

// 会员转移
export async function transferMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/handover`, {
    body: stringify(params, {arrayFormat: 'repeat'})
  })
}

// 会员转卡
export async function tMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/transfer`, {
    body: stringify(params)
  })
}

// 暂停会员
export async function pauseMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/pause`, {
    body: stringify(params)
  })
}

// 取消暂停会员
export async function calcleMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/pause/cancle`, {
    body: stringify(params)
  })
}

// 消卡
export async function cancleMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/cancle`, {
    body: stringify(params)
  })
}

// 激活卡
export async function activeMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/card_subscribe/cancle/active`, {
    body: stringify(params)
  })
}

// 私教查询
export async function queryLessonSubscribe(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/lesson_subscribe/list`, {
    body: stringify(params)
  })
}
// 购买私教课程
export async function addLessonSubscribe(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/lesson_subscribe/add`, {
    body: stringify(params, {arrayFormat: 'repeat'})
  })
}
// 跟换私教
export async function queryChangeLessonTeacher(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/lesson_subscribe/switch`, {
    body: stringify(params)
  })
}

// 会员统计
export async function queryStatisticsUser(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/statistics/user`, {
    body: stringify(params)
  })
}
