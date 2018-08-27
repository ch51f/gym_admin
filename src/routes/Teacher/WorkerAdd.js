import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Checkbox, Radio, Button, DatePicker, Select, Upload, Icon} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, WORKER_TYPE, DEPARTMENT, WORKER_STATUS} from '../../config';

const FormItem = Form.Item;
const {Option} = Select;
const {Group} = Radio;
const {TextArea} = Input;

@connect(({loading, worker}) => ({
  submitting_add: loading.effects['worker/addWorker'],
  submitting_up: loading.effects['worker/updateWorker'],

  worker: worker.worker
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
      if (!err) {
        let params = {
          birthday: values.birthday.format('YYYYMMDD'),
          desc: values.desc,
          gender: values.gender,
          id_card: values.id_card,
          status: values.status,
          department: values.department,
          worker_type: values.worker_type,
          tel: values.tel,
          worker_name: values.worker_name,
          is_private_teacher: values.is_private_teacher ? 1 : 0,
          is_group_teacher: values.is_group_teacher ? 1 : 0,
        }
        if(imgUrl) params.photo = imgUrl
        if(values.item_id) {
          params.item_id = values.item_id;
          dispatch({
            type: 'worker/updateWorker',
            payload: {
              ...params,
            }
          })
        } else {
          dispatch({
            type: 'worker/addWorker',
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
    const submitting = worker.id ? (submitting_up || loading) : (submitting_add || loading);
    if(!imgUrl && worker.photo) this.setState({imgUrl: worker.photo});
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
            <FormItem {...FORM_ITEM_LAYOUT} label="员工头像">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="名字">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="电话">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="性别">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="生日">
              {getFieldDecorator('birthday', {
                initialValue: worker.birthday ? moment(worker.birthday) : "",
                rules: [{
                  required: true, message: '请输入生日'
                }]
              })(
                <DatePicker />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="身份证号">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="所属部门">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="角色">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="教练类型">
              {getFieldDecorator('is_private_teacher', {
                valuePropName: 'checked',
                initialValue: worker.is_private_teacher == 1 ? true : false,
              })(
                <Checkbox>私人教练</Checkbox>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
              {getFieldDecorator('is_group_teacher', {
                valuePropName: 'checked',
                initialValue: worker.is_group_teacher == 1 ? true : false,
              })(
                <Checkbox>小团体课教练</Checkbox>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="员工简介">
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
            <FormItem {...FORM_ITEM_LAYOUT} label="员工状态">
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
            <FormItem {...FORM_ITEM_BUTTON}>
              <Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}