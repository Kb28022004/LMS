import React, { useState } from "react";
import "./Filter.css";
import { Checkbox } from "@mui/material";

const categories = [
  { id: "Next Js", label: "Next Js" },
  { id: "Data Science", label: "Data Science" },
  { id: "Frontend Development", label: "Frontend Development" },
  { id: "Full Stack Development", label: "Full Stack Development" },
  { id: "MERN Stack Development", label: "MERN Stack Development" },
  { id: "Backend Development", label: "Backend Development" },
  { id: "Javascript", label: "Javascript" },
  { id: "Python", label: "Python" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]); // ✅ Ensure useState is correct
  const [sortByPrice, setSortByPrice] = useState("");

  // Handle Category Selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId) // Remove if already selected
        : [...prevCategories, categoryId]; // Add if not selected

      // ✅ Ensure handleFilterChange exists and is a function
      if (typeof handleFilterChange === "function") {
        handleFilterChange(newCategories, sortByPrice);
      }

      return newCategories;
    });
  };

  // Handle Sorting by Price
  const selectByPriceHandler = (event) => {
    const selectedValue = event.target.value;
    setSortByPrice(selectedValue);

    if (typeof handleFilterChange === "function") {
      handleFilterChange(selectedCategories, selectedValue);
    }
  };

  return (
    <div className="filterMainContainer">
      {/* Sorting Options */}
      <div className="filterMainContainer-upperSide">
        <h3>Filter Options</h3>
        <select onChange={selectByPriceHandler}>
          <option value="">Sort By Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="filterMainContainer-lowerSide">
        <h3>CATEGORY</h3>
       <div>
       {categories.map((curCategory) => (
          <div key={curCategory.id} className="filterMainContainer-categoryList">
            <Checkbox
              id={curCategory.id}
              checked={selectedCategories.includes(curCategory.id)}
              onChange={() => handleCategoryChange(curCategory.id)}
            />
            <label htmlFor={curCategory.id}>{curCategory.label}</label>
          </div>
        ))}
       </div>
      </div>
    </div>
  );
};

export default Filter;
