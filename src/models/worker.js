import {routerRedux} from 'dva/router';
import {
	worker_query, worker_add, worker_update,
	rank_info, working_time_range,
	leave_list, leave_check, leave_add, leave_cancle
} from '../services/api';
import {message, Modal} from 'antd';

const confirm = Modal.confirm;

export default {
	namespace: 'worker',
	state: {
		worker_data: {
			list: [],
		},
		worker: {},

		ranks: [],
		working_time: [],

		leave_list: [],

		check: false,
		check_list: [],
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
		},
		*working_time({payload}, {call, put}) {
			const res = yield call(working_time_range, payload);
			if(res.status === 0) {
				yield put({
					type: "set",
					payload: {working_time: res.data},
				})
			} else {
				message.error(res.error);
			}
		},
		*leave_list({payload}, {call, put}) {
			const res = yield call(leave_list, payload);
			if(res.status === 0) {
				yield put({
					type: "set",
					payload: {leave_list: res.data},
				})
			} else {
				message.error(res.error);
			}
		},
		*leave_check({payload}, {call, put}) {
			const res = yield call(leave_check, payload);

			if(res.status === 0) {
				yield put({
					type: 'set',
					payload: {
						check: true,
						check_list: res.data
					}
				})
				let content = '请假时间段内，无预约课程';
				if(res.data.length > 0) {
					content = "请假时间段内，有课程";
					for(let i = 0, item; item = res.data[i]; i++) {
						if(i != 0) content += "、";
							content += item.related_item_title;
					}
					content += "将会被取消";
				}
				yield confirm({
					title: '是否确认请假',
					content: content,
					onOk() {
						let res1 = leave_add(payload);
						res1.then((r) => {
							if(r.status === 0) {
								message.success("请假成功");
								history.go(-1);
							}
							console.log(r)
						})
					},
					onCancel() {
						console.log('cancel')
					}
				})
			} else {
				message.error(res.error);
			}

			console.log(res);
		},
		*leave_add({payload}, {call, put}) {
			const res = yield call(leave_add, payload);
			if(res.status === 0) {
				message.success("请假成功")
				yield put(routerRedux.push('/teacher/askLeave'));
			} else {
				message.error(res.error);
			}
		},
		*leave_cancle({payload}, {call, put}) {
			const res = yield call(leave_cancle, payload);
			if(res.status === 0) {
				message.success("取消请假成功")
				yield put({
					type: 'leave_list',
					payload: {}
				});
			} else {
				message.error(res.error);
			}
		},
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
