import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import './styles/Modal.css';

function DeleteDiscountModal(props) {
  return (
    <Modal isOpen={props.isOpen} toggle={props.onToggleModal}>
      <ModalHeader toggle={props.onToggleModal}>Delete discount</ModalHeader>
      <ModalBody>
        <p>You are about to delete this discount.</p>
        <p>Are you sure?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={props.onDeleteDiscount}>
          Delete
        </Button>{' '}
        <Button color="primary" onClick={props.onToggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DeleteDiscountModal;
