import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Radio, AutoComplete, Button, Select, InputNumber, Col, Row} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';
import {getPriceY} from '../../utils/utils';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea } = Input;
const {Option} = Select;

@Form.create()
@connect(({loading, worker, lesson, member}) => ({
  submitting: loading.effects['lesson/addBuy'],

  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

  worker_data: worker.worker_data,

  search_lists: lesson.search_lists,

  detail: lesson.detail,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.query();
    this.queryWorker();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'lesson/set',
      payload: {detail: {}}
    })
  }

  query() {
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
        this.props.dispatch({
          type: 'lesson/addBuy',
          payload: values
        })
      }
    })
  }

  change = (val) => {

    this.props.dispatch({
      type: 'lesson/detail',
      payload: {item_id: val, show_price: 1, show_time: 1}
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

  renderPrice(item, i) {
    return (
      <Col span={6} key={`price_${i}`}> 
        <Input defaultValue={`${item.price_name}:${getPriceY(item.price)}`} disabled={true}  />
      </Col>
    )
  }

  render() {
    let {submitting, form, worker_data, search_lists, detail} = this.props;
    const users = this.getUser();
    let prices = [];
    if(detail.prices) prices = detail.prices;
    const {getFieldDecorator, getFieldValue} = form;
    return(
      <PageHeaderLayout title="购买课程">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员">
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

            <FormItem {...FORM_ITEM_LAYOUT} label="购买课程">
              {getFieldDecorator('item_id', {
                rules: [{
                  required: true, message: '请选择课程'
                }]
              })(
                <Select placeholder="购买课程" onChange={this.change}>
                  {search_lists.map((item, i) => {
                    return (<Option key={i} value={item.id}>{item.lesson_name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            {detail.prices ?
            <FormItem {...FORM_ITEM_LAYOUT} label="课程价格">
              {prices.map((item, i) => this.renderPrice(item, i))}
            </FormItem>
            :null}

            <FormItem {...FORM_ITEM_LAYOUT} label="购买数量">
              {getFieldDecorator('count', {
                rules: [{
                  required: true, message: '请输入数量'
                }]
              })(
                <InputNumber min={0} precision={0} />
              )}
            </FormItem>

            <FormItem {...FORM_ITEM_LAYOUT} label="备注">
              {getFieldDecorator('note', {
              })(
                <TextArea placeholder="备注" autosize={{ minRows: 2, maxRows: 6 }} />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
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