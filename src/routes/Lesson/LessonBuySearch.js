import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Row, Col, Table, Input,  Button, Select, InputNumber, AutoComplete} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON, PAGE_SIZE} from '../../config';
import {getPriceY, getPriceF} from '../../utils/utils';
import moment from 'moment';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const {Option} = Select;
const InputGroup = Input.Group;

@Form.create()
@connect(({loading, worker, lesson, member}) => ({
  submitting: loading.effects['lesson/buy_list'],

  quickMember: member.quickMember,
  worker_data: worker.worker_data,

  buy_lists: lesson.buy_lists,
  search_lists: lesson.search_lists,
}))
export default class Page extends Component {
  state ={}
  componentWillMount() {
    this.query();
    this.queryWorker();
    this.queryLesson();
  }

  query(params = {}, target_page=1, page_size = PAGE_SIZE) {
    this.props.dispatch({
      type: 'lesson/buy_list',
      payload: {
        ...params,
        target_page,
        page_size,
      }
    })
  }

  queryLesson() {
    this.props.dispatch({
      type: 'lesson/search_list',
      payload: {}
    })
  }

  queryWorker() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {}
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values)
      if(!err) {
        let params = {}
        if(values.count_from) {
          params.count_from = values.count_from;
        }
        if(values.count_to) {
          params.count_to = values.count_to;
        }
        if(values.lesson_id) {
          params.lesson_id = values.lesson_id;
        }
        if(values.worker_id) {
          params.teacher_id = values.worker_id;
        }
        if(values.member_id) {
          params.user_id = values.member_id;
        }
        this.query(params);
      }
    })
  }

  handleReset = () => {
    this.props.form.resetFields();
    this.query();
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

  handleSelect = (value) => {
    this.props.dispatch({
      type: 'member/queryBodyCheckById',
      payload: {
        user_id: value
      }
    });
  }

  handleSearch = (value) => {
    if(value == "") return false;
    this.props.dispatch({
      type: 'member/quickQuery',
      payload: {
        code: value
      }
    })
  }

  renderOption(item) {
    let txt = `${item.user_name}（${item.card_id}，${item.gender == "f" ? "女" : "男"}），电话：${item.tel}`;
    return (
      <AutoOption key={item.id} text={item.id}>{txt}</AutoOption>
    )
  }

  render() {
    let {submitting, form, worker_data, buy_lists, search_lists, quickMember} = this.props;
    const {list, pagination} = buy_lists;
    const users = quickMember;
    const {getFieldDecorator} = form;

    const f_i_l = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    }

    const col = [{
      title: '会员号',
      dataIndex: 'card_id',
      key: 'card_id'
    }, {
      title: '姓名',
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
      title: '购买课程',
      dataIndex: 'lesson_name',
      key: 'lesson_name'
    }, {
      title: '课程教练',
      dataIndex: 'teacher_name',
      key: 'teacher_name'
    }, {
      title: '课程单价(元)',
      dataIndex: 'lesson_price',
      key: 'lesson_price',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '购买数量',
      dataIndex: 'total_count',
      key: 'total_count'
    }, {
      title: '购买总价(元)',
      dataIndex: 'user_price',
      key: 'user_price',
      render(val) {
        return getPriceY(val)
      }
    }, {
      title: '购买时间',
      dataIndex: 'create_ts',
      key: 'create_ts',
      render(val) {
        return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
      }
    }, {
      title: '累计购买',
      dataIndex: 'total_count_sum',
      key: 'total_count_sum'
    }, {
      title: '剩余课时',
      dataIndex: 'left_count',
      key: 'left_count'
    },
    // {
    //   title: '账户余额(元)',
    //   dataIndex: 'balance',
    //   key: 'balance',
    //   render(val) {
    //     return getPriceY(val)
    //   }
    // }
    ];

    return(
      <PageHeaderLayout title="购买记录">
        <Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <Row>
              <Col span="12">
                <FormItem {...f_i_l} label="会员">
                  {getFieldDecorator('member_id', {
                  })(
                    <AutoComplete
                      dataSource={users.map(this.renderOption.bind(this))}
                      onSelect={this.handleSelect.bind(this)}
                      onSearch={this.handleSearch}
                      placeholder="输入会员卡号 / 电话 / 名字"
                    />
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择课程">
                  {getFieldDecorator('lesson_id')(
                    <Select placeholder="购买课程" onChange={this.change}>
                      {search_lists.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.lesson_name}-{item.teacher_name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="购买数量">
                  <InputGroup compact>
                    {getFieldDecorator('count_from', {})(
                    <Input style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
                    )}
                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                    {getFieldDecorator('count_to', {})(
                    <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />
                    )}
                  </InputGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem {...f_i_l} label="选择教练">
                  {getFieldDecorator('worker_id')(
                    <Select placeholder="教练列表">
                      {worker_data.list.map((item, i) => {
                        return (<Option key={i} value={item.id}>{item.worker_name}</Option>)
                      })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span="20" offset="2">
                <FormItem style={{'textAlign': 'right'}}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>

          <div>
            <Table rowKey={record => record.id} dataSource={list} columns={col} loading={submitting} onChange={this.handleTableChange}  pagination={pagination} />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
