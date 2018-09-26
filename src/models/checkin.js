import {
	queryHomeCheckin
} from '../services/api';
import {routerRedux} from 'dva/router';
import {message} from 'antd';

export default {
	namespace: 'checkin',

	state: {
		homeActive: 0,
		homeCheckIn: {
			list: [],
			count: 0,
		}
	},

	effects: {
		*getHomeCHeckinList({payload}, {call, put}) {
			const res = yield call(queryHomeCheckin, payload);
			if(res.status === 0) {
				yield put({
					type: 'set',
					payload: {
						homeCheckIn: {
							list: res.data.items,
							count: res.data.count,
						}
					}
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
				...payload
			}
		}
	}
}