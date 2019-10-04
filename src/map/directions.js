import React, { Component } from "react";
import Geocoder from "react-map-gl-geocoder";
import { Marker } from "react-map-gl";
import { GeoJsonLayer } from "deck.gl";
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
        this.map = props.map;
        console.log(this.MAPBOX_TOKEN);
        console.log(  this.map);

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
        const { markerLatStart, markerLngStart, markerLatEnd, markerLngEnd, } = this.state;
        console.log(markerLatStart + " " + markerLngStart + " " + markerLatEnd + "  " + markerLngEnd)
        fetch('https://api.mapbox.com/directions/v5/mapbox/' + val + '/' + markerLngStart + ',' + markerLatStart + ';' + markerLngEnd + ',' + markerLatEnd + '?access_token=' + this.MAPBOX_TOKEN)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ directions: data })
            })
            .catch(console.log)

          


        const layerLine = {
            'id': 'lines',
            'type': 'line',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'properties': {
                            'color': '#F7455D' // red
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [-122.4833858013153, 37.829607404976734],
                                [-122.4830961227417, 37.82932776098012],
                                [-122.4830746650696, 37.82932776098012],
                                [-122.48218417167662, 37.82889558180985],
                                [-122.48218417167662, 37.82890193740421],
                                [-122.48221099376678, 37.82868372835086],
                                [-122.4822163581848, 37.82868372835086],
                                [-122.48205006122589, 37.82801003030873]
                            ]
                        }
                    }]
                }
            }
        }


    }

    render() {
        const { markerLatStart, markerLngStart, markerTxtStart, markerLatEnd, markerLngEnd, markerTxtEnd } = this.state;
        return (
            <div  >
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
                <ButtonGroup aria-label="Basic example" className="buttonsChoice" >
                    <Button variant="secondary" onClick={() => this.handleChange("driving")}>Driving</Button>
                    <Button variant="secondary" onClick={() => this.handleChange("walking")}>Walking</Button>
                    <Button variant="secondary" onClick={() => this.handleChange("cycling")}>Cycling</Button>
                </ButtonGroup>
            </div>);
    }
}
export default Directions;