import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Col, Row } from 'reactstrap';
import { Payment } from '../components/Payment';

export class MonthlyPayment extends Component {
  calculateMonthlySalary = () => {
    let sum = 0;
    for (const payment of this.props.monthlyPayment.payments) {
      if (!payment.isSpecial) {
        sum += payment.grossPay;
      }
    }
    return sum;
  };

  render() {
    const { monthlyPayment } = this.props;
    return (
      <Row className="mb-3">
        <Col>
          <Row>
            <Col xs="auto">
              <Row>
                <Col>Mes:</Col>
              </Row>
              <Row>
                <Col>Salario mensual:</Col>
              </Row>
            </Col>
            <Col>
              <Row>
                <Col>
                  {monthlyPayment.month}/{monthlyPayment.year}
                </Col>
              </Row>
              <Row>
                <Col>
                  <NumberFormat
                    value={this.calculateMonthlySalary()}
                    displayType="text"
                    prefix="$"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col>
              {monthlyPayment.payments.map((payment, index) => (
                <Payment key={index} payment={payment} index={index} id={monthlyPayment.id} />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
