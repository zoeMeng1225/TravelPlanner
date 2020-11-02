import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button,Input} from 'antd';
import TravelScheduleTable from './TravelScheduleTable';
import "../styles/SearchResult.css";
import { Tabs } from 'antd';
import {EditOutlined} from '@ant-design/icons';


const { TabPane } = Tabs;

class TravelSchedulePanel extends Component {

    newTabIndex = 0;

    constructor(props) {
        super(props);
        this.newTabIndex = 3;
        const initialPanes = [
            { title: 'Day 1', content: 'Content of Tab Day 1', key: '1', closable: false, },    // At least there is 1-day plan.
            { title: 'Day 2', content: 'Content of Tab Day 2', key: '2', closable: true,  },
        ];
        this.state = {
            activeKey: initialPanes[0].key,
            panes: initialPanes,
            selectedAttractions: [],
            planName: "",
            plan: [[],[]]
        };
    }

    //* Methods for the Tab widget
    onChange = activeKey => {
        this.setState({ activeKey });
    };

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };

    add = () => {
        const { panes, plan } = this.state;
        const activeKey = `${this.newTabIndex++}`;

        const newPanes = [...panes];
        newPanes[newPanes.length - 1].closable = false;
        newPanes.push({ title: `Day ${panes.length + 1}`, content: `Content of Tab Day ${panes.length + 1}`, key: activeKey, closable: true });
        plan.push([]);
        this.setState({
            panes: newPanes,
            activeKey,
            plan,
        });
    };

    remove = targetKey => {
        const { panes, activeKey, plan } = this.state;
        let newActiveKey = activeKey;
        let lastIndex;
        panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = panes.filter(pane => pane.key !== targetKey);
        if(newPanes.length > 1) {
            newPanes[newPanes.length - 1].closable = true;
        }
        plan.pop();
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
        }
        this.newTabIndex--;
        this.setState({
            panes: newPanes,
            activeKey: newActiveKey,
            plan,
        });
    };

    updateDataResource = selectedList => {
        const data = [];
        selectedList.forEach(item => {
            data.push({
                key: item.key,   //? what's the real value of the key per item?
                title: item.name,
                rating: item.rating,
                type: item.types[0],
                paneKey: 0,        //* initially set all items to paneKey 0
            });
        });

        this.setState({
            selectedAttractions: data,
        });
    };

    itemTransferToLocal = (nextTargetKeys, paneKey) => {
        // console.log(nextTargetKeys);

        const index = paneKey - 1;
        const plan = this.state.plan;
        plan[index] = nextTargetKeys;
        // nextTargetKeys.map((key) => {
        //     plan[index].push(key);
        // });

        this.setState({
            selectedAttractions: this.state.selectedAttractions.map(item => {
                if (nextTargetKeys.includes(item.key)) {
                    item.paneKey = paneKey;
                }
                return item;
            }),
            plan,
        });
    };

    itemTransferToGlobal = (keyList, paneKey) => {
        // console.log(keyList);

        const index = paneKey - 1;
        const plan = this.state.plan;
        plan[index] = plan[index].filter((key) => {
            return !keyList.includes(key);
        });

        this.setState({
            selectedAttractions: this.state.selectedAttractions.map(item => {
                if (keyList.includes(item.key)) {
                    item.paneKey = 0;
                }
                return item;
            }),
            plan,
        });
    }

    changePlanOrder = (targetKeys, paneKey) => {
        const index = paneKey - 1;
        let plan = this.state.plan;
        plan[index] = targetKeys;
        this.setState(
            plan,
        )
    }
    

    render() {
        const { panes, activeKey, selectedAttractions } = this.state;
        return (
            <div className="tabsContainer">
                <Tabs
                    type="editable-card"
                    onChange={this.onChange}
                    activeKey={activeKey}
                    onEdit={this.onEdit}
                >

                    {panes.map(pane => (
                        <TabPane tab={pane.title} key={pane.key} closable={pane.closable} >
                            <TravelScheduleTable
                                itemTransferToLocal={this.itemTransferToLocal}
                                itemTransferToGlobal={this.itemTransferToGlobal}
                                paneKey={pane.key}
                                selectedAttractions={selectedAttractions.filter(item => item.paneKey === 0 || item.paneKey === pane.key)} 
                                // we need to change the plan order after drag reordering the attractions on the right transfer
                                changePlanOrder={this.changePlanOrder}
                            />
                        </TabPane>
                    ))}
                </Tabs>
                <div className="noteInfo">
                <span><strong>Note</strong>: <u>Order of attractions</u> visited for each day is displayed in the right box</span>
                </div>
                <div className = "btnG">
                    <div className = "planName">
                      <Input 
                      className = "btnGInput"
                      placeholder=" Name your plan" 
                      prefix={<EditOutlined />} 
                      onChange = {(e) => {
                          this.setState({
                          planName: e.target.value.trim()
                      })}
                      }/>
                      <Button id = "btn2"
                              disabled = {this.state.planName === "" ? true : false}
                              onClick = {() => this.props.savePlanFromTravelSchedule(this.state.planName, this.state.plan)}>
                                  Save Plan
                      </Button>
                    </div>
                
                    <Button id = "btn1" 
                            onClick = {() => this.props.submitPlanFromTravelSchedule(this.state.plan)}>
                      Show on map</Button>        
                </div>
                
            </div>
        );
    }

    componentDidMount() {
        const { selectedList } = this.props;
        this.updateDataResource(selectedList);
    }
}

TravelSchedulePanel.propTypes = {
    selectedList: PropTypes.array.isRequired,
}

export default TravelSchedulePanel;
