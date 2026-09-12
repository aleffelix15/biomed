import React, { useState, useEffect, Suspense, lazy } from "react";
import GlobalStyles from "../theme/GlobalStyles";
import { theme } from "../theme/tokens";
import { useAppNavigation } from "../state/useAppNavigation";
import { AuthProvider, useAuth } from "../state/AuthContext";
import { ThemeProvider } from "../state/ThemeContext";

import BottomTabBar from "./navigation/BottomTabBar";
import LoginScreen from "../screens/Auth/LoginScreen";

const HomeScreen = lazy(() => import("../screens/Home/HomeScreen"));
const DisciplinesScreen = lazy(() => import("../screens/Disciplines/DisciplinesScreen"));
const DisciplineDetailScreen = lazy(() => import("../screens/Disciplines/DisciplineDetail/DisciplineDetailScreen"));
const StudyScreen = lazy(() => import("../screens/Study/StudyScreen"));
const LabScreen = lazy(() => import("../screens/Lab/LabScreen"));
const LibraryScreen = lazy(() => import("../screens/Library/LibraryScreen"));
const BookDetailScreen = lazy(() => import("../screens/Library/BookDetailScreen"));
const LeaderboardScreen = lazy(() => import("../screens/Ranking/LeaderboardScreen"));
const ProfileScreen = lazy(() => import("../screens/Profile/ProfileScreen"));
const ProgressOverlay = lazy(() => import("../screens/Progress/ProgressOverlay"));

import { DataCacheProvider } from "../state/DataCacheContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataCacheProvider>
          <AppContent />
        </DataCacheProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const nav = useAppNavigation();
  const { user, loading, isOfflineMode } = useAuth();
  
  const [visitedTabs, setVisitedTabs] = useState(new Set(["home"]));

  useEffect(() => {
    if (nav.tab && !visitedTabs.has(nav.tab)) {
      setVisitedTabs(prev => new Set(prev).add(nav.tab));
    }
  }, [nav.tab, visitedTabs]);

  const showOverlay = nav.selectedDiscipline || nav.selectedBook || nav.showLeaderboard;

  const showHome = !showOverlay && nav.tab === "home";
  const showDisc = !showOverlay && nav.tab === "disciplines";
  const showStudy = !showOverlay && nav.tab === "study";
  const showLab = !showOverlay && nav.tab === "lab";
  const showLib = !showOverlay && nav.tab === "library";
  const showProf = !showOverlay && nav.tab === "profile";

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
            <Suspense fallback={<div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textSecondary }}>Carregando...</div>}>
              <div className="app-scroll bs-scroll">
                {isOfflineMode && (
                  <div style={{ background: theme.surface, color: theme.textSecondary, fontSize: 11, textAlign: "center", padding: "4px 0", borderBottom: `1px solid ${theme.line}` }}>Modo offline/demo</div>
                )}
                
                {/* Overlays */}
                {nav.selectedDiscipline && <DisciplineDetailScreen discipline={nav.selectedDiscipline} onBack={nav.closeDiscipline} />}
                {nav.selectedBook && <BookDetailScreen book={nav.selectedBook} onBack={nav.closeBook} />}
                {nav.showLeaderboard && <LeaderboardScreen onBack={nav.closeLeaderboard} />}

                {/* Tabs with Keep-Alive (display: none when inactive) */}
                {visitedTabs.has("home") && (
                  <div style={{ display: showHome ? "block" : "none", height: "100%" }}>
                    <HomeScreen onOpenDiscipline={nav.openDiscipline} onOpenProgress={nav.openProgress} onGoTab={nav.goTab} />
                  </div>
                )}
                {visitedTabs.has("disciplines") && (
                  <div style={{ display: showDisc ? "block" : "none", height: "100%" }}>
                    <DisciplinesScreen onOpenDiscipline={nav.openDiscipline} />
                  </div>
                )}
                {visitedTabs.has("study") && (
                  <div style={{ display: showStudy ? "block" : "none", height: "100%" }}>
                    <StudyScreen />
                  </div>
                )}
                {visitedTabs.has("lab") && (
                  <div style={{ display: showLab ? "block" : "none", height: "100%" }}>
                    <LabScreen />
                  </div>
                )}
                {visitedTabs.has("library") && (
                  <div style={{ display: showLib ? "block" : "none", height: "100%" }}>
                    <LibraryScreen onOpenBook={nav.openBook} />
                  </div>
                )}
                {visitedTabs.has("profile") && (
                  <div style={{ display: showProf ? "block" : "none", height: "100%" }}>
                    <ProfileScreen onOpenLeaderboard={nav.openLeaderboard} />
                  </div>
                )}
              </div>
              {!nav.showProgress && <BottomTabBar active={nav.tab} onChange={nav.goTab} />}
              {nav.showProgress && <ProgressOverlay onClose={nav.closeProgress} />}
            </Suspense>
          </>
        )}
      </div>
    </div>
  );
}
