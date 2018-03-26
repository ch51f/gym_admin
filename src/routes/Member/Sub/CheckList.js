import React, {Component} from 'react';
import {List} from 'antd';
import moment from 'moment';

export default class Section extends Component {
	render() {
		let {data} = this.props;
		return (
			<List 
				dataSource={data}
				renderItem={(item, i) => (
					<List.Item>
						{moment(item.create_ts * 1000).format("YYYY年MM月DD日 hh:mm")}
					</List.Item>
				)}
			/>
		)
	}
}