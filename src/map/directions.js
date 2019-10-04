import React, { Component } from "react";
import Geocoder from "react-map-gl-geocoder";
import { Marker } from "react-map-gl";
import DeckGL, { GeoJsonLayer, LineLayer } from "deck.gl";
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
        this.viewport = props.viewport;
        this.map = this.mapRef.current.getMap();
        console.log(this.map);

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
        console.log(this.markerLngStart, this.markerLatStart, this.markerTxtStart);

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

    //     getDirections = val => {
    //         const { markerLatStart, markerLngStart, markerLatEnd, markerLngEnd, } = this.state;
    //         var route = "";
    //         var data2 = " ";
    //         console.log(markerLatStart + " " + markerLngStart + " " + markerLatEnd + "  " + markerLngEnd)
    //          fetch('https://api.mapbox.com/directions/v5/mapbox/' + val + '/' + markerLngStart + ',' + markerLatStart + ';' + markerLngEnd + ',' + markerLatEnd + '?access_token=' + this.MAPBOX_TOKEN+"&geometries=geojson")
    //        // fetch(' https://api.mapbox.com/directions/v5/mapbox/driving/-73.989%2C40.733%3B-74%2C40.733.json?access_token=pk.eyJ1IjoiaW9kbyIsImEiOiJjazE3eDJiemgxZXlxM2VycXFidmw2NWI0In0.b60JvDgqnGqa95JBe1nWXQ&geometries=geojson')
    //         .then(res => res.json())
    //             .then((data) => {
    //                 console.log(data);
    //                 this.setState({ directions: data })
    //                  data2 = data.routes[0];
    //                  console.log(data2)
    //                  route = data2.geometry.coordinates;
    //                  console.log(route)
    //             })
    //             .catch(console.log)

    // ////////////////////////////////////////////////////////////////

    //     var geojson = {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: route
    //       }
    //     };
    //     console.log(geojson);
    //     // if the route already exists on the map, reset it using setData
    //         this.map.addLayer({
    //         id: 'route',
    //         type: 'line',
    //         source: {
    //           type: 'geojson',
    //           data: {
    //             type: 'Feature',
    //             properties: {},
    //             geometry: {
    //               type: 'LineString',
    //               coordinates: geojson
    //             }
    //           }
    //         },
    //         layout: {
    //           'line-join': 'round',
    //           'line-cap': 'round'
    //         },
    //         paint: {
    //           'line-color': '#3887be',
    //           'line-width': 15,
    //           'line-opacity': 0.75
    //         }
    //       });
    //       this.map.addLayer({
    //         id: 'routearrows',
    //         type: 'symbol',
    //         source: 'route',
    //         layout: {
    //           'symbol-placement': 'line',
    //           'text-field': '▶',
    //           'text-size': [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             12, 24,
    //             22, 60
    //           ],
    //           'symbol-spacing': [
    //             "interpolate",
    //             ["linear"],
    //             ["zoom"],
    //             12, 30,
    //             22, 160
    //           ],
    //           'text-keep-upright': false
    //         },
    //         paint: {
    //           'text-color': '#3887be',
    //           'text-halo-color': 'hsl(55, 11%, 96%)',
    //           'text-halo-width': 3
    //         }
    //       }, 'waterway-label');
    //     }

    getRoute = end => {
        // make a directions request using cycling profile
        // an arbitrary start will always be the same
        // only the end or destination will change
        var start = [-122.662323, 45.523751];
        var url = 'https://api.mapbox.com/directions/v5/mapbox/cycling/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + this.MAPBOX_TOKEN +"&geometries=geojson";
      
        // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
        var req = new XMLHttpRequest();
        req.responseType = 'json';
        req.open('GET', url, true);
        req.onload = () =>{
          var data = req.response.routes[0];
          var route = data.geometry.coordinates;
          var geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          };
          // if the route already exists on the map, reset it using setData
          if (this.map.getSource('route')) {
            this.map.getSource('route').setData(geojson);
          } else { // otherwise, make a new request
            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: geojson
                  }
                }
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#3887be',
                'line-width': 5,
                'line-opacity': 0.75
              }
            });
          }
          // add turn instructions here at the end
        };
        req.send();
      }
      
  

    getDirections = val => {

        this.map.on('click', function (e) {
            var coordsObj = e.lngLat;
            var coords = Object.keys(coordsObj).map(function (key) {
                return coordsObj[key];
            });
            var end = {
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: coords
                    }
                }
                ]
            };
            if (this.map.getLayer('end')) {
                this.map.getSource('end').setData(end);
            } else {
                this.map.addLayer({
                    id: 'end',
                    type: 'circle',
                    source: {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [{
                                type: 'Feature',
                                properties: {},
                                geometry: {
                                    type: 'Point',
                                    coordinates: coords
                                }
                            }]
                        }
                    },
                    paint: {
                        'circle-radius': 10,
                        'circle-color': '#f30'
                    }
                });
            }
            this.getRoute(coords);
        });
    }


    render() {
        const layer = new LineLayer({
            id: 'line-layer',
            pickable: true,
            getWidth: 50,
            getSourcePosition: d => d.from.coordinates,
            getTargetPosition: d => d.to.coordinates,
            getColor: d => [Math.sqrt(d.inbound + d.outbound), 140, 0],
            onHover: ({ object, x, y }) => {
                const tooltip = `${object.from.name} to ${object.to.name}`;
                /* Update tooltip
                   http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
                */
            }
        });
        const { markerLatStart, markerLngStart, markerTxtStart, markerLatEnd, markerLngEnd, markerTxtEnd, viewport } = this.state;
        return (
            <div  >
                <Marker className="marker2" latitude={markerLatStart} longitude={markerLngStart} offsetLeft={-20} offsetTop={-10}>
                    <p>{markerTxtStart}</p>
                </Marker>
                <Marker className="marker3" latitude={markerLatEnd} longitude={markerLngEnd} offsetLeft={-20} offsetTop={-10}>
                    <p>{markerTxtEnd}</p>
                </Marker>
                <DeckGL {...viewport} layers={[layer]} />
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