import React, { Component } from 'react';
import { Input, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';

export class Discount extends Component {
  handleActiveChange = e => {
    this.props.onActiveChange(this.props.discount.id);
  };

  handleDeleteDiscount = e => {
    this.props.onDeleteDiscount(this.props.discount.id);
  };

  handleDeleteClick = e => {
    this.props.onSelectItem(this.props.discount.id);
  };

  render() {
    const props = this.props;
    const discount = props.discount;
    return (
      <tr key={discount.id}>
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
          <Button tag={Link} to="/new-discount">
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
