import {routerRedux} from 'dva/router';
import {acesgirl_lesson_list, acesgirl_lesson_add, acesgirl_lesson_list_home, acesgirl_lesson_buy_list, acesgirl_lesson_buy, acesgirl_lesson_detail} from '../services/api';
import { message } from 'antd';


export default {
    namespace: 'lesson', 
    state: {
        lists: [], 
        search_lists: [], 
        buy_lists: [], 
        detail: {} 
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
                yield put(routerRedux.push('/lesson/lessonSearch')); 
            } else {
                message.error(res.error, 10); 
            } 
        }, 
        *buy_list({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_buy_list, payload); 
            if(res.status === 0) {
                yield put({
                    type: 'set', 
                    payload: {buy_lists: res.data} 
                }) 
            } else {
                message.error(res.error); 
            } 
        }, 
        *addBuy({payload}, {call, put}) {
            const res = yield call(acesgirl_lesson_buy, payload); 
            if(res.status === 0) {
                message.success("购买课程成功"); 
                yield put(routerRedux.push('/lesson/lessonBuySearch')); 
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
