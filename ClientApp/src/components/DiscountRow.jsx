import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Col, Input, Row } from 'reactstrap';

const LonelyCheckbox = styled(Input)`
  position: relative;
  margin: 0;
`;

export class DiscountRow extends Component {
  handleActiveChange = () => {
    this.props.onActiveChange(this.props.discount.id);
  };

  handleDeleteDiscount = () => {
    this.props.onDeleteDiscount(this.props.discount.id);
  };

  handleDeleteClick = () => {
    this.props.onSelectItem(this.props.discount.id);
  };

  handleViewDiscount = (e) => {
    const { tagName } = e.target;
    if (tagName === 'BUTTON' || tagName === 'INPUT' || tagName === 'A') {
      return;
    }
    this.props.onViewDiscount(this.props.discount.id);
  };

  render() {
    const { description, rate, amount, isActive, id } = this.props.discount;
    return (
      <tr onClick={this.handleViewDiscount}>
        <td>{description}</td>
        <td className="text-right">
          <NumberFormat
            value={rate * 100}
            displayType="text"
            suffix="%"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
          />
        </td>
        <td className="text-right">
          <NumberFormat
            value={amount}
            displayType="text"
            prefix="$"
            thousandSeparator
            decimalScale={2}
            fixedDecimalScale
          />
        </td>
        <td className="text-center">
          <LonelyCheckbox type="checkbox" checked={isActive} onChange={this.handleActiveChange} />
        </td>
        <td>
          <Row className="justify-content-center">
            <Col xs="auto">
              <Button tag={Link} to={`/discounts/${id}/edit`}>
                Editar
              </Button>
            </Col>
            <Col xs="auto">
              <Button onClick={this.handleDeleteClick} color="danger">
                Delete
              </Button>
            </Col>
          </Row>
        </td>
      </tr>
    );
  }
}
