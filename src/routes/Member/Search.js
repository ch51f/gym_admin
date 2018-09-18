import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Card, Form, Input, Select, Button, DatePicker, Tooltip } from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getGender, getAge, getDateStr, getPriceY} from '../../utils/utils';
import {CARD_STATUS, PAGE_SIZE, exportUsersUrl} from '../../config';
import {getToken, getOperatorId} from '../../utils/load';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({member, lesson, worker, loading}) => ({
  loading: loading.effects['member/search'],

  member_data: member.member_data,

  worker_data: worker.worker_data,
  search_lists: lesson.search_lists,
}))
export default class Page extends Component {
  state = {}
  componentDidMount() {
    this.queryWorker();
    this.queryLesson();
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
    this.props.dispatch({
      type: 'lesson/set',
      payload: {
        search_lists: [],
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
  exportUser(params ={}, target_page=1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/exportUser',
      payload: {
        ...params,
        target_page,
        page_size,
      }
    })
  }
  queryLesson() {
    const {dispatch} = this.props;
    dispatch({
      type: 'lesson/search_list',
      payload: {}
    })
  }
  queryWorker() {
    const {dispatch} = this.props;
    dispatch({
      type: 'worker/getWorkerList',
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
        if(values.code) params.code = values.code;
        if(values.lesson_id) params.lesson_id = values.lesson_id;
        if(values.teacher_id) params.teacher_id = values.teacher_id;
        if(values.date) {
          params.date_begin = values.date[0].format('YYYYMMDD');
          params.date_end = values.date[1].format('YYYYMMDD');
        }

        this.query(params)
      }
    })
  }

  handleExport = (e) => {
    e.preventDefault();
    let {export_form} = this.refs;
    debugger;
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if(!err) {
    //     let params = {}
    //     if(values.code) params.code = values.code;
    //     if(values.lesson_id) params.lesson_id = values.lesson_id;
    //     if(values.teacher_id) params.teacher_id = values.teacher_id;
    //     if(values.date) {
    //       params.date_begin = values.date[0].format('YYYYMMDD');
    //       params.date_end = values.date[1].format('YYYYMMDD');
    //     }

    //     this.exportUser(params)
    //   }
    // })
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
    // const {dispatch, history} = this.props;
    // dispatch({
    //   type: 'member/queryToManage',
    //   payload: {
    //     code: record.card_id
    //   }
    // })
    // history.push('/member/manage');
  }

  render() {
    const {worker_data, loading, member_data, search_lists} = this.props;
    const {list, pagination} = member_data;
    const {getFieldDecorator} = this.props.form;

    if(worker_data.list.length > 0 && worker_data.list[0].id != "") {
      worker_data.list.unshift({
        id: "",
        worker_name: '全部'
      })
    }
    if(search_lists.length > 0 &&search_lists[0].id != "") {
      search_lists.unshift({
        id: "",
        lesson_name: '全部'
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
      title: '购买课程',
      dataIndex: 'lesson_names',
      key: 'lesson_names',
      render(val) {
        let text =  (val && val.length > 5) ? (val.slice(0, 5) + "...") : val; 
        return (<Tooltip title={val}>{text}</Tooltip>) 
      }
    }, {
      title: '私人教练',
      dataIndex: 'teacher_names',
      key: 'teacher_names',
      render(val) {
        let text =  (val && val.length > 5) ? (val.slice(0, 5) + "...") : val; 
        return (<Tooltip title={val}>{text}</Tooltip>) 
      }
    }, {
      title: '充值总额(元)',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render(val) {
        return val ? getPriceY(val) : "-"
      }
    }, {
      title: '充值余额(元)',
      dataIndex: 'balance',
      key: 'balance',
      render(val) {
        return val ? getPriceY(val) : "-"
      }
    }, {
      title: '最近上课',
      dataIndex: 'last_attend_date',
      key: 'last_attend_date',
      render(val) {
        return val && val > 0 ? getDateStr(val) : '-'
      }
    }, {
      title: '注册日期',
      dataIndex: 'create_ts',
      key: 'create_ts',
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
                <FormItem {...f_i_l} label="会员">
                  {getFieldDecorator('code')(
                    <Input placeholder="会员ID、手机号码、名字" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择课程">
                  {getFieldDecorator('lesson_id', {
                    initialValue: "",
                  })(
                    <Select placeholder="购买课程" onChange={this.change}>
                      {search_lists.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.lesson_name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="注册时间">
                  {getFieldDecorator('date')(
                    <RangePicker format="YYYY-MM-DD" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择教练">
                  {getFieldDecorator('teacher_id', {
                    initialValue: "",
                  })(
                    <Select placeholder="教练列表">
                      {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="20" offset="2">
                <FormItem style={{'textAlign': 'right'}}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleExport}>导出</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <form ref="export_form" action={exportUsersUrl} target="_blank" method="post">
            <input value={getToken()} type="hidden" name="token" />
            <input value={getOperatorId()} type="hidden" name="operator_id" />
          </form>
      		<div>
            <Table rowKey={record => record.id} dataSource={list} columns={col} loading={loading} pagination={pagination} onChange={this.handleTableChange} />
      		</div>
      	</Card>
      </PageHeaderLayout>
    )
  }
}