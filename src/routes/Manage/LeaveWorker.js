import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Tooltip} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {WORKER_TYPE, DEPARTMENT} from '../../config';
import {getDateStr} from '../../utils/utils';

@connect(({manage, loading}) => ({
  loading: loading.effects['manage/getLeaveWorkerList'],

  leave_worker_data: manage.leave_worker_data,
}))
export default class Page extends Component {
  state = {}
  componentDidMount() {
    this.query();
  }
  // 查询
  query() {
    this.props.dispatch({
      type: 'manage/getLeaveWorkerList',
      payload: {}
    })
  }
  render() {
    const {loading, leave_worker_data} = this.props;
    const {list} = leave_worker_data;
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
          return getDateStr(val);
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
          return WORKER_TYPE[temp]
        }
      }, {
        title: '简介',
        dataIndex: 'desc',
        render(val) {
          let text = val.length > 20 ? (val.slice(0, 20) + "...") : val;
          return (<Tooltip title={val}>{text}</Tooltip>)
        }
      }, 
    ];

    return (
      <PageHeaderLayout title="离职员工">
        <Card bordered={false}>
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