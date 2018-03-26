import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Card, Form, Select, Button, DatePicker } from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getGender, getAge, getDateStr} from '../../utils/utils';
import {CARD_STATUS, PAGE_SIZE} from '../../config';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({member, manage, loading}) => ({
  loading: loading.effects['member/search'],

  member_data: member.member_data,

  worker_data: manage.worker_data,
}))
export default class Page extends Component {
  state = {}
  componentDidMount() {
    this.queryWorker();
    this.query();
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'manage/setConfig',
      payload: {
        worker_data: {
          list: [],
        }
      }
    })
  }
  query(params = {}, target_page=1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/search',
      payload: {
        ...params,
        target_page,
        page_size,
      }
    })
  }
  queryWorker() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manage/getWorkerList',
      payload: {
        department: 0
      }
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.status) params.status = values.status;
        if(values.worker_id) params.worker_id = values.worker_id;
        if(values.subscribe_time) {
          params.subscribe_time_start = values.subscribe_time[0].format('YYYYMMDD');
          params.subscribe_time_end = values.subscribe_time[1].format('YYYYMMDD');
        }
        if(values.valid_time) {
          params.valid_time_start = values.valid_time[0].format('YYYYMMDD');
          params.valid_time_end = values.valid_time[1].format('YYYYMMDD');
        }

        this.query(params)
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.query();
  }

  editUser = (record = {}) => {
    let {dispatch, history} = this.props;
    dispatch({
      type: 'member/query',
      payload: {
        code: record.card_id
      }
    })
    console.log(record)

    history.push('/member/editUser')
  }

  goManage = (record) => {
    const {dispatch, history} = this.props;
    dispatch({
      type: 'member/queryToManage',
      payload: {
        code: record.card_id
      }
    })
    history.push('/member/manage');
  }

  render() {
    const {worker_data, loading, member_data} = this.props;
    const {list, pagination} = member_data;
    const {getFieldDecorator} = this.props.form;

    if(worker_data.list.length > 0 && worker_data.list[0].id != "") {
      worker_data.list.unshift({
        id: "",
        worker_name: '全部'
      })
    }

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '卡号',
      dataIndex: 'card_id',
      key: 'card_id',
    }, {
      title: '名字',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (val, record) => {
        return (
          <Fragment>
            <a href="javascript:;" onClick={() => this.goManage(record)}>{val}</a>
          </Fragment>
        )
      }
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render(val) {
        return getGender(val)
      }
    }, {
      title: '年龄',
      dataIndex: 'birthday',
      key: 'birthday',
      render(val) {
        return val ? getAge(val) : '-'
      }
    }, {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel',
    }, {
      title: '会籍顾问',
      dataIndex: 'worker_name',
      key: 'worker_name',
    }, {
      title: '私人教练',
      dataIndex: 'teachers',
      key: 'teachers',
      render(val) {
        let names = "";
        for(let i = 0; i < val.length; i++) {
          names += val[i].name + " ";
        }
        return names;
      }
    }, {
      title: '入会日期',
      dataIndex: 'subscribe_time',
      key: 'subscribe_time',
      render(val) {
        return val && val > 0 ? getDateStr(val) : "-"
      }
    }, {
      title: '到期时间',
      dataIndex: 'available_time_end',
      key: 'available_time_end',
      render(val) {
        return val && val > 0 ? getDateStr(val) : "-"
      }
    }, {
      title: '入场次数',
      dataIndex: 'checkin_count',
      key: 'cnt',
    }, {
      title: '最近入场',
      dataIndex: 'last_checkin_ts',
      key: 'last',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }, {
      title: '操作',
      width: '100px',
      render: (val, record) => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.editUser(record)}>编辑</a>
        </Fragment>
      )
    }]


    return (
      <PageHeaderLayout title="会员查询">
      	<Card bordered={false}>
      		<Form layout="horizontal" onSubmit={this.handleSubmit}>
      			<Row>
      				<Col span="12">
      					<FormItem
      						{...f_i_l} 
      						label="会员状态"
      					>
                  {getFieldDecorator('status')(
                    <Select placeholder="会员状态">
                      {CARD_STATUS.map((status, key) => {return (<Option key={`card_status_${key}`} value={key}>{status}</Option>)})}
                    </Select>
                  )}
      					</FormItem>
      				</Col>
      				<Col span="12">
      					<FormItem 
      						{...f_i_l} 
      						label="会籍顾问"
      					>
                  {getFieldDecorator('worker_id', {
                    initialValue: "",
                  })(
        						<Select placeholder="会籍顾问">
                      {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
  			            </Select>
                  )}
      					</FormItem>
      				</Col>
      				<Col span="12">
      					<FormItem
      						{...f_i_l}
      						label="注册时间"
      					>
                  {getFieldDecorator('subscribe_time')(
      						  <RangePicker format="YYYY-MM-DD" />
                  )}
      					</FormItem>
      				</Col>
      				<Col span="12">
      					<FormItem
      						{...f_i_l}
      						label="到期时间"
      					>
                  {getFieldDecorator('valid_time')(
      						  <RangePicker format="YYYY-MM-DD" />
                  )}
      					</FormItem>
              </Col>
              <Col span="20" offset="2">
      					<FormItem style={{'textAlign': 'right'}}>
      						<Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
      					</FormItem>
      				</Col>
      			</Row>
      		</Form>
      		<div>
            <Table rowKey={record => record.id} dataSource={list} columns={col} loading={loading} pagination={pagination} onChange={this.handleTableChange} />
      		</div>
      	</Card>
      </PageHeaderLayout>
    )
  }
}