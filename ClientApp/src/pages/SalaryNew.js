import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import PageLoading from '../components/PageLoading';
import api from '../api';
import SalaryForm from '../components/SalaryForm';
import PageError from '../components/PageError';
import { SalaryFormPreview } from '../components/SalaryFormPreview';
import { calculateTotals } from '../Helpers';

export class SalaryNew extends Component {
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

    this.data = [];
    this.discounts = [];
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      this.data = await api.monthlyPayments.last();
      const currentDate = new Date();
      const data =
        Object.entries(this.data).length > 0
          ? this.data
          : {
              month: currentDate.getMonth(),
              year: currentDate.getFullYear(),
              payments: [],
            };
      this.discounts = await api.recurrentDiscounts.list();
      const discounts = this.discounts.filter((discount) => {
        const isActive = discount.isActive;
        discount.isActive = undefined;
        discount.id = undefined;
        return isActive;
      });
      const form = this.state.form;
      form.discounts = discounts;
      for (let i = data.payments.length - 1; i >= 0; i--) {
        const payment = data.payments[i];
        if (!payment.isSpecial) {
          form.basePayment = payment.basePayment;
          form.regularHours = payment.regularHours;
          form.hours[0].hours = payment.regularHours;
          break;
        }
      }
      calculateTotals(form);
      this.setState({ loading: false, data, form });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  handleDateChange = (e) => {
    const month = e.getMonth() + 1;
    const year = e.getFullYear();
    api.monthlyPayments.readByDate(month, year).then((response) => {
      const data =
        response.length > 0
          ? response[0]
          : {
              month,
              year,
              payments: [],
            };
      const form = this.state.form;
      for (let i = data.payments.length - 1; i >= 0; i--) {
        const payment = data.payments[i];
        if (!payment.isSpecial) {
          form.basePayment = payment.basePayment;
          form.regularHours = payment.regularHours;
          form.hours[0].hours = payment.regularHours;
          break;
        }
      }
      this.setState({ data, form });
    });
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
    const form = this.state.form;
    const value = form[property][index];
    value[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    calculateTotals(form);
    this.setState({ form });
  };

  handleNumberPropertyChange = (e) => {
    const { property, index, name, type, value: newValue } = e;
    const form = this.state.form;
    const value = form[property][index];
    value[name] = type === 'number' ? Number(newValue) : newValue;
    calculateTotals(form);
    this.setState({ form });
  };

  handleAddClick = (e) => {
    e.preventDefault();
    const propertyName = e.target.getAttribute('data-property');
    const form = this.state.form;
    let property = form[propertyName];
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
    const form = this.state.form;
    let property = form[propertyName];
    property.splice(index, 1);
    calculateTotals(form);
    this.setState({ form: form });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null });

    calculateTotals(this.state.form);
    try {
      if (this.state.data.id) {
        let data = this.data;
        data.payments.push(this.state.form);
        this.setState({ data });
        await api.monthlyPayments.update(data.id, this.state.data);
      } else {
        let data = this.state.data;
        data.id = undefined;
        data.payments = [this.state.form];
        await api.monthlyPayments.create(this.state.data);
      }
      this.setState({ loading: false, error: null });
      this.props.history.push('/');
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    if (this.state.loading && !this.state.data) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }

    return (
      <>
        <Row className="mt-1">
          <Col>
            <h3>Nuevo pago</h3>
          </Col>
        </Row>
        <Row>
          <Col xs="6" className="form-container">
            <SalaryFormPreview form={this.state.form} data={this.state.data} />
          </Col>
          <Col xs="6" className="form-container">
            <SalaryForm
              onChange={this.handleChange}
              onPropertyChange={this.handlePropertyChange}
              handleNumberPropertyChange={this.handleNumberPropertyChange}
              onDateChange={this.handleDateChange}
              monthData={this.state.data}
              formValues={this.state.form}
              onAddClick={this.handleAddClick}
              onRemoveClick={this.handleRemoveClick}
              onSubmit={this.handleSubmit}
              error={this.state.error}
            />
          </Col>
        </Row>
      </>
    );
  }
}
