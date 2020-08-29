import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'reactstrap';
import { MonthlyReport } from '../components/MonthlyReport';
import { YearlyReport } from '../components/YearlyReport';
import { TypeReport } from '../components/TypeReport';
import CoincidenceReport from '../components/CoincidenceReport';
import VoucherReport from '../components/VoucherReport';

export class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedReport: undefined,
    };
  }

  changeSelectionTo = (selection) => {
    this.setState({ selectedReport: selection });
  };

  render() {
    let report;
    switch (this.state.selectedReport) {
      case 'byMonth':
        report = <MonthlyReport />;
        break;
      case 'byYear':
        report = <YearlyReport />
        break;
      case 'byType':
        report = <TypeReport />
        break;
      case 'coincidenceState':
        report = <CoincidenceReport />;
        break;
      case 'voucherState':
        report = <VoucherReport />;
        break;
      default:
        break;
    }
    return (
      <React.Fragment>
        <Row className="mt-1">
          <Col>
            <h3>Reportes</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Row className="justify-content-center">
              <Col xs="auto">
                <Button onClick={() => this.changeSelectionTo('byMonth')}>Por mes</Button>
              </Col>
              <Col xs="auto">
                <Button onClick={() => this.changeSelectionTo('byYear')}>Por año</Button>
              </Col>
              <Col xs="auto">
                <Button onClick={() => this.changeSelectionTo('byType')}>Por tipo</Button>
              </Col>
              <Col xs="auto">
                <Button onClick={() => this.changeSelectionTo('coincidenceState')}>
                  Por estado de coincidencia
                </Button>
              </Col>
              <Col xs="auto">
                <Button onClick={() => this.changeSelectionTo('voucherState')}>
                  Por estado del comprobante
                </Button>
              </Col>
            </Row>
            {report}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

Reports.propTypes = {
  selectedReport: PropTypes.oneOf([
    'byMonth',
    'byYear',
    'byType',
    'coincidenceState',
    'voucherState',
  ]),
};
