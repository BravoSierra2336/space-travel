import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styles from "./App.module.css";
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import SpacecraftsPage from './pages/SpacecraftsPage';
import SpacecraftPage from './pages/SpacecraftPage';
import ConstructionPage from './pages/ConstructionPage';
import PlanetsPage from './pages/PlanetsPage';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/spacecrafts" element={<SpacecraftsPage />} />
          <Route path="/spacecraft/:id" element={<SpacecraftPage />} />
          <Route path="/construction" element={<ConstructionPage />} />
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
