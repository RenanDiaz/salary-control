import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { RecurrentDiscounts } from '../components/RecurrentDiscounts';
import { DeleteDiscountModal } from '../components/DeleteDiscountModal';
import { PageLoading } from '../components/PageLoading';
import { PageError } from '../components/PageError';
import api from '../utils/api';

export class SalaryDiscounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      loading: true,
      error: null,
      modalIsOpen: false,
      selectedItem: undefined,
    };
  }

  componentDidMount() {
    this.fetchData();

    this.intervalId = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await api.recurrentDiscounts.list();
      this.setState({ loading: false, data: data });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleActiveChange = async (id) => {
    this.setState({ loading: true, error: null });
    let discount = this.state.data.filter((c) => c.id === id)[0];
    discount.isActive = !discount.isActive;

    try {
      await api.recurrentDiscounts.update(id, discount);
      this.setState({ loading: false, error: null });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleToggleModal = (e) => {
    const newState = !this.state.modalIsOpen;
    const selectedItem = newState ? this.state.selectedItem : undefined;
    this.setState({ modalIsOpen: newState, selectedItem });
  };

  handleSelectItem = (selectedItem) => {
    this.setState({ modalIsOpen: true, selectedItem });
  };

  handleDeleteDiscount = async (e) => {
    this.setState({ loading: true, error: null });
    try {
      await api.recurrentDiscounts.remove(this.state.selectedItem);

      this.setState({ loading: false, modalIsOpen: false });
      this.fetchData();
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleViewDiscount = (id) => {
    this.props.history.push(`/discounts/${id}`);
  };

  render() {
    const { loading, data, error, modalIsOpen } = this.state;
    if (loading && !data) {
      return <PageLoading />;
    }

    if (error) {
      return <PageError error={error} />;
    }

    return (
      <>
        <Row className="mt-1">
          <Col>
            <h3>Descuentos recurrentes</h3>
          </Col>
          <Col xs="auto">
            <Button tag={Link} to="/discounts/new">
              Agregar
            </Button>
          </Col>
        </Row>
        <RecurrentDiscounts
          recurrentDiscounts={data}
          onActiveChange={this.handleActiveChange}
          onSelectItem={this.handleSelectItem}
          onToggleModal={this.handleToggleModal}
          onViewDiscount={this.handleViewDiscount}
        />
        <DeleteDiscountModal
          onToggleModal={this.handleToggleModal}
          isOpen={modalIsOpen}
          onDeleteDiscount={this.handleDeleteDiscount}
        />
      </>
    );
  }
}
