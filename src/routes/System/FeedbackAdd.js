import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Button, AutoComplete} from 'antd';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const {TextArea} = Input;
@connect(({loading, feedback, member}) => ({
  submitting: loading.effects['feedback/addFeedback'],

  member_flag: member.member_flag,
  members: member.members,
  member: member.member,

}))
@Form.create()
export default class Page extends Component {
  state = {}
  // 新增反馈
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if(!err) {
        this.props.dispatch({
          type: 'feedback/addFeedback',
          payload: values
        })
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

  onSelect = (value) => {
    let data = this.getData();

    let {setFieldsValue} = this.props.form;
    for(let i = 0, item; item = data[i]; i++) {
      if(item.id == value) {
        setFieldsValue({'user_name': item.user_name});
      }
    }
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

  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    );
  }

  render() {
    const {submitting, form} = this.props;
    const {getFieldDecorator } = form;
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
    let title = "添加反馈";

    return (
      <PageHeaderLayout title={title}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} >
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
            <FormItem {...f_i_l} label="会员名称">
              {getFieldDecorator('user_name', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入会员名称'
                }]
              })(
                <Input placeholder="用户名称" />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="反馈内容">
              {getFieldDecorator('content', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入反馈内容'
                }]
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="反馈内容" rows={4} />
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