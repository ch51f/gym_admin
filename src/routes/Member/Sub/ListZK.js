import React, {Component} from 'react';
import {List, Row, Col} from 'antd';
import moment from 'moment';

export default class Section extends Component {
  render() {
    const {record} = this.props;
    return (
      <div>
        <List
          dataSource={record}
          renderItem={(item, i) => (
            <List.Item>
              {item.user_name}于{moment(item.create_ts * 1000).format("YYYY-MM-DD")}转给{item.to_user_name}
            </List.Item>
          )}
        />
      </div>
    )
  }
}