import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, AutoComplete, Button, Select, Upload, Icon, message} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const {Option} = Select;

@connect(({loading, member}) => ({
  submitting_add: loading.effects['member/addBodyCheck'],
  submitting_upd: loading.effects['member/updateBodyCheck'],

  body_check: member.body_check,

  quickMember: member.quickMember,
}))
@Form.create()
export default class Page extends Component {
  state = {
    zm: false,
    bm: false,
    cm: false,
  }
  componentDidMount(){}
  componentWillUnmount() {
    this.props.dispatch({
      type: 'member/setConfig', 
      payload: {
        body_check: {},
        quickMember: [],
      } 
    })
  }

  uploadZm = (info) => {
    this.setState({zm: true});
    info.call = this.callbackZm.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callbackZm(img) {
    this.setState({
      zm: false,
      zmUrl: img.host + img.url,
    })
  }

  uploadCm = (info) => {
    this.setState({cm: true});
    info.call = this.callbackCm.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callbackCm(img) {
    this.setState({
      cm: false,
      cmUrl: img.host + img.url,
    })
  }

  uploadBm = (info) => {
    this.setState({bm: true});
    info.call = this.callbackBm.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callbackBm(img) {
    this.setState({
      bm: false,
      bmUrl: img.host + img.url,
    })
  }

  // 体测录入事件
  handleSubmit = (e) => {
    e.preventDefault();
    const {form, dispatch, body_check} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if(!err) {
        if(body_check.user_id) {
          this.props.dispatch({
            type: 'member/updateBodyCheck',
            payload: _.assign(values, {item_id: body_check.user_id})
          })
        } else {
          this.props.dispatch({
            type: 'member/addBodyCheck',
            payload: _.assign(values)
          })
        }
      }
    })
  }

  // 获取会员体测信息
  handleSelect = (value) => {
    this.props.dispatch({
      type: 'member/queryBodyCheckById',
      payload: {
        user_id: value
      }
    });
  }

  // 会员查询
  handleSearch = (value) => {
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/quickQuery',
      payload: {
        code: value
      }
    })
  }

  // 渲染会员option
  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    )
  }

  render() {
    let {zmUrl, zm, cmUrl, cm, bmUrl, bm} = this.state;

    const {form, submitting_add, submitting_upd, body_check, quickMember} = this.props;
    const {getFieldDecorator} = form;
    console.log(quickMember)
    const users = quickMember;

    // console.log(body_check)
    let submitting = body_check.user_id ? submitting_add : submitting_upd;

    const UploadZmButton = (
      <div>
        <Icon type={zm ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    const UploadCmButton = (
      <div>
        <Icon type={cm ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    const UploadBmButton = (
      <div>
        <Icon type={bm ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    return (
      <PageHeaderLayout title="体测录入">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员">
              {getFieldDecorator('user_id', {
                rules: [{
                  required: true, message: "请选择会员"
                }]
              })(
                <AutoComplete
                  dataSource={users.map(this.renderOption.bind(this))}
                  onSelect={this.handleSelect.bind(this)}
                  onSearch={this.handleSearch}
                  placeholder="输入会员卡号 / 电话 / 名字"
                />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="身高">
              {getFieldDecorator('check_height', {
                initialValue: body_check.check_height || "",
                rules: [{
                  required: true, message: "请输入身高"
                }]
              })(
                <Input placeholder="身高" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="体重">
              {getFieldDecorator('check_weight', {
                initialValue: body_check.check_weight || "",
                rules: [{
                  required: true, message: "请输入体重"
                }]
              })(
                <Input placeholder="体重" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="体脂">
              {getFieldDecorator('check_bmi', {
                initialValue: body_check.check_bmi || "",
                rules: [{
                  required: true, message: "请输入体脂"
                }]
              })(
                <Input placeholder="体脂" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="新陈代谢">
              {getFieldDecorator('check_XCDX', {
                initialValue: body_check.check_XCDX || "",
                rules: [{
                  required: true, message: "请输入新陈代谢"
                }]
              })(
                <Input placeholder="新陈代谢" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="胸围">
              {getFieldDecorator('check_XW', {
                initialValue: body_check.check_XW || "",
                rules: [{
                  required: true, message: "请输入胸围"
                }]
              })(
                <Input placeholder="胸围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="腰围">
              {getFieldDecorator('check_YW', {
                initialValue: body_check.check_YW || "",
                rules: [{
                  required: true, message: "请输入腰围"
                }]
              })(
                <Input placeholder="腰围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="上臂围">
              {getFieldDecorator('check_STW', {
                initialValue: body_check.check_STW || "",
                rules: [{
                  required: true, message: "请输入上臂围"
                }]
              })(
                <Input placeholder="上臂围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="大腿围">
              {getFieldDecorator('check_DTW', {
                initialValue: body_check.check_DTW || "",
                rules: [{
                  required: true, message: "请输入大腿围"
                }]
              })(
                <Input placeholder="大腿围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="小腿围">
              {getFieldDecorator('check_XTW', {
                initialValue: body_check.check_XTW || "",
                rules: [{
                  required: true, message: "请输入小腿围"
                }]
              })(
                <Input placeholder="小腿围" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="正面照">
              <Upload
                name="check_ZM"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http//v0.api.upyun.com"
                customRequest={this.uploadZm}
              >
                {zmUrl ? <img src={zmUrl} height={200} width={200} alt="" /> : UploadZmButton}
              </Upload>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="侧面照">
              <Upload
                name="check_CM"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http//v0.api.upyun.com"
                customRequest={this.uploadCm}
              >
                {cmUrl ? <img src={cmUrl} height={200} width={200} alt="" /> : UploadCmButton}
              </Upload>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="背面照">
              <Upload
                name="check_BM"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="http//v0.api.upyun.com"
                customRequest={this.uploadBm}
              >
                {bmUrl ? <img src={bmUrl} height={200} width={200} alt="" /> : UploadBmButton}
              </Upload>
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
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