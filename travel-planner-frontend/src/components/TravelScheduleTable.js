import React, { Component } from 'react';
import { Transfer, Table, Tag } from 'antd';
import difference from 'lodash/difference';
import "../styles/SearchResult.css";

import ReactDragListView from 'react-drag-listview/lib/index.js';

import { MenuOutlined } from '@ant-design/icons';

const leftTableColumns = [
    {
        dataIndex: 'title',
        title: 'Name',
    },
    {
        dataIndex: 'type',
        title: 'Type',
        render: type => <Tag>{type}</Tag>,
    },
    {
        dataIndex: 'rating',
        title: 'Rating',
    },
];
const rightTableColumns = [
    {
        dataIndex: 'title',
        title: 'Name',
    },
    {
        dataIndex: 'type',
        title: 'Type',
        render: type => <Tag>{type}</Tag>,
    },
    {
        title: "Drag",
        key: "operate",
        // render: (text, record, index) => <a className="drag-handle" href="#">Drag</a>
        render: (text, record, index) => <a className="drag-handle" href="#" > <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} /> </a>
    },
];

class TravelScheduleTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            targetKeys: [],  //* A set of keys of elements that are listed on the right column
            dataResource: [],
            paneKey: 0,
        };

        const that = this;
        this.dragProps = {
            onDragEnd(fromIndex, toIndex) {
                console.log("targetKey order in right transfer:", that.state.targetKeys);
                const data = [...that.state.targetKeys];
                const item = data.splice(fromIndex, 1)[0];
                data.splice(toIndex, 0, item);
                that.setState({
                    targetKeys: data,
                });
                const paneKey = that.state.paneKey;
                that.props.changePlanOrder(data, paneKey);
            },
            handleSelector: "a",
        };
    }

    //* Methods for the TableTransfer widget
    onChange = nextTargetKeys => {
        const { targetKeys, paneKey } = this.state;

        if (nextTargetKeys.length > targetKeys.length) {
            // left -> right 
            this.props.itemTransferToLocal(nextTargetKeys, paneKey);
        } else {
            // right -> left
            const removeList = [];
            for (let i = 0; i < targetKeys.length; i++) {
                if (!nextTargetKeys.includes(targetKeys[i])) {
                    removeList.push(targetKeys[i]);
                }
            }
            this.props.itemTransferToGlobal(removeList, paneKey);
        }

        this.setState({
            targetKeys: nextTargetKeys,
        });
    };

    render() {
        const { targetKeys } = this.state;

        // Customize Table Transfer
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={true}>
                {({
                    direction,
                    filteredItems,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;

                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({ key }) => key);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ key }, selected) {
                            onItemSelect(key, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };

                    return (
                        <ReactDragListView {...this.dragProps}>
                            <Table
                                rowSelection={rowSelection}
                                columns={columns}
                                dataSource={filteredItems}
                                size="small"
                                style={{ pointerEvents: listDisabled ? 'none' : null }}
                                onRow={({ key, disabled: itemDisabled }) => ({
                                    onClick: () => {
                                        if (itemDisabled || listDisabled) return;
                                        onItemSelect(key, !listSelectedKeys.includes(key));
                                    },
                                })}
                            />
                        </ReactDragListView>
                    );
                }}
            </Transfer>
        );
        
        return (
            <div className="travelScheduleContainer">
                <TableTransfer
                    dataSource={this.props.selectedAttractions}
                    targetKeys={targetKeys}
                    onChange={this.onChange}
                    leftColumns={leftTableColumns}
                    rightColumns={rightTableColumns}
                />
            </div>
        )
    }

    componentDidMount() {
        const { selectedAttractions, paneKey } = this.props;
        this.setState({
            dataResource: selectedAttractions,
            paneKey
        });
    }
}

export default TravelScheduleTable;
