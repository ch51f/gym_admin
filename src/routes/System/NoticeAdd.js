import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Select, Button, Radio, Upload, Icon, message} from 'antd';
import _ from 'lodash';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {NOTICE_STATUS} from '../../config';
import BraftEditor from '../../components/BraftEditor';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const {Group} = Radio;

@connect(({loading, system}) => ({
  notice: system.notice,
  submitting_add: system.addNotice,
  submitting_up: system.updateNotice,
}))
@Form.create()
export default class Page extends Component {
	state = {
    logo: false
  }
  
  upload = (info) => {
    this.setState({logo: true});
    info.call = this.callback.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callback(img) {
    this.setState({
      logo: false,
      logoUrl: img.host + img.url,
    })
  }

	handleSubmit = (e) => {
    e.preventDefault();
    let {form, dispatch} = this.props;
    const {logoUrl} = this.state;
    form.validateFieldsAndScroll((err, values) => {
      console.log(err);
      console.log(values);
      console.log(logoUrl);
      if(!logoUrl) message.error("请上传封面图");
      if(!err) {
        let params = {
          cover: logoUrl,
          title: values.title,
          status: values.status,
        }
        if(values.type == 1) {
          params.content_url = values.content_url;
        } else {
          params.content = values.content;
          params.content_html = values.content_html;
        }

        if(values.item_id) {
          params.item_id = values.item_id;
          this.props.dispatch({
            type: 'system/updateNotice',
            payload: params,
          })
        } else {
          this.props.dispatch({
            type: 'system/addNotice',
            payload: params,
          })
        }
      }
    })
	}
  change = (html, empty) => {
    const {form, dispatch} = this.props;
    if(empty) {
      form.setFieldsValue({content: ''})
      form.setFieldsValue({content_html: ""})
    } else {
      form.setFieldsValue({content: html})
      form.setFieldsValue({content_html: html})
    }
  }

	render() {
    let {logoUrl, logo} = this.state;
    const {form, submitting_add, submitting_up, notice} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    const submitting = notice.id ? submitting_up : submitting_add;
    let title = "添加通知";
    if(notice.id) title = "编辑通知";
    if(!logoUrl && notice.cover) this.setState({logoUrl: notice.cover});

    const UploadLogoButton = (
      <div>
        <Icon type={logo ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    return (
      <PageHeaderLayout title={title}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator('item_id', {
              initialValue: notice.id,
            })(
              <input style={{display: 'none'}} />
            )}
            <FormItem {...FORM_ITEM_LAYOUT} label="通知封面">
              <Upload
                name="gym_logo"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http//v0.api.upyun.com"
                customRequest={this.upload}
              >
                {logoUrl ? <img src={logoUrl} height={150} width={350} alt="" /> : UploadLogoButton}
              </Upload>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="通知标题">
              {getFieldDecorator('title', {
                initialValue: notice.title,
                rules: [{
                  required: true, message: '请输入通知标题', transform: (value) => {
                    return _.trim(value);
                  }
                }]
              })(
                <Input placeholder="通知标题" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="内容类型">
               {getFieldDecorator('type', {
                initialValue: '0',
                rules: [{
                  required: true, message: '选择内容类型'
                }]
              })(
                <Group>
                  <Radio value="0">内容</Radio>
                  <Radio value="1">网页</Radio>
                </Group>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="通知内容" style={{display: getFieldValue('type') == 0 ? 'block' : 'none'}}>
              {getFieldDecorator('content', {
                initialValue: notice.content || 'test',
                rules: [{
                  required: getFieldValue('type') == 0 ? true : false,
                  message: '请输入通知内容', transform: (value) => {
                    return _.trim(value);
                  }
                }]
              })(
                <div>
                  <BraftEditor change={this.change} content={notice.content} placeholder="请输入通知内容" />
                  <TextArea style={{ minHeight: 32, display: 'none' }} placeholder="通知内容" rows={4} />
                </div>
              )}
            </FormItem> 
            <FormItem {...FORM_ITEM_LAYOUT} label="通知内容html" style={{ display: 'none' }}>
              {getFieldDecorator('content_html', {
              })(
                <TextArea  />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="URL地址" style={{display: getFieldValue('type') == 1 ? 'block' : 'none'}}>
              {getFieldDecorator('content_url', {
                initialValue: notice.content_html,
                rules: [{
                  required: getFieldValue('type') == 1 ? true : false, 
                  message: '请输入通知内容', transform: (value) => {
                    return _.trim(value);
                  }
                }]
              })(
                <Input placeholder="请输入url"  />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="通知状态">
              {getFieldDecorator('status', {
                initialValue: parseInt(notice.status || 1),
                rules: [{
                  required: true, message: '请选择通知状态'
                }]
              })(
                <Select placeholder="通知状态">
                  {NOTICE_STATUS.map((item, i) => {
                    return(<Option key={`status_${i}`} value={i}>{item}</Option>)
                  })}
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