import React from 'react';
import DatePicker from 'react-datepicker';
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  ButtonGroup
} from 'reactstrap';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/SalaryForm.css';

class SalaryFormSpecial extends React.Component {
  toggle = value => {
    this.props.onDateChange &&
      this.props.onChange({ target: { type: 'text', value, name: 'type' } });
  };

  render() {
    const lastDate = new Date(this.props.monthData.year, this.props.monthData.month - 1);
    return (
      <Form onSubmit={this.props.onSubmit}>
        <FormGroup>
          <Label>Mes</Label>
          <DatePicker
            className="form-control"
            selected={lastDate}
            onChange={this.props.onDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            readOnly={!this.props.onDateChange}
          />
        </FormGroup>
        <ButtonGroup className="w-100 mb-3">
          <Button
            outline
            color="primary"
            className={classnames({
              active: this.props.formValues.type === 'decimo'
            })}
            onClick={() => {
              this.toggle('decimo');
            }}
            disabled={this.props.formValues.type !== 'decimo' && !this.props.onDateChange}
          >
            Décimo
          </Button>
          <Button
            outline
            color="primary"
            className={classnames({
              active: this.props.formValues.type === 'vacations'
            })}
            onClick={() => {
              this.toggle('vacations');
            }}
            disabled={this.props.formValues.type !== 'vacations' && !this.props.onDateChange}
          >
            Vacaciones
          </Button>
          <Button
            outline
            color="primary"
            className={classnames({
              active: this.props.formValues.type === 'bonus'
            })}
            onClick={() => {
              this.toggle('bonus');
            }}
            disabled={this.props.formValues.type !== 'bonus' && !this.props.onDateChange}
          >
            Bono
          </Button>
        </ButtonGroup>
        <FormGroup>
          <Label>Descripción</Label>
          <Input
            onChange={this.props.onChange}
            type="text"
            name="description"
            value={this.props.formValues.description}
          />
        </FormGroup>
        {this.props.formValues.type === 'bonus' && (
          <FormGroup>
            <Label>Monto</Label>
            <Input
              onChange={this.props.onPropertyChange}
              type="number"
              name="amount"
              value={this.props.formValues.previousPayments[0].amount}
              data-property="previousPayments"
              data-index={0}
            />
          </FormGroup>
        )}
        {this.props.formValues.type !== 'bonus' && (
          <React.Fragment>
            <FormGroup>
              <Label>Meses</Label>
              <Input
                onChange={this.props.onChange}
                type="number"
                name="months"
                value={this.props.formValues.months}
                readOnly={this.props.formValues.type === 'decimo'}
              />
            </FormGroup>
            <Card className="mb-3">
              <CardBody>
                {this.props.formValues.type === 'decimo' && (
                  <CardTitle className="mb-0">Pagos de los últimos 4 meses</CardTitle>
                )}
                {this.props.formValues.type === 'vacations' && (
                  <CardTitle className="mb-0">Pagos del último año</CardTitle>
                )}
              </CardBody>
              {this.props.formValues.previousPayments.map((previousPayment, index) => {
                return (
                  <React.Fragment key={index}>
                    <hr className="my-0" />
                    <CardBody>
                      <FormGroup>
                        <Label>Descripción</Label>
                        <Input
                          onChange={this.props.onPropertyChange}
                          type="text"
                          name="description"
                          value={previousPayment.description}
                          data-property="previousPayments"
                          data-index={index}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Monto</Label>
                        <Input
                          onChange={this.props.onPropertyChange}
                          type="number"
                          name="amount"
                          value={previousPayment.amount}
                          data-property="previousPayments"
                          data-index={index}
                        />
                      </FormGroup>
                      <FormGroup className="mb-0 text-right">
                        <Button
                          onClick={this.props.onRemoveClick}
                          color="danger"
                          data-property="previousPayments"
                          data-index={index}
                        >
                          Remove
                        </Button>
                      </FormGroup>
                    </CardBody>
                  </React.Fragment>
                );
              })}
              <hr className="my-0" />
              <Row>
                <Col xs="auto">
                  <Button
                    onClick={this.props.onAddClick}
                    color="link"
                    data-property="previousPayments"
                  >
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Card>
            <Card className="mb-3">
              <CardBody>
                <CardTitle className="mb-0">Descuentos</CardTitle>
              </CardBody>
              {this.props.formValues.discounts.map((discount, index) => {
                return (
                  <React.Fragment key={index}>
                    <hr className="my-0" />
                    <CardBody>
                      <FormGroup>
                        <Label>Descripción</Label>
                        <Input
                          onChange={this.props.onPropertyChange}
                          type="text"
                          name="description"
                          value={discount.description}
                          data-property="discounts"
                          data-index={index}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Porcentaje</Label>
                        <Input
                          onChange={this.props.onPropertyChange}
                          type="number"
                          name="rate"
                          value={discount.rate}
                          data-property="discounts"
                          data-index={index}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Monto</Label>
                        <Input
                          onChange={this.props.onPropertyChange}
                          type="number"
                          name="amount"
                          value={discount.amount}
                          data-property="discounts"
                          data-index={index}
                        />
                      </FormGroup>
                      <FormGroup className="mb-0 text-right">
                        <Button
                          onClick={this.props.onRemoveClick}
                          color="danger"
                          data-property="discounts"
                          data-index={index}
                        >
                          Remove
                        </Button>
                      </FormGroup>
                    </CardBody>
                  </React.Fragment>
                );
              })}
              <hr className="my-0" />
              <Row>
                <Col xs="auto">
                  <Button onClick={this.props.onAddClick} color="link" data-property="discounts">
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Card>
          </React.Fragment>
        )}
        <Row>
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  onChange={this.props.onChange}
                  type="checkbox"
                  name="matches"
                  checked={this.props.formValues.matches}
                />
                Coincide
              </Label>
            </FormGroup>
          </Col>
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  onChange={this.props.onChange}
                  type="checkbox"
                  name="voucher"
                  checked={this.props.formValues.voucher}
                />
                Tiene comprobante
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row className="justify-content-center my-3">
          <Col xs="auto">
            <Button type="submit" color="primary">
              Save
            </Button>
          </Col>
        </Row>

        {this.props.error && <Alert color="danger">{this.props.error.message}</Alert>}
      </Form>
    );
  }
}

export default SalaryFormSpecial;
