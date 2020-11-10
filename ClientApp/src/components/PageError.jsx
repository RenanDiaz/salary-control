import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 57px);
  width: 100%;
`;

export function PageError(props) {
  return <ErrorContainer>{props.error.message}</ErrorContainer>;
}
