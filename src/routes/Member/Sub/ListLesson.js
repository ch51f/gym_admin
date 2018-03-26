import React, {Component} from 'react';
import {List, Row, Col} from 'antd';
import moment from 'moment';

import {getPriceY} from '../../../utils/utils';


export default class Section extends Component {
  render() {
    const {lesson} = this.props;
    return (
      <div>
        <List
          dataSource={lesson}
          renderItem={(item, i) => (
            <List.Item>
              <Row style={{width: '100%'}}>
                <Col span={6}>私人教练：{item.worker_name}</Col>
                <Col span={3}>价格：{getPriceY(item.lesson_price)}</Col>
                <Col span={3}>课程：{item.count_count}次</Col>
                <Col span={3}>赠送：{item.count_gift}次</Col>
                <Col span={3}>剩余节数：{}</Col>
                <Col span={6}>购买日期：{moment(item.create_ts * 1000).format('YYYY-MM-DD')}</Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    )
  }
}