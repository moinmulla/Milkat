import React, { useState } from "react";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function Select1() {
  return (
    <div>
      <Select
        // defaultValue={selectedOption}
        // onChange={setSelectedOption}
        options={options}
      />
    </div>
  );
}

export default Select1;
