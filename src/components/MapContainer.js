import React, { Component } from 'react';
import { withGoogleMap, GoogleMap,  Marker, DirectionsRenderer, Polyline, InfoWindow } from 'react-google-maps';
import {  GoogleApiWrapper } from 'google-maps-react';
import axios from 'axios';


const MapWithMarker = withGoogleMap((props) => (
    
    <GoogleMap
        defaultCenter={ { lat: 34.0522342, lng: -118.2436849 } }
        defaultZoom={ 12 }
        center={props.cityCoordinate}
        zoom={props.zoom}
    >


        {props.markers.map( location => (
            <Marker
                icon={
                    {
                    path: 'M864 113.92C614.72-28.8 480 256 230.08 113.92l128 475.84c249.6 142.72 384-142.72 634.56 0zM123.2 38.72A50.24 50.24 0 0 0 49.6 96l240.32 896 96-25.92-240.32-896a50.24 50.24 0 0 0-22.4-31.36z',
                    anchor: new window.google.maps.Point(470,1021),
                    fillColor: '#e24f3d',
                    fillOpacity: 1.0,
                    strokeWeight: 0,
                    scale: 0.029,
                }}
                key={location.key}
                address = {location.formatted_address}
                name={location.name}
                position={{ lat: location.geometry.location.lat, lng: location.geometry.location.lng }}
                onClick={() => {props.onMarkerClick(location);}}        //Click on marker
            />

        ))}
        {props.activeMarker !== null && (
      <InfoWindow 
            position={{ lat: props.activeMarker.geometry.location.lat, lng: props.activeMarker.geometry.location.lng }}
            
            onCloseClick={() => {props.onMarkerClick(props.activeMarker);}}     //Close button
            options={
                {pixelOffset: new window.google.maps.Size(0,-29)}
            }
        >
        {props.inSearchResult ? 
        (
            <div className = "mapInfoBox">

          {
            props.activeMarker.formatted_photo != null ? 
            <div className = "img-box"> 
             <img src= {props.activeMarker.formatted_photo} alt=""/>
            </div> : 
            <div className = "img-box"> 
            <img src= {require('../asset/image/photo-1548104587-7d43cc9c95c5.jpeg')} alt=""/>
           </div>
          }
          
          <div>
            <div className = "mapInfoChild">
              <h3>{props.activeMarker.name}</h3>
              <span className = "mapInfoIcon">
                <img src={require('../asset/image/dizhi.svg')} alt=""/>
                <p>{props.activeMarker.formatted_address}</p>
              </span>
              {
                props.activeMarker.international_phone_number != null ? 
                <span className = "mapInfoIcon">
                <img src={require('../asset/image/dianhua.svg')} alt=""/>
                <p>{props.activeMarker.international_phone_number}</p>
                </span> : null
                }
              {
                props.activeMarker.business_status != null ? 
                <span className = "mapInfoIcon">
                  <img src={require('../asset/image/yingyeshijian.svg')} alt=""/>
                  <p>{props.activeMarker.business_status}</p>
                </span> : null
              }
              {
                props.activeMarker.price_level != null ? 
                <span className = "mapInfoIcon">
                  <img src={require('../asset/image/jiage.svg')} alt=""/>
                  <p>{props.activeMarker.price_level}</p>
              </span> : null
              }
              {
                props.activeMarker.website != null ? 
                <span className = "mapInfoIcon">
                  <img src={require('../asset/image/wangzhi.svg')} alt=""/>
                  <a href = {props.activeMarker.website} target="_blank">
                    <p id= "wordBreak">Visit the website</p>
                  </a>
              </span> : null 
              }
            </div>
          </div>
      </div>
        ) : (
            <h3>{props.activeMarker.name}</h3>
        )
        
        }
        
    </InfoWindow>
        )}
        {props.responseData.map( route => (
            <React.Fragment key={route.key}>
                <DirectionsRenderer
                    directions={route}
                    options={{
                        polylineOptions: {
                            strokeOpacity: 0,
                            strokeColor: route.actualColor,
                            clickable: false,
                        },
                        preserveViewport: true,
                        markerOptions: {
                            visible: route.markerVisible,
                            clickable: false,
                        },
                }}
                />
                <Polyline
                    path={route.routes[0].overview_path}
                    options={{
                        strokeColor: route.actualColor,
                    }}
                    onClick={()=>{
                        props.onRouteClick(route);
                    }}
                />
            </React.Fragment>
        )) }
    </GoogleMap>
)); 


