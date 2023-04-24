import React from 'react';
import "../css/CustomInput.css"
function CustomInput({ type, value, onChange,disabled }) {
  return (
    <input 
      type={type}
      value={value}
      onChange={onChange}
      className="custom-input"
      disabled ={disabled}
    />
  );
}

export default CustomInput;