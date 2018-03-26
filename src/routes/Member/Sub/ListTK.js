import React, {Component} from 'react';
import {connect} from 'dva';
import {List, Row, Col} from 'antd';
import moment from 'moment';

@connect(({loading, member}) =>({
}))
export default class Section extends Component {
  cancel(id) {
    const {user_id} = this.props;
    this.props.dispatch({
      type: 'member/calcle',
      payload: {
        item_id: user_id,
        pause_id: id
      }
    })
  }
  render() {
    const {record} = this.props;
    console.log(record)
    return (
      <div>
        <List
          dataSource={record}
          renderItem={(item, i) => (
            <List.Item>
              <Row style={{width: '100%'}}>
                <Col span={4}>停卡天数：{item.day_count}</Col>
                <Col span={4}>停卡时间：{moment(item.create_ts * 1000).format("YYYY-MM-DD")}</Col>
                <Col span={12}>备注：{item.note}</Col>
                <Col span={4} style={{display: (item.status  == 0) ? "block" : "none"}}><a href="javascript:;" onClick={this.cancel.bind(this, item.id)}>取消</a></Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    )
  }
}
