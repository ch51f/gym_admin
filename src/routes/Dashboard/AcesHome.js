import React, {Component} from 'react';
import {connect} from 'dva';
import {Table} from 'antd';

@connect(({}) => ({

}))
export default class Home extends Component {
	handleTableChange = (pagination, filters, sorter) => {
	    let {current, pageSize} = pagination;
	    this.query({}, current, pageSize);
	 }

	render() {
		const col = [{
			title: '客户头像',
			dataIndex: 'img',
			key: 'img',
		}, {
			title: '客户名字',
			dataIndex: 'name',
			key: 'name',
		}, {
			title: '预约课程',
			dataIndex: 'kc',
			key: 'kc',
		}, {
			title: '预约教练',
			dataIndex: 'jl',
			key: 'jl',
		}, {
			title: '上课时间',
			dataIndex: 'time',
			key: 'time',
		}, {
			title: '预约时间',
			dataIndex: 'time1',
			key: 'time1',
		}, {
			title: '预约状态',
			dataIndex: 'status',
			key: 'status',
		}]
		let loading = true;
		return (
			<div>
				<h2>今日预约客服</h2>
				<div>
					<Table rowKey={record => record.id} dataSource={[]} columns={col} loading={loading} onChange={this.handleTableChange} />
				</div>
			</div>
		)
	}
}