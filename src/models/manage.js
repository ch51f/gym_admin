import { routerRedux } from 'dva/router';
import {lesson_query, lesson_add, lesson_update, worker_query, worker_query_leaved, worker_add, worker_update, notice_query, notice_query_release, notice_add, notice_update, feedback_query, feedback_reply, feedback_add, feedback_delete} from '../services/api';
import {PAGE_SIZE} from '../config';
import { message } from 'antd';

export default {
	namespace: 'manage',
	state: {
		lesson_data: {
			list: [],
		},
		lesson: {},

		worker_data: {
			list: [],
		}, 
		leave_worker_data: {
			list: [],
		},
		worker: {},

		notice_data: {
			list: [],
			pagination: {},
		},
		release_notice_data: {
			list: [],
			pagination: {},
		},
		notice: {},

		feedback_data: {
			list: [],
			pagination: {},
		},
	},
	effects: {
		// 获取课程列表
		*getLessonList({payload}, {call, put}) {
			const res = yield call(lesson_query, payload);

			if(res.status === 0) {
				yield put({
					type: 'setLessonList',
					payload: res.data.items,
				})
			} else {
				message.error(res.error);
			}
		},
		// 添加课程
		*addLesson({payload}, {call, put}) {
			const res = yield call(lesson_add, payload);

			if(res.status === 0) {
				message.success("添加课程成功")
				yield put(routerRedux.push('/manage/lesson'));
			} else {
				message.error(res.error);
			}
		},
		// 更新课程
		*updateLesson({payload}, {call, put}) {
			const res = yield call(lesson_update, payload);

			if(res.status === 0) {
				message.success("编辑课程成功")
				yield put(routerRedux.push('/manage/lesson'));
			} else {
				message.error(res.error);
			}
		},


		// 获取员工列表
		*getWorkerList({payload}, {call, put}) {
			const res = yield call(worker_query, payload);

			if(res.status === 0) {
				yield put({
					type: 'setWorkerList',
					payload: res.data.items
				})
			} else {
				message.error(res.error);
			}
		},
		// 获取离职员工列表
		*getLeaveWorkerList({payload}, {call, put}) {
			const res = yield call(worker_query_leaved, payload);

			if(res.status === 0) {
				yield put({
					type: 'setLeaveWorkerList',
					payload: res.data.items
				})
			} else {
				message.error(res.error);
			}
		},
		// 新增员工
		*addWorker({payload}, {call, put}) {
			const res = yield call(worker_add, payload);

			if(res.status === 0) {
				message.success("添加员工成功")
				yield put(routerRedux.push('/manage/worker'));
			} else {
				message.error(res.error);
			}
		},
		// 更新员工
		*updateWorker({payload}, {call, put}) {
			const res = yield call(worker_update, payload);

			if(res.status === 0) {
				message.success("编辑员工成功")
				yield put(routerRedux.push('/manage/worker'));
			} else {
				message.error(res.error);
			}
		},

		// 通知列表
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
		// 已发布通知列表
		*getReleaseNoticeList({payload}, {call, put}) {
			const res = yield call(notice_query_release, payload);

			if(res.status === 0) {
				res.data.page_info.pageSize = payload.page_size;
				res.data.page_info.total = res.data.count;
				yield put({
					type: 'setReleaseNoticeList',
					payload: res.data,
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
				yield put(routerRedux.push('/manage/notice'));
			} else {
				message.error(res.error);
			}
		},
		*updateNotice({payload}, {call, put}) {
			const res = yield call(notice_update, payload);

			if(res.status === 0) {
				message.success("编辑通知成功")
				yield put(routerRedux.push('/manage/notice'));
			} else {
				message.error(res.error);
			}
		},
		// 删除通知
		*deleteNotice({payload}, {call, put}) {
			const res = yield call(notice_update, payload);

			if(res.status === 0) {
				message.success("删除通知成功")
				yield put({
					type: 'getNoticeList',
					payload: {
						target_page: 1,
						page_size: PAGE_SIZE,
					}
				});
			} else {
				message.error(res.error);
			}
		},
		// 发布通知
		*publishNotice({payload}, {call, put}) {
			const res = yield call(notice_update, payload);

			if(res.status === 0) {
				message.success("发布通知成功")
				yield put({
					type: 'getNoticeList',
					payload: {
						target_page: 1,
						page_size: PAGE_SIZE,
					}
				});
			} else {
				message.error(res.error);
			}
		},


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
				yield put(routerRedux.push('/manage/feedback'));
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
		setConfig(state, {payload}) {
			return {
				...state,
				...payload,
			}
		},
		// 设置课程列表
		setLessonList(state, {payload}) {
			return {
				...state,
				lesson_data: {
					list: payload,
				},
			}
		},
		// 设置课程
		setLesson(state, {payload}) {
			return {
				...state,
				lesson: payload
			}
		},

		// 设置员工列表
		setWorkerList(state, {payload}) {
			return {
				...state,
				worker_data: {
					list: payload
				},
			}
		},
		// 设置离职员工列表
		setLeaveWorkerList(state, {payload}) {
			return {
				...state,
				leave_worker_data: {
					list: payload,
				},
			}
		},
		// 设置员工
		setWorker(state, {payload}) {
			return {
				...state,
				worker: payload
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
				},
			}
		},
		// 设置发布通知列表
		setReleaseNoticeList(state, {payload}) {
			const {items, page_info} = payload;
			const {total, pageSize, current_page} = page_info;
			return {
				...state,
				release_notice_data: {
					list: items,
					pagination: {
						total: total,
						pageSize: pageSize,
						current: current_page
					}
				},
			}
		},
		// 设置通知
		setNotice(state, {payload}) {
			return {
				...state,
				notice: payload
			}
		},

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