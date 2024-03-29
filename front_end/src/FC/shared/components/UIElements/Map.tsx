import { CSSProperties, useRef, useEffect } from "react";
import { coordinate } from "../../../../typing/types";
import "./Map.css";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

export function Map({
  className,
  style,
  center,
  zoom,
}: {
  className?: string;
  style?: CSSProperties;
  center: coordinate;
  zoom: number;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = new google.maps.Map(mapRef.current as HTMLElement, {
      center: center,
      zoom: zoom,
    });

    new google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return <div ref={mapRef} className={`map ${className}`} style={style}></div>;
}
