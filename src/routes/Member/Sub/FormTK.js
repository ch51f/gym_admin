import React, {Component} from 'react';
import {connect} from 'dva';
import {Form, Input, InputNumber, Button} from 'antd';

const {TextArea} = Input;
const FormItem = Form.Item;

@connect(({loading, member}) =>({
}))
@Form.create()
export default class Section extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      if(!err) {
        this.props.dispatch({
          type: 'member/pause',
          payload: {
            ...values,
          }
        })
      }
    })
  }
  render() {
    const {user_id, form} = this.props;
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
          {getFieldDecorator('item_id', {
            initialValue: user_id
          })(
            <Input style={{display: 'none'}} />
          )}
          <FormItem {...f_l} label="停卡天数">
            {getFieldDecorator('days', {    
              rules: [{
                required: true, message: '请输入停卡天数'
              }]
            })(
              <InputNumber placeholder="天数" min={1} />
            )}
          </FormItem>
          <FormItem {...f_l} label="备注">
            {getFieldDecorator('note', {
              rules: [{
                required: true, message: '请输入备注'
              }]
            })(
              <TextArea placeholder="备注" autosize={{minRows: 2, maxRows: 6}} />
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