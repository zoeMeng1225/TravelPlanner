import React, { Component } from "react";
import SearchResultHeader from "./SearchResultHeader";
import ResultDisplayPanel from "./ResultDisplayPanel";
import MapContainer from "./MapContainer";
import "../styles/SearchResult.css";
import axios from "axios";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { Travel_Plan_BASE_URL } from "../constant";
import { sendRequest, zoomBefore, zoomAfter } from "./RouteUtils";
import history from "../history";
import uuid from "react-uuid";


class SearchResult extends Component {
    state = {
        cityName: "New York",
        cityCoordinate: null,
        zoom: 12,
        cityImg: "https://media.nomadicmatt.com/laguide1.jpg",
        citySearchResult: [],
        allTypes: [],
        filterTypeName: "",
        markers: [],
        result: [],
        isDraw: false,
        recommendPlanList: [],
        planList : [],
        routes: [],      
        savedPlanList : [],
    };

    getRecommendPlans = (recommendPlanList) =>{
      this.setState({
        recommendPlanList: recommendPlanList
      })       
    }

    pinOnMap = (markers) => {
        this.setState(
            {
              markers: markers,
            }
        );
    };

    updateCenter = (newCenter) => {
      this.setState({
        cityCoordinate: newCenter,
      })
    }

    showOnMap = (plan) => {
        const routes = [];
        let markers = [];
        plan.map((day) =>{
            routes.push(day.route);
            markers = markers.concat(day.route);
        });
        for(let i = 0; i < markers.length; i++) {
          markers[i].key = i;
        }

        this.setState({
            routes: routes,
            markers: markers,
        }, this.sendRequest);
    };
    
    color = ['#411b5e', '#0026ff', '#22bab5', '#55ff00', '#aaff00', '#ffff00', '#ffbb00', '#ff9900', '#ff5500', '#ff3300', '#bf2a2a', '#780765', '#000000'];

    //send route request
    sendRequest = () => {

      const routes = this.state.routes;
      const markers = this.state.markers;

      this.setState({
        result: [],
        markers: [],
        zoom: zoomBefore,
        }, ()=> {
          let lat = [];
          let lng = [];
          for(let i = 0; i < routes.length; i++) {
            for(let j = 0; j < routes[i].length; j++) {
              lat.push(routes[i][j].geometry.location.lat);
              lng.push(routes[i][j].geometry.location.lng);
            }
            if(routes[i].length < 2) {
              continue;
            }
            sendRequest(routes[i], (response) => {
                let newResult = this.state.result;
                // response.color=randomColor({
                //     luminosity: 'random',
                //     hue: 'random'
                //  });
                response.color=this.color[i];
                response.actualColor=response.color;
                response.markerVisible = true;
                response.key=i+1;
                newResult.push(response);
                // newResult = [response];
                this.setState(
                    { 
                        result: newResult,
                        isDraw: true,
                        zoom: zoomAfter,
                        markers: markers
                        
                    });
            });
        }

        function avg(array)  {
          if(array.length === 0) {
            return null;
          } else if(array.length === 1) {
            return array[0];
          } else {
            let max = array[0];
            let min = array[0];
            for(let k = 0; k < array.length; k++) {
              max = array[k] > max ? array[k] : max;
              min = array[k] < min ? array[k] : min;
            }
            return (max + min) / 2;
          }
          
        }
        let latAvg = avg(lat);
        let lngAvg = avg(lng);
        if(latAvg !== null) {
          const cityCoordinate = {
            lat: latAvg,
            lng: lngAvg
          }
          this.setState({
            cityCoordinate: cityCoordinate,
          })
        }
        
    })
        

    }

    switchToTravelSchedulePanel = () => {
        //this.sendRequest();

        //* switch to the travelSchedulePanel component
        const { match: { params } } = this.props;
        history.push(`/searchResult/${params.city}/travelSchedule`);
    }

    switchToRecommendedPlans = () =>{
      // const { match: { params } } = this.props;
      // const cityName = params.city;
      if(localStorage.getItem("userInfo") != null){
        history.push(`/searchResult/${this.state.cityName}/recommendPlans`);
      } else{
        history.push({
          pathname: "/login",
          state: {
            target: `${this.state.cityName}/recommendPlans`,
          }
        });
      }  
    }

    backToSearchResult = () =>{
      this.setState({
        result: [],
        markers:[]
      });
      const { match: { params } } = this.props;
      history.push(`/searchResult/${params.city}`);
    }
    
    submitPlanFromTravelSchedule = (plan) => {
      console.log("show on map", plan);
      const routes = [];

      plan.map((day) => {
          const route = [];
          day.map((attraction) => {
            route.push(this.state.citySearchResult[parseInt(attraction)]);
          });
          routes.push(route)
      });

      this.setState({
          routes: routes,
      }, this.sendRequest);
    }

