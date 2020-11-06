import React, { Component } from 'react';
import styled from 'styled-components';
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
  ButtonGroup,
} from 'reactstrap';
import classnames from 'classnames';

const DatePickerFormGroup = styled(FormGroup)`
  .react-datepicker-wrapper {
    display: block;
  }
  .react-datepicker-popper {
    z-index: 2;
  }
`;

export class SalaryFormSpecial extends Component {
  toggle = (value) => {
    this.props.onDateChange &&
      this.props.onChange({ target: { type: 'text', value, name: 'type' } });
  };

  render() {
    const {
      monthData,
      onSubmit,
      onDateChange,
      formValues,
      onChange,
      onPropertyChange,
      onRemoveClick,
      onAddClick,
      error,
    } = this.props;
    const { year, month } = monthData;
    const lastDate = new Date(year, month - 1);
    return (
      <Form onSubmit={onSubmit}>
        <DatePickerFormGroup>
          <Label>Mes</Label>
          <DatePicker
            className="form-control"
            selected={lastDate}
            onChange={onDateChange}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            readOnly={!onDateChange}
          />
        </DatePickerFormGroup>
        <ButtonGroup className="w-100 mb-3">
          <Button
            outline
            color="primary"
            className={classnames({
              active: formValues.type === 'decimo',
            })}
            onClick={() => {
              this.toggle('decimo');
            }}
            disabled={formValues.type !== 'decimo' && !onDateChange}
          >
            Décimo
          </Button>
          <Button
            outline
            color="primary"
            className={classnames({
              active: formValues.type === 'vacations',
            })}
            onClick={() => {
              this.toggle('vacations');
            }}
            disabled={formValues.type !== 'vacations' && !onDateChange}
          >
            Vacaciones
          </Button>
          <Button
            outline
            color="primary"
            className={classnames({
              active: formValues.type === 'bonus',
            })}
            onClick={() => {
              this.toggle('bonus');
            }}
            disabled={formValues.type !== 'bonus' && !onDateChange}
          >
            Bono
          </Button>
        </ButtonGroup>
        <FormGroup>
          <Label>Descripción</Label>
          <Input
            onChange={onChange}
            type="text"
            name="description"
            value={formValues.description}
          />
        </FormGroup>
        {formValues.type === 'bonus' && (
          <FormGroup>
            <Label>Monto</Label>
            <Input
              onChange={onPropertyChange}
              type="number"
              name="amount"
              value={formValues.previousPayments[0].amount}
              data-property="previousPayments"
              data-index={0}
            />
          </FormGroup>
        )}
        {formValues.type !== 'bonus' && (
          <React.Fragment>
            <FormGroup>
              <Label>Meses</Label>
              <Input
                onChange={onChange}
                type="number"
                name="months"
                value={formValues.months}
                readOnly={formValues.type === 'decimo'}
              />
            </FormGroup>
            <Card className="mb-3">
              <CardBody>
                {formValues.type === 'decimo' && (
                  <CardTitle className="mb-0">Pagos de los últimos 4 meses</CardTitle>
                )}
                {formValues.type === 'vacations' && (
                  <CardTitle className="mb-0">Pagos del último año</CardTitle>
                )}
              </CardBody>
              {formValues.previousPayments.map((previousPayment, index) => (
                <React.Fragment key={index}>
                  <hr className="my-0" />
                  <CardBody>
                    <FormGroup>
                      <Label>Descripción</Label>
                      <Input
                        onChange={onPropertyChange}
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
                        onChange={onPropertyChange}
                        type="number"
                        name="amount"
                        value={previousPayment.amount}
                        data-property="previousPayments"
                        data-index={index}
                      />
                    </FormGroup>
                    <FormGroup className="mb-0 text-right">
                      <Button
                        onClick={onRemoveClick}
                        color="danger"
                        data-property="previousPayments"
                        data-index={index}
                      >
                        Remove
                      </Button>
                    </FormGroup>
                  </CardBody>
                </React.Fragment>
              ))}
              <hr className="my-0" />
              <Row>
                <Col xs="auto">
                  <Button onClick={onAddClick} color="link" data-property="previousPayments">
                    Agregar
                  </Button>
                </Col>
              </Row>
            </Card>
            <Card className="mb-3">
              <CardBody>
                <CardTitle className="mb-0">Descuentos</CardTitle>
              </CardBody>
              {formValues.discounts.map((discount, index) => (
                <React.Fragment key={index}>
                  <hr className="my-0" />
                  <CardBody>
                    <FormGroup>
                      <Label>Descripción</Label>
                      <Input
                        onChange={onPropertyChange}
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
                        onChange={onPropertyChange}
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
                        onChange={onPropertyChange}
                        type="number"
                        name="amount"
                        value={discount.amount}
                        data-property="discounts"
                        data-index={index}
                      />
                    </FormGroup>
                    <FormGroup className="mb-0 text-right">
                      <Button
                        onClick={onRemoveClick}
                        color="danger"
                        data-property="discounts"
                        data-index={index}
                      >
                        Remove
                      </Button>
                    </FormGroup>
                  </CardBody>
                </React.Fragment>
              ))}
              <hr className="my-0" />
              <Row>
                <Col xs="auto">
                  <Button onClick={onAddClick} color="link" data-property="discounts">
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
                  onChange={onChange}
                  type="checkbox"
                  name="matches"
                  checked={formValues.matches}
                />
                Coincide
              </Label>
            </FormGroup>
          </Col>
          <Col xs="auto">
            <FormGroup check>
              <Label check>
                <Input
                  onChange={onChange}
                  type="checkbox"
                  name="voucher"
                  checked={formValues.voucher}
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

        {error && <Alert color="danger">{error.message}</Alert>}
      </Form>
    );
  }
}

export default SalaryFormSpecial;
