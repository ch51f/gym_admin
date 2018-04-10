import React, {Component} from 'react';
import {connect} from 'dva';
import {Card, Form, Input, Button, Select, Radio, Icon, message} from 'antd';
import _ from 'lodash';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {CARD_UNIT, FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';
import styles from './System.less';

const FormItem = Form.Item;
const {Group} = Radio;
const {Option} = Select;
const {Search, Group: InputGroup} = Input;

@connect(({loading, gym}) => ({
  submitting: loading.effects['gym/TeacherForm'],

  card_config: gym.card_config,
  communities: gym.communities,
  income_levels: gym.income_levels,
  user_sources: gym.user_sources,
  cards: gym.cards,
  config_item_removes: gym.config_item_removes,
  card_removes: gym.card_removes,
}))
@Form.create()
export default class Page extends Component {
  state = {
    // 新增id --itemIdex
    itemIndex: -1,
    // 新增cardid --cardIndex
    cardIndex: -1,
    // 单位
    unit: '',

    flag: false,
  }
  componentWillMount() {
    this.queryGym();
  }
  // 查询健身房基础配置
  queryGym() {
    this.props.dispatch({
      type: 'gym/getGym',
      payload: {}
    });
  }
  // 保存配置
  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.flag) return false;
    let {form, dispatch, communities, income_levels, user_sources, cards, config_item_removes: item_removes, card_removes: item_card_removes} = this.props;
    let [config_item_communities, config_item_income_levels, config_item_user_sources, config_item_removes, card_names, card_units, card_amounts, card_removes] = [[], [], [], [], [], [], [], []];

    for(let i = 0, item; item = communities[i]; i++) {
      if(item.id < 0) {
        config_item_communities.push(item.item_name)
      }
    }
    for(let i = 0, item; item = income_levels[i]; i++) {
      if(item.id < 0) {
        config_item_income_levels.push(item.item_name)
      }
    }
    for(let i = 0, item; item = user_sources[i]; i++) {
      if(item.id < 0) {
        config_item_user_sources.push(item.item_name)
      }
    }
    for(let i = 0, item; item = item_removes[i]; i++) {
      if(item > 0) {
        config_item_removes.push(item)
      }
    }
    for(let i = 0, item; item = cards[i]; i++) {
      if(item.id < 0) {
        card_names.push(item.card_name)
        card_units.push(item.card_unit)
        card_amounts.push(item.amount)
      }
    }
    for(let i = 0, item; item = item_card_removes[i]; i++) {
      if(item > 0) {
        card_removes.push(item)
      }
    }


    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = {
          ...values,
        }
        if(config_item_communities.length > 0)
          params.config_item_communities = config_item_communities;
        if(config_item_income_levels.length > 0)
          params.config_item_income_levels = config_item_income_levels;
        if(config_item_user_sources.length > 0)
          params.config_item_user_sources = config_item_user_sources;
        if(config_item_removes.length > 0)
          params.config_item_removes = config_item_removes;
        if(card_names.length > 0)
          params.card_names = card_names;
        if(card_units.length > 0)
          params.card_units = card_units;
        if(card_amounts.length > 0)
          params.card_amounts = card_amounts;
        if(card_removes.length > 0)
          params.card_removes = card_removes;
        
        dispatch({
          type: 'gym/MemberForm',
          payload: params,
        });
      }
    });
  }
  // 添加卡类
  handleAddCard = (e) => {
    e.preventDefault();
    let {unit, cardIndex} = this.state;
    console.log(unit);
    let {card_name, amount} = this.refs;
    if(_.trim(card_name.input.value) == "") {
      message.error("卡类名字不能为空！")
      return false;
    }
    if(_.trim(amount.input.value) == "") {
      message.error("卡类数量不能为空！")
      return false;
    }
    if(_.trim(unit) === "") {
      message.error("卡类单位不能为空！")
      return false;
    }

    this.props.dispatch({
      type: 'gym/addCard',
      payload: {
        card: {
          id: cardIndex,
          card_name: card_name.input.value,
          amount: amount.input.value,
          card_unit: unit,
        }
      }
    })

    this.setState({cardIndex: cardIndex-1, unit: ''})
    card_name.input.value = '';
    amount.input.value = '';
  }
  // 添加配置
  handleAdd = (value, key) => {
    let {itemIndex} = this.state;
    let {dispatch} = this.props;
    let {communitie, income_level, user_source} = this.refs;
    if(_.trim(value) == '') {
      message.error('添加内容不能为空！');
      this.setState({flag: true})
      return false;
    }
    this.setState({flag: false})

    switch(key) {
      case 1:
        dispatch({
          type: 'gym/addCommunitie',
          payload: {
            communitie: {
              id: itemIndex,
              item_name: value,
            }
          }
        })
        this.setState({itemIndex: itemIndex-1})
        communitie.input.input.value = '';
        break;
      case 2:
        dispatch({
          type: 'gym/addIncome',
          payload: {
            income_level: {
              id: itemIndex,
              item_name: value,
            }
          }
        })
        this.setState({itemIndex: itemIndex-1})
        income_level.input.input.value = '';
        break;
      case 3:
        dispatch({
          type: 'gym/addSources',
          payload: {
            user_source: {
              id: itemIndex,
              item_name: value,
            }
          }
        })
        this.setState({itemIndex: itemIndex-1})
        user_source.input.input.value = '';
        break;
    }
  }

  // 删除配置
  handleRemove = (id, key) => {
    const {dispatch} = this.props;
    if(key == 'communities') {
      dispatch({
        type: 'gym/removeCommunitie',
        payload: {id}
      })
    } else if(key == 'income_levels') {
      dispatch({
        type: 'gym/removeIncome',
        payload: {id}
      })
    } else if(key == 'user_sources') {
      dispatch({
        type: 'gym/removeSources',
        payload: {id}
      })
    } else if(key == 'cards') {
      dispatch({
        type: 'gym/removeCard',
        payload: {id}
      })
    }
  }
  _renderItem(item, i, key) {
    return (
      <div key={`${key}_${i}`} className={styles.sysLabelItem}>{item.item_name}<Icon type="close" className={styles.sysLabelClose} onClick={this.handleRemove.bind(this, item.id, key)} /></div>
    )
  }
  _renderBox(data, key) {
    return (
      <div className={styles.sysLabelBox}>
        {data.map((item, i) => this._renderItem(item, i, key))}
      </div>
    )
  }
  _renderCardItem(item, i, key) {
    let unit = CARD_UNIT[item.card_unit] || "";
    return (
      <div key={`${key}_${i}`} className={styles.sysLabelItem}>{item.card_name}{item.amount}{unit}<Icon type="close" className={styles.sysLabelClose} onClick={this.handleRemove.bind(this, item.id, key)} /></div>
    )
  }
  _renderCardBox(data, key) {
    return (
      <div className={styles.sysLabelBox}>
        {data.map((item, i) => this._renderCardItem(item, i, key))}
      </div>
    )
  }
  render() {
    const {form, submitting, card_config, communities, income_levels, user_sources, cards} = this.props;
    const {getFieldDecorator} = form;

    return (
      <PageHeaderLayout title="会籍会员">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            {getFieldDecorator('system_config_id', {
              initialValue: card_config.id,
            })(
              <Input style={{display: 'none'}} />
            )}
            <FormItem {...FORM_ITEM_LAYOUT} label="开卡激活">
              {getFieldDecorator('open_card_type', {
                initialValue: parseInt(card_config.open_card_type || 0),
              })(
                <Group>
                  <Radio value={0}>以第一次刷卡开始算</Radio>
                  <Radio value={1}>以办卡日期开始算</Radio>
                </Group>
              )}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="小区划分" help="添加小区后即可统计各个小区/地方所占的比例">
              <Search ref="communitie" placeholder="输入小区名称" onSearch={value => this.handleAdd(value, 1)} enterButton="添加" />
              {communities.length>0?this._renderBox(communities,"communities"):null}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="会员来源" help="添加来源后即可统计用户都是从哪里来的">
              <Search ref="user_source" placeholder="输入收入划分"onSearch={value => this.handleAdd(value, 3)} enterButton="添加" />
              {user_sources.length>0?this._renderBox(user_sources,"user_sources"):null}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="收入等级" help="添加收入等级后即可统计用户的收入结构">
              <Search ref="income_level" placeholder="输入自定义来源"onSearch={value => this.handleAdd(value, 2)} enterButton="添加" />
              {income_levels.length>0?this._renderBox(income_levels,"income_levels"):null}
            </FormItem>
            <FormItem {...FORM_ITEM_LAYOUT} label="卡类配置">
              <div>
              <InputGroup compact>
                <Input placeholder="名称" ref="card_name" style={{ width: '20%' }} />
                <Input placeholder="数量" ref="amount" style={{ width: '20%' }} />
                <Select placeholder="单位" onSelect={(value) => this.setState({unit: value})} style={{ width: '20%' }}>
                  {CARD_UNIT.map((item, i) => {return(<Option value={i} key={`card_unit_${i}`}>{item}</Option>)})}
                </Select>
                <Button type="primary" onClick={this.handleAddCard.bind(this)}>
                  添加
                </Button>
              </InputGroup>
              </div>
              {cards.length>0?this._renderCardBox(cards,"cards"):null}
            </FormItem>
            <FormItem {...FORM_ITEM_BUTTON}>
              <Button type="primary" htmlType="submit" loading={submitting}>提交</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}