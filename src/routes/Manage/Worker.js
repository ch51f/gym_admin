import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button, Tooltip, Form, Row, Col, Select} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {WORKER_TYPE, DEPARTMENT} from '../../config';
import {getDateStr} from '../../utils/utils';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({manage, loading}) => ({
  loading: loading.effects['manage/getWorkerList'],

	worker_data: manage.worker_data,
}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
		this.query();
	}
  // 查询
  query(params = {}) {
    this.props.dispatch({
      type: 'manage/getWorkerList',
      payload: {
        ...params
      }
    })
  }
  // 跳转到编辑或新增
  goAddWorker = (flag = 0, record = {}) => {
    let {dispatch, history} = this.props;
    dispatch({
      type: 'manage/setWorker',
      payload: record,
    })
  	history.push('/manage/addWorker');
  }
  // 跳转到离职员工列表
  goLeaveWorker = () => {
    this.props.history.push('/manage/leaveWorker');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err) {
        let params = {}
        if(values.department) params.department = values.department;
        this.query(params)
      }
    })
  }

  handleReset = (e) => {
    this.props.form.resetFields();
    this.query();
  }

	render() {
		const {loading, worker_data} = this.props;
		const {list} = worker_data;
    const {getFieldDecorator} = this.props.form;
		const columns = [
			{
				title: '姓名',
				dataIndex: 'worker_name',
			}, {
				title: '性别',
				dataIndex: 'gender',
        render(val) {
          return val == 'm' ? '男' : '女'
        }
			}, {
				title: '电话',
				dataIndex: 'tel',
			}, {
				title: '生日',
				dataIndex: 'birthday',
        render(val) {
          return val ? getDateStr(val) : "-";
        }
			}, {
				title: '部门',
				dataIndex: 'department',
				render(val) {
					return DEPARTMENT[val]
				}
			}, {
				title: '角色',
				dataIndex: 'worker_type',
				render(val) {
					let temp = val == 99 ? 3 : val;
					return WORKER_TYPE[temp];
				}
			}, {
				title: '简介',
				dataIndex: 'desc',
        render(val) {
          let text =  (val && val.length > 20) ? (val.slice(0, 20) + "...") : val;
          return (<Tooltip title={val}>{text}</Tooltip>)
        }
			}, {
				title: '操作',
				render: (val, record) => (
					<Fragment>
						<a href="javascript:;" onClick={() => this.goAddWorker(1, record)}>编辑</a>
					</Fragment>
				)
			},
		];

    const f_i_l = {
      labelCol: {span: 4},
      wrapperCol: {span: 6},
    }

		return (
      <PageHeaderLayout title="员工管理">
      	<Card bordered={false}>
          <Form layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem {...f_i_l} label="部门">
              {getFieldDecorator('department')(
                <Select placeholder="部门">
                  <Option key={0}>销售部</Option>
                  <Option key={1}>教练部</Option>
                </Select>
              )}
            </FormItem>
            <FormItem style={{'textAlign': 'right'}}>
              <Button icon="plus" type="primary" onClick={() => this.goAddWorker()}>
                新建
              </Button>
              <Button style={{'marginLeft': '20px'}} type="primary" onClick={() => this.goLeaveWorker()}>
                查看已离职员工
              </Button>
              <Button style={{'marginLeft': '20px'}} type="primary" htmlType="submit">搜索</Button>
              <Button style={{marginLeft: 20}} onClick={this.handleReset}>重置</Button>
            </FormItem>
          </Form>

      		<div>
      			<Table
      				loading={loading}
      				rowKey={record => record.id}
      				dataSource={list}
      				columns={columns}
              pagination={false}
      			/>
      		</div>
      	</Card>
      </PageHeaderLayout>
		)
	}
}