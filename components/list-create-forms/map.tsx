'use client';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { icon } from "leaflet"

import markerIcon2x from 'leaflet/dist/image/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


interface SelectLocationProps {
    lat: number,
    long: number
}

const ICON = icon({
    iconUrl: "/marker.png",
    iconSize: [32, 32],
})

function Map({ lat, long }: SelectLocationProps) {

    return (
        <MapContainer center={[lat, long]} zoom={13} scrollWheelZoom={true} className='w-full h-full z-0 relative'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker icon={ICON} position={[lat, long]} >
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map