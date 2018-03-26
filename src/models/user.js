export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *getUser({payload}, {call, put}) {
      yield put({
        type: 'saveCurrentUser',
        payload: payload,
      })
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
  },
};
