import React, {Component} from 'react';
import {Card, Row, Col, Tag, Button, Icon} from 'antd';
import moment from 'moment';

import style from '../Member.less';
import {CARD_UNIT, CARD_STATUS} from '../../../config';
import {getDateStr} from '../../../utils/utils';

export default class Section extends Component {
  // 新开卡
  _handle() {
    this.props.create();
  }
  // 渲染卡类
  _renderCard() {
    const {member} = this.props;
    const {subscribe_info} = member.extra_info;
    if(subscribe_info.status) {
      return (<span>{subscribe_info.card_name}</span>)
    } else {
      return (<span>未开卡</span>)
    }
  }
  // 渲染会员卡状态
  _renderStatus() {
    const {member} = this.props;
    const {subscribe_info} = member.extra_info;
    if(!subscribe_info.status) {
      return (<Button type='default' size="small" onClick={this._handle.bind(this)}>开卡</Button>)
    }
    return (<span>{CARD_STATUS[subscribe_info.status]}</span>)
  }

  // 渲染私教
  _renderTearcher(lesson, i) {
    return (<span style={{paddingRight: '15px'}} key={`t_${i}`}>{lesson.worker_name}</span>)
  }

  editUser = (record = {}) => {
    this.props.cb(record)
  }


  render() {
    const {member} = this.props;
    const {user_name, create_ts, tel, birthday, job, community, note, extra_info, card_id, gender, teachers, avatar} = member;
    const {subscribe_info, checkins, lesson_subscribes} = extra_info;
    const {available_time_begin, worker_name, available_time_end} = subscribe_info;

    return (
      <Row>
        <Col span={16}>
          <Row>
            <Col span={24}>
              <h3 className={style.manageCol}>{user_name}({card_id})</h3>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                卡类：{this._renderCard()}
              </div>
            </Col>
              <Col span={12}>
              <div className={style.manageCol}>
                会员卡状态：{this._renderStatus()}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                注册日期：{moment(create_ts * 1000).format('YYYY-MM-DD')}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                有效期：{available_time_end && available_time_end > 0 ? getDateStr(available_time_end) : "-"}
              </div>
            </Col>
            <Col span={12}>     
              <div className={style.manageCol}>
                入场次数：{checkins ? checkins.length : 0}次
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                上次入场：{(checkins && checkins.length > 0) ? moment(checkins[0].create_ts * 1000).format('YYYY-MM-DD') : "-"}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                会籍顾问：{worker_name ? <span style={{paddingRight: '15px'}}>{worker_name}</span> : '-'}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                教练顾问：{(teachers && teachers.length > 0) ? teachers.map((item, i) => this._renderTearcher(item, i)) : "-"}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                电话：{tel}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                性别：{gender == "f" ? '女' : '男'}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                生日：{birthday ? getDateStr(birthday) : '-'}
              </div>
            </Col>
            <Col span={12}>
              <div className={style.manageCol}>
                职业：{job}
              </div>
            </Col>
            <Col span={24}>
              <div className={style.manageCol}>
                地址：{community}
              </div>
            </Col>
            <Col span={24}>
              <div className={style.manageCol}>
                备注：{note}
              </div>
            </Col>
            <Col span={24}>
              <Button type='primary' size="small" onClick={this.editUser.bind(this, member)}>编辑</Button>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          {avatar?
          <Card style={{width: '200px'}} cover={<div><img src={avatar} style={{width: '100%'}} /></div>} /> 
            :
          <Card style={{width: '200px'}} cover={<div><Icon type="user" style={{fontSize: '200px', color: '#999'}} /></div>} /> 
          }
        </Col> 
      </Row>
    )
  }
}