import { Link } from 'react-router-dom';
import styles from '../App.module.css';

function HomePage() {
  return (
    <div className="container">
      <div className={styles.hero}>
        <h1>Welcome to Space Travel</h1>
        <p>
          Embark on an extraordinary journey through the cosmos. Manage your fleet of spacecraft, 
          explore distant planets, and pioneer the future of interstellar travel.
        </p>
        <div className="flex gap-20 justify-center">
          <Link to="/spacecrafts" className="btn btn-primary">
            View Fleet
          </Link>
          <Link to="/construction" className="btn btn-secondary">
            Build Spacecraft
          </Link>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>🚀 Manage Fleet</h3>
          <p>
            View and manage your entire spacecraft fleet. Monitor their status, 
            capacity, and current locations across the solar system.
          </p>
        </div>
        <div className={styles.feature}>
          <h3>🔧 Build Spacecraft</h3>
          <p>
            Design and construct new spacecraft with custom specifications. 
            Set capacity, add descriptions, and prepare for new missions.
          </p>
        </div>
        <div className={styles.feature}>
          <h3>🪐 Explore Planets</h3>
          <p>
            Discover planets throughout the solar system. View populations, 
            dispatch spacecraft, and manage interplanetary operations.
          </p>
        </div>
        <div className={styles.feature}>
          <h3>📊 Mission Control</h3>
          <p>
            Monitor all spacecraft missions in real-time. Track movements, 
            population transfers, and ensure successful operations.
          </p>
        </div>
      </div>

      <div className="text-center mt-20">
        <h2 style={{ marginBottom: '20px', color: '#667eea' }}>Ready to Begin?</h2>
        <p style={{ marginBottom: '30px', opacity: 0.8 }}>
          Start by exploring your current fleet or constructing a new spacecraft to begin your space exploration journey.
        </p>
        <Link to="/planets" className="btn btn-primary">
          Explore Planets
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
