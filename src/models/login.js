// import { routerRedux } from 'dva/router';
import { login, upyun_sign, upyun } from '../services/api';
import { setAuthority } from '../utils/authority';
import {setToken, setOperatorId, setOperatorName} from '../utils/load';
// import 'upyun-form';
let location = window.location;
export default {
  namespace: 'login',

  state: {
    status: undefined,
    msg: '未知错误',

  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(login, payload);
      
      // Login successfully
      if (response.status === 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: true,
            currentAuthority: 'admin',
            token: response.data.token,
            operator_id: response.data.operator.id,
            operator_name: response.data.operator.operator_name,
            operator: response.data.operator,
            operator_bf_info: response.data.operator_bf_info,
          }
        });
        // 非常粗暴的跳转,登陆成功之后权限会变成user或admin,会自动重定向到主页
        // Login success after permission changes to admin or user
        // The refresh will automatically redirect to the home page
        // yield put(routerRedux.push('/'));
        location.reload();
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error',
            currentAuthority: 'guest',
            msg: response.message,
          }
        });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      // yield put(routerRedux.push('/user/login'));
      // Login out after permission changes to admin or user
      // The refresh will automatically redirect to the login page
      location.reload();
    },
    *upload({payload}, {call, put}) {
      console.log('begin')
      console.log(payload)
      const response = yield call(upyun_sign, {
        method: 'POST',
        ext: payload.ext || 'jpg',
        sizes: payload.sizes || "600_600",
      }); 
      if (response.status === 0) {
        let formData = new FormData();
        formData.append('policy', response.data.signatures[0].policy);
        formData.append('signature', response.data.signatures[0].signature);
        formData.append('file', payload.file);
        console.log(formData)
        const res1 = yield call(upyun, formData);

        res1.host = response.data.host;
        payload.call(res1);
      } else {
        console.log(2)
        console.log(response)
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      if(payload.operator_id) {
        setOperatorId(payload.operator_id);
        setToken(payload.token);
        setOperatorName(payload.operator_name);
      }
      return {
        ...state,
        status: payload.status,
        type: 'account',
        msg: payload.msg,
      };
    },
  },
};
