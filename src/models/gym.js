import {gym_get_config, gym_update_config, gym_update_teacher, gym_update_member} from '../services/api';
import {message} from 'antd';
import _ from 'lodash';

export default {
	namespace: 'gym',

	state: {
		gym_company_config: {},
		teacher_config: {}, 

		card_config: {}, 
		communities: [], 
		income_levels: [], 
		user_sources: [], 
		cards: [], 

		config_item_removes: [], 
		card_removes: [],
	},

	effects: {
		// 获取基本配置
		*getGym({payload}, {call, put}) {
			const res = yield call(gym_get_config, payload);

			if(res.status === 0) {
				yield put({
					type: 'setGymInfo',
					payload: res.data
				})
			} else {
				message.error(res.error);
			}
		},
		// 保存基本配置
		*mainForm({payload}, {call, put}) {
			const res = yield call(gym_update_config, payload);

			if(res.status === 0) {
				yield put({
					type: 'setGymInfo',
					payload: res.data,
				}) 
				message.success('提交成功'); 
			} else {
				message.error(res.error); 
			} 
		},
		// 保存私教相关信
		*TeacherForm({payload}, {call, put}) {
			const res = yield call(gym_update_teacher, payload);

			if(res.status === 0) {
				yield put({
					type: 'setGymInfo',
					payload: res.data,
				}) 
				message.success('提交成功');
			} else {
				message.error(res.error);
			}
		},
		// 保存会员相关信息
		*MemberForm({payload}, {call, put}) {
			const res = yield call(gym_update_member, payload);

			if(res.status === 0) {
				yield put({
					type: 'setGymInfo',
					payload: res.data.configs,
				})
				yield put({
					type: 'resetRemove',
					payload: {}
				})
      			message.success('提交成功');
			} else {
				message.error(res.error);
			}
		},
	},

	reducers: {
		resetRemove(state, {payload}) {
			return {
				...state,
				config_item_removes: [], 
				card_removes: [],
			}
		},
		// 设置配置
		setGymInfo(state, {payload}) {
			const {gym_company_config, teacher_config, user_config} = payload;
			const {card_config, communities, income_levels, user_sources, cards} = user_config;

			return {
				...state,
				gym_company_config: gym_company_config,
				teacher_config: teacher_config,

				card_config: card_config,
				communities: communities,
				income_levels: income_levels,
				user_sources: user_sources,
				cards: cards,
			}
		},

		// 添加健身卡
		addCard(state, {payload}) {
			let temp = state.cards;
			temp.push(payload.card);
			return {
				...state,
				cards: temp,
			}
		},
		// 删除健身卡
		removeCard(state, {payload}) {
			let {card_removes, cards} = state;
			card_removes.push(payload.id);
			_.remove(cards, function(n) {
				return n.id == payload.id;
			})
			return {
				...state,
				cards: [].concat(cards),
				card_removes: card_removes,
			}
		},

		// 添加社区
		addCommunitie(state, {payload}) {
			let temp = state.communities;
			temp.push(payload.communitie);
			return {
				...state,
				communities: temp,
			}
		},
		// 删除社区
		removeCommunitie(state, {payload}) {
			let {config_item_removes, communities} = state;
			config_item_removes.push(payload.id);

			_.remove(communities, function(n) {
				return n.id == payload.id;
			})
			return {
				...state,
				communities: [].concat(communities),
				config_item_removes: config_item_removes,
			}
		},

		// 添加收入
		addIncome(state, {payload}) {
			let temp = state.income_levels;
			temp.push(payload.income_level);
			return {
				...state,
				income_levels: temp,
			}
		},
		// 删除收入
		removeIncome(state, {payload}) {
			let {config_item_removes, income_levels} = state;
			config_item_removes.push(payload.id);
			_.remove(income_levels, function(n) {
				return n.id == payload.id;
			})
			return {
				...state,
				income_levels: [].concat(income_levels),
				config_item_removes: config_item_removes,
			}
		},

		// 添加来源
		addSources(state, {payload}) {
			let temp = state.user_sources;
			temp.push(payload.user_source);
			return {
				...state,
				user_sources: temp,
			}
		},
		// 删除来源
		removeSources(state, {payload}) {
			let {config_item_removes, user_sources} = state;
			config_item_removes.push(payload.id);
			_.remove(user_sources, function(n) {
				return n.id == payload.id;
			})
			return {
				...state,
				user_sources: [].concat(user_sources),
				config_item_removes: config_item_removes,
			}
		},
	}
}
