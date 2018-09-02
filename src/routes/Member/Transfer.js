import React, {Component} from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Card, Form, Select, Button, Col, Row, Alert} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({loading, member, worker}) => ({
  submitting: loading.effects['member/transfer'],

  worker_data: worker.worker_data,
  leave_worker_data: worker.leave_worker_data,
}))
@Form.create()
export default class Page extends Component {
  state = {}
  componentDidMount() {
    this.props.dispatch({
      type: 'worker/getWorkerList',
      payload: {
        // department: 0
      }
    });
    // this.props.dispatch({
    //   type: 'manage/getLeaveWorkerList',
    //   payload: {}
    // });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      if(!err) {
        let params = {
          worker_id_src: values.worker_id_src
        };
        if(values.worker_id_dist.indexOf(-1) != -1) {
          params.to_all = 1;
        } else {
          params.worker_id_dist = values.worker_id_dist;
        }
        this.props.dispatch({
          type: 'member/transfer',
          payload: {
            ...params
          }
        })
      }
    })
  }
  render() {
    const {worker_data, leave_worker_data, submitting, form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <PageHeaderLayout title="会员转移">
      	<Card bordered={false}>
      		<Form onSubmit={this.handleSubmit}>
      			<Row>
      				<Col span="4">
      					<FormItem>
                  {getFieldDecorator('worker_id_src', {
                    rules: [{
                      required: true, message: '请选择被转顾问'
                    }]
                  })(
                    <Select placeholder="选择顾问">
                      {worker_data.list.map((item, i) => {return (<Option key={`worker_${i}`} value={item.id}>{item.worker_name}</Option>)})}
                    </Select>
                  )}
      					</FormItem>
      				</Col>
      				<Col span="3">
      					<div style={{'lineHeight': '30px', 'padding': '3px 10px', 'textAlign': 'center'}}>转移给</div>
      				</Col>
      				<Col span="13">
      					<FormItem>
                  {getFieldDecorator('worker_id_dist', {
                    rules: [{
                      required: true, message: '请选择目标顾问'
                    }]
                  })(
        						<Select mode="multiple" placeholder="选择顾问">
                      <Option value={-1}>随机分配给全部顾问</Option>
                      {worker_data.list.map((item, i) => {return (<Option key={`new_${i}`} value={item.id}>{item.worker_name}</Option>)})}
  	                </Select>
                  )}
      					</FormItem>
      				</Col>
      			</Row>
      			<Row>
      				<Col span="24">
      					<FormItem>
      						<Button type="primary" htmlType="submit" loading={submitting}>开始转移</Button>
      					</FormItem>
                <Alert message="当某位会籍顾问离职的时候，可以将该顾问下面的会员转移给其他在职顾问，选择随机分配给全部顾问，选择其他顾问无效" type="warning" showIcon />
      				</Col>
      			</Row>
      		</Form>
      	</Card>
      </PageHeaderLayout>
    )
  }
}