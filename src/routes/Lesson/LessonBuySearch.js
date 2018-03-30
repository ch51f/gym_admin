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
    let {submitting, form, worker_data} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '会员号',
      dataIndex: 'id',
      key: 'id'
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '购买课程',
      dataIndex: 'lesson_id',
      key: 'lesson_id'
    }, {
      title: '课程教练',
      dataIndex: 'worker_id',
      key: 'worker_id'
    }, {
      title: '课程单价',
      dataIndex: 'price',
      key: 'price'
    }, {
      title: '购买数量',
      dataIndex: 'num',
      key: 'num'
    }, {
      title: '购买总价',
      dataIndex: 'total',
      key: 'total'
    }, {
      title: '购买时间',
      dataIndex: 'time',
      key: 'time'
    }, {
      title: '累计购买',
      dataIndex: 'a_price',
      key: 'a_price'
    }, {
      title: '剩余课时',
      dataIndex: 'a_z_price',
      key: 'a_z_price'
    }, {
      title: '账户余额',
      dataIndex: 'y_price',
      key: 'y_price'
    }];
    let loading = true;

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
                    <Select placeholder="课程列表"> 
                      {worker_data.list.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.worker_name}</Option>) 
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
            <Table rowKey={record => record.id} dataSource={[]} columns={col} loading={loading} onChange={this.handleTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}