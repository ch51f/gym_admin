import React, {Component} from 'react';
import {List, Row, Col} from 'antd';
import moment from 'moment';

export default class Section extends Component {
  render() {
    const {logs} = this.props;
    return (
      <div>
        <List
          dataSource={logs}
          renderItem={(item, i) => (
            <List.Item>
              <Row style={{width: '100%'}}>
                <Col span={10}>私人教练：{item.worker_name}</Col>
                <Col span={14}>{item.create_ts}</Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    )
  }
}