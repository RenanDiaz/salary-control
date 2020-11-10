import React, { Component } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { Button, Col, Row } from 'reactstrap';
import { ws } from '../utils/WSClient';

const ScrollButton = styled(Button)`
  background-color: #343a40;
  color: white;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  border: 1px solid white;
  font-weight: bold;
  font-size: 17px;
  padding: 0;
  position: absolute;
  &.left {
    left: 15px;
  }
  &.right {
    right: 15px;
  }
`;

const CarouselContainer = styled.div.attrs({ className: 'row py-3' })`
  overflow-y: hidden;
  overflow-x: auto;
  flex-wrap: nowrap;
  height: 145px;
`;

const CarouselItem = styled.div.attrs({ className: 'col-auto' })`
  &.is-new {
    animation: slide-down 1.5s ease;
  }
`;

export class Test2 extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      shouldScroll: true,
      canScrollLeft: false,
      canScrollRight: false,
      identifier: undefined,
    };
    this.interval = undefined;
    this.carousel = React.createRef();
    this.lastItem = React.createRef();
  }

  componentDidMount() {
    // this.fetchItems();
    const { items } = this.state;
    for (let i = 0; i < 8; i++) {
      items.push({ value: i, isNew: false });
    }
    const identifier = ws.subscribe(this.fetchItems);
    this.setState({ items, identifier });
    // this.interval = setInterval(this.fetchItems, 2000);
  }

  componentWillUnmount() {
    const { identifier } = this.state;
    ws.unsubscribe(identifier);
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
    const { offsetWidth, scrollLeft, scrollWidth } = this.carousel.current;
    let shouldScroll = scrollWidth === scrollLeft + offsetWidth;
    if (!shouldScroll && this.lastItem) {
      const { clientWidth } = this.lastItem.current;
      shouldScroll = scrollWidth - clientWidth <= scrollLeft + offsetWidth;
    }
    this.setState({ items, shouldScroll }, this.checkInterval);
  };

  checkInterval = () => {
    const { items } = this.state;
    if (items.length >= 20 && this.interval) {
      clearInterval(this.interval);
    }
    setTimeout(this.scrollIntoLastItem, 200);
  };

  scrollIntoLastItem = () => {
    const { shouldScroll } = this.state;
    if (this.lastItem && this.carousel && shouldScroll) {
      this.lastItem.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  handleScroll = (e) => {
    const { scrollLeft, scrollWidth, offsetWidth } = e.target;
    const canScrollLeft = scrollLeft > 0;
    const canScrollRight = scrollWidth > scrollLeft + offsetWidth;
    this.setState({ canScrollLeft, canScrollRight });
  };

  handleScrollLeftClick = () => {
    const { firstChild } = this.carousel.current;
    firstChild.scrollIntoView({ behavior: 'smooth' });
  };

  handleScrollRightClick = () => {
    const { lastChild } = this.carousel.current;
    lastChild.scrollIntoView({ behavior: 'smooth' });
  };

  loadMore = () => {
    const { items: oldItems } = this.state;
    const olderItems = [];
    const firstValue = oldItems[0].value;
    for (let i = firstValue - 5; i < firstValue; i++) {
      olderItems.push({ value: i, isNew: false });
    }
    const items = olderItems.concat(oldItems);
    this.setState({ items });
  };

  render() {
    const { items, canScrollLeft, canScrollRight } = this.state;
    return (
      <Row className="mt-4 align-items-center position-relative">
        <Col className="border">
          <CarouselContainer ref={this.carousel} onScroll={this.handleScroll}>
            <Col xs="auto" className="m-auto">
              <Button onClick={this.loadMore}>Load more</Button>
            </Col>
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className={classnames({ 'is-new': item.isNew })}
                ref={this.lastItem}
              >
                <Row>
                  <Col>
                    <h3>{item.value + 1}</h3>
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
        <ScrollButton
          disabled={!canScrollLeft}
          onClick={this.handleScrollLeftClick}
          className="left"
        >
          &lt;
        </ScrollButton>
        <ScrollButton
          disabled={!canScrollRight}
          onClick={this.handleScrollRightClick}
          className="right"
        >
          &gt;
        </ScrollButton>
      </Row>
    );
  }
}
