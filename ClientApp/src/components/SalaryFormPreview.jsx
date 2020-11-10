import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'reactstrap';
import NumberFormat from 'react-number-format';
import classnames from 'classnames';
import { PaymentTable } from './PaymentTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ValuesCol = styled(Col)`
  > .row > .col {
    min-height: 24px;
  }
`;

export function SalaryFormPreview(props) {
  const { data, form } = props;
  return (
    <>
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
        <ValuesCol>
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
        </ValuesCol>
      </Row>
      <Row className={classnames({ 'mt-3': data })}>
        <PaymentTable payment={form} />
      </Row>
    </>
  );
}
