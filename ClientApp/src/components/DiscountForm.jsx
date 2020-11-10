import React from 'react';

export function DiscountForm(props) {
  const { onSubmit, onChange, formValues, error } = props;
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Description</label>
        <input
          onChange={onChange}
          type="text"
          className="form-control"
          name="description"
          value={formValues.description}
        />
      </div>
      <div className="form-group">
        <label>Rate</label>
        <input
          onChange={onChange}
          type="number"
          className="form-control"
          name="rate"
          value={formValues.rate}
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          onChange={onChange}
          type="number"
          className="form-control"
          name="amount"
          value={formValues.amount}
        />
      </div>
      <div className="form-group d-none">
        <label>Is active</label>
        <input
          onChange={onChange}
          type="text"
          className="form-control"
          name="isActive"
          value={true}
        />
      </div>
      <button onClick={this.handleClick} type="submit" className="btn btn-primary">
        Save
      </button>

      {error && <p className="text-danger">{error.message}</p>}
    </form>
  );
}
