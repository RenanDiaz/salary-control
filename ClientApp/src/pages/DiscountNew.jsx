import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { DiscountForm } from '../components/DiscountForm';
import { PageLoading } from '../components/PageLoading';
import { SalaryFormPreview } from '../components/SalaryFormPreview';
import api from '../api';

export class DiscountNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      form: {
        rate: 0,
        amount: 0,
        description: '',
        isActive: true,
      },
    };
  }

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
      },
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    const { form } = this.state;
    if (form.amount === 0) delete form.amount;
    if (form.rate === 0) delete form.rate;
    try {
      await api.recurrentDiscounts.create(form);
      this.setState({ loading: false, error: null });
      this.props.history.push('/discounts');
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    const { loading, form, error } = this.state;
    if (loading) {
      return <PageLoading />;
    }

    return (
      <>
        <Row className="mt-1">
          <Col>
            <h3>Nuevo descuento recurrente</h3>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs="6" className="form-container">
            <SalaryFormPreview form={{ discounts: [form] }} />
          </Col>
          <Col xs="6">
            <DiscountForm
              onChange={this.handleChange}
              formValues={form}
              onSubmit={this.handleSubmit}
              error={error}
            />
          </Col>
        </Row>
      </>
    );
  }
}
