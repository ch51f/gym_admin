import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Table, Icon, AutoComplete, Input} from 'antd';
import {PAGE_SIZE, USER_LESSON_TYPE, DAY_OF_WEEK_1} from '../../config';
import {unix, getDateStr, getTimeStr, setMoment, format} from '../../utils/utils';

import styles from './AcesHome.less';

const {Search} = Input;
const {Option} = AutoComplete;

@connect(({member, loading}) => ({
	loading: loading.effects['member/attend_list'],
	member_data: member.attend_data,

  	checkIn_list: member.checkIn_list,
  	homeActive: member.homeActive,
	homeCheckIn: member.homeCheckIn,
}))
export default class Home extends Component {
	state = {}

	componentDidMount() {
		this.query({
			date_begin: moment().format('YYYYMMDD'),
			date_end: moment().add(7, 'days').format('YYYYMMDD'),
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
		let params = {
			date_begin: moment().format('YYYYMMDD'),
			date_end: moment().add(7, 'days').format('YYYYMMDD'),
		}
		this.query(params, current, pageSize);
	}

	_search(val) {
	    let {panel} = this.refs;
	    let input = panel.querySelector('input');
	    const {dispatch} = this.props;
	    const {user_id} = this.state;
	    // console.log(user_id)
	    if(user_id < 0) {
	      dispatch({
	        type: 'member/checkIn',
	        payload: {
	          code: val,
	        }
	      })
	    } else {
	      dispatch({
	        type: 'member/checkIn',
	        payload: {
	          code: user_id,
	        }
	      })
	      this.setState({user_id: -1})
	    }
	    setTimeout(function() {
	      input.value = '';
	    }, 500)
	}

	// auto数据选择
	onSelect = (value) => {
		console.log('onSelect');
	    const {checkIn_list} = this.props;
	    for(let i = 0, item; item = checkIn_list[i]; i++) {
	      if(value == item.id) {
	        this.setState({user_id: item.card_id})
	        this.props.dispatch({
	          type: 'member/setData',
	          payload: {
	            checkIn_list: []
	          }
	        })
	      }
	    }
	}
	  // auto数据搜索
	handleSearch = (value) => {
		console.log('handleSearch');
	    this.setState({user_id: -1})
	    this.props.dispatch({
	      type: 'member/setData',
	      payload: {
	        checkIn_list: []
	      }
	    })
	    return false;
	    if(value == "") return false;
	    this.props.dispatch({
	      type: 'member/checkIn',
	      payload: {
	        code: value
	      }
	    })
	}
	  // 渲染auto Option
	renderOption(item) {
	    const {id, user_name} = item;
	    return (
	      <Option key={id} text={id}>{user_name}</Option>
	    );
	}

	render() {
		const {loading, member_data, homeCheckIn, homeActive, checkIn_list} = this.props;
		const {list, pagination} = member_data;

		const {list: checkList, count} = homeCheckIn;

		const member = checkList.length > 0 ? checkList[homeActive] : {};
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
		}, 
		{
			title: '上课时间', 
			dataIndex: 'lesson_type', 
			key: 'lesson_type', 
			render: (val, record) => {
				if(val == 2) {
					return format(setMoment(record.date_begin)) + " 至 " + format(setMoment(record.date_end)) + "的" + DAY_OF_WEEK_1[record.day_of_week] + "的" + getTimeStr(record.time_begin) + "-" + getTimeStr(record.time_end); 
				} else {
					return format(setMoment(record.date)) + " " + DAY_OF_WEEK_1[record.day_of_week] + "的" + getTimeStr(record.time_begin) + "-" + getTimeStr(record.time_end); 
				} 
				// return val && val > 0 ? getDateStr(val) : '-';time_begin 
				// return val ? getTimeStr(val) + "-" + getTimeStr(record.time_end) : '-'
			} 
		}, {
			title: '预约时间', 
			dataIndex: 'create_ts', 
			key: 'create_ts', 
			render(val) {
				return val ? moment(val * 1000).format('YYYY-MM-DD') : "-"
			} 
		},
		// {
		// 	title: '上课时间',
		// 	dataIndex: 'time_begin',
		// 	key: 'time_begin',
		// 	render: (val, record) => {
		// 		// return val
		// 		return val ? getTimeStr(val) + "-" + getTimeStr(record.time_end) : '-'
		// 		// return val && val > 0 ? getDateStr(val) : '-';
		// 	}
		// }, {
		// 	title: '预约时间',
		// 	dataIndex: 'lesson_type',
		// 	key: 'lesson_type',
		// 	render: (val, record) => {
		// 		if(val == 2) {
		// 			return format(setMoment(record.date_begin)) + " 至 " + format(setMoment(record.date_end))
		// 		} else {
		// 			return format(setMoment(record.date))
		// 		}
		// 		// return val && val > 0 ? unix(val) : '-';
		// 	}
		// }, 
		{
			title: '预约状态',
			dataIndex: 'status',
			key: 'status',
			render: (val) => {
				return USER_LESSON_TYPE[val];
			}
		}]
		return (
			<div ref="panel" className={styles.acesHome}>
				<AutoComplete className={styles.homeSearch} dataSource={checkIn_list.map(this.renderOption.bind(this))} onSelect={this.onSelect.bind(this)} onSearch={this.handleSearch} >
		          	<Search placeholder="输入会员卡号、电话、名字" enterButton="快速签到" onSearch={(value) => this._search(value)} />
		        </AutoComplete>
				<h2>7天内预约的客户</h2>
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