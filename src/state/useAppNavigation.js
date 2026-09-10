import { useState } from "react";

// Hook central de navegação do app. Isola o estado de "onde o usuário está"
// da árvore de componentes, para facilitar trocar por um router de verdade
// (React Navigation / React Router) sem tocar nas telas.
export function useAppNavigation() {
  const [tab, setTab] = useState("home");
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const goTab = (id) => {
    setSelectedDiscipline(null);
    setSelectedBook(null);
    setShowLeaderboard(false);
    setTab(id);
  };

  const openDiscipline = (discipline) => setSelectedDiscipline(discipline);
  const closeDiscipline = () => setSelectedDiscipline(null);
  const openBook = (book) => setSelectedBook(book);
  const closeBook = () => setSelectedBook(null);
  const openLeaderboard = () => setShowLeaderboard(true);
  const closeLeaderboard = () => setShowLeaderboard(false);
  const openProgress = () => setShowProgress(true);
  const closeProgress = () => setShowProgress(false);

  return {
    tab,
    selectedDiscipline,
    selectedBook,
    showLeaderboard,
    showProgress,
    goTab,
    openDiscipline,
    closeDiscipline,
    openBook,
    closeBook,
    openLeaderboard,
    closeLeaderboard,
    openProgress,
    closeProgress,
  };
}
