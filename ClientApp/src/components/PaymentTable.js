import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import NumberFormat from 'react-number-format';
import { roundCurrency } from '../Helpers';

export class PaymentTable extends Component {
  render() {
    const payment = this.props.payment;
    return (
      <Col>
        {payment.hours && !payment.isSpecial && (
          <React.Fragment>
            <Row>
              <Col>Detalle de horas</Col>
            </Row>
            <Row>
              <Col>
                <Table>
                  <thead>
                    <tr className="text-center">
                      <th>Tipo</th>
                      <th>Tasa</th>
                      <th>Rata/hora</th>
                      <th>Horas</th>
                      <th>Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.hours.map((hour, index) => {
                      return (
                        <tr key={index}>
                          <td>{hour.description}</td>
                          <td className="text-right">{hour.multiplier}</td>
                          <td className="text-right">
                            <NumberFormat
                              value={(payment.basePayment / payment.regularHours) * hour.multiplier}
                              displayType={'text'}
                              prefix={'$'}
                              decimalScale={4}
                            />
                          </td>
                          <td className="text-right">{hour.hours}</td>
                          <td className="text-right">
                            <NumberFormat
                              value={roundCurrency(
                                (payment.basePayment / payment.regularHours) *
                                  hour.hours *
                                  hour.multiplier
                              )}
                              displayType={'text'}
                              prefix={'$'}
                              thousandSeparator
                              decimalScale={2}
                              fixedDecimalScale
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="text-right">
                      <th />
                      <th />
                      <th>Total</th>
                      <th>{payment.totalHours}</th>
                      <th>
                        <NumberFormat
                          value={payment.grossPay}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </Row>
          </React.Fragment>
        )}
        {payment.previousPayments && payment.isSpecial && (
          <React.Fragment>
            <Row>
              <Col>Detalle de pagos</Col>
            </Row>
            <Row>
              <Col>
                <Table>
                  <thead>
                    <tr className="text-center">
                      <th>Descripción</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.previousPayments.map((previousPayment, index) => {
                      return (
                        <tr key={index}>
                          <td>{previousPayment.description}</td>
                          <td className="text-right">
                            <NumberFormat
                              value={previousPayment.amount}
                              displayType={'text'}
                              prefix={'$'}
                              thousandSeparator
                              decimalScale={2}
                              fixedDecimalScale
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="text-right">
                      <th>Total</th>
                      <th>
                        <NumberFormat
                          value={payment.grossPay}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </th>
                    </tr>
                  </tfoot>
                </Table>
              </Col>
            </Row>
          </React.Fragment>
        )}
        <Row>
          <Col>Detalle de descuentos</Col>
        </Row>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr className="text-center">
                  <th>Descripción</th>
                  <th>Tasa</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {payment.discounts.map((discount, index) => {
                  return (
                    <tr key={index}>
                      <td>{discount.description}</td>
                      <td className="text-right">
                        <NumberFormat
                          value={discount.rate * 100}
                          displayType={'text'}
                          suffix={'%'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </td>
                      <td className="text-right">
                        <NumberFormat
                          value={roundCurrency(
                            discount.amount ? discount.amount : discount.rate * payment.grossPay
                          )}
                          displayType={'text'}
                          prefix={'$'}
                          thousandSeparator
                          decimalScale={2}
                          fixedDecimalScale
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {payment.totalDiscounts > 0 && (
                <tfoot>
                  <tr className="text-right">
                    <th />
                    <th>Total</th>
                    <th>
                      <NumberFormat
                        value={payment.totalDiscounts}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </th>
                  </tr>
                  <tr className="text-right">
                    <th />
                    <th>Salario neto</th>
                    <th>
                      <NumberFormat
                        value={payment.netPay}
                        displayType={'text'}
                        prefix={'$'}
                        thousandSeparator
                        decimalScale={2}
                        fixedDecimalScale
                      />
                    </th>
                  </tr>
                </tfoot>
              )}
            </Table>
          </Col>
        </Row>
      </Col>
    );
  }
}
