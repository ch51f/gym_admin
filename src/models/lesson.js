import {routerRedux} from 'dva/router';
import {acesgirl_lesson_add} from '../services/api';


export default {
  namespace: 'lesson',

  state: {
  },

  effects: {
  	// 添加课程
  	*addLesson({payload}, {call, put}) {
  		const res = yield call(acesgirl_lesson_add, payload);

  		console.log(res);
  	}
  },

  reducers: {
  },
};
