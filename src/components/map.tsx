import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'

export const GoogleMaps = () => {
  const [position, setPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >()

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      })
    }
  }, [])
  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
      <Map
        defaultCenter={position}
        defaultZoom={18}
        streetViewControl={false}
        className="w-full h-96 overflow-hidden rounded-md"
      >
        <Marker position={position} />
      </Map>
    </APIProvider>
  )
}
