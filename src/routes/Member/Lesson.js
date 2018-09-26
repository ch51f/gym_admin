import React, {Component, Fragment} from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Card, Form, Input, Select, Button, DatePicker } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {unix, getDateStr, getPriceY, getTimeStr, setMoment, format } from '../../utils/utils';
import {CARD_STATUS, PAGE_SIZE, DAY_OF_WEEK_1} from '../../config';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({member, lesson, worker, loading}) => ({
  loading: loading.effects['member/attend_list'],

  member_data: member.attend_data,

  worker_data: worker.worker_data,
  search_lists: lesson.search_lists,
}))
export default class Page extends Component {
  state = {}
  componentDidMount() {
    // this.add();
    this.queryWorker();
    this.queryLesson();
    this.query();
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'worker/set',
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
  add() {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/attend',
      payload: {
        user_id: 26,
        lesson_id: 132,
        user_lesson_id: 146,
        reserved_item_id: 141,
        reserved_date: 20180526,
        // reserved_day_of_weed: 2,
        // reserved_time_begin: 1300,
        // reserved_time_end: 1400,
      }
    })
  }
  query(params = {}, target_page=1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/attend_list',
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
      payload: {}
    })
  }
  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.code) params.code = values.code;
        if(values.teacher_id) params.teacher_id = values.teacher_id;
        if(values.lesson_id) params.lesson_id = values.lesson_id;
        if(values.date) {
          params.date_begin = values.date[0].format('YYYYMMDD');
          params.date_end = values.date[1].format('YYYYMMDD');
        }

        this.query(params, current, pageSize)
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.code) params.code = values.code;
        if(values.teacher_id) params.teacher_id = values.teacher_id;
        if(values.lesson_id) params.lesson_id = values.lesson_id;
        if(values.date) {
          params.date_begin = values.date[0].format('YYYYMMDD');
          params.date_end = values.date[1].format('YYYYMMDD');
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
      type: 'member/queryToManage',
      payload: {
        code: record.card_id
      }
    })
    history.push('/member/manage');
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
      title: '课程名称',
      dataIndex: 'lesson_name',
      key: 'lesson_name',
    }, {
      title: '课程教练',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
    }, {
      title: '上课时间',
      dataIndex: 'lesson_type',
      key: 'lesson_type',
      render: (val, record) => {
        if(val == 2) {
          return format(setMoment(record.date_begin)) + " 至 " + format(setMoment(record.date_end)) + "的" + DAY_OF_WEEK_1[record.day_of_week] + "的" + getTimeStr(record.time_begin) + "-" + getTimeStr(record.time_end);
        } else {
          return format(setMoment(record.date)) + " " + DAY_OF_WEEK_1[record.day_of_week] + "的" + getTimeStr(record.time_begin) + "-" + getTimeStr(record.time_end);
        }
        // return val && val > 0 ? getDateStr(val) : '-';time_begin
        // return val ? getTimeStr(val) + "-" + getTimeStr(record.time_end) : '-'
      }
    }, {
      title: '预约时间',
      dataIndex: 'create_ts',
      key: 'create_ts',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }, {
      title: '购买/剩余',
      dataIndex: 'count_left_count',
      key: 'count_left_count',
    }, 
    // {
    //   title: '账户余额(元)',
    //   dataIndex: 'balance',
    //   key: 'balance',
    //   render: (val) => {
    //     return getPriceY(val);
    //   }
    // }
    ]


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
                        return (<Option key={i} value={item.id}>{item.lesson_name}-{item.teacher_name}</Option>)
                      })}
                    </Select>
                  )}
      					</FormItem>
      				</Col>
      				<Col span="12">
      					<FormItem {...f_i_l} label="上课时间">
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