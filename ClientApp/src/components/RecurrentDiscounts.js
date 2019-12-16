import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { DiscountRow } from './DiscountRow';

export class RecurrentDiscounts extends Component {
  render() {
    return (
      <Table striped className="align-items-center">
        <thead>
          <tr className="text-center">
            <th>Nombre</th>
            <th>Tasa</th>
            <th>Monto</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.props.recurrentDiscounts.map(recurrentDiscount => {
            return (
              <DiscountRow
                key={recurrentDiscount.id}
                discount={recurrentDiscount}
                onActiveChange={this.props.onActiveChange}
                onDeleteDiscount={this.props.onDeleteDiscount}
                onSelectItem={this.props.onSelectItem}
                onViewDiscount={this.props.onViewDiscount}
              />
            );
          })}
        </tbody>
      </Table>
    );
  }
}
