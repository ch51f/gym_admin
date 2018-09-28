import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import {Card, Table, Icon, Button} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {LESSON_STATUS, DAY_OF_WEEK} from '../../config';
import {getTimeStr} from '../../utils/utils';

@connect(({groupLesson, loading}) => ({
  loading: loading.effects['groupLesson/getLessonList'],

	lesson_data: groupLesson.lesson_data,
}))
export default class Page extends Component {
  state = {}
	componentWillMount() {
    this.query();
	}
  // 查询课程列表
  query() {
    this.props.dispatch({
      type: 'groupLesson/getLessonList',
      payload: {}
    })
  }
  // 新增，编辑
  goAddLesson = (record = {}) => {
    let {dispatch, history} = this.props;
    dispatch({
      type: 'groupLesson/setLesson',
      payload: record,
    })
  	history.push('/teacher/addLesson')
  }
	render() {
		const {loading, lesson_data} = this.props;
		const {list} = lesson_data;
		const columns = [
			{
				title: '课程配图',
        width: '100px',
				dataIndex: 'lesson_cover',
        render(val) {
          if(val) {
            return (<img src={val} height={80} width={80} />)
          } else {
            return (<Icon type="picture" style={{fontSize: '80px'}} />)
          }

        }
			}, {
				title: '课程名称',
				dataIndex: 'lesson_name'
			}, {
				title: '日期',
        width: '100px',
				dataIndex: 'day_of_week',
        render(val) {
          return DAY_OF_WEEK[val];
        }
			}, {
				title: '时间',
        width: '100px',
				dataIndex: 'begin_time',
        render(val) {
          return getTimeStr(val);
        }
			}, {
				title: '老师',
        width: '100px',
				dataIndex: 'teacher_name'
			}, {
				title: '课程状态',
        width: '100px',
				dataIndex: 'status',
				render(val) {
					return LESSON_STATUS[val];
				}
			}, {
				title: '操作',
        width: '100px',
				render: (val, record) => (
					<Fragment>
						<a href="javascript:;" onClick={() => this.goAddLesson(record)}>编辑</a>
					</Fragment>
				)
			},
		];

		return (
      <PageHeaderLayout title="操课管理">
      	<Card bordered={false}>
      		<div style={{'marginBottom': '20px'}}>
      			<Button icon="plus" type="primary" onClick={() => this.goAddLesson()}>新建</Button>
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
