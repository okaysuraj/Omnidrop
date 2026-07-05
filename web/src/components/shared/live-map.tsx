'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/providers/socket-provider';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

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
      <div style={{ width: '100%', height: '100%', borderRadius: 16, background: 'rgba(30,41,59,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
        <div className="pulse-live" style={{ marginBottom: 16, fontSize: 32 }}>🛵</div>
        <p style={{ fontWeight: 600 }}>Simulated Tracking</p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
          {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
        </p>
        <div style={{ marginTop: 16, fontSize: '0.7rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '4px 8px', borderRadius: 12 }}>
          Google Maps API Key Missing
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
        ]
      }}
    >
      <Marker position={riderLocation} icon={{ url: 'https://maps.google.com/mapfiles/ms/icons/motorcycling.png' }} />
    </GoogleMap>
  ) : (
    <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 16 }} />
  );
}
