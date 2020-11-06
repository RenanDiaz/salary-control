import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MonthlyPayment } from '../components/MonthlyPayment';
import { PageLoading } from '../components/PageLoading';
import { PageError } from '../components/PageError';
import api from '../api';

export class SalaryDetail extends Component {
  state = {
    loading: true,
    error: null,
    data: undefined,
  };

  page = {
    prev: 0,
    current: 1,
    next: 2,
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

  setPage = (currentPage) => {
    const current = Number(currentPage);
    this.page = {
      prev: current - 1,
      current,
      next: current + 1,
    };
  };

  render() {
    const { loading, data, error } = this.state;
    if (loading && !data) {
      return <PageLoading />;
    }

    if (error) {
      return <PageError error={error} />;
    }
    const { page } = this;

    return (
      <>
        <Row className="justify-content-between mt-1">
          <Col xs="auto">
            <Button tag={Link} to="/payments/1" disabled={page.current === 1}>
              <FontAwesomeIcon icon="angle-double-left" />
            </Button>
            <Button tag={Link} to={`/payments/${page.prev}`} disabled={page.current === 1}>
              <FontAwesomeIcon icon="angle-left" />
            </Button>
          </Col>
          <Col xs="auto">
            <h3>Detalle de pago</h3>
          </Col>
          <Col xs="auto">
            <Button tag={Link} to={`/payments/${page.next}`} disabled={page.current === data.last}>
              <FontAwesomeIcon icon="angle-right" />
            </Button>
            <Button tag={Link} to={`/payments/${data.last}`} disabled={page.current === data.last}>
              <FontAwesomeIcon icon="angle-double-right" />
            </Button>
          </Col>
        </Row>
        {data.id && <MonthlyPayment monthlyPayment={data} />}
        {!data.id && (
          <Row className="justify-content-center">
            <Col xs="auto">
              <span>Entry does not exist.</span>
            </Col>
          </Row>
        )}
      </>
    );
  }
}
