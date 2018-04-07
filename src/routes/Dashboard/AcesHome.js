import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Table} from 'antd';
import {PAGE_SIZE} from '../../config';

@connect(({member, loading}) => ({
  loading: loading.effects['member/attend_list'],
  member_data: member.attend_data,
}))
export default class Home extends Component {
  state = {}

  componentDidMount() {
    this.query();
  }

  query(params = {}, target_page=1, page_size = PAGE_SIZE) {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/attend_list',
      payload: {
        ...params,
        target_page,
        page_size,
      }
    })
  }


	handleTableChange = (pagination, filters, sorter) => {
	    let {current, pageSize} = pagination;
	    this.query({}, current, pageSize);
	 }

	render() {
    const {loading, member_data} = this.props;
    const {list, pagination} = member_data;
		const col = [{
			title: '客户头像',
			dataIndex: 'avatar',
			key: 'avatar',
			render: (val, record) => {
				return (
		          <Fragment>
		            <img src={val} />
		          </Fragment>
		        )
			}
		}, {
			title: '客户名字',
			dataIndex: 'user_name',
			key: 'user_name',
		}, {
			title: '预约课程',
			dataIndex: 'lesson_name',
			key: 'lesson_name',
		}, {
			title: '预约教练',
			dataIndex: 'teacher_name',
			key: 'teacher_name',
		}, {
			title: '上课时间',
			dataIndex: 'date',
			key: 'date',
		}, {
			title: '预约时间',
			dataIndex: 'create_ts',
			key: 'create_ts',
		}, {
			title: '预约状态',
			dataIndex: 'status',
			key: 'status',
		}]
		return (
			<div>
				<h2>今日预约客服</h2>
				<div>
					<Table rowKey={record => record.id} dataSource={list} columns={col} loading={loading} onChange={this.handleTableChange} />
				</div>
			</div>
		)
	}
}