import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Radio, AutoComplete, Button, Select, InputNumber, Col, Row} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea } = Input;
const {Option} = Select;

@Form.create()
@connect(({loading, worker, lesson}) => ({
  submitting: loading.effects['lesson/buy'],

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

  render() {
    let {submitting, form, worker_data} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    return(
      <PageHeaderLayout title="购买课程">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员">
              {getFieldDecorator('member_id', {
                rules: [{
                  required: true, message: '请选择会员'
                }]
              })(
                <Input placeholder="会员ID、手机号码、名字" />
              )}
            </FormItem>

            <FormItem {...FORM_ITEM_LAYOUT} label="购买课程">
              {getFieldDecorator('lesson_id', {
                rules: [{
                  required: true, message: '请选择课程'
                }]
              })(
                <Select placeholder="购买课程"></Select>
              )}
            </FormItem>

            <FormItem {...FORM_ITEM_LAYOUT} label="课程价格">
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('p_0', {
                  })(
                    <InputNumber placeholder="普通价格" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('p_1', {
                  })(
                    <InputNumber placeholder="白银会员" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('p_2', {
                  })(
                    <InputNumber placeholder="黄金价格" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('p_3', {
                  })(
                    <InputNumber placeholder="砖石价格" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('p_4', {
                  })(
                    <InputNumber placeholder="至尊价格" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
            </FormItem>

            <FormItem {...FORM_ITEM_LAYOUT} label="购买数量">
              {getFieldDecorator('num', {
                rules: [{
                  required: true, message: '请输入数量'
                }]
              })(
                <InputNumber min={0} precision={0} />
              )}
            </FormItem>

            <FormItem {...FORM_ITEM_LAYOUT} label="充值金额">
              {getFieldDecorator('price', {
                rules: [{
                  required: true, message: '请输入充值金额'
                }]
              })(
                <InputNumber min={0} precision={2} />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="支付方式">
              {getFieldDecorator('pay_method', {
                rules: [{
                  required: true,
                  message: '请选择支付方式'
                }]
              })(
                <RadioGroup>
                  <Radio value="0">刷卡</Radio> 
                  <Radio value="1">微信</Radio> 
                  <Radio value="2">支付宝</Radio> 
                  <Radio value="3">现金</Radio> 
                  <Radio value="4">其他</Radio> 
                  <Radio value="5">综合</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="支付组合" style={{display: getFieldValue('pay_method') == 5 ? "block" : 'none'}}>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('by_card', {
                  })(
                    <InputNumber placeholder="刷卡" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('by_wechat', {
                  })(
                    <InputNumber placeholder="微信" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('by_alipay', {
                  })(
                    <InputNumber placeholder="支付宝" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('by_cash', {
                  })(
                    <InputNumber placeholder="现金" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem>
                  {getFieldDecorator('by_other', {
                  })(
                    <InputNumber placeholder="其他" min={0} precision={2} />
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="其他支付方式备注" style={{display: ((getFieldValue('by_other') && getFieldValue('by_other')>0 && getFieldValue('pay_method') == 5 ) || (getFieldValue('pay_method') == 4 )) ? "block" : "none"}}>
              {getFieldDecorator('by_other_txt', {
              })(
                <Input placeholder="填写其他支付方式备注" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="充值顾问">
              {getFieldDecorator('worker_id', {
                rules: [{
                  required: true,
                  message: '请选择会籍顾问'
                }]
              })(
                <Select placeholder="教练列表">
                  {worker_data.list.map((item, i) => {
                    return (<Option key={i} value={item.id}>{item.worker_name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="备注">
                {getFieldDecorator('note', {
                })(
                  <TextArea placeholder="备注" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
              </FormItem>
          </Form>
          <FormItem {...FORM_ITEM_BUTTON}>
                <Button type="primary" htmlType="submit" loading={submitting} >提交</Button>
              </FormItem>
        </Card>
      </PageHeaderLayout>
    )
  }
}