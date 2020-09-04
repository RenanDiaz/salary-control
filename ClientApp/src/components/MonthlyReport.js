import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import api from '../api';
import PageLoading from './PageLoading';
import PageError from './PageError';
import NumberFormat from 'react-number-format';

export class MonthlyReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      ascendingOrder: true,
      regularPayments: true,
      specialPayments: true,
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
      this.setState({ loading: false, payments });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleRadioChange = () => {
    const ascendingOrder = !this.state.ascendingOrder;
    this.setState({ ascendingOrder });
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const { state } = this;
    this.setState({ ...state, [name]: checked });
  };

  tableBody = (payment, index) => {
    const { year, month, basePayment, grossPay, netPay, totalDiscounts } = payment;
    return (
      <tr className="text-right" key={index}>
        <td>{year}</td>
        <td>{month}</td>
        <td>
          <NumberFormat
            value={basePayment}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </td>
        <td>
          <NumberFormat
            value={grossPay}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </td>
        <td>
          <NumberFormat
            value={totalDiscounts}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </td>
        <td>
          <NumberFormat
            value={netPay}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={true}
          />
        </td>
      </tr>
    );
  };

  render() {
    const {
      loading,
      error,
      ascendingOrder,
      payments,
      regularPayments,
      specialPayments,
    } = this.state;
    if (loading && !this.monthlyPayments) {
      return <PageLoading />;
    }

    if (error) {
      return <PageError error={error} />;
    }

    let selectedPayments = [];
    if (regularPayments && specialPayments) {
      selectedPayments = payments.filter(() => true);
    } else if (regularPayments) {
      selectedPayments = payments.filter((payment) => !payment.isSpecial);
    } else if (specialPayments) {
      selectedPayments = payments.filter((payment) => payment.isSpecial);
    }

    if (!ascendingOrder) {
      selectedPayments = selectedPayments.reverse();
    }

    const monthlyPayments = [];
    selectedPayments.forEach((selectedPayment) => {
      const { year, month, basePayment: base, grossPay, netPay, totalDiscounts } = selectedPayment;
      const basePayment = base ? base : 0;
      const newPayment = {
        year,
        month,
        basePayment,
        grossPay,
        netPay,
        totalDiscounts,
      };
      const index = monthlyPayments.findIndex(
        (payment) => payment.year === year && payment.month === month
      );
      if (index < 0) {
        monthlyPayments.push(newPayment);
      } else {
        const prevPayment = monthlyPayments[index];
        const payment = {
          year,
          month,
          basePayment: prevPayment.basePayment + basePayment,
          grossPay: prevPayment.grossPay + grossPay,
          netPay: prevPayment.netPay + netPay,
          totalDiscounts: prevPayment.totalDiscounts + totalDiscounts,
        };
        monthlyPayments[index] = payment;
      }
    });

    return (
      <Row>
        <Col>
          <Row>
            <Col xs="auto">Filtro:</Col>
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="regularPayments"
                    checked={regularPayments}
                    onChange={this.handleCheckboxChange}
                  />
                  Pagos regulares
                </Label>
              </FormGroup>
            </Col>
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    name="specialPayments"
                    checked={specialPayments}
                    onChange={this.handleCheckboxChange}
                  />
                  Pagos especiales
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs="auto">Orden:</Col>
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    checked={ascendingOrder}
                    onChange={this.handleRadioChange}
                  />
                  Ascendente
                </Label>
              </FormGroup>
            </Col>
            <Col xs="auto">
              <FormGroup check>
                <Label check>
                  <Input
                    type="radio"
                    name="type"
                    checked={!ascendingOrder}
                    onChange={this.handleRadioChange}
                  />
                  Descendente
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr className="text-center">
                    <th>Año</th>
                    <th>Mes</th>
                    <th>Base</th>
                    <th>Bruto</th>
                    <th>Descuentos</th>
                    <th>Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPayments.map((payment, index) => {
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
