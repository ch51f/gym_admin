import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Checkbox, Button, DatePicker, Select, message} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, ASK_LEAVE_REASON} from '../../config';
import {strToTime, timeToStr} from '../../utils/utils.js';

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
  submitting: loading.effects['worker/leave_check'],

  worker_data: worker.worker_data,
  working_time: worker.working_time,
}))
@Form.create()
export default class Page extends Component {
  state = {
    checkedList: [],
    indeterminate: false,
    checkAll: false,
  }
  componentWillMount() {
    this.queryWorker();
    this.queryWorkingTime();
  }
  // 获取工作时间
  queryWorkingTime() {
    this.props.dispatch({
      type: 'worker/working_time',
      payload: {}
    })
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
    let {checkAll, checkedList} = this.state;
    let {form, dispatch} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // console.log(values)
      // console.log(checkedList)
      // console.log(checkAll)
      if (!err) {
        let params = {
          date: values.date.format('YYYYMMDD'),
          note: values.note,
          teacher_id: values.teacher_id,
          reason_type: values.reason_type,
        };
        if(!checkAll && checkedList.length == 0) {
          message.warning("请选择请假时间");
        }
        if(checkAll) {
          params.full_day = 1;
        } else {
          let [time_begins, time_ends] = [[], []];
          for(let i = 0, item; item = checkedList[i]; i++) {
            let temps = item.split(" - ");
            time_begins.push(timeToStr(temps[0]))
            time_ends.push(timeToStr(temps[1]))
          }
          params.time_begins = time_begins.join(',');
          params.time_ends = time_ends.join(',');
        }
        console.log(params)

        dispatch({
          type: 'worker/leave_check',
          payload: params,
        })
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

  getWorkerTime() {
    const {working_time} = this.props;
    let arr = [];
    for(let i = 0, item; item = working_time[i]; i++) {
      arr.push(strToTime(item.time_begin) + " - " + strToTime(item.time_end));
    }
    return arr;
  }

  render() {
    const {submitting, form, worker_data} = this.props;
    const {getFieldDecorator} = form;
    const working_time_options = this.getWorkerTime();
    return(
      <PageHeaderLayout title="教练请假">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="教练列表">
              {getFieldDecorator('teacher_id', {
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
              <CheckboxGroup options={working_time_options} value={this.state.checkedList} onChange={this.onChange} />
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="请假原因">
              {getFieldDecorator('reason_type', {
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
              {getFieldDecorator('note', {
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