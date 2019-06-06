import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Discount } from '../components/Discount';

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
              <Discount
                key={recurrentDiscount.id}
                discount={recurrentDiscount}
                onActiveChange={this.props.onActiveChange}
                onDeleteDiscount={this.props.onDeleteDiscount}
                onSelectItem={this.props.onSelectItem}
              />
            );
          })}
        </tbody>
      </Table>
    );
  }
}
