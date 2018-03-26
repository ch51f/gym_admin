import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Table} from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {PAGE_SIZE, NOTICE_STATUS} from '../../config';

@connect(({manage, loading}) =>({
  loading: loading.effects['manage/getReleaseNoticeList'],

  release_notice_data: manage.release_notice_data,
}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
    this.query()
  }
  // 查询列表
  query(target_page = 1, page_size = PAGE_SIZE) {
    this.props.dispatch({
      type: 'manage/getReleaseNoticeList',
      payload: {
        target_page,
        page_size,
      }
    })
  }
  // 页面跳转
  handleTableChange = (pagination, filters, sorter) => {
    // console.log(pagination, filters, sorter);
    let {current, pageSize} = pagination;
    this.query(current, pageSize);
  }
  render() {
    const {loading, release_notice_data} = this.props;
    const {list, pagination} = release_notice_data;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
      }, {
        title: '通知状态',
        dataIndex: 'status',
        render(val) {
          return NOTICE_STATUS[val]
        }
      }, {
        title: '创建时间',
        dataIndex: 'create_ts',
        render(val) {
          return moment(val * 1000).format('YYYY-MM-DD')
        }
      }, {
        title: '发布时间',
        dataIndex: 'release_ts',
        render(val) {
          return val ? moment(val * 1000).format('YYYY-MM-DD') : "未知"
        }
      }
    ];

    return (
      <PageHeaderLayout title="已发布通知">
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}