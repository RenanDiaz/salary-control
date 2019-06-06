import React, { Component } from 'react';
import { MonthlyPayment } from '../components/MonthlyPayment';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../api';
import './styles/SalaryDetail.css';

export class SalaryDetail extends Component {
  state = {
    loading: true,
    error: null,
    data: undefined
  };

  page = {
    prev: 0,
    current: 1,
    next: 2
  };

  componentDidMount() {
    this.setPage(this.props.match.params.id);
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });

    try {
      const data = await api.monthlyPayments.read(this.page.current);
      if (this.page.current > data.last) {
        this.props.history.push(`/payments/${data.last}`);
      } else if (this.page.current < 1) {
        this.props.history.push('/payments/1');
      }
      this.setState({ loading: false, data });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setPage(this.props.match.params.id);
      this.fetchData();
    }
  }

  setPage = currentPage => {
    const current = Number(currentPage);
    this.page = {
      prev: current - 1,
      current,
      next: current + 1
    };
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
        <Row className="justify-content-between mt-1">
          <Col xs="auto">
            <Button tag={Link} to="/payments/1" disabled={this.page.current === 1}>
              <FontAwesomeIcon icon="angle-double-left" />
            </Button>
            <Button
              tag={Link}
              to={`/payments/${this.page.prev}`}
              disabled={this.page.current === 1}
            >
              <FontAwesomeIcon icon="angle-left" />
            </Button>
          </Col>
          <Col xs="auto">
            <h3>Detalle de pago</h3>
          </Col>
          <Col xs="auto">
            <Button
              tag={Link}
              to={`/payments/${this.page.next}`}
              disabled={this.page.current === this.state.data.last}
            >
              <FontAwesomeIcon icon="angle-right" />
            </Button>
            <Button
              tag={Link}
              to={`/payments/${this.state.data.last}`}
              disabled={this.page.current === this.state.data.last}
            >
              <FontAwesomeIcon icon="angle-double-right" />
            </Button>
          </Col>
        </Row>
        {this.state.data.id && <MonthlyPayment monthlyPayment={this.state.data} />}
        {!this.state.data.id && (
          <Row className="justify-content-center">
            <Col xs="auto">
              <span>Entry does not exist.</span>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}
