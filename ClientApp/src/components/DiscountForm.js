import React from 'react';

class DiscountForm extends React.Component {
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input
            onChange={this.props.onChange}
            type="text"
            className="form-control"
            name="description"
            value={this.props.formValues.description}
          />
        </div>
        <div className="form-group">
          <label>Rate</label>
          <input
            onChange={this.props.onChange}
            type="text"
            className="form-control"
            name="rate"
            value={this.props.formValues.rate}
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            onChange={this.props.onChange}
            type="text"
            className="form-control"
            name="amount"
            value={this.props.formValues.amount}
          />
        </div>
        <div className="form-group d-none">
          <label>Is active</label>
          <input
            onChange={this.props.onChange}
            type="text"
            className="form-control"
            name="isActive"
            value={true}
          />
        </div>
        <button onClick={this.handleClick} type="submit" className="btn btn-primary">
          Save
        </button>

        {this.props.error && <p className="text-danger">{this.props.error.message}</p>}
      </form>
    );
  }
}

export default DiscountForm;
