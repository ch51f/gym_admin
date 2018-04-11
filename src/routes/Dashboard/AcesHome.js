import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Table, Icon} from 'antd';
import {PAGE_SIZE, USER_LESSON_TYPE} from '../../config';
import {unix, getDateStr} from '../../utils/utils';

import styles from './AcesHome.less';

@connect(({member, loading}) => ({
	loading: loading.effects['member/attend_list'],
	member_data: member.attend_data,
}))
export default class Home extends Component {
	state = {}

	componentDidMount() {
		this.query({
			date_begin: moment().format('YYYYMMDD'),
			date_end: moment().format('YYYYMMDD'),
		});
	}

	// 查询数据
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

	// 页码事件
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
						{val ? 
							<img src={val} height="80" width="80" /> 
							: 
							<Icon type="user" style={{fontSize: '80px', color: '#999'}} />
						}
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
			render: (val) => {
				return val && val > 0 ? getDateStr(val) : '-';
			}
		}, {
			title: '预约时间',
			dataIndex: 'create_ts',
			key: 'create_ts',
			render: (val) => {
				return val && val > 0 ? unix(val) : '-';
			}
		}, {
			title: '预约状态',
			dataIndex: 'status',
			key: 'status',
			render: (val) => {
				return USER_LESSON_TYPE[val];
			}
		}]
		return (
			<div className={styles.acesHome}>
				<h2>今日预约客服</h2>
				<div>
					<Table 
						rowKey={record => record.id} 
						dataSource={list} 
						columns={col} 
						loading={loading} 
						onChange={this.handleTableChange} 
						pagination={pagination}
					/>
				</div>
			</div>
		)
	}
}