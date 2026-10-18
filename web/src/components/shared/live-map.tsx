'use client';

import { MapPin } from 'lucide-react';

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
      <div className="w-full h-full bg-muted text-ink flex flex-col items-center justify-center p-7 text-center rounded-2xl">
        <span className="empty-state-icon">
          <MapPin size={27} />
        </span>
        <h3 className="font-bold text-base">The map is unavailable right now.</h3>
        <p className="text-sm text-secondary mt-2 max-w-xs leading-7">
          Follow your order status here for updates on your delivery.
        </p>
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
    <div
      role="status"
      className="w-full h-full flex items-center justify-center bg-muted rounded-2xl text-sm text-secondary"
    >
      Loading your delivery map...
    </div>
  );
}
