// src/components/SortBar.js
import React from 'react';
import { Select } from 'antd';
import './style/SortBar.css'; // Import CSS file

const { Option } = Select;

const SortBar = ({ sortOption, setSortOption }) => {
  return (
    <div className="sort-bar-container">
      <Select
        value={sortOption}
        onChange={setSortOption}
        style={{ width: 200 }}
        placeholder="Sort by"
        dropdownStyle={{ borderRadius: '8px' }}
        className="custom-sort-select"
      >
        <Option value="default">Sort By Price</Option>
        <Option value="asc">Price: Low to High</Option>
        <Option value="desc">Price: High to Low</Option>
      </Select>
    </div>
  );
};

export default SortBar;