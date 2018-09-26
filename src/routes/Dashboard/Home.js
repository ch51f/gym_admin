import React, {Component} from 'react';
import {connect} from 'dva';
import {Input, Row, Col, List, Card, Icon, Tag, AutoComplete} from 'antd';
import moment from 'moment';
import {getDateStr} from '../../utils/utils';
import styles from './Home.less';

const {Meta} =Card;
const {Search} = Input;
const {Option} = AutoComplete;

@connect(({member, checkin, loading}) => ({
  loading: loading.effects['checkin/homeCheckinList'],

  checkIn_list: member.checkIn_list,

  homeActive: checkin.homeActive,
  homeCheckIn: checkin.homeCheckIn,
}))
export default class Home extends Component {
  state = {
    user_id: -1,
  }
  componentWillMount() {
    this.query()
  }
  // 首页数据查询
  query() {
    this.props.dispatch({
      type: 'checkin/getHomeCHeckinList',
      payload: {}
    })
  }
  // 签到
  _search(val) {
    let {panel} = this.refs;
    let input = panel.querySelector('input');
    const {dispatch} = this.props;
    const {user_id} = this.state;
    // console.log(user_id)
    if(user_id < 0) {
      dispatch({
        type: 'member/checkIn',
        payload: {
          code: val,
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
    setTimeout(function() {
      input.value = '';
    }, 500)
  }
  // 选择List数据
  _chooseItem(item) {
    this.props.dispatch({
      type: 'checkin/set',
      payload: {
        homeActive: item
      }
    })
  }
  // 跳转链接
  _go(url) {
    const {homeCheckIn, homeActive, dispatch, history} = this.props;
    if(url == '/member/manage') {
      dispatch({
        type: 'member/queryToManage',
        payload: {
          code: homeCheckIn.list[homeActive].card_id,
        }
      })
    }
    history.push(url);
  }

  // auto数据选择
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
  }
  // auto数据搜索
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
  // 渲染auto Option
  renderOption(item) {
    const {id, user_name} = item;
    return (
      <Option key={id} text={id}>{user_name}</Option>
    );
  }

  render() {
    const {homeCheckIn, homeActive, checkIn_list} = this.props;
    const {list, count} = homeCheckIn;

    const member = list.length > 0 ? list[homeActive] : {};

    return (
      <div ref="panel" className={styles.pageHome}>
        <AutoComplete className={styles.homeSearch} dataSource={checkIn_list.map(this.renderOption.bind(this))} onSelect={this.onSelect.bind(this)} onSearch={this.handleSearch} >
          <Search placeholder="输入会员卡号、电话、名字" enterButton="快速签到" onSearch={(value) => this._search(value)} />
        </AutoComplete>
        <Row>
          <Col span={10} offset={2}>
            <List
              header={<h4 className={styles.homeListHd}>今天入场人数<em>{count}</em></h4>} 
              footer={list.length > 0 ?<div><a href="javascript:;" onClick={this._go.bind(this, '/member/checkin')}>查看更多</a></div> : null}
              dataSource={list}
              renderItem={(item, i) => (
                <List.Item>
                  <Row className={styles.homeListItem} onClick={this._chooseItem.bind(this, i)}>
                    <Col span={6}>{item.user_name}</Col>
                    <Col span={6}>{item.card_name}</Col>
                    <Col span={6}>{item.available_info}</Col>
                    <Col span={6}>{moment(item.create_ts * 1000).format('YYYY-MM-DD HH:mm')}</Col>
                  </Row>
                </List.Item>
              )}
            />
          </Col>
          <Col span={8} offset={2}>
            {member.id ?
            <Card 
              style={{width: '380px', margin: '0 auto'}}
              bordered={false}
              cover={<div className={styles.homeIcon}>
                {member.avatar ?
                <img src={member.avatar} header="380px" width="380px" />
                :
                <Icon type="user" style={{fontSize: '380px', color: '#999'}} />
                }
              </div>}
            >
              <Meta
                title={member.user_name}
                description={
                  <Row>
                    <Col span={12} className={styles.homeItem}>
                      <label>卡类：</label>
                      <span>{member.card_name}</span>
                    </Col>
                    <Col span={12} className={styles.homeItem}>
                      <label>有效期：</label>
                      <span>{member.available_time_end ? getDateStr(member.available_time_end) : "-"}</span>
                    </Col>
                    <Col span={24} className={styles.homeItem}>
                      <label>会籍顾问：</label>
                      <span>{member.saler_name}</span>
                    </Col>
                    <Col span={24} className={styles.homeItem}>
                      <label>私人教练：</label>
                      <span>{member.teachers.map((item, i) => {
                        return (<span key={`t_${i}`}>{item.name} </span>)
                      })}</span>
                    </Col>
                    <Col span={24} className={styles.homeItem}>
                      <label>上次签到：</label>
                      <span>{moment(member.create_ts * 1000).format('YYYY-MM-DD HH:mm')}</span>
                    </Col>
                    <Col span={24} className={styles.homeItem}>
                      <a href="javascript:;" onClick={this._go.bind(this, '/member/manage')}>查看详细信息</a>
                    </Col>
                  </Row>
                }
              />
            </Card>
            :null}
          </Col>
        </Row>
      </div>
    )
  }
}