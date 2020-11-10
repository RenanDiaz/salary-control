import React, { Component } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Col, Row } from 'reactstrap';

const CarouselContainer = styled.div.attrs({ className: 'row p-3' })`
  overflow-y: hidden;
  overflow-x: auto;
  flex-wrap: nowrap;
  height: 145px;
  direction: rtl;
`;

const CarouselItem = styled.div.attrs({ className: 'col-auto' })`
  &.is-new {
    animation: slide-down 1.5s ease;
  }
`;

export class Test extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
    };
    this.interval = undefined;
    this.lastItem = React.createRef();
  }

  componentDidMount() {
    this.fetchItems();
    this.interval = setInterval(this.fetchItems, 2000);
  }

  fetchItems = () => {
    const { items } = this.state;
    for (const item of items) {
      item.isNew = false;
    }
    const newItem = {
      value: items.length,
      isNew: true,
    };
    items.push(newItem);
    this.setState({ items }, this.checkInterval);
  };

  checkInterval = () => {
    const { items } = this.state;
    if (items.length > 21 && this.interval) {
      clearInterval(this.interval);
    }
    setTimeout(this.scrollIntoLastItem, 200);
  };

  scrollIntoLastItem = () => {
    if (this.lastItem) {
      this.lastItem.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  render() {
    const { items } = this.state;
    return (
      <Row className="mt-4">
        <Col className="border">
          <CarouselContainer>
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className={classnames({ 'is-new': item.isNew })}
                ref={this.lastItem}
              >
                <Row>
                  <Col>
                    <h3>{item.value}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col>Lorem ipsum</Col>
                </Row>
                <Row>
                  <Col>Lorem ipsum</Col>
                </Row>
                <Row>
                  <Col>Lorem ipsum</Col>
                </Row>
              </CarouselItem>
            ))}
          </CarouselContainer>
        </Col>
      </Row>
    );
  }
}
