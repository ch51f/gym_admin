import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';
import {getPriceY, getPriceF} from '../../utils/utils';
import moment from 'moment';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, lesson}) => ({
  submitting: loading.effects['lesson/buy_list'],

  worker_data: worker.worker_data,

  buy_lists: lesson.buy_lists,
  search_lists: lesson.search_lists,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.query();
    this.queryWorker();
    this.queryLesson();
  }

  query() {
    this.props.dispatch({
      type: 'lesson/buy_list',
      payload: {}
    })
  }

  queryLesson() {
    this.props.dispatch({
      type: 'lesson/search_list',
      payload: {}
    })
  }

  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values)
      if(!err) {

      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.query();
  }

  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }

  render() {
    let {submitting, form, worker_data, buy_lists, search_lists} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '会员号',
      dataIndex: 'card_id',
      key: 'card_id'
    }, {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name'
    }, {
      title: '购买课程',
      dataIndex: 'lesson_name',
      key: 'lesson_name'
    }, {
      title: '课程教练',
      dataIndex: 'teacher_name',
      key: 'teacher_name'
    }, {
      title: '课程单价(元)',
      dataIndex: 'lesson_price',
      key: 'lesson_price',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '购买数量',
      dataIndex: 'total_count',
      key: 'total_count'
    }, {
      title: '购买总价(元)',
      dataIndex: 'user_price',
      key: 'user_price',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '购买时间',
      dataIndex: 'create_ts',
      key: 'create_ts',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }, {
      title: '累计购买',
      dataIndex: 'total_count_sum',
      key: 'total_count_sum'
    }, {
      title: '剩余课时',
      dataIndex: 'left_count',
      key: 'left_count'
    }, {
      title: '账户余额(元)',
      dataIndex: 'balance',
      key: 'balance',
      render(val) {
        return getPriceY(val)
      }
    }];

    return(
      <PageHeaderLayout title="购买记录">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="12">
                <FormItem {...f_i_l} label="搜索会员">
                  {getFieldDecorator('keyword')(
                    <Input placeholder="搜索内容" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择课程">
                  {getFieldDecorator('lesson_id')(
                    <Select placeholder="购买课程" onChange={this.change}>
                      {search_lists.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.lesson_name}-{item.teacher_name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="购买数量">
                  <InputGroup compact>
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择教练">
                  {getFieldDecorator('worker_id')(
                    <Select placeholder="教练列表"> 
                      {worker_data.list.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.worker_name}</Option>) 
                      })} 
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
            <Table rowKey={record => record.id} dataSource={buy_lists} columns={col} loading={submitting} onChange={this.handleTableChange}  pagination={false} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}