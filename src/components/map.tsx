import { Map, MapMouseEvent, Marker } from '@vis.gl/react-google-maps'
import React, { useCallback, useEffect } from 'react'

interface MapProps {
  position: google.maps.LatLngLiteral | undefined
  setPosition: (position: google.maps.LatLngLiteral) => void
}

export const GoogleMaps: React.FC<MapProps> = ({ position, setPosition }) => {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [setPosition])

  const onMapClick = useCallback(
    (event: MapMouseEvent) => {
      if (event.detail.latLng) {
        const { lat, lng } = event.detail.latLng
        setPosition({ lat, lng })
      }
    },
    [setPosition],
  )

  return (
    <Map
      defaultCenter={position}
      defaultZoom={18}
      streetViewControl={false}
      className="w-full h-96 overflow-hidden rounded-md"
      onClick={onMapClick}
    >
      <Marker position={position} />
    </Map>
  )
}
