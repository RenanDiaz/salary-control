import React from 'react';
import styled from 'styled-components';
import { Loader } from './Loader';

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
`;

export function PageLoading() {
  return (
    <LoaderContainer>
      <Loader />
    </LoaderContainer>
  );
}
