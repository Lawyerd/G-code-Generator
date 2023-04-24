import React from 'react';
import "../css/CustomCheckbox.css"
function CustomCheckbox({ checked, onChange }) {
  return (
    <input type="checkbox" checked={checked} onChange={onChange} />
  );
}

export default CustomCheckbox;