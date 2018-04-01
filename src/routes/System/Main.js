import React, {Component} from 'react';
import {connect} from 'dva';
import {Spin, Card, Form, Input, Button, Radio, Upload, Icon} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BraftEditor from '../../components/BraftEditor';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Group} = Radio;

@connect(({loading, gym}) => ({
	submitting: loading.effects['gym/mainForm'],

	gym_company_config: gym.gym_company_config,
}))
@Form.create()
export default class Page extends Component {
	state = {
		loading_logo: false,
		loading_pic: false,
	}
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
    const {form, dispatch, gym_company_config} = this.props;
    const {logoUrl, picUrl} = this.state;
		form.validateFieldsAndScroll((err, values) => {
      // console.log(err, values);
      if (!err) {
        if(logoUrl) values.gym_logo = logoUrl;
        if(picUrl) values.gym_cover = picUrl;
        dispatch({
          type: 'gym/mainForm',
          payload: {
          	...values
          },
        });
      }
    });
	}
  upload = (info) => {
    this.setState({loading_logo: true});
    info.call = this.callback.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }
  callback(img) {
    this.setState({
      loading_logo: false,
      logoUrl: img.host + img.url,
    })
  }
  upload1 = (info) => {
    this.setState({loading_pic: true});
    info.call = this.callback1.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }
  callback1(img) {
    this.setState({
      loading_pic: false,
      picUrl: img.host + img.url,
    })
  }
  change = (html, empty) => {
    const {form, dispatch, gym_company_config} = this.props;
    if(empty) {
      form.setFieldsValue({gym_desc: ''})
      form.setFieldsValue({gym_desc_html: ""})
    } else {
      form.setFieldsValue({gym_desc: html})
      form.setFieldsValue({gym_desc_html: html})
    }
  }
  render() {
  	let {logoUrl, picUrl, loading_logo, loading_pic} = this.state;
  	const {form, submitting, gym_company_config} = this.props;
  	const {getFieldDecorator} = form;
    if(!logoUrl && gym_company_config.gym_logo) this.setState({logoUrl: gym_company_config.gym_logo})
    if(!picUrl && gym_company_config.gym_cover) this.setState({picUrl: gym_company_config.gym_cover})
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
  	const UploadLogoButton = (
  		<div>
  			<Icon type={loading_logo ? 'loading' : 'plus'} />
  			<div className="ant-upload-text">上传</div>
  		</div>
  	)
  	const UploadPicButton = (
  		<div>
  			<Icon type={loading_pic ? 'loading' : 'plus'} />
  			<div className="ant-upload-text">上传</div>
  		</div>
  	)
    if(!gym_company_config.id) {
      return (
         <PageHeaderLayout title="基础配置">
          <Card bordered={false}>
            <Spin size="large" />
          </Card>
      </PageHeaderLayout>
      )
    }
    if(!gym_company_config.gym_desc) gym_company_config.gym_desc = ""

    return (
      <PageHeaderLayout title="基础配置">
      	<Card bordered={false}>
      		<Form onSubmit={this.handleSubmit}>
      			{getFieldDecorator('item_id', {
        			initialValue: gym_company_config.id,
        		})(
        			<Input style={{display: 'none'}} />
        		)}
      			<FormItem {...f_i_l} label="俱乐部名字">
      				{getFieldDecorator('gym_name', {
      					initialValue: gym_company_config.gym_name,
      					rules: [{
      						required: true, message: '请输入俱乐部名字',
      					}],
      				})(
      					<Input placeholder="俱乐部名字" />
      				)}
      			</FormItem>
      			<FormItem {...f_i_l} label="俱乐部Logo" help="显示在小程序首页">
      				<Upload
				        name="gym_logo"
				        listType="picture-card"
				        className="avatar-uploader"
				        showUploadList={false}
				        action="http//v0.api.upyun.com"
                customRequest={this.upload}
				      >
				        {logoUrl ? <img src={logoUrl} height={200} width={200} alt="" /> : UploadLogoButton}
				      </Upload>
      			</FormItem>
      			<FormItem {...f_i_l} label="封面配图" help="显示在小程序首页">
      				<Upload
				        name="gym_cover"
				        listType="picture-card"
				        className="avatar-uploader"
				        showUploadList={false}
				        action="http//v0.api.upyun.com"
                customRequest={this.upload1}
				      >
				        {picUrl ? <img src={picUrl} height={200} width={200} alt="" /> : UploadPicButton}
				      </Upload>
      			</FormItem>
      			<FormItem {...f_i_l} label="标语" help="显示在小程序首页">
      				{getFieldDecorator('gym_slogan', {
      					initialValue: gym_company_config.gym_slogan,
      					rules: [{
      						required: true, message: '请输入标语',
      					}],
      				})(
      					<Input placeholder="多个标语用“｜”隔开（会随机显示）" />
      				)}
      			</FormItem>
      			<FormItem {...f_i_l} label="服务电话">
      				{getFieldDecorator('gym_tel', {
      					initialValue: gym_company_config.gym_tel,
      					rules: [{
      						required: true, message: '请输入服务电话',
      					}],
      				})(
      					<Input placeholder="服务电话" />
      				)}
      			</FormItem>
      			<FormItem {...f_i_l} label="营业时间">
      				{getFieldDecorator('gym_opentime', {
      					initialValue: gym_company_config.gym_opentime,
      					rules: [{
      						required: true, message: '请输入营业时间',
      					}],
      				})(
      					<Input placeholder="营业时间" />
      				)}
      			</FormItem>
      			<FormItem {...f_i_l} label="会员反馈">
      				{getFieldDecorator('can_feedback', {
      					initialValue: parseInt(gym_company_config.can_feedback || 0),
                rules: [{
                  required: true, message: '请选择会员反馈',
                }]
              })(
		      			<Group>
		              <Radio value={0}>开启</Radio>
		              <Radio value={1}>关闭</Radio>
		            </Group>
		          )}
      			</FormItem>
      			<FormItem {...f_i_l} label="俱乐部简介">
      				{getFieldDecorator('gym_desc', {
      					initialValue: gym_company_config.gym_desc,
                rules: [{
                  required: true, message: '请输入俱乐部简介',
                }],
              })(
                <div>
                  <BraftEditor change={this.change} content={gym_company_config.gym_desc} placeholder="请输入俱乐部简介" />
                  <TextArea style={{ minHeight: 32, display: 'none' }} placeholder="请输入俱乐部简介" rows={4} />
                </div>
              )}
              
      			</FormItem>
            <FormItem {...f_i_l} label="俱乐部简介html" style={{ display: 'none' }}>
              {getFieldDecorator('gym_desc_html', {
              })(
                <TextArea  />
              )}
            </FormItem>
            <FormItem {...f_i_l} label="俱乐部地址">
              {getFieldDecorator('gym_address', {
                initialValue: gym_company_config.gym_address,
                rules: [{
                  required: true, message: '请输入俱乐部地址',
                }],
              })(
                <TextArea style={{ minHeight: 32 }} placeholder="请输入俱乐部地址" rows={4} />
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