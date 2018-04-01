import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Checkbox, Button, DatePicker, Select} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, ASK_LEAVE_REASON} from '../../config';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

const plainOptions = [
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
];
const defaultCheckedList = [];

@connect(({loading, worker}) => ({
  submitting: loading.effects['worker/addWorker'],
  submitting_up: loading.effects['worker/updateWorker'],

  worker_data: worker.worker_data,

  worker: worker.worker
}))
@Form.create()
export default class Page extends Component {
  state = {
    checkedList: [
    ],
    indeterminate: true,
    checkAll: false,
  }
  componentWillMount() {
    this.queryWorker();
  }
  // 获取会籍顾问
  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {}
    })
  }
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

  onChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }

  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  render() {
    const {submitting, form, worker_data} = this.props;
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
                  {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="请假日期">
              {getFieldDecorator('date', {
                rules: [{
                  required: true, message: '请选择请假日期'
                }]
              })(
                <DatePicker placeholder="请假日期"/>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="请假时间">
              <Checkbox
                indeterminate={this.state.indeterminate} 
                onChange={this.onCheckAllChange} 
                checked={this.state.checkAll}
              >
                全天
              </Checkbox>
              <br />
              <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="请假原因">
              {getFieldDecorator('reason', {
                rules: [{
                  required: true, message: '请选择请假原因'
                }]
              })(
                <Select placeholder="选择请假原因">
                  {ASK_LEAVE_REASON.map((item, i) => {return (<Option key={`worker_${i}`} value={i}>{item}</Option>)})}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="请假备注">
              {getFieldDecorator('content', {
                initialValue: '',
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="备注" rows={4} />
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