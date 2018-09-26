import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Form, DatePicker, Button, Row, Col, Table} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getGender, getAge, getDateStr} from '../../utils/utils';
import {PAGE_SIZE} from '../../config';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({member, loading}) => ({
  loading: loading.effects['member/checkinList'],

  checkIn: member.checkIn,
}))
export default class Page extends Component {
  state = {}
  componentDidMount() {
    this.query();
  }
  query(params = {}, target_page=1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/checkinList',
      payload: {
        ...params,
        target_page,
        page_size,
      }
    })
  }
  goManage = (record) => {
    const {dispatch, history} = this.props;
    dispatch({
      type: 'member/queryToManage',
      payload: {
        code: record.card_id
      }
    })
    history.push('/member/manage');
  }
  handleTableChange = (pagination, filters, sorter) => {
    let {current, pageSize} = pagination;
    this.query({}, current, pageSize);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.time) {
          params.checkin_time_start = values.time[0].format('YYYYMMDD');
          params.checkin_time_end = values.time[1].format('YYYYMMDD');
        }
        this.query(params)
        // console.log(values);
      }
    })
  }
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const {checkIn, loading} = this.props;
    const {list, pagination} = checkIn;
    const {getFieldDecorator} = this.props.form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '卡号',
      dataIndex: 'card_id',
      key: 'card_id'
    }, {
      title: '名字',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (val, record) => {
        return (
          <Fragment>
            <a href="javascript:;" onClick={() => this.goManage(record)}>{val}</a>
          </Fragment>
        )
      }
    }, {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render(val) {
        return getGender(val)
      }
    }, {
      title: '年龄',
      dataIndex: 'birthday',
      key: 'birthday',
      render(val) {
        return val ? getAge(val) : "-"
      }
    }, {
      title: '电话',
      dataIndex: 'tel',
      key: 'tel'
    }, {
      title: '会籍顾问',
      dataIndex: 'saler_name',
      key: 'saler_name'
    }, {
      title: '私人教练',
      dataIndex: 'teachers',
      key: 'srjl',
      render(val) {
        let temp= "";
        for(let i = 0, teacher; teacher = val[i]; i++) {
          temp += teacher.name + ",";
        }
        return temp.slice(0, temp.length -1);
      }
    }, {
      title: '入会日期',
      dataIndex: 'subscribe_time',
      key: 'subscribe_time',
      render(val) {
        return val ? getDateStr(val) : '-'
      }
    }, {
      title: '到期时间',
      dataIndex: 'available_time_end',
      key: 'available_time_end',
      render(val) {
        return val && val != 0 ? getDateStr(val) : '-'
      }
    }, {
      title: '入场次数',
      dataIndex: 'checkin_count',
      key: 'cnt'
    }, {
      title: '最近入场',
      dataIndex: 'last_checkin_ts',
      key: 'last',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }];

    return (
      <PageHeaderLayout title="入场记录">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="12">
                <FormItem
                  {...f_i_l}
                  label="入场日期"
                >
                  {getFieldDecorator('time')(
                    <RangePicker format="YYYY-MM-DD" />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem style={{'textAlign': 'right'}}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div>
            <Table rowKey={record => record.id} dataSource={list} columns={col} loading={loading} pagination={pagination} onChange={this.handleTableChange} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}