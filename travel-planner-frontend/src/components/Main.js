import React, { Component } from 'react';
import {Row, Col, Input, AutoComplete} from 'antd';
import history from '../history';

const {Search} = Input;

const renderTitle = (title) => {
  return (
    <span className="searchOptionTitle">
      {title}
    </span>
  );
};

const renderItem = (title) => {
  return {
    value: title,
    label: (
      <div className="searchOptions">
        {title}
      </div>
    ),
  };
};

const options = [
  {
    label: renderTitle('Asia'),
    options: [renderItem('Beijing'),
    renderItem('Hong Kong'), 
    renderItem('Shanghai'), 
    renderItem('Singapore'), 
    renderItem('Sydney'), 
    renderItem('Tokyo')],
  },
  {
    label: renderTitle('North America'),
    options: [renderItem('New York'), 
    renderItem('Chicago'), 
    renderItem('Los Angeles'), 
    renderItem('Miami'), 
    renderItem('San Francisco')],
  },
  {
    label: renderTitle('Europe'),
    options: [renderItem('London'), 
    renderItem('Paris'), 
    renderItem('Frankfurt'), 
    renderItem('Istanbul')],
  },
];

class Main extends Component {
  render() {
    return(
      <div>
          <Row className = "home-body">
            <Col span={24} className = "home-bg-col">
              <Row className = "home-detail">
                <Col span={8}></Col>
                <Col span={8} className = "home-detail-child">
                    <p className = "bg-title">Hi! Let's plan your next road trip efficiently! </p>
                    <AutoComplete
                      className = "home-search_bar"
                      dropdownClassName="certain-category-search-dropdown"                      
                      options={options}
                      filterOption={(inputValue, option) =>{
                        if (option.label.type === 'div') {
                          return option.label.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                        }
                      }
                      }
                    >
                    <Input.Search
                      className = "home-search_bar"
                      placeholder="Where do you want to go?"
                      onSearch = { (city) => {
                        history.push(`/searchResult/${city}`);
                      }}
                    />
                    
                    </AutoComplete>
                </Col>
                <Col span={8}></Col>
              </Row>
            </Col>
          </Row>
        </div>
    );
  }
}

export default Main;