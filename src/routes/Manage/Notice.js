import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button, Divider, Popconfirm, Modal} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PAGE_SIZE, NOTICE_STATUS} from '../../config';
import ReactQuill from 'react-quill';

@connect(({manage, loading}) => ({
  loading: loading.effects['manage/getNoticeList'],

  notice_data: manage.notice_data,
}))
export default class Page extends Component {
  state = {
    visible: false,
    title: "",
    value: {ops: []},
    content: "",
  }
  componentWillMount() {
    this.query()
  }
  // 查询列表
  query(target_page = 1, page_size = PAGE_SIZE) {
    this.props.dispatch({
      type: 'manage/getNoticeList',
      payload: {
        target_page,
        page_size,
      }
    })
  }
  // 页面跳转
  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    let {current, pageSize} = pagination;
    this.query(current, pageSize);
  }
  // 新增通知
  goAddNotice = (flag = 0, record = {}) => {
    let {dispatch, history} = this.props;
    dispatch({
      type: 'manage/setNotice',
      payload: record,
    })
    history.push('/manage/addNotice');
  }
  // 跳转发布界面
  goReleaseNotice = () => {
    this.props.history.push('/manage/releaseNotice');
  }
  // 删除方法
  _delete = (record = {}) => {
    let params = {
      item_id: record.id,
      status: 2,
    }
    this.props.dispatch({
      type: 'manage/deleteNotice',
      payload: params,
    })
  }
  // 发布方法
  _publish = (record = {}) => {
    let params = {
      item_id: record.id, 
      status: 0,
    }
    this.props.dispatch({
      type: 'manage/publishNotice',
      payload: params,
    })
  }
  // 显示通知
  showNotice = (record) => {
    // console.log(record.content);
    this.setState({
      value: JSON.parse(record.content),
      title: record.title,
      visible: true,
    })
  }

  onEditorChange = (value, delta, source, editor) => {
    this.setState({
      content: value
    })
    setTimeout(() => {
      let {con} = this.refs;
      con.innerHTML = value;
    }, 50)
    // console.log(value);
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
	render() {
    const {value, visible, title, content} = this.state;
    const {loading, notice_data} = this.props;
    const {list, pagination} = notice_data;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        render: (val, record) => {
          return (
            <Fragment>
              <a href="javascript:;" onClick={() => this.showNotice(record)}>{val}</a>
            </Fragment>
          )
        }
      }, {
        title: '通知状态',
        width: '100px',
        dataIndex: 'status',
        render(val) {
          return NOTICE_STATUS[val]
        }
      }, {
        title: '创建时间',
        width: '120px',
        dataIndex: 'create_ts',
        render(val) {
          return moment(val * 1000).format('YYYY-MM-DD')
        }
      }, {
        title: '操作',
        width: '150px',
        render: (val, record) => {
          if(record.status == 0) {
            return '已发布通知'
          } else {
            return (
              <Fragment>
                <a href="javascript:;"  onClick={() => this.goAddNotice(1, record)}>修改</a>
                <Divider type="vertical" />
                <Popconfirm title="确定要发布该通知吗？" onConfirm={this._publish.bind(this, record)} okText="发布" cancelText="取消">
                  <a href="javascript:;">发布</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="确定要删除该通知吗？" onConfirm={this._delete.bind(this, record)} okText="删除" cancelText="取消">
                  <a href="javascript:;">删除</a>
                </Popconfirm>
              </Fragment>
            )
          }
        }
      },
    ];

		return (
      <PageHeaderLayout title="通知管理">
      	<Card bordered={false}>
          <div style={{'marginBottom': '20px'}}>
            <Button icon="plus" type="primary" onClick={() => this.goAddNotice()}>
              新建
            </Button>
            <Button style={{'marginLeft': '20px'}} type="primary" onClick={() => this.goReleaseNotice()}>
              查看已发布通知
            </Button>
          </div>
          <div>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
      	</Card>
        <div style={{display: 'none'}}>
          <ReactQuill 
            theme='snow'
            value={value}
            onChange={this.onEditorChange}
          />
        </div>
        <Modal 
          title=<div style={{wordBreak: 'break-all'}}>{title}</div>
          visible={visible} 
          onOk={this.handleOk} 
          onCancel={this.handleCancel}
        >
          <div ref="con"></div>
        </Modal>
      </PageHeaderLayout>
		)
	}
}