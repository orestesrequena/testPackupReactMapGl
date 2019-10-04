import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { Component } from "react";
import { render } from "react-dom";
import MapGL, { Marker, SVGOverlay } from "react-map-gl";
import DeckGL, { GeoJsonLayer, LineLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";
import Directions from "./directions";
import './map.css';


// Please be a decent human and don't abuse my Mapbox API token.
// If you fork this sandbox, replace my API token with your own.
// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN = "pk.eyJ1IjoiaW9kbyIsImEiOiJjazE3eDJiemgxZXlxM2VycXFidmw2NWI0In0.b60JvDgqnGqa95JBe1nWXQ";

class Map extends Component {
  state = {
    viewport: {
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    searchResultLayer: null,
    markerLat: 0.0,
    markerLng: 0.0,
    markerTxt: "",
  };

  mapRef = React.createRef()

  redraw({project}) {
    const [cx, cy] = project([-122, 37]);
    return <circle cx={cx} cy={cy} r={4} fill="blue" />;
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

  handleOnResult = event => {
    console.log(event.result);
    this.markerLat = event.result.center[1];
    this.markerLng = event.result.center[0];
    this.markerTxt = event.result.text;
    console.log(this.markerLat, this.markerLng, this.markerTxt);

    this.setState({
      searchResultLayer: 
      // new GeoJsonLayer({
      //   id: "search-result",
      //   data: event.result.geometry,
      //   getFillColor: [255, 0, 0, 128],
      //   getRadius: 1000,
      //   pointRadiusMinPixels: 10,
      //   pointRadiusMaxPixels: 10,
      // }),
      new LineLayer({
        id: 'line-layer',
        pickable: true,
        getWidth: 50,
        getSourcePosition: [
          2.493896484375,
          50.708634400828224
        ],
        getTargetPosition: [
          3.2080078125,
          50.233151832472245
        ],
        getColor: "#2d1cff",
        // onHover: ({object, x, y}) => {
        //   const tooltip = `${event.result.text} to ${event.result.text}`;
        //   /* Update tooltip
        //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
        //   */
        // }
      }),
      markerLat: this.markerLat,
      markerLng: this.markerLng,
      markerTxt: this.markerTxt
    });
  };

  render() {

    const { viewport, searchResultLayer, markerLat, markerLng, markerTxt } = this.state;
    console.log(searchResultLayer);
    let view = false;
    console.log(markerLat, markerLng, markerTxt);
    if (markerLng !== 0) {
      view = true
    }
    return (
      <div style={{ height: "100vh" }}>
        <MapGL
          // ref={(reactMap) => this.reactMap = reactMap}
          ref={this.mapRef}
          {...viewport}
          width="100%"
          height="100%"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}

        >
           <SVGOverlay redraw={this.redraw} />
          <Directions
            // map = {this.map}
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN} />
          <Marker className="marker" latitude={37.78} longitude={-122.41} offsetLeft={-20} offsetTop={-10}>
            <p></p>
          </Marker>
          {view ? <Marker className="marker" latitude={markerLat} longitude={markerLng} offsetLeft={-20} offsetTop={-10}> </Marker> : null}
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
          />
          <DeckGL {...viewport} layers={[searchResultLayer]} />


        </MapGL>
      </div>
    );
  }
}

render(<Map />, document.getElementById("root"));
export default Map;
