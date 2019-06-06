import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './pages/Layout';
import { SalaryControl } from './pages/SalaryControl';
import { SalaryDetail } from './pages/SalaryDetail';
import { SalaryNew } from './pages/SalaryNew';
import { SalaryNewSpecial } from './pages/SalaryNewSpecial';
import { SalaryDiscounts } from './pages/SalaryDiscounts';
import { SalaryNewDiscount } from './pages/SalaryNewDiscount';
import { SalaryEdit } from './pages/SalaryEdit';
import { SalaryEditSpecial } from './pages/SalaryEditSpecial';
import { Reports } from './pages/Reports';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAdjust,
  faAngleDoubleRight,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleLeft,
  faCog,
  faCheckCircle,
  faTimesCircle,
  faColumns,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons';

library.add(faAdjust);
library.add(faCog);
library.add(faAngleRight);
library.add(faAngleDoubleRight);
library.add(faAngleLeft);
library.add(faAngleDoubleLeft);
library.add(faCheckCircle);
library.add(faTimesCircle);
library.add(faColumns);
library.add(faClipboardList);

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={SalaryControl} />
        <Route exact path="/new" component={SalaryNew} />
        <Route exact path="/new-special" component={SalaryNewSpecial} />
        <Route exact path="/discounts" component={SalaryDiscounts} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/new-discount" component={SalaryNewDiscount} />
        <Route exact path="/payments/:id" component={SalaryDetail} />
        <Route exact path="/payments/:id/edit/:index" component={SalaryEdit} />
        <Route
          exact
          path="/payments/:id/edit-special/:index"
          component={SalaryEditSpecial}
        />
      </Layout>
    );
  }
}
