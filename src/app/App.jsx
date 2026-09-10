import React from "react";
import GlobalStyles from "../theme/GlobalStyles";
import { theme } from "../theme/tokens";
import { useAppNavigation } from "../state/useAppNavigation";
import { AuthProvider, useAuth } from "../state/AuthContext";

import { ThemeProvider } from "../state/ThemeContext";

import BottomTabBar from "./navigation/BottomTabBar";
import HomeScreen from "../screens/Home/HomeScreen";
import DisciplinesScreen from "../screens/Disciplines/DisciplinesScreen";
import DisciplineDetailScreen from "../screens/Disciplines/DisciplineDetail/DisciplineDetailScreen";
import StudyScreen from "../screens/Study/StudyScreen";
import LabScreen from "../screens/Lab/LabScreen";
import LibraryScreen from "../screens/Library/LibraryScreen";
import BookDetailScreen from "../screens/Library/BookDetailScreen";
import LeaderboardScreen from "../screens/Ranking/LeaderboardScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ProgressOverlay from "../screens/Progress/ProgressOverlay";
import LoginScreen from "../screens/Auth/LoginScreen";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const nav = useAppNavigation();
  const { user, loading, isOfflineMode } = useAuth();


  let content;
  if (nav.selectedDiscipline) {
    content = <DisciplineDetailScreen discipline={nav.selectedDiscipline} onBack={nav.closeDiscipline} />;
  } else if (nav.selectedBook) {
    content = <BookDetailScreen book={nav.selectedBook} onBack={nav.closeBook} />;
  } else if (nav.showLeaderboard) {
    content = <LeaderboardScreen onBack={nav.closeLeaderboard} />;
  } else if (nav.tab === "home") {
    content = <HomeScreen onOpenDiscipline={nav.openDiscipline} onOpenProgress={nav.openProgress} onGoTab={nav.goTab} />;
  } else if (nav.tab === "disciplines") {
    content = <DisciplinesScreen onOpenDiscipline={nav.openDiscipline} />;
  } else if (nav.tab === "study") {
    content = <StudyScreen />;
  } else if (nav.tab === "lab") {
    content = <LabScreen />;
  } else if (nav.tab === "library") {
    content = <LibraryScreen onOpenBook={nav.openBook} />;
  } else if (nav.tab === "profile") {
    content = <ProfileScreen onOpenLeaderboard={nav.openLeaderboard} />;
  }

  return (
    <div className="app-container">
      <GlobalStyles />
      <div className="app-frame">
        {loading ? (
           <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textSecondary }}>Carregando...</div>
        ) : !user ? (
           <div className="app-scroll"><LoginScreen /></div>
        ) : (
          <>
            <div className="app-scroll bs-scroll">
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
