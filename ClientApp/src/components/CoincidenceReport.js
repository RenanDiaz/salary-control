import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import api from '../api';
import PageLoading from './PageLoading';
import PageError from './PageError';
import NumberFormat from 'react-number-format';

class CoincidenceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: undefined,
      noMatch: undefined,
      matchSelected: true,
      loading: true,
      error: null
    };

    this.monthlyPayments = undefined;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      this.monthlyPayments = await api.monthlyPayments.list();
      const payments = [];
      for (const monthlyPayment of this.monthlyPayments) {
        for (const payment of monthlyPayment.payments) {
          payments.push({ ...payment, month: monthlyPayment.month, year: monthlyPayment.year });
        }
      }
      const match = payments.filter(payment => payment.matches);
      const noMatch = payments.filter(payment => !payment.matches);
      this.setState({ loading: false, match, noMatch });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleRadioChange = () => {
    const matchSelected = !this.state.matchSelected;
    this.setState({ matchSelected });
  };

  tableBody = (payment, index) => {
    return (
      <tr className="text-right" key={index}>
        <td>{payment.month}</td>
        <td>{payment.year}</td>
        <td className="text-left">{payment.description}</td>
        <td>
          <NumberFormat
            value={payment.grossPay}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={payment.grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={payment.totalDiscounts}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={payment.totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={payment.netPay}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={payment.netPay > 0}
          />
        </td>
      </tr>
    );
  };

  render() {
    if (this.state.loading && !this.monthlyPayments) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }

    const selected = this.state.matchSelected ? this.state.match : this.state.noMatch;

    return (
      <Row>
        <Col>
          <Row className="justify-content-center">
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    checked={this.state.matchSelected}
                    onChange={this.handleRadioChange}
                  />
                  Coincide: {this.state.match.length}
                </Label>
              </FormGroup>
            </Col>
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    checked={!this.state.matchSelected}
                    onChange={this.handleRadioChange}
                  />
                  No coincide: {this.state.noMatch.length}
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr className="text-center">
                    <th>Mes</th>
                    <th>Año</th>
                    <th>Descripción</th>
                    <th>Bruto</th>
                    <th>Descuentos</th>
                    <th>Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.map((payment, index) => {
                    return this.tableBody(payment, index);
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default CoincidenceReport;
