import React from 'react';
import NumberFormat from 'react-number-format';
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
} from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/SalaryForm.css';

function NumberPropertyInput(props) {
  const { onPropertyChange, defaultValue, name, property, index, decimalScale } = props;
  const onValueChange = ({ formattedValue, value, floatValue }) => {
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

class SalaryForm extends React.Component {
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
        <FormGroup>
          <Label>Descripción</Label>
          <Input
            onChange={this.props.onChange}
            type="text"
            name="description"
            value={this.props.formValues.description}
          />
        </FormGroup>
        <FormGroup>
          <Label>Horas regulares</Label>
          <Input
            onChange={this.props.onChange}
            type="number"
            name="regularHours"
            value={this.props.formValues.regularHours}
          />
        </FormGroup>
        <FormGroup>
          <Label>Salario quincenal</Label>
          <Input
            onChange={this.props.onChange}
            type="number"
            name="basePayment"
            value={this.props.formValues.basePayment}
          />
        </FormGroup>
        <Card className="mb-3">
          <CardBody>
            <CardTitle className="mb-0">Horas trabajadas</CardTitle>
          </CardBody>
          {this.props.formValues.hours.map((hour, index) => {
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
                      value={hour.description}
                      data-property="hours"
                      data-index={index}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Horas</Label>
                    <Input
                      onChange={this.props.onPropertyChange}
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
                      onChange={this.props.onPropertyChange}
                      type="number"
                      name="multiplier"
                      value={hour.multiplier}
                      data-property="hours"
                      data-index={index}
                    />
                  </FormGroup>
                  <FormGroup className="mb-0 text-right">
                    <Button
                      onClick={this.props.onRemoveClick}
                      color="danger"
                      data-property="hours"
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
              <Button onClick={this.props.onAddClick} color="link" data-property="hours">
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
                    <NumberPropertyInput
                      onPropertyChange={this.props.handleNumberPropertyChange}
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

export default SalaryForm;
