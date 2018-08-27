import React, {Component} from 'react';
import { connect } from 'dva';
import { Icon, Form, Row, Col, Select, Input, Radio, InputNumber, Button, Alert} from 'antd';
import {CARD_UNIT} from '../../config';

import {getPriceF} from '../../utils/utils';
const {TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({loading, member, worker}) => ({
  submitting: loading.effects['member/addCard'],

  member: member.member,
  cards: member.cards,
  worker_data: worker.worker_data,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    const {history, member} = this.props;
    if(!member.id) {
      history.push('/member/manage')
    }
    this.queryCard();
    this.query();
  }
  query() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {
        department: 0
      }
    })
  }
  queryCard() {
    this.props.dispatch({
      type: 'member/queryCard',
      payload: {}
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if(!err) {
        let params = {
          user_id: values.user_id,
          card_id: values.card_id,
          worker_id: values.worker_id,
          gift_count: values.gift_count,
          card_price: getPriceF(values.card_price),
        }
        if(values.note && values.note != '') params.note = values.note;

        if(values.pay_method == 5) {
          params.pay_methods = [];

          params.amounts = [];
          params.pay_method_notes = [];

          if(values.by_card) {
            params.pay_methods.push(0)
            params.pay_method_notes.push("刷卡")
            params.amounts.push(getPriceF(values.by_card))
          }
          if(values.by_wechat) {
            params.pay_methods.push(1)
            params.pay_method_notes.push("微信")
            params.amounts.push(getPriceF(values.by_wechat))
          }
          if(values.by_alipay) {
            params.pay_methods.push(2)
            params.pay_method_notes.push("支付宝")
            params.amounts.push(getPriceF(values.by_alipay))
          }
          if(values.by_cash) {
            params.pay_methods.push(3)
            params.pay_method_notes.push("现金")
            params.amounts.push(getPriceF(values.by_cash))
          }
          if(values.by_other) {
            params.pay_methods.push(4)
            params.pay_method_notes.push("其他")
            params.amounts.push(getPriceF(values.by_cash))
          }
        } else if(values.pay_method == 4) {
          params.amounts = [getPriceF(values.card_price)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [values.by_other_txt || "其他"];
        } else {
          params.amounts = [getPriceF(values.card_price)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [""];
        }
        this.props.dispatch({
          type: 'member/addCard',
          payload: {
            ...params
          }
        })
      }
    })
  }
  
  render() {
    const {submitting, member, worker_data, cards} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {list} = worker_data;
    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }
    const b_l = {
      wrapperCol: {span: 14, offset: 7},
    }

    return (
      <div>
        <Row style={{'marginBottom': "50px"}}>
          <Col span={16} offset={4} key="col_1">
            <Alert 
            message="创建成功"
            description="添加会员资料成功，请继续填写会员购买的卡券"
            type="success"
            showIcon 
            />
          </Col>
        </Row>
        <Row>
          <Col span={16} offset={4} key="col_2">
            <Form onSubmit={this.handleSubmit}>
              {getFieldDecorator('user_id', {
                initialValue: member.id,
              })(
                <Input style={{display: 'none'}} />
              )}
              <FormItem {...f_i_l} label="卡类">
                {getFieldDecorator('card_id', {
                  rules: [{
                    required: true, message: '请选择卡类'
                  }]
                })(
                  <Select placeholder="选择类型">
                    {cards.map((item, i) => {
                      return (<Option key={`card_${i}`} value={item.id}>{item.card_name}{item.amount}{CARD_UNIT[item.card_unit]}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="赠送">
                {getFieldDecorator('gift_count', {
                  initialValue: 0,
                  rules: [{
                    required: true, message: '请填写赠送次数'
                  }]
                })(
                  <InputNumber min={0} precision={0} />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="价格">
                {getFieldDecorator('card_price', {
                  rules: [{
                    required: true, message: '请填写价格'
                  }]
                })(
                  <InputNumber min={0} precision={2}/>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="支付方式">
                {getFieldDecorator('pay_method', {
                  rules: [{
                    required: true, message: '请选择支付方式'
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
              <FormItem {...f_i_l} label="支付组合" style={{display: getFieldValue('pay_method') == 5 ? 'block' : 'none'}}>
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
              <FormItem {...f_i_l} label="其他支付方式备注"  style={{display: ((getFieldValue('by_other') && getFieldValue('by_other')>0 && getFieldValue('pay_method') == 5 ) || (getFieldValue('pay_method') == 4 )) ? "block" : "none"}}>
                {getFieldDecorator('by_other_txt', {
                })(
                  <Input placeholder="填写其他支付方式备注" />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="会籍顾问">
                {getFieldDecorator('worker_id', {
                  rules: [{
                    required: true, message: '请选择会籍顾问'
                  }]
                })(
                  <Select placeholder="选择顾问">
                    {list.map((item, i) => {
                      return (<Option key={i} value={item.id}>{item.worker_name}</Option>)
                    })}
                  </Select>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="备注">
                {getFieldDecorator('note', {
                })(
                  <TextArea placeholder="备注" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
              </FormItem>
              <FormItem {...b_l}>
                <Button type="primary" htmlType="submit" loading={submitting} >提交</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }
}