import {routerRedux} from 'dva/router';
import {notice_query, notice_add, notice_update} from '../services/api';
import {PAGE_SIZE} from '../config';
import {message} from 'antd';

export default {
	namespace: 'system',
	state: {
		notice_data: {
			list: [],
			pagination: {},
		},
		notice: {},
	},
	effects: {
		// 获取通知列表
		*getNoticeList({payload}, {call, put}) {
			const res = yield call(notice_query, payload);
			if(res.status === 0) {
				res.data.page_info.pageSize = payload.page_size;
				res.data.page_info.total = res.data.count;
				yield put({
					type: 'setNoticeList',
					payload: res.data
				})
			} else {
				message.error(res.error);
			}
		},
		// 新增通知
		*addNotice({payload}, {call, put}) {
			const res = yield call(notice_add, payload);
			if(res.status === 0) {
				message.success("添加通知成功")
				yield put({
					type: 'set',
					payload: {notice: {}}
				})
				yield put(routerRedux.push('/teacher/noticeManage'));
			} else {
				message.error(res.error);
			}
		},
		// 编辑通知
		*updateNotice({payload}, {call, put}) {
			const res = yield call(notice_update, payload);
			if(res.status === 0) {
				message.success("编辑通知成功")
				yield put({
					type: 'set',
					payload: {notice: {}}
				})
				yield put(routerRedux.push('/teacher/noticeManage'));
			} else {
				message.error(res.error);
			}
		},
	},
	reducers: {
		// 基本设置
		set(state, {payload}) {
			 return {
			 	...state,
			 	...payload,
			 }
		},
		// 设置通知列表
		setNoticeList(state, {payload}) {
			const {items, page_info} = payload;
			const {total, pageSize, current_page} = page_info;
			return {
				...state,
				notice_data: {
					list: items,
					pagination: {
						total: total,
						pageSize: pageSize,
						current: current_page
					}
				}
			}
		}
	}
}
