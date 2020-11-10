import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Chart } from 'react-google-charts';
import { Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import api from '../utils/api';
import { PageLoading } from './PageLoading';
import { PageError } from './PageError';

export class YearlyReport extends Component {
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
    const { year, basePayment, grossPay, netPay, totalDiscounts } = payment;
    return (
      <tr className="text-right" key={index}>
        <td>{year}</td>
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

  formatData = (payments) => {
    const response = [];
    response.push(['Year', 'Base', 'Gross', 'Net', 'Discounts']);
    payments.forEach((payment) => {
      const { year, basePayment, grossPay, netPay, totalDiscounts } = payment;
      const date = new Date(year);
      response.push([date, basePayment, grossPay, netPay, totalDiscounts]);
    });
    return response;
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

    const yearlyPayments = [];
    selectedPayments.forEach((selectedPayment) => {
      const { year, basePayment: base, grossPay, netPay, totalDiscounts } = selectedPayment;
      const basePayment = base ? base : 0;
      const newPayment = {
        year,
        basePayment,
        grossPay,
        netPay,
        totalDiscounts,
      };
      const index = yearlyPayments.findIndex((payment) => payment.year === year);
      if (index < 0) {
        yearlyPayments.push(newPayment);
      } else {
        const prevPayment = yearlyPayments[index];
        const payment = {
          year,
          basePayment: prevPayment.basePayment + basePayment,
          grossPay: prevPayment.grossPay + grossPay,
          netPay: prevPayment.netPay + netPay,
          totalDiscounts: prevPayment.totalDiscounts + totalDiscounts,
        };
        yearlyPayments[index] = payment;
      }
    });

    const data = this.formatData(yearlyPayments);

    return (
      <>
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
            <Chart
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={data}
              options={{
                hAxis: {
                  title: 'Year',
                },
                vAxis: {
                  title: '$',
                },
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr className="text-center">
                  <th>Año</th>
                  <th>Base</th>
                  <th>Bruto</th>
                  <th>Descuentos</th>
                  <th>Neto</th>
                </tr>
              </thead>
              <tbody>
                {yearlyPayments.map((payment, index) => this.tableBody(payment, index))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </>
    );
  }
}
