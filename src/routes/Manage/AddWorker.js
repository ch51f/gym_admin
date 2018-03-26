import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Radio, Button, DatePicker, Select, Upload, Icon} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {WORKER_TYPE, DEPARTMENT, WORKER_STATUS} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const {Group} = Radio;
const {TextArea} = Input;

@connect(({loading, manage}) => ({
	submitting_add: loading.effects['manage/addWorker'],
  submitting_up: loading.effects['manage/updateWorker'],

	worker: manage.worker
}))
@Form.create()
export default class Page extends Component {
	state = {
		loading: false
	}
  // 提交
	handleSubmit = (e) => {
		e.preventDefault();
    let {imgUrl} = this.state;
    let {form, dispatch} = this.props;
		form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if (!err) {
        let params = {
          birthday: values.birthday.format('YYYYMMDD'),
          department: values.department,
          desc: values.desc,
          gender: values.gender,
          id_card: values.id_card,
          status: values.status,
          tel: values.tel,
          worker_name: values.worker_name,
          worker_type: values.worker_type,
        }
        if(imgUrl) params.photo = imgUrl
        if(values.item_id) {
          params.item_id = values.item_id;
          dispatch({
            type: 'manage/updateWorker',
            payload: {
              ...params,
            }
          })
        } else {
          dispatch({
            type: 'manage/addWorker',
            payload: {
              ...params,
            }
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
		const {form, submitting_add, submitting_up, worker} = this.props;
		const {getFieldDecorator} = form;
    const submitting = worker.id ? submitting_up : submitting_add;
    if(!imgUrl && worker.photo) this.setState({imgUrl: worker.photo});
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
    let title = "添加员工";
    if(worker.id) {title = "编辑员工"}

  	return(
  		<PageHeaderLayout title={title}>
      	<Card bordered={false}>
      		<Form onSubmit={this.handleSubmit}>
      			{getFieldDecorator('item_id', {
      				initialValue: worker.id,
      			})(
      				<Input style={{display: 'none'}} />
      			)}
      			<FormItem {...f_i_l} label="名字">
	      			{getFieldDecorator('worker_name', {
        				initialValue: worker.worker_name,
	      				rules: [{
	      					required: true, message: '请输入名字', transform: (value) => {
                    return _.trim(value);
                  }
	      				}]
	      			})(
      					<Input placeholder="名字" />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="电话">
	      			{getFieldDecorator('tel', {
        				initialValue: worker.tel,
	      				rules: [{
	      					required: true, message: '请输入电话', transform: (value) => {
                    return _.trim(value);
                  }
	      				}]
	      			})(
      					<Input placeholder="电话" />
	      			)}
      			</FormItem>
      			<FormItem {...f_i_l} label="性别">
              {getFieldDecorator('gender', {
                initialValue: worker.gender || 'm',
                rules: [{
                  required: true, message: '请选择性别'
                }]
              })(
                <Group>
                  <Radio value="f">女</Radio>
                  <Radio value="m">男</Radio>
                </Group>
              )}
      			</FormItem>
      			<FormItem {...f_i_l} label="生日">
              {getFieldDecorator('birthday', {
                initialValue: worker.birthday ? moment(worker.birthday) : "",
                rules: [{
                  required: true, message: '请输入生日'
                }]
              })(
                <DatePicker />
              )}
      			</FormItem>
      			<FormItem {...f_i_l} label="身份证号">
              {getFieldDecorator('id_card', {
                initialValue: worker.id_card,
                rules: [{
                  required: true, message: '请输入身份证号', transform: (value) => {
                    return _.trim(value);
                  }
                }]
              })(
                <Input placeholder="身份证号" />
              )}
      			</FormItem>
      			<FormItem {...f_i_l} label="所属部门">
              {getFieldDecorator('department', {
                initialValue: parseInt(worker.department || 0),
                rules: [{
                  required: true, message: '请选择所属部门'
                }]
              })(
                <Select placeholder="所属部门">
                  {DEPARTMENT.map((item, i) => {return <Option value={i} key={`department_${i}`}>{item}</Option>})}
                </Select>
              )}
      			</FormItem>
            <FormItem {...f_i_l} label="角色">
              {getFieldDecorator('worker_type', {
                initialValue: parseInt(worker.worker_type || 0),
                rules: [{
                  required: true, message: '请选择角色'
                }]
              })(
                <Select placeholder="角色">
                  {WORKER_TYPE.map((item, i) => {return <Option value={i == 3 ? '99' : i} key={`worker_type_${i}`}>{item}</Option>})}
                </Select>
              )}
            </FormItem>
      			<FormItem {...f_i_l} label="员工头像">
              <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http//v0.api.upyun.com"
                customRequest={this.upload}
              >
                {imgUrl ? <img src={imgUrl} width={100} height={100} alt="" /> : UploadButton}
              </Upload>
      			</FormItem>
      			<FormItem {...f_i_l} label="员工简介">
              {getFieldDecorator('desc', {
                initialValue: worker.desc,
                rules: [{
                  required: true, message: '请输入员工简介', transform: (value) => {
                    return _.trim(value);
                  }
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="员工简介" rows={4} />
              )}
      			</FormItem>
      			<FormItem {...f_i_l} label="员工状态">
              {getFieldDecorator('status', {
                initialValue: parseInt(worker.status || 0),
                rules: [{
                  required: true, message: '请选择员工状态'
                }]
              })(
                <Select placeholder="员工状态">
                  {WORKER_STATUS.map((item, i) => {return <Option value={i} key={`sorker_status_${i}`}>{item}</Option>})}
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