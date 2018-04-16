import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Button} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getDateStr, strToTime} from '../../utils/utils';
import {MAIN_TAIN_STATUS} from '../../config';

@connect(({gym, loading}) => ({
	loading: loading.effects['gym/mt_list'],
	main_tains: gym.main_tains,
}))
export default class Page extends Component {
	state = {}
	componentWillMount() {
		this.query()
	}
	query() {
		this.props.dispatch({
			type: 'gym/mt_list',
			payload: {}
		})
	}
	addMainTain = () => {
		this.props.history.push('/gym/mainTainAdd');
	}
	done = (record) => {
		this.props.dispatch({
			type: 'gym/mt_done',
			payload: {item_id: record.id}
		})
	}
	cancel = (record) => {
		this.props.dispatch({
			type: 'gym/mt_cancle',
			payload: {item_id: record.id}
		})
	}
	render() {
		let {main_tains, loading} = this.props;
		
		const col = [{
			title: 'id',
			dataIndex: 'id',
			key: 'id',
		}, {
			title: '时间段类型',
			dataIndex: 'maintaining_type',
			key: 'maintaining_type',
			render: (val) => {
				if(val == 0) {
					return "小团体课"
				} else {
					return "其他"
				}
			}
		}, {
			title: '开始日期',
			dataIndex: 'date_begin',
			key: 'date_begin',
			render: (val) => {
				return val ? getDateStr(val) : '-';
			}
		}, {
			title: '开始时间',
			dataIndex: 'time_begin',
			key: 'time_begin',
			render: (val) => {
				return val ? strToTime(val) : '-';
			}
		}, {
			title: '结束日期',
			dataIndex: 'date_end',
			key: 'date_end',
			render: (val) => {
				return val ? getDateStr(val) : '-';
			}
		}, {
			title: '结束时间',
			dataIndex: 'time_end',
			key: 'time_end',
			render: (val) => {
				return val ? strToTime(val) : '-';
			}
		}, {
			title: '状态',
			dataIndex: 'status',
			key: 'status',
			render: (val) => {
				return MAIN_TAIN_STATUS[val];
			}
		}, {
			title: '创建时间',
			dataIndex: 'create_ts',
			key: 'create_ts',
		}, {
			title: '操作',
			render: (val, record) => (
				<Fragment> 
					<a href="javascript:;" onClick={() => this.cancel(record)}>取消</a> 
					<span style={{padding: "0 10px"}}>|</span>
					<a href="javascript:;" onClick={() => this.done(record)}>维护完成</a>
				</Fragment> 
			)
		}]

		return (
			<PageHeaderLayout title="系统维护记录">
				<Card bordered={false}>
					<div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
						<Button icon="plus" type="primary" onClick={() => this.addMainTain()}>新增维护</Button>
					</div>
					<div>
						<Table rowKey={record => record.id} dataSource={main_tains} columns={col} loading={loading} pagination={false} />
					</div>
				</Card>
			</PageHeaderLayout>
		)
	}
}