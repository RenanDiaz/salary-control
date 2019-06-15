import React, { Component } from 'react';
import { MonthlyPayments } from '../components/MonthlyPayments';
import PageLoading from '../components/PageLoading';
import PageError from '../components/PageError';
import { Row, Col, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import api from '../api';

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      loading: true,
      error: null,
      page: {
        list: [1, 2, 3, 4, 5],
        first: 1,
        prev: 0,
        current: 1,
        next: 2,
        last: 6
      }
    };

    this._mounted = true;
  }

  componentDidMount() {
    this.fetchData();
    this.intervalId = setInterval(this.fetchData, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    if (this.state.loading) {
      this._mounted = false;
    }
  }

  fetchData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const data = await api.monthlyPayments.list(this.state.page.current);
      let page = this.state.page;
      page.last = Math.ceil(data.totalCount / 12);
      if (page.last < 1) page.last = 1;
      if (this._mounted) {
        page = this.getPage(page.current, page.last);
        this.setState({ loading: false, data, page });
      }
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  toggle = e => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  viewDetail = id => {
    this.props.history.push(`/payments/${id}`);
  };

  getPage = (currentPage, last) => {
    const current = Number(currentPage);
    const page = this.state.page;
    if (last === undefined) last = page.last;

    const list = [];
    for (let i = current - 4; list.length < 5 && i <= last; i++) {
      if (i < 1) continue;
      list.push(i);
      if (current > 2 && list.indexOf(current) > 2 && i < last) list.shift();
    }

    return {
      ...page,
      list,
      prev: current - 1,
      current,
      next: current + 1,
      last
    };
  };

  setPage = currentPage => {
    const page = this.getPage(currentPage);
    this.setState({ page });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.page.current !== prevState.page.current) {
      this.fetchData();
    }
  }

  render() {
    if (this.state.loading && !this.state.data) {
      return <PageLoading />;
    }

    if (this.state.error) {
      return <PageError error={this.state.error} />;
    }

    return (
      <React.Fragment>
        <Row className="justify-content-end mt-1">
          <Col>
            <h3>Resumen de pagos</h3>
          </Col>
        </Row>
        <MonthlyPayments
          monthlyPayments={this.state.data}
          viewDetail={this.viewDetail}
          page={this.state.page}
        />
        {this.state.data.length > 0 && (
          <Row className="justify-content-end">
            <Col xs="auto">
              <Pagination aria-label="Page navigation">
                <PaginationItem disabled={this.state.page.current === this.state.page.first}>
                  <PaginationLink
                    onClick={() => {
                      this.setPage(this.state.page.first);
                    }}
                  >
                    <FontAwesomeIcon icon="angle-double-left" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={this.state.page.current === this.state.page.first}>
                  <PaginationLink
                    onClick={() => {
                      this.setPage(this.state.page.prev);
                    }}
                  >
                    <FontAwesomeIcon icon="angle-left" />
                  </PaginationLink>
                </PaginationItem>
                {this.state.page.list.map(item => {
                  return (
                    <PaginationItem key={item} active={this.state.page.current === item}>
                      <PaginationLink
                        onClick={() => {
                          this.setPage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem disabled={this.state.page.current === this.state.page.last}>
                  <PaginationLink
                    onClick={() => {
                      this.setPage(this.state.page.next);
                    }}
                  >
                    <FontAwesomeIcon icon="angle-right" />
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={this.state.page.current === this.state.page.last}>
                  <PaginationLink
                    onClick={() => {
                      this.setPage(this.state.page.last);
                    }}
                  >
                    <FontAwesomeIcon icon="angle-double-right" />
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}
