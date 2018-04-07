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

export async function gym_info(params) {
  return requestApi(`${GYM_URL}admin/v1/basic/gym_info`, {
    body: stringify(params)
  });
}

export async function rank_info(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/basic/rank_info`, {
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


// Acesgirl_User - 艾思会员管理列表
export async function user_list(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/user/list`, {
    body: stringify(params)
  })
}



// Acesgirl_Attend - 会员预约
export async function attend(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/attend/attend`, {
    body: stringify(params)
  })
}

// Acesgirl_Attend - 上课记录
export async function attend_list(params){
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/attend/list`, {
    body: stringify(params)
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

// User - 充值
export async function recharge(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/recharge`, {
    body: stringify(params, {arrayFormat: 'repeat'})
  })
}


// User - 充值记录
export async function recharge_list(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/recharge/list`, {
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

// 查找会员
export async function findMember(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/user/find`, {
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



// Acesgirl_Lesson - 添加课程
export async function acesgirl_lesson_add(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/add`, {
    body: stringify(params)
  })
}


// Acesgirl_Lesson - 课程列表
export async function acesgirl_lesson_list(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/list`, {
    body: stringify(params)
  })
}


// Acesgirl_Lesson - 课程管理界面的课程列表
export async function acesgirl_lesson_list_home(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/list/home`, {
    body: stringify(params)
  })
}

// Acesgirl_Lesson - 购买记录
export async function acesgirl_lesson_buy_list(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/buy/list`, {
    body: stringify(params)
  })
}

// Acesgirl_Lesson - 购买课程
export async function acesgirl_lesson_buy(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/buy`, {
    body: stringify(params)
  })
}

// Acesgirl_Lesson - 课程详情
export async function acesgirl_lesson_detail(params) {
  params = setToken(params);
  return requestApi(`${GYM_URL}admin/v1/acesgirl/lesson/detail`, {
    body: stringify(params)
  })
}
