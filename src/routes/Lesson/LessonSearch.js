import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, lesson}) => ({
  submitting: loading.effects['lesson/add'],

  worker_data: worker.worker_data,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.queryWorker();
  }

  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
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

  render() {
    let {submitting, form, worker_data} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '课程名称',
      dataIndex: 'lesson',
      key: 'lesson'
    }, {
      title: '课程教练',
      dataIndex: 'worker_id',
      key: 'worker_id'
    }, {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type'
    }, {
      title: '课程时间',
      dataIndex: 'date',
      key: 'date'
    }, {
      title: '课程价格',
      dataIndex: 'price',
      key: 'price'
    }, {
      title: '销量/消耗',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '课程状态',
      dataIndex: 'statue',
      key: 'statue'
    }, {
      title: '操作',
      render: (val, record) => {

      }
    }];
    let loading = true;

    return(
      <PageHeaderLayout title="课程管理">
        <Card bordered={false}>
          <div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.addLesson()}>添加课程</Button>
          </div>

          <div>
            <Table rowKey={record => record.id} dataSource={[]} columns={col} loading={loading} onChange={this.handleTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}