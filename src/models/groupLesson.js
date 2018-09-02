import {routerRedux} from 'dva/router';
import {
	lesson_query,
	lesson_add,
	lesson_update,
} from '../services/api';
import {PAGE_SIZE} from '../config';
import {message} from 'antd';

export default {
	namespace: 'groupLesson',
	state: {
		lesson_data: {
			list: []
		},
		lesson: {},
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
				yield put(routerRedux.push('/system/lesson'));
			} else {
				message.error(res.error);
			}
		},
		// 更新课程
		*updateLesson({payload}, {call, put}) {
			const res = yield call(lesson_update, payload);

			if(res.status === 0) {
				message.success("编辑课程成功")
				yield put(routerRedux.push('/system/lesson'));
			} else {
				message.error(res.error);
			}
		},
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
	}
}