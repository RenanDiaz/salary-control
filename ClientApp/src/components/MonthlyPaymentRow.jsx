import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

export class MonthlyPaymentRow extends Component {
  calculateMonthlySalary = () => {
    let sum = 0;
    for (const payment of this.props.monthlyPayment.payments) {
      if (!payment.isSpecial) {
        sum += payment.grossPay;
      }
    }
    return sum;
  };

  handleClick = () => {
    const { id } = this.props.monthlyPayment;
    this.props.viewDetail(id);
  };

  render() {
    const { monthlyPayment } = this.props;
    const empty = { grossPay: undefined, totalDiscounts: undefined, netPay: undefined };
    const first =
      monthlyPayment.payments.filter(
        (payment) => payment.description.trim() === 'Primera quincena'
      )[0] || empty;
    const second =
      monthlyPayment.payments.filter(
        (payment) => payment.description.trim() === 'Segunda quincena'
      )[0] || empty;
    const specials = monthlyPayment.payments.filter((payment) => payment.isSpecial);
    let special = { grossPay: 0, totalDiscounts: 0, netPay: 0 };
    if (specials.length > 0) {
      for (const payment of specials) {
        special.grossPay += payment.grossPay;
        special.totalDiscounts += payment.totalDiscounts;
        special.netPay += payment.netPay;
      }
    } else {
      special = empty;
    }
    const totals = {
      grossPay: (first.grossPay || 0) + (second.grossPay || 0) + (special.grossPay || 0),
      totalDiscounts:
        (first.totalDiscounts || 0) + (second.totalDiscounts || 0) + (special.totalDiscounts || 0),
      netPay: (first.netPay || 0) + (second.netPay || 0) + (special.netPay || 0),
    };

    return (
      <tr onClick={this.handleClick}>
        <th>{monthlyPayment.id}</th>
        <td>{monthlyPayment.year}</td>
        <td>{monthlyPayment.month}</td>
        <td>
          <NumberFormat
            value={first.grossPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={first.grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={first.totalDiscounts}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={first.totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={first.netPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={first.netPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={second.grossPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={second.grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={second.totalDiscounts}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={second.totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={second.netPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={second.netPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={special.grossPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={special.grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={special.totalDiscounts}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={special.totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={special.netPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={special.netPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={totals.grossPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={totals.grossPay > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={totals.totalDiscounts}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={totals.totalDiscounts > 0}
          />
        </td>
        <td>
          <NumberFormat
            value={totals.netPay}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale={totals.netPay > 0}
          />
        </td>
      </tr>
    );
  }
}
