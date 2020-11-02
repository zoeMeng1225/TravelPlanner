import React, { Component } from 'react';
import ImgContainer from './ImgContainer';
import LocationOptionList from './LocationOptionList';
import PropTypes from 'prop-types';
import {Button, Typography} from 'antd';
import RecommendPlanList from './RecommendPlanList';
import TravelSchedulePanel from "./TravelSchedulePanel";
import "../styles/SearchResult.css";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import history from "../history";

const {Text} =  Typography;

class ResultDisplayPanel extends Component {
    state = {
        recommendPlanList: [],
    }
    
    getRecommendPlans = (recommendPlanList)=>{
        this.setState({
            recommendPlanList: recommendPlanList,
        })
    }

    render() {
        const { cityName, cityImg, citySearchResult, selectedList, allTypes } = this.props;

        return ( 
            <BrowserRouter>
                <Router history={history}>
                    <div className="container">
                        <ImgContainer cityImg={cityImg} />
                        <Switch>
                            <Route exact path={`/searchResult/${cityName}`}>
                                <div className="recommend-div">
                                    Have no idea about the following places? <Text onClick = {this.props.switchToRecommendedPlans} underline> Click here</Text> to get inspiration!
                                </div>
                                <LocationOptionList
                                    updateSelectedLocation={this.props.updateSelectedLocation}
                                    switchToTravelSchedulePanel={this.props.switchToTravelSchedulePanel}
                                    selectedList={selectedList}
                                    citySearchResult={citySearchResult} 
                                    allTypes = {allTypes}
                                    filterByName={this.props.filterByName} 
                                    filterByType={this.props.filterByType} 
                                    sendRequest={this.props.sendRequest}
                                    pinOnMap={this.props.pinOnMap}
                                />
                            </Route>
                            <Route path={`/searchResult/${cityName}/recommendPlans`}>
                                <RecommendPlanList
                                    showOnMap={this.props.showOnMap}
                                    //planList={this.props.planList}
                                    cityName={this.props.cityName}
                                    getRecommendsBack = {this.getRecommendPlans}
                                />
                                <Button type="primary" className="backwardButton" onClick = {this.props.backToSearchResult}>Back to places list</Button>
                            </Route>
                            <Route path={`/searchResult/${cityName}/travelSchedule`} >
                                <TravelSchedulePanel 
                                    selectedList={selectedList}
                                    submitPlanFromTravelSchedule = {this.props.submitPlanFromTravelSchedule}
                                    savePlanFromTravelSchedule = {this.props.savePlanFromTravelSchedule}
                                />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </BrowserRouter>
        );
    }
}

ResultDisplayPanel.propTypes = {
    citySearchResult: PropTypes.array.isRequired,
    cityImg: PropTypes.string.isRequired,
    allTypes: PropTypes.array.isRequired,
};

export default ResultDisplayPanel;
