import React, {PureComponent} from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import NotFound from '../Exception/404';
import { getRoutes } from '../../utils/utils';
import styles from './Member.less';

const { Step } = Steps;

export default class Page extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'user': return 0;
      case 'card': return 1;
      default: return 0;
    }
  }
  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout title="添加会员">
        <Card bordered={false}>
          <div>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写会员信息" />
              <Step title="填写卡片信息" />
            </Steps>
            <Switch>
              {
                getRoutes(match.path, routerData).map(item => (
                  <Route
                    key={item.key}
                    path={item.path}
                    component={item.component}
                    exact={item.exact}
                  />
                ))
              }
              <Redirect exact from="/member/add" to="/member/add/user" />
              <Route render={NotFound} />
            </Switch>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}