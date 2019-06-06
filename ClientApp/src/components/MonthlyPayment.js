import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { Payment } from '../components/Payment';
import NumberFormat from 'react-number-format';
import './styles/MonthlyPayment.css';

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
    const monthlyPayment = this.props.monthlyPayment;
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
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mt-3 ">
            <Col>
              {monthlyPayment.payments.map((payment, index) => {
                return (
                  <Payment key={index} payment={payment} index={index} id={monthlyPayment.id} />
                );
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
