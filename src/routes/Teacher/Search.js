import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import {Card, Form, Table, Row, Col, Input, Select, Button, DatePicker} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getDateStr, getPriceY} from '../../utils/utils';
import {PAGE_SIZE, LESSON_SUBSCRIBE_STATUS} from '../../config';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({teacher, manage, loading}) => ({
  loading: loading.effects['teacher/getList'],

  teacher_lesson: teacher.teacher_lesson,

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
      type: 'teacher/getList',
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
      payload: {}
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.code) params.code = values.code;
        if(values.status) params.status = values.status;
        if(values.worker_id) params.worker_id = values.worker_id;
        if(values.worker_id) params.user_id = values.user_id;
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
  goManage = (record) => {
    const {dispatch, history} = this.props;
    dispatch({
      type: 'member/query',
      payload: {
        code: record.card_id
      }
    })
    history.push('/member/manage');
  }
  change = (record) => {
    const {dispatch, history} = this.props;
    dispatch({
      type: 'teacher/set',
      payload: {
        old_teacher_id: record.item_id
      }
    })
    history.push('/teacher/change');
  }
  render() {
    const {teacher_lesson, worker_data, loading} = this.props;
    const {list, pagination} = teacher_lesson;
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
      key: 'id'
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
      title: '购买课程',
      dataIndex: 'count_count', 
      key: 'count_count',
      render(val, record) {
        if(val) {
          if(record.count_gift) {
            return "购" + val + "赠" + record.count_gift;
          } else {
            return "购" + val;
          }
        }
        return '包月用户';
      }
    }, {
      title: '剩余课程',
      dataIndex: 'count_left', 
      key: 'count_left',
      render(val) {
        return val || '-';
      }
    }, {
      title: '价格',
      dataIndex: 'lesson_price', 
      key: 'lesson_price',
      render(val) {
        return getPriceY(val);
      }
    }, {
      title: '私人教练',
      dataIndex: 'worker_name', 
      key: 'worker_name'
    }, {
      title: '到期日期',
      dataIndex: 'valid_date_end', 
      key: 'valid_date_end',
      render(val) {
        return getDateStr(val)
      }
    }, {
      title: '购买日期',
      dataIndex: 'create_ts', 
      key: 'create_ts',
      render(val) {
        return moment(val * 1000).format('YYYY-MM-DD')
      }
    }, {
      title: '操作',
      width: '150px',
      render: (val, record) => {
        return (
          <Fragment>
            <a href="javascript:;"  onClick={() => this.change(record)}>更换私教</a>
          </Fragment>
        )
      }
    }]

    return (
      <PageHeaderLayout title="私教查询">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="8">
                <FormItem {...f_i_l} label="会员">
                  {getFieldDecorator('code')(
                    <Input placeholder="输入会员卡号／电话／名字" />
                  )}
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem {...f_i_l} label="私教">
                  {getFieldDecorator('worker_id', {
                    initialValue: "",
                  })(
                    <Select placeholder="私教">
                      {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem {...f_i_l} label="课程状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="课程状态">
                      {LESSON_SUBSCRIBE_STATUS.map((item, i) => {return (<Option key={`status_${i}`} value={i}>{item}</Option>)})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem
                  {...f_i_l}
                  label="购买时间"
                >
                  {getFieldDecorator('subscribe_time')(
                    <RangePicker format="YYYY-MM-DD" />
                  )}
                </FormItem>
              </Col>
              <Col span="8">
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