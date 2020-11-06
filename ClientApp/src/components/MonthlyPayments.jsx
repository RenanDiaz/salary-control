import React from 'react';
import NumberFormat from 'react-number-format';
import { Col, Row, Table } from 'reactstrap';
import { MonthlyPaymentRow } from '../components/MonthlyPaymentRow';

export function MonthlyPayments(props) {
  const { monthlyPayments, viewDetail, page } = props;
  const totals = { grossPay: 0, totalDiscounts: 0, netPay: 0 };
  for (const monthlyPayment of monthlyPayments) {
    for (const payment of monthlyPayment.payments) {
      totals.grossPay += payment.grossPay;
      totals.totalDiscounts += payment.totalDiscounts;
      totals.netPay += payment.netPay;
    }
  }
  return (
    <>
      {monthlyPayments.length === 0 && (
        <Row className="justify-content-center">
          <Col xs="auto">No payments registered</Col>
        </Row>
      )}
      {monthlyPayments.length > 0 && (
        <Table>
          <thead className="text-center">
            <tr>
              <th />
              <th colSpan="2">Fecha</th>
              <th colSpan="3">Primera quincena</th>
              <th colSpan="3">Segunda quincena</th>
              <th colSpan="3">Especial</th>
              <th colSpan="3">Total</th>
            </tr>
            <tr>
              <th>#</th>
              <th>Año</th>
              <th>Mes</th>
              <th>Bruto</th>
              <th>Descuentos</th>
              <th>Neto</th>
              <th>Bruto</th>
              <th>Descuentos</th>
              <th>Neto</th>
              <th>Bruto</th>
              <th>Descuentos</th>
              <th>Neto</th>
              <th>Bruto</th>
              <th>Descuentos</th>
              <th>Neto</th>
            </tr>
          </thead>
          <tbody className="text-right">
            {monthlyPayments.map((monthlyPayment) => (
              <MonthlyPaymentRow
                monthlyPayment={monthlyPayment}
                key={monthlyPayment.id}
                viewDetail={viewDetail}
              />
            ))}
          </tbody>
          {!page.current && (
            <tfoot>
              <tr className="text-right">
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th />
                <th>Totals</th>
                <th>
                  <NumberFormat
                    value={totals.grossPay}
                    displayType="text"
                    prefix="$"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={totals.grossPay > 0}
                  />
                </th>
                <th>
                  <NumberFormat
                    value={totals.totalDiscounts}
                    displayType="text"
                    prefix="$"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={totals.grossPay > 0}
                  />
                </th>
                <th>
                  <NumberFormat
                    value={totals.netPay}
                    displayType="text"
                    prefix="$"
                    thousandSeparator
                    decimalScale={2}
                    fixedDecimalScale={totals.grossPay > 0}
                  />
                </th>
              </tr>
            </tfoot>
          )}
        </Table>
      )}
    </>
  );
}
