import React, { Component } from 'react';
import styled from 'styled-components';
import { Col, Row } from 'reactstrap';
import { PageLoading } from '../components/PageLoading';
import { PageError } from '../components/PageError';
import { SalaryFormSpecial } from '../components/SalaryFormSpecial';
import { SalaryFormPreview } from '../components/SalaryFormPreview';
import { calculateTotalsSpecial } from '../Helpers';
import api from '../api';

const FormContainer = styled(Col)`
  max-height: calc(100vh - 102px);
  overflow-y: auto;
`;

export class SalaryNewSpecial extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      data: undefined,
      form: {
        description: '',
        grossPay: 0,
        totalDiscounts: 0,
        netPay: 0,
        isSpecial: true,
        type: 'decimo',
        months: 5,
        discounts: [],
        previousPayments: [],
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
      this.data = await api.monthlyPayments.list();
      const currentDate = new Date();
      const lastMonthlyPayment = this.data[this.data.length - 1];
      const data = lastMonthlyPayment
        ? {
            month: lastMonthlyPayment.month,
            year: lastMonthlyPayment.year,
          }
        : {
            month: currentDate.getMonth(),
            year: currentDate.getFullYear(),
          };
      const previousPayments = this.calculatePreviousPayments(
        data.month,
        data.year,
        this.state.form.type,
        this.state.form.months
      );

      this.discounts = await api.recurrentDiscounts.list();
      const discounts = this.discounts.filter((discount) => {
        const isActive = discount.isActive;
        discount.isActive = undefined;
        discount.id = undefined;
        return isActive;
      });
      const { form } = this.state;
      form.discounts = discounts;
      form.previousPayments = previousPayments;
      form.description = `Décimo ${data.month}/${data.year}`;
      calculateTotalsSpecial(form);
      this.setState({ loading: false, data, form });
      this.setState({
        loading: false,
        data: {
          ...this.data[this.data.length - 1],
          month: data.month,
          year: data.year,
        },
        form,
      });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  calculatePreviousPayments = (currentMonth, currentYear, type, months) => {
    if (type === 'bonus') return [{ amount: 0, description: 'Bono' }];
    const validMonths = [];
    for (let i = months - 1; i >= 0; i--) {
      let year = currentYear;
      let month = currentMonth - i;
      if (month < 1) {
        month += 12;
        year -= 1;
      }
      validMonths.push(`${month}/${year}`);
    }
    let previousPayments = [];
    for (const monthlyPayment of this.data) {
      const paymentMonth = monthlyPayment.month;
      const date = `${paymentMonth}/${monthlyPayment.year}`;
      if (validMonths.includes(date)) {
        if (validMonths[0] === date && type === 'decimo') {
          const payment =
            monthlyPayment.payments[
              monthlyPayment.payments.length > 1 ? monthlyPayment.payments.length - 1 : 0
            ];
          const newPayment = {
            description: `${payment.description} ${date}`,
            amount: payment.grossPay,
          };
          previousPayments.push(newPayment);
        } else if (currentMonth === paymentMonth && type === 'decimo') {
          const payment = monthlyPayment.payments[0];
          const newPayment = {
            description: `${payment.description} ${date}`,
            amount: payment.grossPay,
          };
          previousPayments.push(newPayment);
        } else {
          for (const payment of monthlyPayment.payments) {
            if (!payment.isSpecial || payment.type === 'vacations') {
              const newPayment = {
                description: `${payment.description} ${date}`,
                amount: payment.grossPay,
              };
              previousPayments.push(newPayment);
            }
          }
        }
      }
    }
    return previousPayments;
  };

  handleDateChange = (e) => {
    const month = e.getMonth() + 1;
    const year = e.getFullYear();
    const data = { ...this.state.data, month, year };
    const { form } = this.state;
    switch (form.type) {
      case 'decimo':
        form.description = `Décimo ${month}/${year}`;
        break;
      case 'vacations':
        form.description = `Vacaciones ${year}`;
        break;
      case 'bonus':
        form.description = `Bono ${month}/${year}`;
        break;
      default:
        break;
    }
    form.previousPayments = this.calculatePreviousPayments(month, year, form.type, form.months);
    calculateTotalsSpecial(form);
    this.setState({ data, form });
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
    if (e.target.name === 'type') {
      switch (e.target.value) {
        case 'decimo':
          form.description = `Décimo ${this.state.data.month}/${this.state.data.year}`;
          form.months = 5;
          if (form.discounts.length === 0) form.discounts = this.discounts;
          break;
        case 'vacations':
          form.description = `Vacaciones ${this.state.data.year}`;
          form.months = 11;
          if (form.discounts.length === 0) form.discounts = this.discounts;
          break;
        case 'bonus':
          form.description = `Bono ${this.state.data.month}/${this.state.data.year}`;
          form.months = 0;
          form.discounts = [];
          break;
        default:
          break;
      }
      form.previousPayments = this.calculatePreviousPayments(
        this.state.data.month,
        this.state.data.year,
        e.target.value,
        form.months
      );
    } else if (e.target.name === 'months') {
      form.previousPayments = this.calculatePreviousPayments(
        this.state.data.month,
        this.state.data.year,
        this.state.form.type,
        e.target.value
      );
    }
    calculateTotalsSpecial(form);
    this.setState({ form });
  };

  handlePropertyChange = (e) => {
    const property = e.target.getAttribute('data-property');
    const index = e.target.getAttribute('data-index');
    const { form } = this.state;
    const value = form[property][index];
    value[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    calculateTotalsSpecial(form);
    this.setState({ form });
  };

  handleAddClick = (e) => {
    e.preventDefault();
    const propertyName = e.target.getAttribute('data-property');
    const { form } = this.state;
    const property = form[propertyName];
    switch (propertyName) {
      case 'previousPayments':
        property.push({ description: '', amount: 0 });
        break;
      case 'discounts':
        property.push({ description: '', rate: 0, amount: 0 });
        break;
      default:
        throw new Error(`Invalid property name "${propertyName}"`);
    }
    calculateTotalsSpecial(form);
    this.setState({ form });
  };

  handleRemoveClick = (e) => {
    e.preventDefault();
    const propertyName = e.target.getAttribute('data-property');
    const index = e.target.getAttribute('data-index');
    const { form } = this.state;
    const property = form[propertyName];
    property.splice(index, 1);
    calculateTotalsSpecial(form);
    this.setState({ form: form });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: null });

    calculateTotalsSpecial(this.state.form);
    try {
      const filtered = this.data.filter((current) => {
        const { month, year } = this.state.data;
        return current.month === month && current.year === year;
      });
      if (filtered.length > 0) {
        const data = filtered[0];
        data.payments.push(this.state.form);
        await api.monthlyPayments.update(data.id, data);
      } else {
        const { data } = this.state;
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
            <h3>Nuevo pago especial</h3>
          </Col>
        </Row>
        <Row>
          <FormContainer xs="6">
            <SalaryFormPreview form={form} data={data} />
          </FormContainer>
          <FormContainer xs="6">
            <SalaryFormSpecial
              onChange={this.handleChange}
              onPropertyChange={this.handlePropertyChange}
              onDateChange={this.handleDateChange}
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
