import {routerRedux} from 'dva/router';
import {worker_query, worker_add, worker_update, rank_info} from '../services/api';
import {message} from 'antd';

export default {
	namespace: 'worker',
	state: {
		worker_data: {
			list: [],
		},
		worker: {}, 
		ranks: [],
	},
	effects: {
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
		// 新增员工
		*addWorker({payload}, {call, put}) {
			const res = yield call(worker_add, payload);

			if(res.status === 0) {
				message.success("添加员工成功")
				yield put({
					type: 'set',
					payload: {worker: {}},
				})
				yield put(routerRedux.push('/teacher/worker'));
			} else {
				message.error(res.error);
			}
		},
		// 更新员工
		*updateWorker({payload}, {call, put}) {
			const res = yield call(worker_update, payload);

			if(res.status === 0) {
				message.success("编辑员工成功")
				yield put({
					type: 'set',
					payload: {worker: {}},
				})
				yield put(routerRedux.push('/teacher/worker'));
			} else {
				message.error(res.error);
			}
		},
		*rank({payload}, {call, put}) {
			const res = yield call(rank_info, payload);
			if(res.status === 0) {
				yield put({
					type: "set",
					payload: {ranks: res.data},
				})
			} else {
				message.error(res.error);
			}
		}
	}, 
	reducers: {
		set(state, {payload}) {
			return {
				...state,
				...payload,
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
	}
}