    savePlanFromTravelSchedule = (planName, plan) => {
      console.log("saved plan:",plan);
      const routes = [];

      plan.map((day) => {
          const route = [];
          day.map((attraction) => {
            route.push(this.state.citySearchResult[parseInt(attraction)]);
          });
          routes.push(route)
      });

      this.setState({
          routes: routes,
      }, () => {

      //format routeDataList
      let routeDataList = [];
      for(let i = 0; i < this.state.routes.length; i++) {
        if(this.state.routes[i].length == 0) {
          continue;
        } 
        let attractionDataList = [];
        for(let j = 0; j < this.state.routes[i].length; j++) {
          let attraction = this.state.routes[i][j];
          let newAttraction = {
            attactionId: 0,
            attractionName: attraction.name,
            geometry: attraction.geometry,
            type: attraction.types.join(","),
            rating: attraction.rating
          }
          attractionDataList.push(newAttraction);
        };
        let routeObject = {
          routeId: 0,
          day: i+1,
          attractionDataList: attractionDataList
        };
        routeDataList.push(routeObject);
      }

      //construct payload
      const plan = {
        //username: String,
        planDataList: [{
          planId: 0,
          cityId: 0,
          planName: planName,
          city: this.state.cityName,
          routeDataList: routeDataList,
        }]
      }

      // console.log(plan);

      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if(userInfo) {
        const url = Travel_Plan_BASE_URL + `/addplan`;
        plan.username = userInfo.userName;
        
        axios
        .post(url, plan)
        .then((response) => {
          if(response.data.responseCode === "200") {
            history.push({
              pathname: `/savedRoute`,
              state: {
                target: `${this.props.match.params.city}`
              }
            });
          }
        })
        .catch((error) => {
          console.log("err in saving plan -> ", error);
        });
        
      } else {
  
        const planId = uuid();
        localStorage.setItem(planId, JSON.stringify(plan));

        history.push({
          pathname: `/login`,
          state: {
            planId: planId,
            target: `${this.props.match.params.city}/travelSchedule`
          }
        });

      }

      });
    
    }

    filterByName = (value) => {
        this.setState({
            citySearchResult: this.state.citySearchResult.map((res) => {
                if (res.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    res.display = true;
                } else {
                    res.display = false;
                }
                return res;
            }),
        });
    };

    filterByType = (type) => {
        this.setState({
            filterTypeName: type,
        });
    };

    updateSelectedLocation = (selectedRowKeys) => {
        this.setState({
            citySearchResult: this.state.citySearchResult.map((res) => {
                if (selectedRowKeys.includes(res.key)) {
                    res.checked = true;
                } else {
                    res.checked = false;
                }
                return res;
            }),
        });
    };

    componentDidMount() {
        // todo: put into const file
        //console.log("page refreshed");
        const url =
            Travel_Plan_BASE_URL + `/search?city=${this.props.match.params.city}`;
        axios
            .get(url)
            .then((response) => {
                // console.log('response: ',response);
                //console.log('response: ',response.data.responseObj.results);
                //console.log(response.data.responseObj.allTypes);
                this.setState({
                    cityCoordinate: {
                        lat: response.data.responseObj.coordinate[0],
                        lng: response.data.responseObj.coordinate[1],
                    },
                    cityName: response.data.responseObj.cityName,
                    citySearchResult: response.data.responseObj.results,
                    allTypes: response.data.responseObj.allTypes,
                    markers: [],
                });
            })
            .catch((error) => {
                console.log("err in fetch cityInfo -> ", error);
            });
    }

    render() {
        const { cityImg, citySearchResult, allTypes, markers } = this.state;
        const { match: { params } } = this.props;


        return (
            <BrowserRouter>
                <Router history={history}>
                    <div className="searchResult-container">
                        <SearchResultHeader 
                        cityName = {this.props.match.params.city}/>
                        <div className="main">
                            <div className="left-side">                               
                                    <Route path={`/searchResult/${params.city}`}>
                                        <ResultDisplayPanel
                                            updateSelectedLocation={this.updateSelectedLocation}
                                            citySearchResult={citySearchResult.filter(
                                                (res) =>
                                                    res.display === true &&
                                                    (res.types.includes(this.state.filterTypeName) ||
                                                        !this.state.filterTypeName ||
                                                        this.state.filterTypeName === "All")
                                            )}
                                            allTypes={allTypes}
                                            cityName={params.city}
                                            cityImg={cityImg}
                                            filterByName={this.filterByName}
                                            filterByType={this.filterByType}
                                            selectedList={citySearchResult.filter(
                                                (item) => item.checked === true
                                            )}
                                            switchToTravelSchedulePanel={this.switchToTravelSchedulePanel}
                                            switchToRecommendedPlans={this.switchToRecommendedPlans}
                                            backToSearchResult={this.backToSearchResult}
                                            pinOnMap={this.pinOnMap}
                                            showOnMap = {this.showOnMap}
                                            //planList = {this.state.planList}
                                            savePlanFromTravelSchedule = {this.savePlanFromTravelSchedule}
                                            recommendPlanList = {this.state.recommendPlanList}
                                            submitPlanFromTravelSchedule = {this.submitPlanFromTravelSchedule}/>
                                    </Route>
                            </div>
                            <div className="right-side">
                                  <Route path={`/searchResult/${params.city}`}>
                                    <MapContainer
                                        cityCoordinate={this.state.cityCoordinate}
                                        // selected={citySearchResult.filter(
                                        //     (item) => item.checked === true
                                        // )}
                                        selected={markers}
                                        responseData={this.state.result}
                                        zoom={this.state.zoom}
                                        updateCenter={this.updateCenter}
                                    />
                                  </Route>
                            </div>
                        </div>
                    </div>
                </Router>
            </BrowserRouter>
        );
    }
}

export default SearchResult;
