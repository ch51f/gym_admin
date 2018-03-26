import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Input, AutoComplete, Button} from 'antd';

const {Option} = AutoComplete;
const FormItem = Form.Item;

@connect(({loading, member}) => ({
  quickMember: member.quickMember,
}))
@Form.create()
export default class Section extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      if(!err) {
        this.props.dispatch({
          type: 'member/tMember',
          payload: {
            ...values,
          }
        })
      }
    })
  }
  onSelect = (value) => {
    this.setState({user_id: value})
    this.props.dispatch({
      type: 'member/setData',
      payload: {
        checkIn_list: []
      }
    })
  }
  handleSearch = (value) => {
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/quickQuery',
      payload: {
        code: value
      }
    });
  }
  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      // 用户名（卡号，性别），电话：13xxxxxxxxx
      <Option key={item.id} text={item.id} >{txt}</Option>
    );
  }
  render() {
    const {user_id, form, quickMember} = this.props;
    const {getFieldDecorator} = form;
    const f_l = {
      labelCol: {span: 3},
      wrapperCol: {span: 20}
    }
    const s_l = {
      wrapperCol: {span: 20, offset: 3}
    }
    
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {getFieldDecorator('subscribe_id', {
            initialValue: user_id
          })(
            <Input style={{display: 'none'}} />
          )}
          <FormItem {...f_l} label="转卡目标" extra="会员转卡之前请先建立好转卡目标的会员资料">
            {getFieldDecorator('target_user_id', {              
            })(
              <AutoComplete 
                dataSource={quickMember.map(this.renderOption.bind(this))}
                onSelect={this.onSelect.bind(this)}
                onSearch={this.handleSearch}
                placeholder="请输入会员卡号、电话、名字查询"
              />
            )}
          </FormItem>
          <FormItem {...s_l}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}