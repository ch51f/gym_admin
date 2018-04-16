import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Button, DatePicker, TimePicker, Select} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const {Option} = Select;

@connect(({gym, loading}) => ({
	main_tains: gym.main_tains,
	submitting: gym.mt_add,
}))
@Form.create()
export default class Page extends Component {
	state = {}
	componentWillMount() {
	}
	handleSubmit = (e) => {
		e.preventDefault(); 
		let {form, dispatch} = this.props; 
		form.validateFieldsAndScroll((err, values) => {
			let params = {
				maintaining_type: values.maintaining_type,
				date_begin: values.date_begin.format("YYYYMMDD"),
				date_end: values.date_end.format("YYYYMMDD"),
				time_begin: values.time_begin.format("HHmm"),
				time_end: values.time_end.format("HHmm"),
				// test: 1,
			}

			this.props.dispatch({
				type: 'gym/mt_add',
				payload: params
			})
		})
	}
	render() {
		let {form, submitting} = this.props;
    	const {getFieldDecorator} = form;
		return (
			<PageHeaderLayout title="新增维护">
				<Card bordered={false}>
					<Form onSubmit={this.handleSubmit}>
						<FormItem {...FORM_ITEM_LAYOUT} label="类型"> 
							{getFieldDecorator('maintaining_type', {
								initialValue: 0, 
								rules: [{
									required: true, message: '请选择通知状态'
								}] 
							})(
								<Select placeholder="通知状态"> 
									<Option value={0}>小团体课</Option>
									<Option value={999}>其他</Option> 
								</Select> 
							)}
						</FormItem>
						<FormItem {...FORM_ITEM_LAYOUT} label="开始日期"> 
							{getFieldDecorator('date_begin', {
								rules: [{
									required: true, message: '请选择开始日期'
								}] 
							})(
								<DatePicker placeholder="开始日期" />
							)}
						</FormItem>
						<FormItem {...FORM_ITEM_LAYOUT} label="开始时间"> 
							{getFieldDecorator('time_begin', {
								rules: [{
									required: true, message: '请选择开始日期'
								}] 
							})(
								<TimePicker placeholder="开始时间" />
							)}
						</FormItem>
						<FormItem {...FORM_ITEM_LAYOUT} label="结束日期"> 
							{getFieldDecorator('date_end', {
								rules: [{
									required: true, message: '请选择结束日期'
								}] 
							})(
								<DatePicker placeholder="结束日期" />
							)}
						</FormItem>
						<FormItem {...FORM_ITEM_LAYOUT} label="结束时间"> 
							{getFieldDecorator('time_end', {
								rules: [{
									required: true, message: '请选择结束日期'
								}] 
							})(
								<TimePicker placeholder="结束时间" />
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