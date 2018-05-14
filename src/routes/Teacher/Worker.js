import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button, Tooltip} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {WORKER_TYPE, DEPARTMENT} from '../../config';
import {getDateStr} from '../../utils/utils';

@connect(({worker, loading}) => ({
  loading: loading.effects['worker/getWorkerList'],

  worker_data: worker.worker_data,
}))
export default class Page extends Component {
  state = {}
  componentWillMount() {
    this.query();
  }
  query(params = {}) {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {
        department: 1,
        ...params
      }
    })
  }
  // 跳转到编辑或新增
  goAddWorker = (record = {}) => {
    let {dispatch, history} = this.props;
    if(record.teacher_type) {
      let arr = record.teacher_type.split("");
      if(arr.length > 2) {
        record.is_private_teacher = arr[arr.length - 1];
        record.is_group_teacher = arr[arr.length - 2];
      }
    }
    console.log(record)
    dispatch({
      type: 'worker/set',
      payload: {worker: record},
    })
    history.push('/teacher/workerAdd');
  }
  render() {
    const {loading, worker_data} = this.props;
    const {list} = worker_data;
    console.log(list)
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
          return val ? getDateStr(val) : "-";
        }
      }, {
        title: '教练类型',
        dataIndex: 'teacher_type',
        render(val) {
          let arr = val.split("");
          let res = [];
          if(arr.length > 2) {
            if(arr[arr.length - 1] == 1) res.push("私人教练");
            if(arr[arr.length - 2] == 1) res.push("小团体教练");
          }
          return res.join(",") || "-";
        }
      }, {
        title: '简介',
        dataIndex: 'desc',
        render(val) {
          let text =  (val && val.length > 20) ? (val.slice(0, 20) + "...") : val;
          return (<Tooltip title={val}>{text}</Tooltip>)
        }
      }, {
        title: '操作',
        render: (val, record) => (
          <Fragment>
            <a href="javascript:;" onClick={() => this.goAddWorker(record)}>编辑</a>
          </Fragment>
        )
      },
    ];
    return (
      <PageHeaderLayout title="教练管理">
        <Card bordered={false}>
          <div style={{'marginBottom': '20px', 'textAlign': 'right'}}>
            <Button icon="plus" type="primary" onClick={() => this.goAddWorker()}>添加教练</Button>
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