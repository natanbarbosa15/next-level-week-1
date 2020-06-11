import React, { useState, useEffect, useRef, ReactElement } from "react";

declare global {
  interface Window {
    google: any;
  }
  interface MapCoord {
    lat: Number;
    lng: Number;
  }
  interface MapOptions {
    center: MapCoord;
    zoom: Number;
  }
  interface MapPins {
    coords: MapCoord;
    title: string;
    url: string;
  }
  interface AddPins {
    map: any;
    onMountProps: MapPins[];
  }
  interface GoogleMapObject {
    options: MapOptions;
    className?: string;
    onMount: string;
    onMountProps: any;
  }
}

function addPins(props: AddPins) {
  props.onMountProps.forEach((link, index) => {
    const marker = new window.google.maps.Marker({
      map: props.map,
      position: link.coords,
      title: link.title,
    });
    var infowindow = new window.google.maps.InfoWindow({
      content: link.title,
    });
    marker.addListener(`click`, () => {
      infowindow.open(props.map, marker);
    });
  });
}

const GoogleMap: React.FC<GoogleMapObject> = ({
  options,
  onMount,
  className,
  onMountProps,
}: GoogleMapObject): ReactElement => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    // The Google Maps API modifies the options object passed to
    // the Map constructor in place by adding a mapTypeId with default
    // value 'roadmap'. { ...options } prevents this by creating a copy.
    const onLoad = () => {
      setMap(new window.google.maps.Map(ref.current, { ...options }));
    };
    if (!window.google) {
      const script = document.createElement(`script`);
      script.src =
        `https://maps.googleapis.com/maps/api/js?key=` +
        process.env.REACT_APP_MAPS_API_KEY;
      document.head.append(script);
      script.addEventListener(`load`, onLoad);
      return () => script.removeEventListener(`load`, onLoad);
    } else onLoad();
  }, [options]);

  if (map && onMount === "addPins") {
    addPins({ map, onMountProps });
  }

  return (
    <div
      style={{ height: `60vh`, margin: `1em 0`, borderRadius: `0.5em` }}
      className={className}
      ref={ref}
    />
  );
};

export default GoogleMap;
