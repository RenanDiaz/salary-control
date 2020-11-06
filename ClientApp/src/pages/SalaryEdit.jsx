import React, { Component } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'reactstrap';
import { PageLoading } from '../components/PageLoading';
import { PageError } from '../components/PageError';
import { SalaryForm } from '../components/SalaryForm';
import { SalaryFormPreview } from '../components/SalaryFormPreview';
import { calculateTotals } from '../Helpers';
import api from '../api';

const FormContainer = styled(Col)`
  max-height: calc(100vh - 102px);
  overflow-y: auto;
`;

export class SalaryEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      data: undefined,
      form: {
        description: '',
        regularHours: 80,
        basePayment: 0,
        totalHours: 0,
        grossPay: 0,
        totalDiscounts: 0,
        netPay: 0,
        isSpecial: false,
        hours: [{ description: 'Regulares', hours: 80, multiplier: 1 }],
        discounts: [],
        matches: true,
        voucher: true,
      },
    };

    this.id = props.match.params.id;
    this.index = props.match.params.index;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await api.monthlyPayments.read(this.id);
      delete data.last;
      const form = data.payments[this.index];
      this.setState({ loading: false, data, form });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  handleChange = (e) => {
    const form = {
      ...this.state.form,
      [e.target.name]:
        e.target.type === 'number'
          ? Number(e.target.value)
          : e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.value,
    };
    calculateTotals(form);
    this.setState({ form });
  };

  handlePropertyChange = (e) => {
    const property = e.target.getAttribute('data-property');
    const index = e.target.getAttribute('data-index');
    const { form } = this.state;
    const value = form[property][index];
    value[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    calculateTotals(form);
    this.setState({ form });
  };

  handleAddClick = (e) => {
    e.preventDefault();
    const propertyName = e.target.getAttribute('data-property');
    const { form } = this.state;
    const property = form[propertyName];
    switch (propertyName) {
      case 'hours':
        property.push({ description: '', hours: 0, multiplier: 1 });
        break;
      case 'discounts':
        property.push({ description: '', rate: 0, amount: 0 });
        break;
      default:
        throw new Error(`Invalid property name "${propertyName}"`);
    }
    calculateTotals(form);
    this.setState({ form });
  };

  handleRemoveClick = (e) => {
    e.preventDefault();
    const propertyName = e.target.getAttribute('data-property');
    const index = e.target.getAttribute('data-index');
    const { form } = this.state;
    const property = form[propertyName];
    property.splice(index, 1);
    calculateTotals(form);
    this.setState({ form });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null });

    calculateTotals(this.state.form);
    try {
      const { data } = this.state;
      data.payments[this.index] = this.state.form;
      this.setState({ data });
      await api.monthlyPayments.update(data.id, this.state.data);
      this.setState({ loading: false, error: null });
      this.props.history.push(`/payments/${this.id}`);
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    const { loading, data, error, form } = this.state;
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
            <h3>Editar pago</h3>
          </Col>
        </Row>
        <Row>
          <FormContainer xs="6">
            <SalaryFormPreview form={form} data={data} />
          </FormContainer>
          <FormContainer xs="6">
            <SalaryForm
              onChange={this.handleChange}
              onPropertyChange={this.handlePropertyChange}
              monthData={data}
              formValues={form}
              onAddClick={this.handleAddClick}
              onRemoveClick={this.handleRemoveClick}
              onSubmit={this.handleSubmit}
              error={error}
            />
          </FormContainer>
        </Row>
      </>
    );
  }
}
