import React, { Component } from "react";
import Geocoder from "react-map-gl-geocoder";
import  { Marker } from "react-map-gl";
import  { GeoJsonLayer } from "deck.gl";
import './map.css';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


class Directions extends Component {
    state = {
        markerLatStart: 0.0,
        markerLngStart: 0.0,
        markerTxtStart: "",
        markerLatEnd: 0.0,
        markerLngEnd: 0.0,
        markerTxtEnd: "",
      };
    constructor(props) {

        super();
        console.log(props);
        this.MAPBOX_TOKEN = props.mapboxApiAccessToken;
        this.mapRef = props.mapRef;
        this.handleOnResult = props.onResult;
        this.handleGeocoderViewportChange = props.onViewportChange;
        console.log(this.MAPBOX_TOKEN);
    }

    
  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    });
  };

  handleOnResultStart = event => {
    console.log(event.result);
    this.markerLatStart = event.result.center[1];
    this.markerLngStart = event.result.center[0];
    this.markerTxtStart = event.result.text;
    console.log(this.markerLatStart, this.markerLngStart, this.markerTxtStart);

    this.setState({
      searchResultLayerStart: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      }),
      markerLatStart: this.markerLatStart,
      markerLngStart: this.markerLngStart,
      markerTxtStart: this.markerTxtStart
    });
  };

  handleOnResultEnd = event => {
    console.log(event.result);
    this.markerLatEnd = event.result.center[1];
    this.markerLngEnd = event.result.center[0];
    this.markerTxtEnd = event.result.text;
    console.log(this.markerLatEnd, this.markerLngEnd, this.markerTxtEnd);

    this.setState({
      searchResultLayerEnd: new GeoJsonLayer({
        id: "search-result",
        data: event.result.geometry,
        getFillColor: [255, 0, 0, 128],
        getRadius: 1000,
        pointRadiusMinPixels: 10,
        pointRadiusMaxPixels: 10,
      }),
      markerLatEnd: this.markerLatEnd,
      markerLngEnd: this.markerLngEnd,
      markerTxtEnd: this.markerTxtEnd
    });
  };
handleChange = val => {
    console.log(val);
    this.getDirections(val);
};

getDirections = val => {
    const {  markerLatStart, markerLngStart,markerLatEnd, markerLngEnd,   } = this.state;
    fetch('https://api.mapbox.com/directions/v5/mapbox/'+ val+'/'+markerLngStart+'%2C'+markerLatStart +'%3B'+markerLngEnd +'%2C'+markerLatEnd + '.json?access_token='+ this.MAPBOX_TOKEN, {mode: 'no-cors'})
    .then(res => res.json())
    .then((data) => {
        console.log(data);
      this.setState({ directions: data })
    })
    .catch(console.log)
   
}

    render() {
        const {  markerLatStart, markerLngStart, markerTxtStart,markerLatEnd, markerLngEnd, markerTxtEnd  } = this.state;
        return (
            <div className="buttons" >
                    <Marker className="marker2" latitude={markerLatStart} longitude={markerLngStart} offsetLeft={-20} offsetTop={-10}>
                        <p>{markerTxtStart}</p>
                    </Marker>
                    <Marker className="marker3" latitude={markerLatEnd} longitude={markerLngEnd} offsetLeft={-20} offsetTop={-10}>
                        <p>{markerTxtEnd}</p>
                    </Marker>
                <Geocoder
                    mapRef={this.mapRef} 
                    onResult={this.handleOnResultStart}
                    onViewportChange={this.handleGeocoderViewportChange}
                    mapboxApiAccessToken={this.MAPBOX_TOKEN}
                    position="top-right"
                />
                <Geocoder
                    mapRef={this.mapRef}
                    onResult={this.handleOnResultEnd}
                    onViewportChange={this.handleGeocoderViewportChange}
                    mapboxApiAccessToken={this.MAPBOX_TOKEN}
                    position="top-right"
                />
                <ButtonGroup   aria-label="Basic example" >
                    <Button variant="secondary"  onClick={()=>this.handleChange("Driving")}>Driving</Button>
                    <Button variant="secondary"  onClick={()=>this.handleChange("Walking")}>Walking</Button>
                    <Button variant="secondary"  onClick={()=>this.handleChange("Cycling")}>Cycling</Button>
                </ButtonGroup>
            </div>);
    }
}
export default Directions;