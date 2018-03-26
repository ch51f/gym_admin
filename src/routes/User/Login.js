import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { Tab, UserName, Password,  Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    test: 1,
    autoLogin: true,
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    const { test } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          test,
        },
      });
    }
  }

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  }

  renderMessage = (content) => {
    console.log(123)
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    console.log(login)
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="账户密码登录">
            {
              login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage(login.msg)
            }
            <UserName name="login" placeholder="请输入用户名" />
            <Password name="identity" placeholder="请输入密码" />
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
