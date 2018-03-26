import React, {Component} from 'react';
import { connect } from 'dva';
import {Input, AutoComplete} from 'antd';
import styles from './index.less';
const {Search} = Input;

const {Option} = AutoComplete;

@connect(({member}) => ({
  checkIn_list: member.checkIn_list,
}))
export default class Section extends Component {
  state = {
    user_id: -1,
  }
  _search = (value) => {
    const {dispatch} = this.props;
    const {user_id} = this.state;
    if(user_id < 0) {
      dispatch({
        type: 'member/checkIn',
        payload: {
          code: value,
        }
      })
    } else {
      dispatch({
        type: 'member/checkIn',
        payload: {
          code: user_id,
        }
      })
      this.setState({user_id: -1})
    }
  }
  onSelect = (value) => {
    const {checkIn_list} = this.props;
    for(let i = 0, item; item = checkIn_list[i]; i++) {
      if(value == item.id) {
        this.setState({user_id: item.card_id})
        this.props.dispatch({
          type: 'member/setData',
          payload: {
            checkIn_list: []
          }
        })
      }
    }
    // console.log('onSelect', value)
  }
  handleSearch = (value) => {
    this.setState({user_id: -1})
    this.props.dispatch({
      type: 'member/setData',
      payload: {
        checkIn_list: []
      }
    })
    return false;
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/checkIn',
      payload: {
        code: value
      }
    })
  }
  renderOption(item) {
    return (
      <Option key={item.id} text={item.id}>{item.user_name}</Option>
    );
  }
  render() {
    let {checkIn_list} = this.props;
    return (
      <AutoComplete className={styles.quickSign} dataSource={checkIn_list.map(this.renderOption.bind(this))} onSelect={this.onSelect.bind(this)} onSearch={this.handleSearch} >
        <Search placeholder="输入会员卡号、电话、名字" enterButton="快速签到" onSearch={(value) => this._search(value)} />
      </AutoComplete>
    )
  }
}