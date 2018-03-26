import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Button, DatePicker, Select, Radio, InputNumber, AutoComplete, Col, message} from 'antd';
import moment from 'moment';
import {PAY_METHODS} from '../../config';

import {getPriceF} from '../../utils/utils';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const {Option} = Select;
const {Group} = Radio;

@connect(({loading, manage, member}) => ({
  submitting: loading.effects['teacher/add'],

  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

  worker_data: manage.worker_data,
}))
@Form.create()
export default class Page extends Component {
  state = {
    users: [],
    user_id: -1,
  }
  componentDidMount(){
    this.queryWorker();
  }
  queryWorker() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manage/getWorkerList',
      payload: {
        department: 1
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // if(!values.valid_date_end.isAfter(values.valid_date_begin)) {
        //   message.warning("结束时间必须大于开始时间")
        //   return false;
        // }
        let params = {
          user_id: values.user_id,
          worker_id: values.worker_id,
          // valid_date_begin: values.valid_date_begin.format('YYYYMMDD'),
          valid_date_end: values.valid_date_end.format('YYYYMMDD'),
          lesson_price: getPriceF(values.lesson_price),
          lesson_type: values.lesson,
        }
        if(values.lesson == 0) {
          params.count_count = values.count_count;
          params.count_gift = values.count_gift;
        }
        if(values.pay_method == 5) {
          params.pay_methods = [];

          params.pay_method_notes = [];
          params.amounts = [];
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
            params.pay_method_notes.push(values.by_other_txt || "其他")
            params.amounts.push(getPriceF(values.by_cash))
          }
        } else if(values.pay_method == 4) {
          params.amounts = [getPriceF(values.lesson_price)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [values.by_other_txt || "其他"];
        } else {
          params.amounts = [getPriceF(values.lesson_price)];
          params.pay_methods = [values.pay_method];
          params.pay_method_notes = [""];
        }
        console.log(params)
        this.props.dispatch({
          type: 'teacher/add',
          payload: {
            ...params,
          }
        })
      }
    })
  }
  onSelect = (value) => {
    console.log('onSelect', value)
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
  getData() {
    const {member_flag, members, member} = this.props;
    let data = [];

    if(member_flag) {
      if(member.id) {
        data.push(member);
      } else {
        data = members;
      }
    }

    return data;
  }
  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    );
  }
  render() {
    const {submitting, worker_data} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const dataSource = this.getData();
    const f_i_l = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 7},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
        md: {span: 10},
      },
    };
    const s_l = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 10, offset: 7},
      },
    };

    return (
      <PageHeaderLayout title="添加私教">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...f_i_l} label="会员">
              {getFieldDecorator('user_id', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入会员'
                }]
              })(
                <AutoComplete 
                  dataSource={dataSource.map(this.renderOption.bind(this))}
                  onSelect={this.onSelect.bind(this)}
                  onSearch={this.handleSearch}
                  placeholder="输入会员卡号／电话／名字"
                />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="课程">
              {getFieldDecorator('lesson', {
                initialValue: '0',
                rules: [{
                  required: true, message: '选择课程类型'
                }]
              })(
                <Group>
                  <Radio value="0">按节</Radio>
                  <Radio value="1">包月</Radio>
                </Group>
              )}
            </FormItem>
            <FormItem {...f_i_l} label="数量" style={{display: getFieldValue('lesson') == 1 ? 'none' : 'block'}}>
              {getFieldDecorator('count_count', {
                initialValue: 0,
                rules: [{
                  required: getFieldValue('lesson') == 1 ? false : true, message: '请输入数量'
                }]
              })(
                <InputNumber min={0} precision={0} /> 
              )}
            </FormItem>
            <FormItem {...f_i_l} label="赠送" style={{display: getFieldValue('lesson') == 1 ? 'none' : 'block'}}>
              {getFieldDecorator('count_gift', {
                initialValue: 0,
                rules: [{
                  required: getFieldValue('lesson') == 1 ? false : true, message: '请输入赠送数量'
                }]
              })(
                <InputNumber min={0} precision={0} /> 
              )}
            </FormItem>
            <FormItem {...f_i_l} label="开始日期" style={{display: getFieldValue('lesson') == 1 ? 'none' : 'none'}}>
              {getFieldDecorator('valid_date_begin', {
                initialValue: moment(),
                rules: [{
                  required: getFieldValue('lesson') == 1 ? true : false, message: '请选择开始日期'
                }]
              })(
                <DatePicker /> 
              )}
            </FormItem>
            <FormItem {...f_i_l} label={getFieldValue('lesson') == 1 ? '截止日期' : '有效期'}>
              {getFieldDecorator('valid_date_end', {
                rules: [{
                  required: true, message: '请选择截止日期'
                }]
              })(
                <DatePicker /> 
              )}
            </FormItem>
            <FormItem {...f_i_l} label="价格">
              {getFieldDecorator('lesson_price', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入价格'
                }]
              })(
                <InputNumber precision={2} min={0} /> 
              )}
            </FormItem>
            <FormItem {...f_i_l} label="支付方式">
              {getFieldDecorator('pay_method', {
                initialValue: 0,
                rules: [{
                  required: true, message: '请选择支付方式'
                }]
              })(
                <Group>
                  {PAY_METHODS.map((item, i) => {
                    return (<Radio value={i} key={`p_m_${i}`}>{item}</Radio>)
                  })}
                  <Radio value="5">综合</Radio>
                </Group>
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
            <FormItem {...f_i_l} label="私人教练">
              {getFieldDecorator('worker_id', {
                initialValue: '',
                rules: [{
                  required: true, message: '请选择私人教练'
                }]
              })(
                <Select>
                  {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                </Select> 
              )}
            </FormItem>
            <FormItem {...s_l}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}