import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button, Tooltip} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {ASK_LEAVE_REASON} from '../../config';
import {getDateStr} from '../../utils/utils';

@connect(({worker, loading}) => ({
  loading: loading.effects['worker/leave_list'],
  leave_list: worker.leave_list,
}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
    this.query();
  }
  query() {
    this.props.dispatch({
      type: 'worker/leave_list',
      payload: {}
    })
  }
  cancel(id) {
    this.props.dispatch({
      type: 'worker/leave_cancle',
      payload: {
        item_id: id
      }
    })
  }
  goAddLeave() {
    let {history} = this.props;
    history.push('/teacher/askLeaveAdd');
  }
  render() {
    let {loading, leave_list} = this.props;
    const columns = [
      {
        title: '请假教练',
        dataIndex: 'worker_name',
      }, {
        title: '请假日期',
        dataIndex: 'date_begin',
        render: (val, record) => {
          if(val == record.date_end) {
            return getDateStr(record.date_end);
          } else {
            return val + " - " + record.date_end;
          }
        }
      }, {
        title: '请假时间',
        dataIndex: 'time_begin',
        render: (val, record) => {
          if(val == record.time_end) {
            return record.time_end;
          } else if(val == 0 && record.time_end) {
            return "全天";
          } else {
            return val + " - " + record.time_end;
          }
        }
      }, {
        title: '请假原因',
        dataIndex: 'reason_type',
        render: (val) => {
          return ASK_LEAVE_REASON[val];
        }
      }, {
        title: '备注',
        dataIndex: 'note',
        render(val) {
          let text =  (val && val.length > 20) ? (val.slice(0, 20) + "...") : val;
          return (<Tooltip title={val}>{text}</Tooltip>)
        }
      }, {
        title: '操作',
        dataIndex: 'status',
        render: (val, record) => (
          <Fragment>
            {val == 0 ?
            <a href="javascript:;" onClick={() => this.cancel(record.id)}>取消</a>
            :
            <a href="javascript:;" style={{color: '#666'}}>已取消</a>
            }
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
              dataSource={leave_list}
              columns={columns}
              pagination={false}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}