import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber, Tooltip, message} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, LESSON_TYPE, LESSON_STATUS} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, lesson}) => ({
  submitting: loading.effects['lesson/lesson_list'],

  lists: lesson.lists,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.query();
  }

  query() {
    this.props.dispatch({
      type: 'lesson/lesson_list',
      payload: {}
    })
  }

  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }

  addLesson = (item = {}) => {
    // this.props.dispatch({
    //   type: 'system/set',
    //   payload: {
    //     notice: item
    //   }
    // });
    this.props.history.push('/lesson/lessonAdd');
  }

  update =(item ={}) => {
    message.warning("未接入接口")
  }

  render() {
    let {submitting, form, lists} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '课程名称',
      dataIndex: 'lesson_name',
      key: 'lesson_name'
    }, {
      title: '课程教练',
      dataIndex: 'teacher_name',
      key: 'teacher_name'
    }, {
      title: '课程类型',
      dataIndex: 'lesson_type',
      key: 'lesson_type',
      render: (val) => {
        return LESSON_TYPE[val] || "-";
      }
    }, {
      title: '课程时间',
      dataIndex: 'camp_lesson_valid_date_begin',
      key: 'camp_lesson_valid_date_begin',
      render: (val, record) => {
        if(val) {
          return `${val}至${record.camp_lesson_valid_date_end}`;
        }
        return "-"
      }
    }, {
      title: '课程价格',
      dataIndex: 'prices',
      key: 'prices',
      render(val) {
          let text =  (val && val.length > 20) ? (val.slice(0, 20) + "...") : val;
          return (<Tooltip title={val}>{text}</Tooltip>)
        }
    }, {
      title: '销量/消耗',
      dataIndex: 'left_count',
      key: 'left_count',
      render: (val, record) => {
        if(val) {
          return `${val}/${record.total_count}`;
        }
        return "-"
      }
    }, {
      title: '课程状态',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        return LESSON_STATUS[val] || "-";
      }
    }, {
      title: '操作',
      render: (val, record) => (
        <Fragment>
          <a href="javascript:;" onClick={() => this.update(record)}>编辑</a>
        </Fragment>
      )
    }];

    return(
      <PageHeaderLayout title="课程管理">
        <Card bordered={false}>
          <div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.addLesson()}>添加课程</Button>
          </div>

          <div>
            <Table rowKey={record => record.id} dataSource={lists} columns={col} loading={submitting} onChange={this.handleTableChange} pagination={false} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}