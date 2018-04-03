import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Radio, AutoComplete, Button, Select, InputNumber, Col, Row} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';
import {getPriceF} from '../../utils/utils';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea } = Input;
const {Option} = Select;

@Form.create()
@connect(({loading, worker, member}) => ({
  submitting: loading.effects['member/addCard'],

  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

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

  // 获取会员autoComplete数据
  getUser = () => {
    const {member_flag, members, member} = this.props;
    let res = [];

    if(member_flag) {
      if(member.id) {
        res.push(member);
      } else {
        res = members;
      }
    }

    return res;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err)
      console.log(values)
      if(!err) {
        let params = {
          user_id: values.member_id,
          worker_id: values.worker_id,
          user_amount: getPriceF(values.user_amount),
          gift_amount: getPriceF(values.gift_count),
        }
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
          params.amounts = [getPriceF(values.user_amount)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [values.by_other_txt || "其他"];
        } else {
          params.amounts = [getPriceF(values.user_amount)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [""];
        }
        this.props.dispatch({
          type: 'member/recharge',
          payload: {
            ...params
          }
        })
      }
    })
  }

  handleSelect = (value) => {
    this.props.dispatch({
      type: 'member/queryBodyCheckById',
      payload: {
        user_id: value
      }
    });
  }

  handleSearch = (value) => {
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/query',
      payload: {
        code: value
      }
    })
  }

  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    )
  }

  render() {
    let {submitting, form, worker_data} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const users = this.getUser();

    return(
      <PageHeaderLayout title="会员充值">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员">
              {getFieldDecorator('member_id', {
                rules: [{
                  required: true, message: '请选择会员'
                }]
              })(
                <AutoComplete
                  dataSource={users.map(this.renderOption.bind(this))}
                  onSelect={this.handleSelect.bind(this)}
                  onSearch={this.handleSearch}
                  placeholder="输入会员卡号 / 电话 / 名字"
                />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="充值金额">
              {getFieldDecorator('user_amount', {
                rules: [{
                  required: true, message: '请输入充值金额'
                }]
              })(
                <InputNumber min={0} precision={2} />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="赠送">
              {getFieldDecorator('gift_count', {
                rules: [{
                  required: true, message: '请填写赠送金额'
                }]
              })(
                <InputNumber min={0} precision={0} />
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
            <FormItem {...FORM_ITEM_LAYOUT} label="备注" style={{display: 'none'}}>
              {getFieldDecorator('note', {
              })(
                <TextArea placeholder="备注" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
              <Button type="primary" htmlType="submit" loading={submitting} >提交</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}