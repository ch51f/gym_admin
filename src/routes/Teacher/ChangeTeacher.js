import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Button, Select, message} from 'antd';

const FormItem = Form.Item;
const {Option} = Select;

@connect(({loading, teacher, manage}) => ({
	submitting: loading.effects['teacher/change'],

	worker_data: manage.worker_data,

	old_teacher_id: teacher.old_teacher_id,
}))
@Form.create()
export default class Page extends Component {
	state = {}
	componentWillMount() {
    const {history, old_teacher_id} = this.props;
		if(old_teacher_id < 0) {
      history.push('/teacher/search')
    }
	}
	componentDidMount() {
		this.queryWorker();
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
		let {form} = this.props;
		form.validateFieldsAndScroll((err, values) => {
			// console.log(err, values);
			if(!err) {
				this.props.dispatch({
          type: 'teacher/change',
          payload: {
            ...values,
          }
        })
			}
		})
	}
	render() {
		const {submitting, worker_data, old_teacher_id} = this.props;
		const {getFieldDecorator} = this.props.form;
		console.log(worker_data)
    const {list} = worker_data;
		const f_i_l = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 7},
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 12},
				md: {span: 10},
			}
		};
		const s_l = {
			wrapperCol: {
				xs: {span: 24, offset: 0},
				sm: {span: 10, offset: 7},
			}
		};

		return (
			<PageHeaderLayout title="更换私教">
				<Card bordered={false}>
					<Form onSubmit={this.handleSubmit}>
						{getFieldDecorator('item_id', {
              initialValue: old_teacher_id,
            })(
              <input style={{display: 'none'}} />
            )}
						<FormItem {...f_i_l} label="新私人教练">
              {getFieldDecorator('worker_id_dist', {
                initialValue: '',
                rules: [{
                  required: true, message: '请选择新的私人教练'
                }]
              })(
                <Select>
                  {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                </Select> 
              )}
            </FormItem>
						<FormItem {...s_l}>
							<Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
						</FormItem>
					</Form>
				</Card>
			</PageHeaderLayout>
		)
	}
}