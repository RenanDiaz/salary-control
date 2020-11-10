import React, { Component } from 'react';
import { Row, Col, FormGroup, Label, Input, Table } from 'reactstrap';
import api from '../utils/api';
import { PageLoading } from './PageLoading';
import { PageError } from './PageError';
import NumberFormat from 'react-number-format';

export class VoucherReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      voucher: undefined,
      noVoucher: undefined,
      voucherSelected: true,
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
      const voucher = payments.filter((payment) => payment.voucher);
      const noVoucher = payments.filter((payment) => !payment.voucher);
      this.setState({ loading: false, voucher, noVoucher });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleRadioChange = () => {
    const voucherSelected = !this.state.voucherSelected;
    this.setState({ voucherSelected });
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

    const selected = this.state.voucherSelected ? this.state.voucher : this.state.noVoucher;

    return (
      <>
        <Row className="justify-content-center">
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  checked={this.state.voucherSelected}
                  onChange={this.handleRadioChange}
                />
                Tiene comprobante: {this.state.voucher.length}
              </Label>
            </FormGroup>
          </Col>
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="type"
                  checked={!this.state.voucherSelected}
                  onChange={this.handleRadioChange}
                />
                No tiene comprobante: {this.state.noVoucher.length}
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
