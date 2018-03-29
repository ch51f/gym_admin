import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Checkbox, Button, DatePicker, Select} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

@connect(({loading, worker}) => ({
  submitting: loading.effects['worker/addWorker'],
  submitting_up: loading.effects['worker/updateWorker'],

  worker: worker.worker
}))
@Form.create()
export default class Page extends Component {
  state = {}
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    let {imgUrl} = this.state;
    let {form, dispatch} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    });
  }
  render() {
    const {submitting, form} = this.props;
    const {getFieldDecorator} = form;
    return(
      <PageHeaderLayout title="教练请假">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="教练列表">
              {getFieldDecorator('worker_id', {
                rules: [{
                  required: true, message: '请选择教练'
                }]
              })(
                <Select placeholder="选择请假教练">
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
              <Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}