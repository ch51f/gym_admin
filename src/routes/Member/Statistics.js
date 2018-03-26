import React, {PureComponent} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card, Row, Col} from 'antd';
import { Pie, yuan } from '../../components/Charts';

@connect(({member, loading}) => ({
  loading: loading.effects['member/statistics'],

  statistics: member.statistics,
}))
export default class Page extends PureComponent {
  state = {}
  componentDidMount() {
    this.query();
  }
  query() {
    const {dispatch} = this.props;
    dispatch({
      type: 'member/statistics',
      payload: {}
    })
  }
  getDate(data = [], type = 1) {
    let res = [];
    if(type == 1) {
      for(let i = 0, item; item = data[i]; i++) {
        res.push({
          x: item.name,
          y: item.count,
        })
      }
    } else if(type == 2) {
      for(let i = 0, item; item = data[i]; i++) {
        res.push({
          x: item.age || '未知',
          y: item.count,
        })
      }
    }
    return res;
  }
  render() {
    const {statistics} = this.props;
    if(!statistics.user_count) {
      return (
        <PageHeaderLayout title="会员统计">
          <Card bordered={false}>
          </Card>
        </PageHeaderLayout>
      )
    }
    const {week_checkin_count, user_count, source_count, renew_count, income_count, gender_count, comunity_count, age_count} = statistics;
    const user_data = [{
      x: '总会员数量',
      y: user_count.user_count,
    }, {
      x: '购卡会员数量',
      y: user_count.subscribe_count,
    }, {
      x: '卡有效会员数量',
      y: user_count.available_count,
    }]
    const gender_data = [{
      x: '女性会员数量',
      y: gender_count.f_count,
    }, {
      x: '男性会员数量',
      y: gender_count.m_count,
    }, {
      x: '总会员数量',
      y: gender_count.t_count,
    }]
    const comunity_data = this.getDate(comunity_count);
    const income_data = this.getDate(income_count);
    const source_data = this.getDate(source_count);
    const age_data = this.getDate(age_count, 2);
    return (
      <PageHeaderLayout title="会员统计">
      	<Card bordered={false}>
      		<div>
            <h4>基础统计</h4>
            <p>本周签到会员数<span style={{color: '#f50', fontSize: '24px'}}>{week_checkin_count}</span></p>
      			<p>续卡会员数量<span style={{color: '#f50', fontSize: '24px'}}>{renew_count}</span></p>
      		</div>
      		<Row>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="会员数量"
                subTitle="会员数量信息"
                total={user_data.reduce((pre, now) => now.y + pre, 0)}
                data={user_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="性别数量"
                subTitle="性别数量信息"
                total={gender_data.reduce((pre, now) => now.y + pre, 0)}
                data={gender_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="小区统计"
                subTitle="小区统计"
                total={comunity_data.reduce((pre, now) => now.y + pre, 0)}
                data={comunity_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="收入等级"
                subTitle="收入等级"
                total={income_data.reduce((pre, now) => now.y + pre, 0)}
                data={income_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="会员来源"
                subTitle="会员来源"
                total={source_data.reduce((pre, now) => now.y + pre, 0)}
                data={source_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
            <Col span={24} style={{margin: '30px 0'}}>
              <Pie
                hasLegend
                title="会员年龄"
                total={age_data.reduce((pre, now) => now.y + pre, 0)}
                subTitle="会员年龄"
                data={age_data}
                valueFormat={val => val}
                height={294}
              />
            </Col>
      		</Row>
      	</Card>
      </PageHeaderLayout>
    )
  }
}