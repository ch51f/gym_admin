import React, {Component} from 'react';
import {connect} from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card, Form, Input, Radio, AutoComplete, Button, Select, InputNumber} from 'antd';
import {FORM_ITEM_LAYOUT, FORM_ITEM_BUTTON} from '../../config';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const {TextArea } = Input;
const {Option} = Select;