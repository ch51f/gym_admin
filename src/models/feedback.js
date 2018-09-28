import {routerRedux} from 'dva/router';
import {
	feedback_query,
	feedback_reply,
	feedback_add,
	feedback_delete,
} from '../services/api';
import {PAGE_SIZE} from '../config';
import {message} from 'antd';

export default {
	namespace: 'feedback',
	state: {
		feedback_data: {
			list: [],
			pagination: {},
		},
	},
	effects: {
		// 获取反馈列表
		*getFeedbackList({payload}, {call, put}) {
			const res = yield call(feedback_query, payload);

			if(res.status === 0) {
				res.data.page_info.pageSize = payload.page_size;
				res.data.page_info.total = res.data.count;
				yield put({
					type: 'setFeedbackList',
					payload: res.data,
				})
			} else {
				message.error(res.error);
			}
		},
		// 新增反馈
		*addFeedback({payload}, {call, put}) {
			const res = yield call(feedback_add, payload);

			if(res.status === 0) {
				message.success("添加反馈成功")
				yield put(routerRedux.push('/teacher/feedback'));
			} else {
				message.error(res.error);
			}
		},
		// 删除反馈
		*deleteFeedback({payload}, {call, put}) {
			const res = yield call(feedback_delete, payload);

			if(res.status === 0) {
				message.success("删除反馈成功")
				yield put({
					type: 'getFeedbackList',
					payload: {
						target_page: 1,
						page_size: PAGE_SIZE,
					}
				});
			} else {
				message.error(res.error);
			}
		},
		// 回复反馈
		*replyFb({payload}, {call, put}) {
			const res = yield call(feedback_reply, payload);

			if(res.status === 0) {
				message.success("回复反馈成功")
				yield put({
					type: 'getFeedbackList',
					payload: {
						target_page: 1,
						page_size: PAGE_SIZE,
					}
				});
			} else {
				message.error(res.error);
			}
		}
	},
	reducers: {
		// 获取反馈列表
		setFeedbackList(state, {payload}) {
			const {items, page_info} = payload;
			const {total, pageSize, current_page} = page_info;
			return {
				...state,
				feedback_data: {
					list: items,
					pagination: {
						total: total,
						pageSize: pageSize,
						current: current_page
					}
				},
			}
		},
	}
}
