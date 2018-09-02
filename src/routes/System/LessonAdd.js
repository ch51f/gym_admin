import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Button, TimePicker, Select, Upload, Icon, message} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {DAY_OF_WEEK, LESSON_STATUS} from '../../config';
import {setMoment} from '../../utils/utils';

const FormItem = Form.Item;
const {Option} = Select;

@connect(({loading, groupLesson, worker}) => ({
  submitting_add: loading.effects['groupLesson/addLesson'],
	submitting_up: loading.effects['groupLesson/updateLesson'],

	lesson: groupLesson.lesson,
  worker_data: worker.worker_data,
}))
@Form.create()
export default class Page extends Component {
	state = {
		loading: false
	}
  componentWillMount() {
    this.queryWorker();
  }
  // 获取会籍顾问
  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {
        department: 1
      }
    })
  }
  // 提交事件
	handleSubmit = (e) => {
		e.preventDefault();
    let {imgUrl} = this.state;
    let {form, dispatch} = this.props;
		form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if (!err) {
        if(!values.end_time.isAfter(values.begin_time)) {
          message.warning("结束时间必须大于开始时间")
          return false;
        }
        let params = {
          status: values.status,
          teacher_name: values.teacher_name,
          lesson_name: values.lesson_name,
          day_of_week: values.day_of_week == 0 ? 7 : values.day_of_week,
          begin_time: values.begin_time.format("HHmm"),
          end_time: values.end_time.format("HHmm"),
        };
        if(imgUrl) params.lesson_cover = imgUrl
        if(values.item_id) {
          params.item_id = values.item_id;
          dispatch({
            type: 'groupLesson/updateLesson',
            payload: params,
          })
        } else {
          dispatch({
            type: 'groupLesson/addLesson',
            payload: params,
          })
        }
      }
    });
	}
  upload = (info) => {
    this.setState({loading: true});
    info.call = this.callback.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }
  callback(img) {
    this.setState({
      loading: false,
      imgUrl: img.host + img.url,
    })
  }
	render() {
		let {imgUrl, loading} = this.state;
		const {submitting_add, submitting_up, lesson, worker_data} = this.props;
		const {getFieldDecorator} = this.props.form;
    const {list} = worker_data;
    const submitting = lesson.id ? (submitting_up || loading) : (submitting_add || loading);
    if(!imgUrl && lesson.lesson_cover) this.setState({imgUrl: lesson.lesson_cover});
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
  	const UploadButton = (
  		<div>
  			<Icon type={loading ? 'loading' : 'plus'} />
  			<div className="ant-upload-text">上传</div>
  		</div>
  	)
    let title = "添加操课";
    if(lesson.id) {title = "编辑操课"}

		return (
      <PageHeaderLayout title={title}>
      	<Card bordered={false}>
      		<Form onSubmit={this.handleSubmit}>
      			{getFieldDecorator('item_id', {
      				initialValue: lesson.id,
      			})(
      				<Input style={{display: 'none'}} />
      			)}
      			<FormItem {...f_i_l} label="课程封面" help="照片请裁剪成为正方形">
      				<Upload
				        name="lesson_cover"
				        listType="picture-card"
				        className="avatar-uploader"
				        showUploadList={false}
				        action="http//v0.api.upyun.com"
				        customRequest={this.upload}
				      >
				        {imgUrl ? <img src={imgUrl} width={100} height={100} alt="" /> : UploadButton}
				      </Upload>
      			</FormItem>
      			<FormItem {...f_i_l} label="课程名称">
	      			{getFieldDecorator('lesson_name', {
        				initialValue: lesson.lesson_name,
	      				rules: [{
	      					required: true, message: '请输入课程名称'
	      				}]
	      			})(
      					<Input placeholder="课程名称" />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="课程日期">
	      			{getFieldDecorator('day_of_week', {
        				initialValue: parseInt(lesson.day_of_week || 7),
	      				rules: [{
	      					required: true, message: '课程日期'
	      				}]
	      			})(
      					<Select placeholder="选择日期">
                  {DAY_OF_WEEK.map((item, i) => {if(i != 0) return (<Option value={i} key={`d_of_w_${i}`}>{item}</Option>)})}
      					</Select>
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="课程开始时间">
	      			{getFieldDecorator('begin_time', {
        				initialValue: lesson.begin_time ? setMoment(lesson.begin_time, "HH:mm") : null,
	      				rules: [{
	      					required: true, message: '请输入课程开始时间'
	      				}]
	      			})(
                <TimePicker format='HH:mm' />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="课程结束时间">
	      			{getFieldDecorator('end_time', {
        				initialValue: lesson.end_time ? setMoment(lesson.end_time, "hh:mm") : null,
	      				rules: [{
	      					required: true, message: '请输入课程结束时间'
	      				}]
	      			})(
                <TimePicker format='HH:mm' />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="课程老师">
	      			{getFieldDecorator('teacher_name', {
        				initialValue: lesson.teacher_name,
	      				rules: [{
	      					required: true, message: '请输入课程老师'
	      				}]
	      			})(
                <Input placeholder="课程老师" />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="课程状态">
	      			{getFieldDecorator('status', {
        				initialValue: parseInt(lesson.status || 0),
	      				rules: [{
	      					required: true, message: '请输入课程状态'
	      				}]
	      			})(
      					<Select placeholder="选择状态">
                  {LESSON_STATUS.map((item, i) => {return (<Option value={i} key={`lesson_status_${i}`}>{item}</Option>)})}
      					</Select>
	      			)}
      			</FormItem>
      			<FormItem {...s_l} >
      				<Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
      			</FormItem>
      		</Form>
      	</Card>
      </PageHeaderLayout>
		)
	}
}