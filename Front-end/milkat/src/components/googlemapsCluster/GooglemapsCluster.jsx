import React, { useState } from "react";
import styles from "./googlemapsCluster.module.scss";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Marker,
} from "@vis.gl/react-google-maps";

function GooglemapsCluster({ props }) {
  const [open, setOpen] = useState(null);

  const extractLocations = (data) => {
    return data.map((item) => {
      const [lat, lng] = item.location.split(",").map(Number); // Split and convert to numbers
      return { position: { lat, lng }, address: item.address_line1 };
    });
  };

  const LocationList = extractLocations(props);

  return (
    <div className={styles.container}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <div className={styles.map}>
          {LocationList.length > 0 && (
            <Map defaultZoom={15} defaultCenter={LocationList[0].position}>
              {LocationList.map((item, index) => (
                <>
                  <Marker
                    key={item.lat}
                    position={item.position}
                    onClick={() => setOpen(index)}
                  />

                  {open === index && (
                    <InfoWindow
                      position={item.position}
                      onCloseClick={() => {
                        setOpen(false);
                      }}
                    >
                      <div>
                        <p>{item.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </>
              ))}
            </Map>
          )}
        </div>
      </APIProvider>
    </div>
  );
}

export default GooglemapsCluster;
