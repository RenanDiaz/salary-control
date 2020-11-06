import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import { PageLoading } from './PageLoading';
import { PageError } from './PageError';
import api from '../api';

export class CoincidenceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      match: undefined,
      noMatch: undefined,
      matchSelected: true,
      loading: true,
      error: null,
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
      const match = payments.filter((payment) => payment.matches);
      const noMatch = payments.filter((payment) => !payment.matches);
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
    const { month, year, description, grossPay, totalDiscounts, netPay } = payment;
    return (
      <tr className="text-right" key={index}>
        <td>{month}</td>
        <td>{year}</td>
        <td className="text-left">{description}</td>
        <td>
          <NumberFormat
            value={grossPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={totalDiscounts}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={netPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={netPay > 0}
          />
        </td>
      </tr>
    );
  };

  render() {
    const { loading, error, matchSelected, match, noMatch } = this.state;
    if (loading && !this.monthlyPayments) {
      return <PageLoading />;
    }

    if (error) {
      return <PageError error={error} />;
    }

    const selected = matchSelected ? match : noMatch;

    return (
      <>
        <Row className="justify-content-center">
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  checked={matchSelected}
                  onChange={this.handleRadioChange}
                />
                Coincide: {match.length}
              </Label>
            </FormGroup>
          </Col>
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  checked={!matchSelected}
                  onChange={this.handleRadioChange}
                />
                No coincide: {noMatch.length}
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
              <tbody>{selected.map((payment, index) => this.tableBody(payment, index))}</tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }
}
