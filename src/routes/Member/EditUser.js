import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Button, DatePicker, Radio, Upload, Icon, message} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {setMoment} from '../../utils/utils';

import styles from './Member.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;

@connect(({loading, member}) => ({
  submitting: loading.effects['member/editUser'],

  card_id: member.card_id,
  member: member.member,
  communities: member.communities, 
  income_levels: member.income_levels, 
  user_sources: member.user_sources,
}))
@Form.create()
export default class Page extends Component {
  state = {
    loading: false
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'member/config',
      payload: {}
    })
    this.props.dispatch({
      type: 'member/setConfig',
      payload: {
        card_id: ''
      }
    })
  }

  _random = () => {
    this.props.dispatch({
      type: 'member/random',
      payload: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let {imageUrl} = this.state;
    let {form, member} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {item_id: values.item_id}
        if(values.card_id != member.card_id) params.card_id = values.card_id;
        if(values.user_name != member.user_name) params.user_name = values.user_name;
        if(values.tel != member.tel) params.tel = values.tel;
        if(values.gender != member.gender) params.gender = values.gender;

        if(values.birthday) {
          if(values.birthday.format("YYYYMMDD") != member.birthday) params.birthday = values.birthday.format("YYYYMMDD");
        }

        if(values.community_config_id != member.community_config_id) params.community_config_id = values.community_config_id;
        if(values.income_level_config_id != member.income_level_config_id) params.income_level_config_id = values.income_level_config_id;
        if(values.user_source_config_id != member.user_source_config_id) params.user_source_config_id = values.user_source_config_id;
        if(imageUrl != member.avatar) params.avatar = imageUrl;

        this.props.dispatch({
          type: 'member/editUser',
          payload: params
        })
      }
    })
  }

  upload = (info) => {
    info.call = this.callback.bind(this);
    this.setState({loading: true});
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callback(img) {
    this.setState({
      loading: false,
      imageUrl: img.host + img.url
    })
  }

  render() {
    let {imageUrl} = this.state;
    let {form, card_id, member, communities, income_levels, user_sources, submitting} = this.props;
    const {getFieldDecorator} = form;

    if(card_id != "") member.card_id = card_id;
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
        sm: {span: 10, offset: 7}
      }
    }

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    if(!imageUrl && member.avatar) this.setState({imageUrl: member.avatar})

    return (
      <PageHeaderLayout title="编辑会员信息">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator('item_id', {
              initialValue: member.id,
            })(
              <Input style={{display: 'none'}} />
            )}
            <FormItem {...f_i_l} label="卡号">
              {getFieldDecorator('card_id', {
                initialValue: member.card_id,
                rules: [{required: true, message: '请输入6位数卡号', whitespace: true}],
              })(
                <Search placeholder="卡号" enterButton="随机生成" onSearch={(value) => this._random()} />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="名字">
              {getFieldDecorator('user_name', {
                initialValue: member.user_name,
                rules: [{required: true, message: '请输入名字', whitespace: true}],
              })(
                <Input placeholder="名字" />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="电话">
              {getFieldDecorator('tel', {
                initialValue: member.tel,
                rules: [{required: true, message: '请输入电话', whitespace: true}],
              })(
                <Input placeholder="电话" />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="性别">
              {getFieldDecorator('gender', {
                initialValue: member.gender,
                rules: [{required: true, message: '请选择性别'}]
              })(
                <RadioGroup>
                  <Radio value="m">男</Radio>
                  <Radio value="f">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...f_i_l} label="头像">
              <Upload
                name="img"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false} 
                action="http//v0.api.upyun.com"
                customRequest={this.upload} 
              >
                {imageUrl ? <img src={imageUrl} height={200} width={200} alt="img" /> : uploadButton}
              </Upload>
            </FormItem>
            <FormItem {...f_i_l} label="生日">
              {getFieldDecorator('birthday', {
                initialValue: member.birthday ? setMoment(member.birthday, "YYYYMMDD") : null
              })(
                <DatePicker />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="职业">
              {getFieldDecorator('job', {
                initialValue: member.job
              })(
                <Input placeholder="职业" />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="住址">
              {getFieldDecorator('community_config_id', {
                initialValue: member.community_config_id
              })(
                <RadioGroup>
                  {communities.map((item, i) => {
                    return (<Radio className={styles.myRadio} value={item.id} key={`c_${i}`}>{item.item_name}</Radio>)
                  })}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...f_i_l} label="收入">
              {getFieldDecorator('income_level_config_id', {
                initialValue: member.income_level_config_id
              })(
                <RadioGroup>
                  {income_levels.map((item, i) => {
                    return (<Radio className={styles.myRadio} value={item.id} key={`i_${i}`}>{item.item_name}</Radio>)
                  })}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem {...f_i_l} label="来源">
              {getFieldDecorator('user_source_config_id', {
                initialValue: member.user_source_config_id
              })(
                <RadioGroup>
                  {user_sources.map((item, i) => {
                    return (<Radio className={styles.myRadio} value={item.id} key={`u_${i}`}>{item.item_name}</Radio>)
                  })}
                </RadioGroup>
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