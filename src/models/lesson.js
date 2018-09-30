import {routerRedux} from 'dva/router';
import {acesgirl_lesson_list, acesgirl_lesson_add, acesgirl_lesson_list_home, acesgirl_lesson_buy_list, acesgirl_lesson_buy, acesgirl_lesson_detail, acesgirl_lesson_update } from '../services/api';
import { message } from 'antd';


export default {
    namespace: 'lesson',
    state: {
        lists: [],
        search_lists: [],
        // buy_lists: [],
        buy_lists: {
          lists: [],
          pagination: {},
        },
        detail: {},
        lesson_id: -1,
        // lesson_id: 132,
    },
    effects: {
        // 课程列表
        *lesson_list({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_list_home, payload);
            if(res.status === 0) {
                yield put({
                    type: 'set',
                    payload: {lists: res.data}
                })
            } else {
                message.error(res.error);
            }
        },
        *search_list({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_list, payload);
            if(res.status === 0) {
                yield put({
                    type: 'set',
                    payload: {search_lists: res.data}
                })
            } else {
                message.error(res.error);
            }
        },
        // 添加课程
        *addLesson({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_add, payload);
            if(res.status === 0) {
                message.success("创建课程成功");
                yield put(routerRedux.push('/teacher/lessonSearch'));
            } else {
                message.error(res.error, 10);
            }
        },
        // 修改课程
        *updLesson({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_update, payload);
            if(res.status === 0) {
                message.success("修改课程成功");
                yield put(routerRedux.push('/teacher/lessonSearch'));
            } else {
                message.error(res.error, 10);
            }
        },
        *buy_list({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_buy_list, payload);
            if(res.status === 0) {
                yield put({
                    type: 'set',
                    payload: {buy_lists: {
                      list: res.data.items ? res.data.items : res.data,
                      pagination: {
                        total: res.data.count || 1,
                        pageSize: payload.page_size,
                        current: res.data.target_page || 1,
                      }
                    }}
                })
            } else {
                message.error(res.error);
            }
        },
        *addBuy({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_buy, payload);
            if(res.status === 0) {
                message.success("购买课程成功");
                yield put(routerRedux.push('/teacher/lessonBuySearch'));
            } else {
                message.error(res.error, 10);
            }
        },
        *detail({payload}, {call, put}) {
            yield put({
                type: 'set',
                payload: {detail: {}}
            })
            const res = yield call(acesgirl_lesson_detail, payload);
            if(res.status === 0) {
                yield put({
                    type: 'set',
                    payload: {detail: res.data}
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
        },
    },
};
