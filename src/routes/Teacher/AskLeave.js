import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button, Tooltip} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({worker, loading}) => ({

}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
    this.query();
  }
  query() {

  }
  cancel() {

  }
  goAddLeave() {
    let {history} = this.props;
    history.push('/teacher/askLeaveAdd');
  }
  render() {
    let loading = true;
    let list = [];
    const columns = [
      {
        title: '请假教练',
        dataIndex: 'worker_name',
      }, {
        title: '请假日期',
        dataIndex: 'date',
      }, {
        title: '请假时间',
        dataIndex: 'time',
      }, {
        title: '请假原因',
        dataIndex: 'reason',
      }, {
        title: '备注',
        dataIndex: 'note',
      }, {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a href="javascript:;" onClick={() => this.cancel(record)}>取消</a>
          </Fragment>
        )
      },
    ];
    return (
      <PageHeaderLayout title="教练请假管理">
        <Card bordered={false}>
          <div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.goAddLeave()}>添加请假</Button>
          </div>
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