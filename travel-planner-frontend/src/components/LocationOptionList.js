import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/SearchResult.css';
import { Menu, Dropdown, Button, Input, message, Tooltip, Tag, Table} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: [
      '//at.alicdn.com/t/font_2064551_fho540f8c18.js' // Search route icon
    ],
  });

class LocationOptionList extends Component {
    // set the table header name
    columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '40%'
            // render: text => <a>{text}</a>,
        },
        {
            title: 'Type',
            dataIndex: 'types',
            width: '40%',
            render: types => types.map((key, index) => {
                return (
                    <Tag key={index} name={key}>
                        {key}
                    </Tag>
                )
            })
        },
        {
            title: 'rating',
            dataIndex: 'rating',
            render: rating => rating === 0 ? 'N/A' : rating,
            width: '20%',
            sorter: (a, b) => a.rating - b.rating,
            sortDirections: ['descend', 'ascend'],
        },
    ];
    
    // rowSelection object indicates the need for row selection
    rowSelection = {
        preserveSelectedRowKeys: true,              //* Keep selection key even when it removed from dataSource
        onChange: (selectedRowKeys, selectedRows) => {
            //* selectedRowKeys indicates the id for the selected row
            //* selectedRows indicates the objects array of all the selected rows
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.props.updateSelectedLocation(selectedRowKeys);
            this.props.pinOnMap(selectedRows);
            //console.log("clicked", selectedRows);
            //console.log(selectedRowKeys);
        }
    };

    //* filter by type
    filterByType = (e) => {
        const type = e.item.props.name;
        
        message.info('Display all ' + type + ' locations');
        this.props.filterByType(type);
    }

    //* filter by name
    filterByName = (value) => {
        this.props.filterByName(value);
    }

    render() {
        const { citySearchResult, selectedList, allTypes } = this.props;

        const menus = allTypes.map((key, index) => {
            return (
            <Menu.Item key={index} name={key} onClick={this.filterByType}>
                {key}
            </Menu.Item>
            )
        });

        const menu = () => {
            return (
                <Menu>
                    {menus}
                </Menu>
            )
        }

        return (
            <div className = "result-table">
                <div className="filterContainer" style={{ display: "flex", width: 420 }}>
                    <Dropdown overlay={menu}>
                        <Button className = "filterBtn filter-child">
                            Type <DownOutlined />
                        </Button>
                    </Dropdown>

                    <Input
                        className = "filterInput filter-child"
                        style={{ marginLeft: 10 }}
                        placeholder="filter by name"
                        onChange={e => this.filterByName(e.target.value)}   //? onChange or onSearch need to be discussed
                    />
                </div>

                <div className='tableContainer'>
                    <Table
                        rowSelection={{ ...this.rowSelection }}
                        columns={this.columns}
                        dataSource={citySearchResult}
                        pagination={{ pageSize: 5 }}
                    />
                    <Button
                            className="search-route" 
                            type="primary" 
                            disabled={selectedList.length < 2 ? true : false}
                            onClick={this.props.switchToTravelSchedulePanel}>
                            Start Planning
                    </Button>    
                </div>
            </div>
        );
    }
}

LocationOptionList.propTypes = {
    citySearchResult: PropTypes.array.isRequired,
    selectedList: PropTypes.array.isRequired,
}

export default LocationOptionList;
