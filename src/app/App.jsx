import React from "react";
import GlobalStyles from "../theme/GlobalStyles";
import { theme } from "../theme/tokens";
import { useAppNavigation } from "../state/useAppNavigation";
import { AuthProvider, useAuth } from "../state/AuthContext";

import BottomTabBar from "./navigation/BottomTabBar";
import HomeScreen from "../screens/Home/HomeScreen";
import DisciplinesScreen from "../screens/Disciplines/DisciplinesScreen";
import DisciplineDetailScreen from "../screens/Disciplines/DisciplineDetail/DisciplineDetailScreen";
import StudyScreen from "../screens/Study/StudyScreen";
import LabScreen from "../screens/Lab/LabScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import ProgressOverlay from "../screens/Progress/ProgressOverlay";
import LoginScreen from "../screens/Auth/LoginScreen";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const nav = useAppNavigation();
  const { user, loading, isOfflineMode } = useAuth();


  let content;
  if (nav.selectedDiscipline) {
    content = <DisciplineDetailScreen discipline={nav.selectedDiscipline} onBack={nav.closeDiscipline} />;
  } else if (nav.tab === "home") {
    content = <HomeScreen onOpenDiscipline={nav.openDiscipline} onOpenProgress={nav.openProgress} onGoTab={nav.goTab} />;
  } else if (nav.tab === "disciplines") {
    content = <DisciplinesScreen onOpenDiscipline={nav.openDiscipline} />;
  } else if (nav.tab === "study") {
    content = <StudyScreen />;
  } else if (nav.tab === "lab") {
    content = <LabScreen />;
  } else if (nav.tab === "library") {
    content = <LibraryScreen />;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", background: "#040E10", minHeight: "100vh", padding: 20 }}>
      <GlobalStyles />
      <div style={{ position: "relative", width: 390, height: 780, background: theme.bg, borderRadius: 28, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", border: `1px solid ${theme.line}` }}>
        {loading ? (
           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textSecondary }}>Carregando...</div>
        ) : !user ? (
           <LoginScreen />
        ) : (
          <>
            <div className="bs-scroll" style={{ height: "100%", overflowY: "auto" }}>
              {isOfflineMode && (
                <div style={{ background: theme.surface, color: theme.textSecondary, fontSize: 11, textAlign: "center", padding: "4px 0", borderBottom: `1px solid ${theme.line}` }}>Modo offline/demo</div>
              )}
              {content}
            </div>
            {!nav.showProgress && <BottomTabBar active={nav.tab} onChange={nav.goTab} />}
            {nav.showProgress && <ProgressOverlay onClose={nav.closeProgress} />}
          </>
        )}
      </div>
    </div>
  );
}
