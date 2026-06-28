/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Screen =
  | 'login'
  | 'dashboard'
  | 'cameras'
  | 'alerts'
  | 'analytics'
  | 'logs'
  | 'docs'
  | 'usecases'
  | 'config';

export interface Alert {
  id: string;
  timestamp: string;
  cameraId: string;
  location: string;
  type: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
  confidence: number;
  imageUrl?: string | null;
  deviceId?: string;
  resolved?: boolean;
}

export interface Camera {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'alert';
  thumbnail: string;
  coords: [number, number];
}
