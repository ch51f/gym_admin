import {queryLessonSubscribe, addLessonSubscribe, queryChangeLessonTeacher} from '../services/api';
import {routerRedux} from 'dva/router';
import {message} from 'antd';

export default {
  namespace: 'teacher',

  state: {
    teacher_lesson: {
      list: [],
      pagination: {},
    },
    old_teacher_id: -1,
  },

  effects: {
    *getList({payload}, {call, put}) {
      const res = yield call(queryLessonSubscribe, payload);

      if(res.status === 0) {
        res.data.page_info.pageSize = payload.page_size;
        res.data.page_info.total = res.data.count;
        yield put({
          type: 'setList',
          payload: {
            data: res.data
          }
        })
      } else {
        message.error(res.error);
      }
    },
    *add({payload}, {call, put}) {
      const res = yield call(addLessonSubscribe, payload);
      if(res.status === 0) {
        message.success("添加私教课程成功")
        yield put(routerRedux.push('/teacher/search'));
      } else {
        message.error(res.error);
      }
    },
    *change({payload}, {call, put}) {
      const res = yield call(queryChangeLessonTeacher, payload);
      if(res.status === 0) {
        message.success("更换私教成功")
        yield put(routerRedux.push('/teacher/search'));
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
    setList(state, {payload}) {
      const {data} = payload;
      return {
        ...state,
        teacher_lesson: {
          list: data.items,
          pagination: {
            total: data.page_info.total,
            pageSize: data.page_info.pageSize,
            current: data.page_info.current_page,
          }
        },
      }
    }
  }
}