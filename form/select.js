import React from 'react';
import './style.scss'

const Select = props => {

  let formControl = "form-control";

  if (props.touched && !props.valid) {
    formControl = 'form-control control-error';
  }

  return (
    <div className="form-group">
      <label>{props.label}</label>
      <select className={formControl} value={props.value} onChange={props.onChange} name={props.name}>
        {props.options.map(option => (
          <option value={option.value}>
            {option.displayValue}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
