import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
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
  faCheckCircle,
  faTimesCircle,
  faColumns
} from '@fortawesome/free-solid-svg-icons';

library.add(faAdjust);
library.add(faAngleRight);
library.add(faAngleDoubleRight);
library.add(faAngleLeft);
library.add(faAngleDoubleLeft);
library.add(faCheckCircle);
library.add(faTimesCircle);
library.add(faColumns);

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/new" component={SalaryNew} />
        <Route exact path="/new/special" component={SalaryNewSpecial} />
        <Route exact path="/discounts" component={SalaryDiscounts} />
        <Route exact path="/reports" component={Reports} />
        <Route exact path="/new/discount" component={SalaryNewDiscount} />
        <Route exact path="/payments/:id" component={SalaryDetail} />
        <Route exact path="/payments/:id/edit/:index" component={SalaryEdit} />
        <Route exact path="/payments/:id/edit-special/:index" component={SalaryEditSpecial} />
      </Layout>
    );
  }
}
