'use client';

import { useFCM } from '@/hooks/use-fcm';

export function FCMInit() {
  useFCM();
  return null;
}
