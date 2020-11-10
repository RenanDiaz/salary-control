import React from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';

export function DeleteDiscountModal(props) {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onToggleModal}>
      <ModalHeader toggle={props.onToggleModal}>Delete discount</ModalHeader>
      <ModalBody>
        <p>You are about to delete this discount.</p>
        <p>Are you sure?</p>
      </ModalBody>
      <ModalFooter>
        <Row className="justify-content-end">
          <Col xs="auto">
            <Button color="danger" onClick={props.onDeleteDiscount}>
              Delete
            </Button>
          </Col>
          <Col xs="auto">
            <Button color="primary" onClick={props.onToggleModal}>
              Cancel
            </Button>
          </Col>
        </Row>
      </ModalFooter>
    </Modal>
  );
}
