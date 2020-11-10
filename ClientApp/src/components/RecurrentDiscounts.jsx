import React from 'react';
import styled from 'styled-components';
import { Table } from 'reactstrap';
import { DiscountRow } from './DiscountRow';

const DiscountsTable = styled(Table)`
  td {
    vertical-align: middle;
  }
`;

export function RecurrentDiscounts(props) {
  const {
    recurrentDiscounts,
    onActiveChange,
    onDeleteDiscount,
    onSelectItem,
    onViewDiscount,
  } = props;
  return (
    <DiscountsTable striped>
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
        {recurrentDiscounts.map((recurrentDiscount) => (
          <DiscountRow
            key={recurrentDiscount.id}
            discount={recurrentDiscount}
            onActiveChange={onActiveChange}
            onDeleteDiscount={onDeleteDiscount}
            onSelectItem={onSelectItem}
            onViewDiscount={onViewDiscount}
          />
        ))}
      </tbody>
    </DiscountsTable>
  );
}
