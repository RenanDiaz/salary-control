import React, { Component } from 'react';
import { Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';

export class DiscountRow extends Component {
  handleActiveChange = e => {
    this.props.onActiveChange(this.props.discount.id);
  };

  handleDeleteDiscount = e => {
    this.props.onDeleteDiscount(this.props.discount.id);
  };

  handleDeleteClick = e => {
    this.props.onSelectItem(this.props.discount.id);
  };

  handleViewDiscount = e => {
    const tagName = e.target.tagName;
    if (tagName === 'BUTTON' || tagName === 'INPUT' || tagName === 'A') {
      return;
    }
    this.props.onViewDiscount(this.props.discount.id);
  };

  render() {
    const props = this.props;
    const discount = props.discount;
    return (
      <tr key={discount.id} onClick={this.handleViewDiscount}>
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
            value={discount.amount}
            displayType={'text'}
            prefix={'$'}
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
          />
        </td>
        <td className="text-center">
          <Input
            type="checkbox"
            checked={discount.isActive}
            onChange={this.handleActiveChange}
            className="lonely-checkbox"
          />
        </td>
        <td className="text-center">
          <Button tag={Link} to={`/discounts/${discount.id}/edit`}>
            Editar
          </Button>{' '}
          <Button onClick={this.handleDeleteClick} color="danger">
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}
