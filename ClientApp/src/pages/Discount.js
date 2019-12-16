import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import NumberFormat from 'react-number-format';
import PageLoading from '../components/PageLoading';
import api from '../api';

export class Discount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      error: null,
      data: undefined
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await api.recurrentDiscounts.read(this.props.match.params.id);
      this.setState({ loading: false, data });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };
  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }
    const data = this.state.data;
    return (
      <React.Fragment>
        <Row>
          <Col xs="auto">
            <Row>
              <Col>Descripción:</Col>
            </Row>
            {data.rate &&
              <Row>
                <Col>Tasa:</Col>
              </Row>
            }
            {data.amount &&
              <Row>
                <Col>Monto:</Col>
              </Row>
            }
            <Row>
              <Col>Activo:</Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col>{data.description}</Col>
            </Row>
            <Row>
              <Col>
                <NumberFormat
                  value={data.rate * 100}
                  displayType={'text'}
                  suffix={'%'}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <NumberFormat
                  value={data.amount}
                  displayType={'text'}
                  prefix={'$'}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale
                />
              </Col>
            </Row>
            <Row>
              {data.isActive &&
                <Col>Yes</Col>
              }
              {!data.isActive &&
                <Col>No</Col>
              }
            </Row>
          </Col>
        </Row>
        <Row>
          <Col xs="auto">
            <Button
              tag={Link}
              to={`/discounts/${data.id}/edit`}
            >
              Editar
            </Button>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}