export class MapContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeMarker: null,
            selectedPlaces: this.props.selected,
            responseData:[],
            cityCoordinate: this.props.cityCoordinate,
            zoom: this.props.zoom,
           
            inSearchResult: true,
            InfoWindow_state : {
              formatted_address:"",
              international_phone_number:"",
              website:"",
              opening_hours:null,
              price_level:null,
              photos : [{photo_reference : ""}]
            }
        }

    }

    onRouteClick = (route) => {
        let newResponseData = this.state.responseData;
        let highlight = this.state.highlight;

        if(highlight === null) {
            highlight = route;
            newResponseData = newResponseData.map(entry => {
                if(entry !== route) {
                    entry.actualColor = '#b2b2b2';
                    entry.markerVisible = false;
                }
                
                return entry;
            })
        }else if(highlight !== null && route === highlight) {
            highlight = null;
            newResponseData = newResponseData.map(entry => {
                
                entry.actualColor = entry.color;
                entry.markerVisible = true;
                
                return entry;
            })
        }else if(highlight !== null && route !== highlight) {
            highlight = route;
            newResponseData = newResponseData.map(entry => {
                if(entry === route) {
                    entry.actualColor = entry.color;
                    entry.markerVisible = true;
                } else {
                    entry.actualColor = '#b2b2b2';
                    entry.markerVisible = false;
                }
                return entry;
            })
        }

        this.setState({
            responseData: []
        }, () => this.updateRoute(highlight, newResponseData))
        
    }

    updateRoute = (highlight, newResponseData) => {
        this.setState({
            highlight: highlight,
            responseData: newResponseData,
        })
    }
    
  
    onMarkerClick = (location) => {
        let newActive = this.state.activeMarker;
        let newCenter = this.state.cityCoordinate;
        if(newActive === location) {
            newActive = null;
        } else {
            newActive = location;
            newCenter = { lat: location.geometry.location.lat, lng: location.geometry.location.lng }
            
        }
        
        console.log("------->>>>>", newActive)
        if(newActive != null && newActive.place_id !== undefined){
          const URL = `http://localhost:8080/travelplanner/detail?id=${newActive.place_id}`;
          axios.get(URL).then((res) => {
            const result = res.data.responseObj.result;
            
            // console.log("------->>>>>",result.result.name)
            // console.log("------->>>>>", result.formatted_address)
        
            newActive.formatted_address = result.formatted_address === null ? null : result.formatted_address;
            newActive.international_phone_number = result.international_phone_number  === null ? null : result.international_phone_number;
            newActive.website = result.website === null ? null : result.website;
            newActive.opening_hours = result.opening_hours  === null ? null : result.opening_hours;
            newActive.price_level = result.price_level === null ? null : result.price_level;
            newActive.formatted_photo = result.photos === null ? null : result.photos[0].photo_reference;
            this.setState({
              activeMarker: newActive,
              cityCoordinate: newCenter,
              inSearchResult: true
            },() => {this.props.updateCenter(newCenter)})
          }).catch((err) => {
            console.log("err in fetch cityInfo -> ", err);
          })
        }else{
          this.setState({
            activeMarker: newActive,
            cityCoordinate: newCenter,
            inSearchResult: false
          },() => {this.props.updateCenter(newCenter)})
        }
        

        // this.setState({
        //     activeMarker: newActive,
        //     cityCoordinate: newCenter
        // },() => {this.props.updateCenter(newCenter)});
    }

    componentDidUpdate(prevProps, prevState) {
        
        if(prevProps.selected !== this.props.selected) {
            
            let newActiveMarker = this.state.activeMarker;
            
            if(!this.props.selected.some(location => location === newActiveMarker)) {
                newActiveMarker = null;
            }

            this.setState( {
                selectedPlaces: this.props.selected,
                cityCoordinate: this.props.cityCoordinate,
                zoom: this.props.zoom,
                responseData: this.props.responseData,
                activeMarker: newActiveMarker,
                
            })
        }
    }

    render(){
        // check if there is a container class (left panel height), if not set default to 120% viewport height
        const height = document.getElementsByClassName("container").length == 0 ? "120vh" : document.getElementsByClassName("container")[0].clientHeight;
        return(
        <div>
            <MapWithMarker
                className = "Map"
                // Map setting                
                containerElement={<div style={{height: height, width: "100%"}} />}
                loadingElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}

                // Markers and routes data
                markers={this.state.selectedPlaces}
                cityCoordinate={this.state.cityCoordinate}
                responseData={this.state.responseData}
                onRouteClick = {this.onRouteClick}
                inSearchResult = {this.state.inSearchResult}
                
                onMarkerClick={this.onMarkerClick}
                activeMarker={this.state.activeMarker}
                showingInfoWindow={this.state.showingInfoWindow}
                selectedPlaces={this.selectedPlaces}
                zoom={this.state.zoom}
            />
        </div>
        );
    }
  }

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAitfwUxAM070XRx72zctpECLYsj7bj0jg'
})(MapContainer);


