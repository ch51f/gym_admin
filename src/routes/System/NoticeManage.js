import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, List, Button} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PAGE_SIZE, NOTICE_STATUS} from '../../config';
import ReactQuill from 'react-quill';

@connect(({system, loading}) => ({
	loading: loading.effects['system/getNoticeList'],

	notice_data: system.notice_data,
}))
export default class Page extends Component {
	state = {}
	componentWillMount() {
		this.query()
	}
	// 查询通知列表
	query(target_page = 1, page_size = PAGE_SIZE) {
		this.props.dispatch({
			type: 'system/getNoticeList',
			payload: {
				target_page,
				page_size,
			}
		})
	}
	//添加通知方法 
	addNotice = () => {
    this.props.history.push('/system/noticeAdd');
	}
	render() {
		const {loading, notice_data} = this.props;
		console.log(notice_data)
		return (
			<PageHeaderLayout title="通知管理">
				<Card bordered={false}>
					<div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.addNotice()}>添加通知</Button>
          </div>
          <div>
          	list
          </div>
				</Card>
			</PageHeaderLayout>
		)
	}
}