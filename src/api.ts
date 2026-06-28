/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Client for the VTD FastAPI backend: REST (list/get/delete) + live WebSocket.
 */

import { Alert } from './types';

// Base URL of the backend. Override with VITE_API_URL in .env (e.g. http://localhost:8000).
const API_URL: string =
  (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8000';

// Base URL of the camera device's live MJPEG video stream (served by the pipeline).
// Override with VITE_STREAM_URL in .env (e.g. http://localhost:8090). The pipeline
// exposes /stream (MJPEG) and /snapshot.jpg on this host.
export const STREAM_URL: string =
  (import.meta as any).env?.VITE_STREAM_URL?.replace(/\/$/, '') || 'http://localhost:8090';

/** URL of the live MJPEG stream for a camera. `cam` is passed through as a hint. */
export function streamUrl(cameraId?: string): string {
  const q = cameraId ? `?cam=${encodeURIComponent(cameraId)}` : '';
  return `${STREAM_URL}/stream${q}`;
}

/** Build the matching ws:// or wss:// URL for the /ws endpoint. */
function wsUrl(): string {
  return API_URL.replace(/^http/, 'ws') + '/ws';
}

/** Fetch recent alerts (newest first). */
export async function getAlerts(limit = 50): Promise<Alert[]> {
  const res = await fetch(`${API_URL}/alerts?limit=${limit}`);
  if (!res.ok) throw new Error(`GET /alerts failed: ${res.status}`);
  return res.json();
}

/** Delete an alert (also removes its Cloudinary image on the backend). */
export async function deleteAlert(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/alerts/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error(`DELETE /alerts/${id} failed: ${res.status}`);
}

export type AlertSocketEvents = {
  onCreated?: (alert: Alert) => void;
  onDeleted?: (id: string) => void;
  onStatusChange?: (connected: boolean) => void;
};

/**
 * Connect to the live alert stream. Auto-reconnects on drop.
 * Returns a cleanup function to close the socket.
 */
export function connectAlertSocket(events: AlertSocketEvents): () => void {
  let socket: WebSocket | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let closedByUser = false;

  const connect = () => {
    socket = new WebSocket(wsUrl());

    socket.onopen = () => events.onStatusChange?.(true);

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'alert.created') events.onCreated?.(msg.data as Alert);
        else if (msg.event === 'alert.deleted') events.onDeleted?.(msg.data.id as string);
      } catch {
        /* ignore malformed messages */
      }
    };

    socket.onclose = () => {
      events.onStatusChange?.(false);
      if (!closedByUser) retryTimer = setTimeout(connect, 3000); // auto-reconnect
    };

    socket.onerror = () => socket?.close();
  };

  connect();

  return () => {
    closedByUser = true;
    if (retryTimer) clearTimeout(retryTimer);
    socket?.close();
  };
}
