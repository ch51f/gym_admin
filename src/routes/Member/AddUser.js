import React, {Component} from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Icon, Input, Button, Radio, DatePicker, Upload, message } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import _ from 'lodash';
import {dataURL2Blob} from '../../utils/dataUri2Blob';

import styles from './Member.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {Search} = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


@connect(({loading, member}) => ({
  submitting: loading.effects['member/add'],
  card_id: member.card_id,
  communities: member.communities, 
  income_levels: member.income_levels, 
  user_sources: member.user_sources,
}))
@Form.create()
export default class Page extends Component {
  state = {
    loading: false
  };
  componentDidMount() {
    let {video, canvas} = this.refs;
    this.props.dispatch({
      type: 'member/config',
      payload: {}
    })
    video.addEventListener('canplay', function(ev){
      let width = 300;
      let height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width); 
      video.setAttribute('height', height); 
      canvas.setAttribute('width', width); 
      canvas.setAttribute('height', height); 
    }, false);
  }
  handleChange = (info) => {
    if(info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if(info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    } 
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
      imageUrl: img.host + img.url,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    let {imageUrl} = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        if(values.birthday) {
          values.birthday = values.birthday.format("YYYYMMDD");
        }
        if(imageUrl) values.avatar = imageUrl;
        this.props.dispatch({
          type: 'member/add',
          payload: values,
        })
        // console.log('Received values of form: ', values);
      }
    });
    // dispatch(routerRedux.push('/member/add/card'));
  }
  _random = () => {
    this.props.dispatch({
      type: 'member/random',
      payload: {cb:this._checkCardId}
    })
  }
  _checkCardId = (card_id) => {
    let {setFieldsValue} = this.props.form;
    setFieldsValue({card_id})
  }
  open = () => {
    let self = this;
    let {video, canvas} = this.refs;
    let {dispatch} = this.props;
    let context = canvas.getContext('2d');
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMeddia || navigator.msGetUserMedia;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true, 
        audio: false 
      }).then(function(stream) { 
        video.srcObject = stream;
        video.play();
        video.style.display = 'block';
      }).catch(function(err) {
        message.error("未找到设备！");
      })
    } else if (navigator.getMedia) {
      navigator.getMedia({
        video: true,
        audio: false
      }, function(stream) {
        video.srcObject = stream;
        video.play();
        video.style.display = 'block';
      }, function(err) {
        message.error("未找到设备！");
      });
    } else {
      message.error("该浏览器不支持调用摄像头！")
    }
  }

  up = () => {
    let self = this;
    let {video, canvas} = this.refs;
    let {dispatch} = this.props;
    let context = canvas.getContext('2d');

    context.drawImage(video, 0, 0, video.width, video.height);

    let stream = video.srcObject;
    let tracks = stream.getTracks();

    tracks.forEach(function(track) {
      track.stop();
    })
    video.style.display = 'none';

    dispatch({
      type: 'login/upload', 
      payload: {
        ext: dataURL2Blob(canvas.toDataURL('image/png')).type.split('/')[1], 
        sizes: '100_100', 
        file: dataURL2Blob(canvas.toDataURL('image/png')), 
        call: (img) => {
          self.setState({imageUrl: img.host + img.url}) 
        } 
      } 
    })
  }
  render() {
    const {form, communities, income_levels, user_sources, card_id, submitting} = this.props;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {
        sm: {span: 4},
      },
      wrapperCol: {
        sm: {span: 20},
      }
    }

    const uploadButton = (
      <div>
        <Icon type={this.state.Loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <div>
        <Form className={styles.stepForm}>
          <Row>
            <Col span={8} offset={2}>
              <FormItem {...f_i_l} label="卡号">
                {getFieldDecorator('card_id', {
                  initialValue: card_id,
                  rules: [{required: true, message: '请输入6位数卡号',whitespace: true}],
                })(
                  <Search placeholder="卡号" enterButton="随机生成" onSearch={(value) => this._random()} />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="名字">
                {getFieldDecorator('user_name', {
                  rules: [{required: true, message: '请输入名字', transform: (value) => {
                    return _.trim(value);
                  }}],
                })(
                  <Input placeholder="名字" />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="电话">
                {getFieldDecorator('tel', {
                  rules: [{required: true, message: '请输入电话', transform: (value) => {
                    return _.trim(value);
                  }}],
                })(
                  <Input placeholder="电话" />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="性别">
                {getFieldDecorator('gender', {
                  rules: [{required: true, message: '请选择性别', transform: (value) => {
                    return _.trim(value);
                  }}],
                })(
                  <RadioGroup>
                    <Radio value="m">男</Radio>
                    <Radio value="f">女</Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="生日">
                {getFieldDecorator('birthday')(
                  <DatePicker />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="职业">
                {getFieldDecorator('job')(
                  <Input placeholder="职业" />
                )}
              </FormItem>
              <FormItem {...f_i_l} label="住址">
                {getFieldDecorator('community_config_id')(
                  <RadioGroup>
                    {communities.map((item, i) => {
                      return (<Radio className={styles.myRadio} value={item.id} key={`c_${i}`}>{item.item_name}</Radio>)
                    })}
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="收入">
                {getFieldDecorator('income_level_config_id')(
                  <RadioGroup>
                    {income_levels.map((item, i) => {
                      return (<Radio className={styles.myRadio} value={item.id} key={`i_${i}`}>{item.item_name}</Radio>)
                    })}
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem {...f_i_l} label="来源">
                {getFieldDecorator('user_source_config_id')(
                  <RadioGroup>
                    {user_sources.map((item, i) => {
                      return (<Radio className={styles.myRadio} value={item.id} key={`u_${i}`}>{item.item_name}</Radio>)
                    })}
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  onClick={this.handleSubmit}
                  loading={submitting}
                >
                  下一步
                </Button>
              </FormItem>
            </Col>
            <Col span={8} offset={4}>
              <FormItem>
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
                <Button
                  type="default"
                  onClick={this.open}
                >
                  摄像头拍照
                </Button>
                <video style={{display: 'none'}} ref="video"></video>
                <canvas style={{display: 'none'}} ref="canvas"></canvas>
                <br />
                <Button
                  type="default"
                  onClick={this.up}
                >
                  上传图片
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}