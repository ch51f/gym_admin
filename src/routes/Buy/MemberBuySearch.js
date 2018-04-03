import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber} from 'antd';
import {PAGE_SIZE} from '../../config';
import {getPriceY, getPriceF} from '../../utils/utils';
import moment from 'moment';

const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, member}) => ({
  submitting: loading.effects['member/recharge_list'],

  recharge_data: member.recharge_data,

  worker_data: worker.worker_data,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.query();
    this.queryWorker();
  }

  query(params = {}, target_page = 1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/recharge_list',
      payload: {
        ...params,
        target_page,
        page_size
      }
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
        let params = {}
        if(values.code) params.code = values.code;
        if(values.worker_id) params.worker_id = values.worker_id;
        if(values.user_amount_from) params.user_amount_from =getPriceF(values.user_amount_from);
        if(values.user_amount_to) params.user_amount_to = getPriceF(values.user_amount_to);
        if(values.grand_amount_from) params.grand_amount_from = getPriceF(values.grand_amount_from);
        if(values.grand_amount_to) params.grand_amount_to = getPriceF(values.grand_amount_to);
        if(values.balance_from) params.balance_from = getPriceF(values.balance_from);
        if(values.balance_to) params.balance_to =getPriceF(values.balance_to);
        this.query(params)
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
    let {submitting, form, worker_data, recharge_data} = this.props;
    const {list, pagination} = recharge_data;
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
      title: '充值金额',
      dataIndex: 'user_amount',
      key: 'user_amount',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '赠送金额',
      dataIndex: 'gift_amount',
      key: 'gift_amount',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '充值顾问',
      dataIndex: 'worker_name',
      key: 'worker_name'
    }, {
      title: '充值时间',
      dataIndex: 'create_ts',
      key: 'create_ts',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }, {
      title: '累计充值',
      dataIndex: 'grand_user_amount',
      key: 'grand_user_amount',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '累计赠送',
      dataIndex: 'grand_gift_amount',
      key: 'grand_gift_amount',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '账户余额',
      dataIndex: 'grand_total_amount',
      key: 'grand_total_amount',
      render(val) {
        return getPriceY(val)
      }
    }];

    return(
      <PageHeaderLayout title="充值记录">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="12">
                <FormItem {...f_i_l} label="搜索会员">
                  {getFieldDecorator('code')(
                    <Input placeholder="搜索内容" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="充值顾问">
                  {getFieldDecorator('worker_id')(
                    <Select placeholder="教练列表"> 
                      {worker_data.list.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.worker_name}</Option>) 
                      })} 
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="充值金额">
                  <InputGroup compact>
                    {getFieldDecorator('user_amount_from')(
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    )}
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    {getFieldDecorator('user_amount_to')(
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                    )}
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="账户余额">
                  <InputGroup compact>
                    {getFieldDecorator('balance_from')(
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    )}
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    {getFieldDecorator('balance_to')(
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                    )}
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="累计充值">
                  <InputGroup compact>
                    {getFieldDecorator('grand_amount_from')(
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" /> 
                    )}
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                    {getFieldDecorator('grand_amount_to')(
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                    )}
                  </InputGroup>
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
            <Table rowKey={record => record.id} dataSource={list} columns={col} loading={submitting}  pagination={pagination} onChange={this.handleTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}