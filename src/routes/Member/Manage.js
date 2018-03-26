import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Alert, Row, Col, Card, Icon, Input, Tabs, Tag, Button, Table, message} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import Info from './Sub/Info';

import CheckList from './Sub/CheckList';

import ListLesson from './Sub/ListLesson';
import ListLog from './Sub/ListLog';

import ListXK from './Sub/ListXK';
import FormXK from './Sub/FormXK';

import ListTK from './Sub/ListTK';
import FormTK from './Sub/FormTK';

import ListZK from './Sub/ListZK';
import FormZK from './Sub/FormZK';

import styles from './Member.less';

const {Search} = Input;
const {TabPane} = Tabs;

@connect(({member, manage}) => ({
  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

  manage_flag: member.manage_flag,

  cards: member.cards,
  worker_data: manage.worker_data,
}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
    let {manage_flag} = this.props;
      console.log(manage_flag)
    if(manage_flag) {
      console.log(1)
      this.props.dispatch({
        type: 'member/setConfig',
        payload: {
          manage_flag: false,
        }
      })
    } else {
      console.log(2)
      this.props.dispatch({
        type: 'member/setConfig',
        payload: {
          members: [],
          member_flag: false,
          member: {},
        }
      })
    }
    this.queryWorker();
    this.queryCard();
  }
  componentWillUnmount() {
    // this.props.dispatch({
    //   type: 'member/setConfig',
    //   payload: {
    //     members: [],
    //     member_flag: false,
    //     member: {},
    //   }
    // })
  }
  // 查询会籍顾问
  queryWorker() {
    this.props.dispatch({
      type: 'manage/getWorkerList',
      payload: {}
    })
  }
  // 查询健身卡
  queryCard() {
    this.props.dispatch({
      type: 'member/queryCard',
      payload: {}
    })
  }
  // 会员查询
  _search(val) {
    if(val == '') {
      message.warning('请输入会员卡号、电话、名字查询');
      return false;
    }
    this.props.dispatch({
      type: 'member/query',
      payload: {
        code: val
      }
    });
  }
  // 选择会员
  _chose(record) {
    this.props.dispatch({
      type: 'member/query',
      payload: {
        code: record.card_id,
      }
    })
  }
  // 跳转创建健身卡
  _create(record) {
    this.props.history.push('/member/add/card')
  }
  // 激活卡
  _active(id) {
    this.props.dispatch({
      type: 'member/activeMember',
      payload: {
        item_id: id,
      }
    })
  }
  // 销卡方法
  _cancle(id) {
    this.props.dispatch({
      type: 'member/cancleMember',
      payload: {
        item_id: id,
      }
    })
  }
  // 查询出多个会员时，先渲染列表
  _renderData() {
    const {member, members, cards, worker_data} = this.props;
    const {list: workers} = worker_data;
    const member_col = [{
      title: '会员卡号',
      dataIndex: 'card_id'
    }, {
      title: '会员姓名',
      dataIndex: 'user_name'
    }, {
      title: '会员电话',
      dataIndex: 'tel'
    }, {
      title: '会员操作',
      render: (val, record) => (
        <Fragment>
          <a href="javascript:;" onClick={() => this._chose(record)}>选择</a>
        </Fragment>
      )
    }];

    if(member.id) {
      const {id, extra_info} = member;
      const {subscribe_info, checkins, lesson_subscribes, lesson_attend_logs, card_subscribe_buys, card_subscribe_pauses, card_subscribe_transfers} = extra_info;
      return (
        <Tabs defaultActiveKey="1">
          <TabPane tab="会员资料" key="1">
            <Info member={member} create={this._create.bind(this)} />
          </TabPane>
          {subscribe_info.status&&checkins ?
          <TabPane tab="入场记录" key="6">
            <CheckList data={checkins} />
          </TabPane>
          : null}
          {subscribe_info.status ?
          <TabPane tab="私教课程" key="7">
            <Row>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="table" />私教购买记录</h3>
                  <ListLesson lesson={lesson_subscribes} />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="table" />上课记录</h3>
                  <ListLesson ogs={lesson_attend_logs} />
                </div>
              </Col>
            </Row>
          </TabPane>
          : null}
          {subscribe_info.status ?
          <TabPane tab="续卡" key="2">
            <Row>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="table" />续卡记录</h3>
                  <ListXK record={card_subscribe_buys} />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="form" />会员续卡</h3>
                  <FormXK user_id={id} workers={workers} cards={cards} />
                </div>
              </Col>
            </Row>
          </TabPane>
          : null}
          {subscribe_info.status ?
          <TabPane tab="停卡" key="3">
            <Row>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="table" />停卡记录</h3>
                  <ListTK record={card_subscribe_pauses}  user_id={subscribe_info.subscribe_id} />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="form" />会员停卡</h3>
                  <FormTK user_id={subscribe_info.subscribe_id} />
                </div>
              </Col>
            </Row>
          </TabPane>
          : null}
          {subscribe_info.status ?
          <TabPane tab="转卡" key="4">
            <Row>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="table" />转卡记录</h3>
                  <ListZK record={card_subscribe_transfers} />
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.record}>
                  <h3><Icon className={styles.icon} type="form" />会员转卡</h3>
                  <FormZK user_id={subscribe_info.subscribe_id} />
                </div>
              </Col>
            </Row>
          </TabPane>
          : null}
          {subscribe_info.status ?
          <TabPane tab="注销" key="5">
            <div className={styles.sectionCancel}>
              {subscribe_info.status == 3 ?
              <div>
                <Button className={styles.btnCancel} type="primary" size="large" onClick={this._active.bind(this, subscribe_info.subscribe_id)}>激活</Button>
              </div>
              :
              <div>
                <Button className={styles.btnCancel} type="primary" size="large" onClick={this._cancle.bind(this, subscribe_info.subscribe_id)}>注销</Button>
                <br />
                <Alert className={styles.alertCancel} message="注销后卡将不能使用，如需使用需再次激活" type="warning" />
              </div>
              }
            </div>
          </TabPane>
          : null}
        </Tabs>
      )
    } else if(members.length > 0) {
      return (<Table rowKey={record => record.id} dataSource={members} columns={member_col} pagination={false} />)
    } else {
      return (<Alert message="未找到相关数据！" type="warning" />)
    }
  }
  render() {
    const {member_flag} = this.props;
    return (
      <PageHeaderLayout title="会员管理">
        <Card bordered={false}>
          <div style={{'marginBottom': '40px'}}>
            <Search placeholder="输入会员卡号、电话、名字查询" enterButton="查询会员" onSearch={(value) => this._search(value)} />
          </div>
          {member_flag ?
          <div>
            {this._renderData()}
          </div>
          : null}
        </Card>
      </PageHeaderLayout>
    )
  }
}