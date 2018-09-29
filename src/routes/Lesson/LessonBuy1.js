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
const {TextArea } = Input;

@connect(({loading, worker, lesson, member}) => ({
  submitting: loading.effects['lesson/addBuy'],

  quickMember: member.quickMember,
  search_lists: lesson.search_lists,

  worker_data: worker.worker_data,
  detail: lesson.detail,
}))
@Form.create()
export default class Page extends Component {
  state = {
    users: [],
    user_id: -1,
  }
  componentDidMount(){
    this.query();
    this.queryWorker();
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'lesson/set',
      payload: {detail: {}}
    })
    this.props.dispatch({
      type: 'member/setConfig',
      payload: {
        quickMember: [],
      }
    })
  }
  query() {
    this.props.dispatch({
      type: 'lesson/search_list',
      payload: {}
    })
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
          item_id: values.item_id,
          // valid_date_begin: values.valid_date_begin.format('YYYYMMDD'),
          valid_date_end: values.valid_date_end.format('YYYYMMDD'),
          lesson_price: getPriceF(values.lesson_price),
          lesson_type: values.lesson,
        }
        if(values.lesson == 0) {
          params.count = values.count_count;
          params.gift = values.count_gift;
        } else {
          params.valid_date_begin = values.valid_date_begin.format('YYYYMMDD');
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
          type: 'lesson/addBuy',
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
  handleSelect = (value) => {
    this.props.dispatch({
      type: 'member/queryBodyCheckById',
      payload: {
        user_id: value
      }
    });
  }

  change = (val) => {

    this.props.dispatch({
      type: 'lesson/detail',
      payload: {item_id: val, show_price: 1, show_time: 1}
    })
  }


  handleSearch = (value) => {
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/quickQuery',
      payload: {
        code: value
      }
    })
  }
  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    );
  }
  render() {
    const {submitting, worker_data, quickMember, search_lists} = this.props;
    const users = quickMember;
    const {getFieldDecorator, getFieldValue} = this.props.form;
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
            <FormItem {...f_i_l} label="购买课程">
              {getFieldDecorator('item_id', {
                rules: [{
                  required: true, message: '请选择课程'
                }]
              })(
                <Select placeholder="购买课程" onChange={this.change}>
                  {search_lists.map((item, i) => {
                    return (<Option key={i} value={item.id}>{item.lesson_name}-{item.teacher_name}</Option>)
                  })}
                </Select>
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
            <FormItem {...f_i_l} label="备注">
              {getFieldDecorator('note', {
              })(
                <TextArea placeholder="备注" autosize={{ minRows: 2, maxRows: 6 }} />
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
