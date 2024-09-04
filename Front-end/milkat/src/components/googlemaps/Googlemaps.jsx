import React, { useState } from "react";
import styles from "./googlemaps.module.scss";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Marker,
} from "@vis.gl/react-google-maps";

function Googlemaps({ props }) {
  const address = props.address;
  const pos = props.location.split(",");
  const latitude = Number(pos[0]);
  const longitude = Number(pos[1]);
  const position = { lat: latitude, lng: longitude };
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className={styles.map}>
        <Map defaultZoom={20} defaultCenter={position}>
          <Marker position={position} onClick={() => setOpen(true)}></Marker>
          {open && (
            <InfoWindow
              position={position}
              onCloseClick={() => {
                setOpen(false);
              }}
            >
              <div>
                <p>{address}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}

export default Googlemaps;
