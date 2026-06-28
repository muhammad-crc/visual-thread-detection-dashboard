/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Screen } from "./types";
import { Layout } from "./components/Layout";
import { LoginScreen } from "./components/LoginScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { CamerasScreen } from "./components/CamerasScreen";
import { AlertsScreen } from "./components/AlertsScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { LogsScreen } from "./components/LogsScreen";
import { ConfigScreen } from "./components/ConfigScreen";
import { DocumentationScreen } from "./components/DocumentationScreen";
import { UseCasesScreen } from "./components/UseCasesScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard");
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Simulate auth check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthReady(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveScreen("dashboard");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary-glow border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00ffaa]"></div>
          <span className="font-mono text-[10px] text-primary-glow tracking-[0.3em] uppercase animate-pulse">
            Initializing_Visual Threat Detection_AI
          </span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case "dashboard":
        return <DashboardScreen />;
      case "cameras":
        return <CamerasScreen />;
      case "alerts":
        return <AlertsScreen />;
      case "analytics":
        return <AnalyticsScreen />;
      case "logs":
        return <LogsScreen />;
      case "docs":
        return <DocumentationScreen />;
      case "usecases":
        return <UseCasesScreen />;
      case "config":
        return <ConfigScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <Layout
      activeScreen={activeScreen}
      onScreenChange={setActiveScreen}
      onLogout={handleLogout}
    >
      {renderScreen()}
    </Layout>
  );
}
