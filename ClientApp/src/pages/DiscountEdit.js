import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import DiscountForm from '../components/DiscountForm';
import PageLoading from '../components/PageLoading';
import { SalaryFormPreview } from '../components/SalaryFormPreview';
import api from '../api';

export class DiscountEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: null,
      form: {
        rate: 0,
        amount: 0,
        description: '',
        isActive: true
      }
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await api.recurrentDiscounts.read(this.props.match.params.id);
      const form = data;
      this.setState({ loading: false, data, form });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: null });
    const form = this.state.form;
    if (form.amount === 0) delete form.amount;
    if (form.rate === 0) delete form.rate;
    try {
      await api.recurrentDiscounts.update(form.id, form);
      this.setState({ loading: false, error: null });
      this.props.history.push('/discounts');
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }

    return (
      <React.Fragment>
        <Row className="mt-1">
          <Col>
            <h3>Nuevo descuento recurrente</h3>
          </Col>
        </Row>
        <Row className="justify-content-end">
          <Col xs="6" className="form-container">
            <SalaryFormPreview form={{ discounts: [this.state.form] }} />
          </Col>
          <Col xs="6">
            <DiscountForm
              onChange={this.handleChange}
              formValues={this.state.form}
              onSubmit={this.handleSubmit}
              error={this.state.error}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
