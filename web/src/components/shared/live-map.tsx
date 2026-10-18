'use client';

import { useSocket } from '@/providers/socket-provider';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

interface LiveMapProps {
  orderId: string;
  initialLat: number;
  initialLng: number;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
};

export function LiveMap({ orderId, initialLat, initialLng }: LiveMapProps) {
  const { socket, connected } = useSocket();
  const [riderLocation, setRiderLocation] = useState({ lat: initialLat, lng: initialLng });

  // Replace with actual API key in .env.local
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasApiKey = Boolean(apiKey && apiKey.length > 10 && apiKey !== 'demo-api-key');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
  });

  useEffect(() => {
    if (!connected || !socket) return;

    socket.emit('room:join_order', { orderId });

    socket.on('delivery:location_updated', (data) => {
      if (data.orderId === orderId) {
        setRiderLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      socket.off('delivery:location_updated');
      socket.emit('room:leave_order', { orderId });
    };
  }, [connected, socket, orderId]);

  if (!hasApiKey) {
    return (
      <div className="w-full h-full bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-tech">
        {/* Radar concentric circular grid */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-72 h-72 rounded-full border border-neutral-600 animate-ping"></div>
          <div className="absolute w-56 h-56 rounded-full border border-neutral-700"></div>
          <div className="absolute w-36 h-36 rounded-full border border-neutral-800"></div>
          <div className="absolute w-full h-[1px] bg-neutral-800"></div>
          <div className="absolute h-full w-[1px] bg-neutral-800"></div>
        </div>

        {/* Pulsing courier beacon */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 bg-[#FFE600] border-2 border-black flex items-center justify-center text-2xl shadow-[3px_3px_0px_#00E599] mb-3 animate-bounce">
            🛵
          </div>
          <div className="bg-black border border-neutral-700 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00E599] shadow-[2px_2px_0px_#000]">
            ● RADAR TELEMETRY LOCK
          </div>
          <div className="font-mono text-xs text-neutral-300 mt-2 font-bold tracking-tight">
            LAT: {riderLocation.lat.toFixed(6)} | LNG: {riderLocation.lng.toFixed(6)}
          </div>
          <div className="text-[10px] text-neutral-500 uppercase mt-1">
            MOMENTUM VECTOR: 28.4 KM/H · BEARING 042°
          </div>
        </div>
      </div>
    );
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={riderLocation}
      zoom={15}
      options={{
        disableDefaultUI: true,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
          { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
          { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
        ],
      }}
    >
      <Marker
        position={riderLocation}
        icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png' }}
      />
    </GoogleMap>
  ) : (
    <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 16 }} />
  );
}
