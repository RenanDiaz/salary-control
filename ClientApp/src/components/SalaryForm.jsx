import React from 'react';
import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';

const DatePickerFormGroup = styled(FormGroup)`
  .react-datepicker-wrapper {
    display: block;
  }
`;

function NumberPropertyInput(props) {
  const { onPropertyChange, defaultValue, name, property, index, decimalScale } = props;
  const onValueChange = ({ floatValue }) => {
    const object = {
      type: 'number',
      value: floatValue,
      property,
      index,
    };
    onPropertyChange(object);
  };
  return (
    <NumberFormat
      customInput={Input}
      onValueChange={onValueChange}
      name={name}
      value={defaultValue}
      data-property={property}
      data-index={index}
      thousandSeparator
      decimalScale={decimalScale}
    />
  );
}

export function SalaryForm(props) {
  const {
    monthData,
    onSubmit,
    onDateChange,
    onChange,
    formValues,
    onPropertyChange,
    onRemoveClick,
    onAddClick,
    handleNumberPropertyChange,
    error,
  } = props;
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
      <FormGroup>
        <Label>Descripción</Label>
        <Input onChange={onChange} type="text" name="description" value={formValues.description} />
      </FormGroup>
      <FormGroup>
        <Label>Horas regulares</Label>
        <Input
          onChange={onChange}
          type="number"
          name="regularHours"
          value={formValues.regularHours}
        />
      </FormGroup>
      <FormGroup>
        <Label>Salario quincenal</Label>
        <Input
          onChange={onChange}
          type="number"
          name="basePayment"
          value={formValues.basePayment}
        />
      </FormGroup>
      <Card className="mb-3">
        <CardBody>
          <CardTitle className="mb-0">Horas trabajadas</CardTitle>
        </CardBody>
        {formValues.hours.map((hour, index) => (
          <React.Fragment key={index}>
            <hr className="my-0" />
            <CardBody>
              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  onChange={onPropertyChange}
                  type="text"
                  name="description"
                  value={hour.description}
                  data-property="hours"
                  data-index={index}
                />
              </FormGroup>
              <FormGroup>
                <Label>Horas</Label>
                <Input
                  onChange={onPropertyChange}
                  type="number"
                  name="hours"
                  value={hour.hours}
                  data-property="hours"
                  data-index={index}
                />
              </FormGroup>
              <FormGroup>
                <Label>Multiplicador</Label>
                <Input
                  onChange={onPropertyChange}
                  type="number"
                  name="multiplier"
                  value={hour.multiplier}
                  data-property="hours"
                  data-index={index}
                />
              </FormGroup>
              <FormGroup className="mb-0 text-right">
                <Button
                  onClick={onRemoveClick}
                  color="danger"
                  data-property="hours"
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
            <Button onClick={onAddClick} color="link" data-property="hours">
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
                <NumberPropertyInput
                  onPropertyChange={handleNumberPropertyChange}
                  name="rate"
                  defaultValue={discount.rate}
                  property="discounts"
                  index={index}
                  decimalScale={4}
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
