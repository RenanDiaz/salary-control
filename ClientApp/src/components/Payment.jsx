import React from 'react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PaymentTable } from './PaymentTable';

export function Payment(props) {
  const { payment, id, index } = props;
  return (
    <Row>
      <Col xs="auto">
        <Row>
          <Col xs="auto">
            <h4>{payment.description}</h4>
          </Col>
        </Row>
        {!payment.isSpecial && (
          <Row>
            <Col xs="auto">
              Salario por hora:{' '}
              <NumberFormat
                value={payment.basePayment / payment.regularHours}
                displayType="text"
                prefix="$"
                decimalScale={4}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col xs="auto">
            Coincide:{' '}
            {payment.matches && <FontAwesomeIcon icon="check-circle" className="text-success" />}
            {!payment.matches && <FontAwesomeIcon icon="times-circle" className="text-danger" />}
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            Comprobante:{' '}
            {payment.voucher && <FontAwesomeIcon icon="check-circle" className="text-success" />}
            {!payment.voucher && <FontAwesomeIcon icon="times-circle" className="text-danger" />}
          </Col>
        </Row>
        <Row>
          <Col>
            {payment.isSpecial && (
              <Button tag={Link} to={`/payments/${id}/edit-special/${index}`}>
                Editar
              </Button>
            )}
            {!payment.isSpecial && (
              <Button tag={Link} to={`/payments/${id}/edit/${index}`}>
                Editar
              </Button>
            )}
          </Col>
        </Row>
      </Col>
      <PaymentTable payment={payment} />
    </Row>
  );
}
