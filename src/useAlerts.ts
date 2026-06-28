/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared hook: loads alert history once, then keeps it live via WebSocket.
 * Used by both the Alerts screen and the Dashboard so they share one source of truth.
 */

import { useCallback, useEffect, useState } from 'react';
import { Alert } from './types';
import { getAlerts, deleteAlert, connectAlertSocket } from './api';

export function useAlerts(limit = 100) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getAlerts(limit)
      .then((data) => mounted && setAlerts(data))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));

    const disconnect = connectAlertSocket({
      onCreated: (alert) =>
        setAlerts((prev) => [alert, ...prev.filter((a) => a.id !== alert.id)]),
      onDeleted: (id) => setAlerts((prev) => prev.filter((a) => a.id !== id)),
      onStatusChange: (isConnected) => mounted && setConnected(isConnected)
    });

    return () => {
      mounted = false;
      disconnect();
    };
  }, [limit]);

  const remove = useCallback(async (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAlert(id);
    } catch {
      getAlerts(limit).then(setAlerts).catch(() => undefined);
    }
  }, [limit]);

  return { alerts, connected, loading, error, remove };
}
