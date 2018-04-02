import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Radio, TimePicker, Checkbox, AutoComplete, Button, Select, InputNumber, DatePicker, Col, Row, Upload, Icon, message} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, LESSON_TYPE, LESSON_STATUS, DAY_OF_WEEK} from '../../config';
import _ from 'lodash';

import moment from 'moment';
import {uuid, getPriceF} from '../../utils/utils';
import {getOperatorId} from '../../utils/load';

const CheckboxGroup = Checkbox.Group;
const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea } = Input;
const {Option} = Select;
const InputGroup = Input.Group;
const RangePicker = DatePicker.RangePicker;

const format = "HH:mm";

const plainOptions = ['1', '5', '10', '12', '15', '20', '24', '25', '30', '36', ];
const defaultCheckedList = [];

@Form.create()
@connect(({loading, worker, lesson}) => ({
  submitting: loading.effects['lesson/addLesson'],

  worker_data: worker.worker_data,

  ranks: worker.ranks,
}))
export default class Page extends Component {
  state ={
    flag: false,
    checkedList: [],
    imgs: [],

    id: 1,
    time_box: [],
  }
  componentWillMount() {
    this.queryWorker();
    this.queryRank();
  }

  queryRank() {
    this.props.dispatch({
      type: 'worker/rank',
      payload: {
        is_default: 1
      }
    })
  }
  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {}
    })
  }

  upload = (info) => {
    this.setState({flag: true});
    info.call = this.callback.bind(this);
    this.props.dispatch({
      type: 'login/upload',
      payload: info
    })
  }

  callback(img) {
    let {imgs} = this.state;
    let temp = [].concat(imgs);
    temp.push({
      status: 'done',
      uid: img.url,
      name: img.url,
      url: img.host + img.url
    });
    let a = {
      flag: false,
      imgs: temp
    }
    console.log(a);
    this.setState(a);
  }

  onChange = (checkedList) => {
    this.setState({
      checkedList,
    });
  }

  getCovers = (imgs) => {
    let arr = [];
    for(let i = 0, item; item = imgs[i]; i++) {
      arr.push(item.url);
    }
    return arr.join(",");
  }

  getTeacherName = (id) => {
    let {worker_data} = this.props;
    for(let i = 0, item; item = worker_data.list[i]; i++) {
      if(item.id == id) return item.worker_name;
    }
    return "-"
  }

  getPrices = () => {
    let {ranks, form} = this.props;
    let {getFieldValue} = form;
    let arr = [];
    for(let i = 0, item; item = ranks[i]; i++) {
      arr.push(getPriceF(getFieldValue(`price_${item.id}`)));
      // console.log(getFieldValue(`price_${item.id}`));
    }
    return arr.join(',');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values)
      if(!err) {
        let {imgs, time_box} = this.state;
        if(imgs.length < 1) {
          message.warning("请上传封面图");
          return false;
        }
        if(values.lesson_type != 0 && time_box.length == 0) {
          message.warning("请添加课程时间");
          return false;
        }

        let params = {
          covers: this.getCovers(imgs),
          gym_id: getOperatorId(),
          item_uuid: uuid(32, 16),
          lesson_name: values.lesson_name,
          lesson_type: values.lesson_type,
          teacher_id: values.teacher_id,
          teacher_name: this.getTeacherName(values.teacher_id),
          buy_types: values.buy_types.join(","),
          status: values.status,
          rank_type_id: values.rank_type_id,
          rank_prices: this.getPrices(),
        }
        if(values.lesson_type == 2) {
          params['camp_lesson_valid_date_begin'] = values.camp_lesson_valid_date[0].format("YYYYMMDD");
          params['camp_lesson_valid_date_end'] = values.camp_lesson_valid_date[1].format("YYYYMMDD");
        }
        if(values.lesson_type != 0) {
          params['group_lesson_user_min'] = values.group_lesson_user_min;
          params['group_lesson_user_max'] = values.group_lesson_user_max;
        }
        if(values.lesson_type != 0) {
          let day_of_weeks = [];
          let time_begins = [];
          let time_ends = [];
          for(let i =0, item; item = time_box[i]; i++) {
            day_of_weeks.push(item['week'] == 0 ? 7 : item['week']);
            time_begins.push(item['begin_time'].format("HHmm"));
            time_ends.push(item['end_time'].format("HHmm"));
          }
          params['day_of_weeks'] = day_of_weeks.join(',');
          params['time_begins'] = time_begins.join(',');
          params['time_ends'] = time_ends.join(',');
        }



        console.log(params);

        this.props.dispatch({
          type: 'lesson/addLesson',
          payload: params
        })
        // covers
        // teacher_name
        // buy_types
        // group_lesson_user_min
        // group_lesson_user_max
        // camp_lesson_valid_date_begin
        // camp_lesson_valid_date_end
        // time_begins
        // day_of_weeks
        // time_ends
        // rank_type_id
        // rank_prices
      }
    })
  }

  addTime = () => {
    let {getFieldValue} = this.props.form;
    let begin_time = getFieldValue('begin_time');
    let end_time = getFieldValue('end_time');
    let week = getFieldValue('week');

    if(!week && week != 0) {
      message.warning("请选择星期");
      return false;
    }
    if(!begin_time) {
      message.warning("请选择开始时间");
      return false;
    }
    if(!end_time) {
      message.warning("请选择结束时间");
      return false;
    }

    if(!end_time.isAfter(begin_time)) {
      message.warning("结束时间必须大于开始时间")
      return false;
    }
    let {time_box, id} = this.state;
    
    let params = {
      id,
      week,
      begin_time,
      end_time,
    }
    time_box.push(params);
    this.setState({time_box, id: ++id});
  }

  _renderPrice(item, i) {
    let {getFieldDecorator} = this.props.form;
    return (
      <Col span={4} key={`rank_${i}`}> 
        <FormItem> 
          {getFieldDecorator(`price_${item.id}`, {

          })(
            <InputNumber placeholder={item.default_price_name} min={0} precision={2} />
          )}
        </FormItem>
      </Col>
    )
  }

  handleRemove(id) {
    let {time_box} = this.state;
    _.remove(time_box, function(n) {
      return n.id == id;
    })
    this.setState({time_box});
  }

  renderTimeBox(item, i) {
    console.log(item)
    return (
      <div key={`time_${i}`}>{DAY_OF_WEEK[item.week]} {item.begin_time.format(format)} - {item.end_time.format(format)} <Icon type="close" onClick={this.handleRemove.bind(this, item.id)} /></div>
    )
  }

  render() {
    let {imgs, flag, time_box} = this.state;
    let {submitting, form, worker_data, ranks} = this.props;
    const {getFieldDecorator, getFieldValue} = form;
    console.log(ranks)
    const UploadButton = (
      <div>
        <Icon type={flag ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    )

    return(
      <PageHeaderLayout title="购买课程">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}>
            {getFieldDecorator('rank_type_id', {
              initialValue: ranks.length > 0 ? ranks[0].rank_type_id : "",
            })(
              <Input style={{display: 'none'}} />
            )}
            <FormItem {...FORM_ITEM_LAYOUT} label="课程封面">
              <Upload
                name="img"
                listType="picture-card"
                className="avatar-uploader"
                fileList={imgs}
                action="http//v0.api.upyun.com"
                customRequest={this.upload}
              >
                {imgs.length >= 5 ? null : UploadButton}
              </Upload>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="课程名称">
              {getFieldDecorator('lesson_name', {
                rules: [{
                  required: true, message: '请选择课程名称'
                }]
              })(
                <Input placeholder="课程名称" />
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="课程教练">
              {getFieldDecorator('teacher_id', {
                rules: [{
                  required: true,
                  message: '请选择课程教练'
                }]
              })(
                <Select placeholder="教练列表">
                  {worker_data.list.map((item, i) => {
                    return (<Option key={i} value={item.id}>{item.worker_name}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="课程类型">
              {getFieldDecorator('lesson_type', {
                initialValue: 0,
                rules: [{
                  required: true,
                  message: '请选择课程类型'
                }]
              })(
                <Select placeholder="课程类型">
                  {LESSON_TYPE.map((item, i) => {
                    return (<Option key={`LESSON_TYPE_${i}`} value={i}>{item}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="有效日期" style={{display: getFieldValue('lesson_type') == 2 ? 'block' : 'none'}}>
              {getFieldDecorator('camp_lesson_valid_date', {
                rules: [{
                  required: getFieldValue('lesson_type') == 2 ? true : false,
                  message: '请选择有效日期'
                }]
              })(
                <RangePicker format="YYYY-MM-DD" />
              )}
            </FormItem>



            <FormItem {...FORM_ITEM_LAYOUT} label="课程时间" style={{display: getFieldValue('lesson_type') != 0 ? 'block' : 'none'}}>
              <div>
                <InputGroup compact>
                  {getFieldDecorator('week')(
                    <Select placeholder="星期" style={{width: '100px'}}>
                      {DAY_OF_WEEK.map((item, i) => {
                        return (<Option key={`DAY_OF_WEEK_${i}`} value={i}>{item}</Option>)
                      })}
                    </Select>
                  )}
                  {getFieldDecorator('begin_time')(
                    <TimePicker format={format} style={{width: '100px'}} placeholder="开始时间" />
                  )}
                  <Input style={{ width: 30, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                  {getFieldDecorator('end_time')(
                    <TimePicker format={format} style={{width: '100px'}} placeholder="结束时间" />
                  )}
                  <Button onClick={this.addTime.bind(this)} >添加</Button>
                </InputGroup>
                <div>
                  {time_box.map((item, i) => this.renderTimeBox(item, i))}
                </div>
              </div>
            </FormItem>



            <FormItem {...FORM_ITEM_LAYOUT} label="课程价格">
              {ranks.map((item, i) => this._renderPrice(item, i))}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="课程人数" style={{display: getFieldValue('lesson_type') != 0 ? 'block' : 'none'}}>
              <InputGroup compact>
                {getFieldDecorator('group_lesson_user_min', {
                  rules: [{
                    required: getFieldValue('lesson_type') != 0 ? true : false,
                    message: '请选择课程人数'
                  }]
                })(
                  <Input id="group_lesson_user_min" style={{ width: 100, textAlign: 'center' }} placeholder="最少" /> 
                )}
                <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled /> 
                {getFieldDecorator('group_lesson_user_max', {
                  rules: [{
                    required: getFieldValue('lesson_type') != 0 ? true : false,
                    message: '请选择课程人数'
                  }]
                })(
                  <Input id="group_lesson_user_max" style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最多" />
                )}
              </InputGroup>
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="购买数量">
              {getFieldDecorator('buy_types')(
                <CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
              )}
            </FormItem>


            <FormItem {...FORM_ITEM_LAYOUT} label="课程状态">
              {getFieldDecorator('status', {
                initialValue: 0,
                rules: [{
                  required: true, message: '请选择课程状态'
                }]
              })(
                <Select placeholder="课程状态">
                  {LESSON_STATUS.map((item, i) => {
                    return (<Option key={`LESSON_STATUS_${i}`} value={i}>{item}</Option>)
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
              <Button type="primary" htmlType="submit" loading={submitting} >提交</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}