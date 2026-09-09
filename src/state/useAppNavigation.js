import { useState } from "react";

// Hook central de navegação do app. Isola o estado de "onde o usuário está"
// da árvore de componentes, para facilitar trocar por um router de verdade
// (React Navigation / React Router) sem tocar nas telas.
export function useAppNavigation() {
  const [tab, setTab] = useState("home");
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const goTab = (id) => {
    setSelectedDiscipline(null);
    setTab(id);
  };

  const openDiscipline = (discipline) => setSelectedDiscipline(discipline);
  const closeDiscipline = () => setSelectedDiscipline(null);
  const openProgress = () => setShowProgress(true);
  const closeProgress = () => setShowProgress(false);

  return {
    tab,
    selectedDiscipline,
    showProgress,
    goTab,
    openDiscipline,
    closeDiscipline,
    openProgress,
    closeProgress,
  };
}
