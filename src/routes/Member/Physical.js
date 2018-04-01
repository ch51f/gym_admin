import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, AutoComplete, Button, Select} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const {Option} = Select;

@connect(({loading, member, manage}) => ({
  submitting_add: loading.effects['member/addBodyCheck'],
  submitting_upd: loading.effects['member/updateBodyCheck'],

  body_check: member.body_check,

  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

  worker_data: manage.worker_data,
}))
@Form.create()
export default class Page extends Component {
  state = {}

  componentDidMount(){
    this.queryWorker();
  }
  queryWorker() {
    // const {dispatch} = this.props;
    // dispatch({
    //   type: 'manage/getWorkerList',
    //   payload: {
    //     department: 1
    //   }
    // })
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

  // 体测录入事件
  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, body_check} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      if(!err) {
        if(body_check.user_id) {
          this.props.dispatch({
            type: 'member/updateBodyCheck',
            payload: _.assign(values, {item_id: body_check.user_id})
          })
        } else {
          this.props.dispatch({
            type: 'member/addBodyCheck',
            payload: _.assign(values)
          })
        }
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
    const {form, submitting_add, submitting_upd, body_check, worker_data} = this.props;
    const {getFieldDecorator} = form;
    const users = this.getUser();
    const title = "体测录入";

    let submitting = body_check.user_id ? submitting_add : submitting_upd;
    console.log(body_check)
    return (
      <PageHeaderLayout title={title}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员">
              {getFieldDecorator('user_id', {
                rules: [{
                  required: true, message: "请选择会员"
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
            <FormItem {...FORM_ITEM_LAYOUT} label="身高">
              {getFieldDecorator('check_height', {
                initialValue: body_check.check_height || "",
                rules: [{
                  required: true, message: "请输入身高"
                }]
              })(
                <Input placeholder="身高" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="体重">
              {getFieldDecorator('check_weight', {
                initialValue: body_check.check_weight || "",
                rules: [{
                  required: true, message: "请输入体重"
                }]
              })(
                <Input placeholder="体重" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="体脂">
              {getFieldDecorator('check_bmi', {
                initialValue: body_check.check_bmi || "",
                rules: [{
                  required: true, message: "请输入体脂"
                }]
              })(
                <Input placeholder="体脂" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="新陈代谢">
              {getFieldDecorator('check_XCDX', {
                initialValue: body_check.check_XCDX || "",
                rules: [{
                  required: true, message: "请输入新陈代谢"
                }]
              })(
                <Input placeholder="新陈代谢" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="胸围">
              {getFieldDecorator('check_XW', {
                initialValue: body_check.check_XW || "",
                rules: [{
                  required: true, message: "请输入胸围"
                }]
              })(
                <Input placeholder="胸围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="腰围">
              {getFieldDecorator('check_YW', {
                initialValue: body_check.check_YW || "",
                rules: [{
                  required: true, message: "请输入腰围"
                }]
              })(
                <Input placeholder="腰围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="上臂围">
              {getFieldDecorator('check_STW', {
                initialValue: body_check.check_STW || "",
                rules: [{
                  required: true, message: "请输入上臂围"
                }]
              })(
                <Input placeholder="上臂围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="大腿围">
              {getFieldDecorator('check_DTW', {
                initialValue: body_check.check_DTW || "",
                rules: [{
                  required: true, message: "请输入大腿围"
                }]
              })(
                <Input placeholder="大腿围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="小腿围">
              {getFieldDecorator('check_XTW', {
                initialValue: body_check.check_XTW || "",
                rules: [{
                  required: true, message: "请输入小腿围"
                }]
              })(
                <Input placeholder="小腿围" />
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