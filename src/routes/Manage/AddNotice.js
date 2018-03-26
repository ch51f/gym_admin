import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Select, Button} from 'antd';
import _ from 'lodash';


import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {NOTICE_STATUS} from '../../config';
import RichText from '../../components/Quill';
import {dataURL2Blob} from '../../utils/img';

const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;

@connect(({loading, manage}) => ({
  submitting_add: loading.effects['manage/addNotice'],
  submitting_up: loading.effects['manage/updateNotice'],

  notice: manage.notice,
}))
@Form.create()
export default class Page extends Component {
  state = {}
  handleSubmit = (e) => {
    e.preventDefault();
    let {form, dispatch} = this.props;
    let flag = true;

    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {
          title: values.title,
          content: values.content,
          content_html: values.content_html   ,
          status: values.status,
        }
        if(values.item_id) {
          params.item_id = values.item_id;
          this.props.dispatch({
            type: 'manage/updateNotice',
            payload: params,
          })
        } else {
          this.props.dispatch({
            type: 'manage/addNotice',
            payload: params,
          })
        }
      }
    })
  }
  onRichChange = (value, html, val) => {
    const {form, dispatch} = this.props;
    // console.log(value)
    // console.log(html)
    if(_.trim(val) == "") {
      form.setFieldsValue({content: ""})
    } else {
        let contents = JSON.parse(value).ops;
        for(let i =0, item; item = contents[i]; i++) {
          if(typeof(item.insert) == "object") {
            if(item.insert.image && item.insert.image.indexOf('http') == -1) {
              dispatch({
                type: 'login/upload',
                payload: {
                  ext: dataURL2Blob(item.insert.image).type.split('/')[1],
                  sizes: '100_100',
                  file: dataURL2Blob(item.insert.image),
                  call: (img) => {
                    let temp = item.insert.image;
                    item.insert.image = img.host + img.url;
                    console.log(contents)
                    form.setFieldsValue({content: JSON.stringify({ops: contents})})
                    form.setFieldsValue({content_html: html.replace(temp, img.host + img.url)})
                  }
                }
              })
            }
          }
        }
      form.setFieldsValue({content: value})
      form.setFieldsValue({content_html: html})
    }
  }
  render() {
    const {form, submitting_add, submitting_up, notice} = this.props;
    const {getFieldDecorator} = form;
    const submitting = notice.id ? submitting_up : submitting_add;
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
    let title = "添加通知";
    if(notice.id) title = "编辑通知";

    return (
      <PageHeaderLayout title={title}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator('item_id', {
              initialValue: notice.id,
            })(
              <input style={{display: 'none'}} />
            )}
            <FormItem {...f_i_l} label="通知标题">
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
            <FormItem {...f_i_l} label="通知内容">
              {getFieldDecorator('content', {
                initialValue: notice.content,
                rules: [{
                  required: true, message: '请输入通知内容', transform: (value) => {
                    return _.trim(value);
                  }
                }]
              })(
                <div>
                <RichText change={this.onRichChange} content={"notice"} />
                <TextArea style={{ minHeight: 32, display: 'none' }} placeholder="通知内容" rows={4} />
                </div>
              )}
            </FormItem> 
            <FormItem {...f_i_l} label="通知内容html" style={{ display: 'none' }}>
              {getFieldDecorator('content_html', {
              })(
                <TextArea  />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="通知状态">
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

            <FormItem {...s_l}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}