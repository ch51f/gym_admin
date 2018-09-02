import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Icon, Button, List, Popconfirm, Modal, Input, Radio} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PAGE_SIZE} from '../../config';
import style from './System.less';

@connect(({feedback, loading}) => ({
  loading: loading.effects['feedback/getFeedbackList'],

  feedback_data: feedback.feedback_data,
}))
export default class Page extends Component {
  state = {
    modal: false,
    record: {},
    reply: '',
    is_public: '0',
  } 
  componentWillMount() {
    this.query();
  }
  query(target_page=1, page_size = PAGE_SIZE) {
    this.props.dispatch({
      type: 'feedback/getFeedbackList',
      payload: {
        target_page,
        page_size,
      }
    })
  }
  handleListChange = (current, pageSize) => {
    this.query(current, pageSize);
  }
  goAddFeedback = () => {
    this.props.history.push('/system/addFeedback');
  }
  setModal = (flag, record = {}) => {
    let params = {
      record: record,
    };
    if(flag == false) {
      params.is_public = '0';
      params.reply = '';
    }
    this.setState({
      ...params,
      modal: flag
    })
  }
  _reply = () => {
    let {record, is_public, reply} = this.state;
    let params = {
      worker_id: 1,
      reply,
      item_id: record.id,
    }
    this.props.dispatch({
      type: 'feedback/replyFb',
      payload: params,
    })
    this.setModal(false);
  }
  _delete = (record = {}) => {
    let params = {
      item_id: record.id,
    }
    this.props.dispatch({
      type: 'feedback/deleteFeedback',
      payload: {
        ...params,
      }
    })
  }
  onChangeReply = (e) => {
    this.setState({
      reply: e.target.value,
    });
  }
  onChangeis_public = (e) => {
    this.setState({
      is_public: e.target.value,
    });
  }
	render() {
    const {loading, feedback_data} = this.props;
    const {list, pagination} = feedback_data;
    const paginationProps = {
      ...pagination,
      onChange: this.handleListChange,
    }
    console.log(style)
    console.log(123)
		return (
      <PageHeaderLayout title="反馈管理">
      	<Card bordered={false}>
          <div style={{'marginBottom': '20px'}}>
            <Button icon="plus" type="primary" onClick={() => this.goAddFeedback()}>新建</Button>
          </div>
          <div>
            <List
              className={style.feedbackList}
              itemLayout="vertical"
              size="large"
              rowKey="id"
              loading={loading}
              dataSource={list}
              pagination={paginationProps}
              renderItem = {item => (
                <List.Item className={style.feedbackItem}>
                  <div className={style.feedbackHead}>
                    {item.user_name}反馈：
                  </div>
                  <div className={style.feedbackCon}>
                    {item.content}
                  </div>
                  {item.reply ? <div className={style.feedbackReply}>{item.reply}</div> : null}
                  <div className={style.feedbackFoot}>
                    <span className={style.feedbackTime}>{moment(item.create_ts * 1000).format("YYYY-MM-DD")}</span>
                    <Popconfirm title="确定要删除该通知吗？" onConfirm={this._delete.bind(this, item)} okText="删除" cancelText="取消">
                      <a className={style.feedbackBtn} href="javascript:;">删除</a>
                    </Popconfirm>
                    <a className={style.feedbackBtn} href="javascript:;" onClick={this.setModal.bind(this, true, item)}>回复</a>
                  </div>
                </List.Item>
              )}
            />
          </div>
      	</Card>
        <Modal
          title="反馈回复"
          wrapClassName="vertical-center-modal"
          visible={this.state.modal}
          okText="回复"
          cancelText="取消"
          onOk={() => this._reply()}
          onCancel={() => this.setModal(false)}
        >
          <Input.TextArea value={this.state.reply} placeholder="反馈内容" style={{'margin-bottom': '15px'}}  onChange={this.onChangeReply} />
          <Radio.Group value={this.state.is_public} onChange={this.onChangeis_public}>
            <Radio value="0">公开</Radio>
            <Radio value="1">不公开</Radio>
          </Radio.Group>
          <span>公开后会员将可以在小程序看到这条反馈</span>
        </Modal>
      </PageHeaderLayout>
		)
	}
}