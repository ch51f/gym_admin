import React, {Component} from 'react';
import {List, Row, Col} from 'antd';

import {getDateStr, getPriceY} from '../../../utils/utils';


export default class Section extends Component {
  render() {
    const {record} = this.props;
    return (
      <div>
        <List
          dataSource={record}
          renderItem={(item, i) => (
            <List.Item>
              <Row style={{width: '100%'}}>
                <Col span={3}>卡类：{item.card_name}</Col>
                <Col span={3}>赠送：{item.gift_count}</Col>
                <Col span={3}>价格：{getPriceY(item.card_price)}</Col>
                <Col span={3}>会籍顾问：{item.worker_name}</Col>
                <Col span={4}>购买日期：{getDateStr(item.subscribe_time)}</Col>
                <Col span={8}>备注：{item.note}</Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    )
  }
}