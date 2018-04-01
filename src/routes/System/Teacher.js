import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Button, Radio} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const {Group} = Radio;
const {TextArea} = Input;

@connect(({loading, gym}) => ({
	submitting: loading.effects['gym/TeacherForm'],

	teacher_config: gym.teacher_config,
}))
@Form.create()
export default class Page extends Component {
  state = {}
	componentWillMount() {
		this.queryGym();
  }
  // 查询健身房基础配置
  queryGym() {
    this.props.dispatch({
      type: 'gym/getGym',
      payload: {}
    });
  }
  // 保存配置
	handleSubmit = (e) => {
		e.preventDefault();
    const {form, dispatch} = this.props;
		form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if (!err) {
      	if(values.status == 1) {
      		dispatch({
	          type: 'gym/TeacherForm',
	          payload: {
	          	item_id: values.item_id,
	          	status: values.status,
	          	teacher_rule: values.teacher_rule,
	          },
	        });
      	} else {
      		dispatch({
	          type: 'gym/TeacherForm',
	          payload: {
              ...values,
            },
	        });
      	}
      }
    });
	}
  render() {
  	const {form, submitting, teacher_config} = this.props;
  	const {getFieldDecorator, getFieldValue} = form;
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

    return (
      <PageHeaderLayout title="体测私教">
        <Card bordered={false}>
        	<Form onSubmit={this.handleSubmit}>
        		{getFieldDecorator('item_id', {
        			initialValue: teacher_config.id,
        		})(
        			<Input style={{display: 'none'}} />
        		)}
        		<FormItem {...f_i_l} label="体测预约">
        			{getFieldDecorator('status', {
        				initialValue: parseInt(teacher_config.status || 0),
                rules: [{
                  required: true, message: '请选择是否开启提测预约'
                }]
        			})(
        				<Group>
        					<Radio value={0}>正常</Radio>
        					<Radio value={1}>关闭</Radio>
        				</Group>
        			)}
        		</FormItem>
        		<FormItem {...f_i_l} label="体测预约规则" help="（请在注册会员的时候分配教练）" style={{display: getFieldValue('status') == 1 ? 'none' : 'block'}}>
        			{getFieldDecorator('body_check_rule', {
        				initialValue: parseInt(teacher_config.body_check_rule || 0),
                rules: [{
                  required: getFieldValue("status") == 0 ? true : false,
                  message: '请选择体测预约规则'
                }]
        			})(
        				<Group>
        					<Radio value={0}>可以预约任意一个教练</Radio>
        					<Radio value={1}>只能预约分配的教练</Radio>
        				</Group>
        			)}
        		</FormItem>
        		<FormItem {...f_i_l} label="体测预约说明" style={{display: getFieldValue('status') == 1 ? 'none' : 'block'}}>
        			{getFieldDecorator('desc', {
      					initialValue: teacher_config.desc,
                rules: [{
                  required: getFieldValue("status") == 0 ? true : false,
                  message: '请输入提测预约说明'
                }]
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入体测预约说明" rows={4} />
              )}
        		</FormItem>
        		<FormItem {...f_i_l} label="私教预约规则">
        			{getFieldDecorator('teacher_rule', {
        				initialValue: parseInt(teacher_config.teacher_rule || 0),
                rules: [{
                  required: true, message: '请选择私教预约规则'
                }]
        			})(
        				<Group>
        					<Radio value={0}>只能预约下一次的课程</Radio>
        					<Radio value={1}>可以预约未来一周的课程</Radio>
        				</Group>
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