import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import api from '../api';
import PageLoading from './PageLoading';
import PageError from './PageError';
import NumberFormat from 'react-number-format';

export class TypeReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payments: [],
      groupRegularPayments: true,
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

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const { state } = this;
    this.setState({ ...state, [name]: checked });
  };

  tableBody = (payment, index) => {
    const { type, basePayment, grossPay, netPay, totalDiscounts } = payment;
    return (
      <tr className="text-right" key={index}>
        <td className="text-left">{type}</td>
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
      payments,
      groupRegularPayments,
    } = this.state;
    if (loading && !this.monthlyPayments) {
      return <PageLoading />;
    }

    if (error) {
      return <PageError error={error} />;
    }

    const monthlyPayments = [];
    payments.forEach((selectedPayment) => {
      const { description, basePayment: base, grossPay, netPay, totalDiscounts } = selectedPayment;
      const splitted = description.split(' ');
      let type = splitted[0];
      if (groupRegularPayments && (type === 'Primera' || type === 'Segunda')) {
        type = 'Quincena';
      }
      const basePayment = base ? base : 0;
      const newPayment = {
        type,
        basePayment,
        grossPay,
        netPay,
        totalDiscounts,
      };
      const index = monthlyPayments.findIndex(
        (payment) => payment.type === type
      );
      if (index < 0) {
        monthlyPayments.push(newPayment);
      } else {
        const prevPayment = monthlyPayments[index];
        const payment = {
          type,
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
                    name="groupRegularPayments"
                    checked={groupRegularPayments}
                    onChange={this.handleCheckboxChange}
                  />
                  Agrupar pagos regulares
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <Table>
                <thead>
                  <tr className="text-center">
                    <th>Tipo</th>
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
