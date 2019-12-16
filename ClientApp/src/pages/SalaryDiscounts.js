import React, { Component } from 'react';
import { RecurrentDiscounts } from '../components/RecurrentDiscounts';
import DeleteDiscountModal from '../components/DeleteDiscountModal';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import api from '../api';
import './styles/SalaryDiscounts.css';

export class SalaryDiscounts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      loading: true,
      error: null,
      modalIsOpen: false,
      selectedItem: undefined
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

  handleActiveChange = async id => {
    this.setState({ loading: true, error: null });
    let discount = this.state.data.filter(c => c.id === id)[0];
    discount.isActive = !discount.isActive;

    try {
      await api.recurrentDiscounts.update(id, discount);
      this.setState({ loading: false, error: null });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleToggleModal = e => {
    const newState = !this.state.modalIsOpen;
    const selectedItem = newState ? this.state.selectedItem : undefined;
    this.setState({ modalIsOpen: newState, selectedItem });
  };

  handleSelectItem = selectedItem => {
    this.setState({ modalIsOpen: true, selectedItem });
  };

  handleDeleteDiscount = async e => {
    this.setState({ loading: true, error: null });
    try {
      await api.recurrentDiscounts.remove(this.state.selectedItem);

      this.setState({ loading: false, modalIsOpen: false });
      this.fetchData();
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  handleViewDiscount = id => {
    this.props.history.push(`/discounts/${id}`);
  };

  render() {
    if (this.state.loading && !this.state.data) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }

    return (
      <React.Fragment>
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
          recurrentDiscounts={this.state.data}
          onActiveChange={this.handleActiveChange}
          onSelectItem={this.handleSelectItem}
          onToggleModal={this.handleToggleModal}
          onViewDiscount={this.handleViewDiscount}
        />
        <DeleteDiscountModal
          onToggleModal={this.handleToggleModal}
          isOpen={this.state.modalIsOpen}
          onDeleteDiscount={this.handleDeleteDiscount}
        />
      </React.Fragment>
    );
  }
}
