import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, List, Button} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PAGE_SIZE, NOTICE_STATUS} from '../../config';
import {unix} from '../../utils/utils';

import style from './System.less';

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
	 handleListChange = (current, pageSize) => {
    this.query(current, pageSize);
  }
	//添加通知方法 
	addNotice = () => {
    this.props.history.push('/system/noticeAdd');
	}
	updateNotice = (item) => {
		this.props.dispatch({
			type: 'system/set',
			payload: {
				notice: item
			}
		});
    this.props.history.push('/system/noticeAdd');
	}
	render() {
		const {loading, notice_data} = this.props;
		const {list, pagination} = notice_data;
		console.log(list)
		const paginationProps = {
      ...pagination,
      onChange: this.handleListChange,
    }
		return (
			<PageHeaderLayout title="通知管理">
				<Card bordered={false}>
					<div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.addNotice()}>添加通知</Button>
          </div>
          <List 
          	className={style.noticeList}
          	itemLayout="vertical"
          	size="large"
          	rowKey="id"
          	loading={loading}
          	dataSource={list}
          	pagination={paginationProps}
          	renderItem = {item => (
          		<List.Item>
          			<div className={style.noticeItem}>
	          			<div className={style.noticeHd}>
	          				<img src={item.cover} />
	          			</div>
	          			<div className={style.noticeCon}>
	          				<div className={style.noticeTitle}>
		          				{item.title}
		          			</div>
		          			<div className={style.noticeFd}>
		          				<div className={style.noticeSub}>
		          					发布状态: {NOTICE_STATUS[item.status]}
		          				</div>
		          				<div className={style.noticeSub}>
		          					发布时间: {item.release_ts ? unix(item.release_ts, "YYYY-MM-DD HH:mm") : "-"}
		          				</div>
		          				<div className={style.noticeHandle}>
		          					{item.release_ts ? null :
		          					<a onClick={this.updateNotice.bind(this, item)}>编辑</a>
		          					}
		          				</div>
		          			</div>
	          			</div>
	          		</div>
          		</List.Item>
          	)}
          />
				</Card>
			</PageHeaderLayout>
		)
	}
}