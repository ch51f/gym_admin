import {routerRedux} from 'dva/router';
import {notice_query} from '../services/api';
import {PAGE_SIZE} from '../config';
import {message} from 'antd';

export default {
	namespace: 'system',
	state: {
		notice_data: {
			list: [],
			pagination: {},
		},
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
		}
	},
	reducers: {
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