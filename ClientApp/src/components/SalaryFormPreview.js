import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import { PaymentTable } from '../components/PaymentTable';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class SalaryFormPreview extends Component {
  render() {
    const data = this.props.data;
    const form = this.props.form;
    return (
      <React.Fragment>
        <Row>
          <Col xs="auto">
            {data && (
              <Row>
                <Col>Mes:</Col>
              </Row>
            )}
            {(form.description || form.description === '') && (
              <Row>
                <Col>Descripción:</Col>
              </Row>
            )}
            {form.regularHours && (
              <Row>
                <Col>Horas regulares:</Col>
              </Row>
            )}
            {form.basePayment && (
              <Row>
                <Col>Salario quincenal:</Col>
              </Row>
            )}
            {form.matches !== undefined && (
              <Row>
                <Col>Coincide:</Col>
              </Row>
            )}
            {form.voucher !== undefined && (
              <Row>
                <Col>Comprobante:</Col>
              </Row>
            )}
          </Col>
          <Col xs="auto" className="form-values-preview">
            {data && (
              <Row>
                <Col>
                  {data.month}/{data.year}
                </Col>
              </Row>
            )}
            {(form.description || form.description === '') && (
              <Row>
                <Col>{form.description}</Col>
              </Row>
            )}
            {form.regularHours && (
              <Row>
                <Col>{form.regularHours}</Col>
              </Row>
            )}
            {form.basePayment && (
              <Row>
                <Col>
                  <NumberFormat
                    value={form.basePayment}
                    displayType={'text'}
                    prefix={'$'}
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Col>
              </Row>
            )}
            {form.matches !== undefined && (
              <Row>
                <Col xs="auto">
                  {form.matches && <FontAwesomeIcon icon="check-circle" className="text-success" />}
                  {!form.matches && <FontAwesomeIcon icon="times-circle" className="text-danger" />}
                </Col>
              </Row>
            )}
            {form.voucher !== undefined && (
              <Row>
                <Col xs="auto">
                  {form.voucher && <FontAwesomeIcon icon="check-circle" className="text-success" />}
                  {!form.voucher && <FontAwesomeIcon icon="times-circle" className="text-danger" />}
                </Col>
              </Row>
            )}
          </Col>
        </Row>
        <Row className={classnames({ 'mt-3': data })}>
          <PaymentTable payment={form} />
        </Row>
      </React.Fragment>
    );
  }
}
