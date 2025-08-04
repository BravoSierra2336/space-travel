import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import Loading from '../components/Loading';
import styles from '../App.module.css';

function SpacecraftsPage() {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spacecraftsResponse, planetsResponse] = await Promise.all([
        SpaceTravelApi.getSpacecrafts(),
        SpaceTravelApi.getPlanets()
      ]);

      if (spacecraftsResponse.isError) {
        throw new Error('Failed to load spacecrafts');
      }
      if (planetsResponse.isError) {
        throw new Error('Failed to load planets');
      }

      setSpacecrafts(spacecraftsResponse.data);
      setPlanets(planetsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecommission = async (spacecraftId) => {
    if (!window.confirm('Are you sure you want to decommission this spacecraft?')) {
      return;
    }

    try {
      const response = await SpaceTravelApi.destroySpacecraftById({ id: spacecraftId });
      if (response.isError) {
        throw new Error('Failed to decommission spacecraft');
      }
      await loadData(); // Reload data after successful deletion
    } catch (err) {
      alert('Error decommissioning spacecraft: ' + err.message);
    }
  };

  const getPlanetName = (planetId) => {
    const planet = planets.find(p => p.id === planetId);
    return planet ? planet.name : 'Unknown';
  };

  if (loading) {
    return <Loading message="Loading spacecraft fleet..." />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Error Loading Spacecrafts</h2>
          <p>{error}</p>
          <button onClick={loadData} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles.pageHeader}>
        <h1>Spacecraft Fleet</h1>
        <p>Manage your entire fleet of spacecraft</p>
      </div>

      <div className="flex justify-between align-center mb-20">
        <h2>Fleet Overview ({spacecrafts.length} spacecraft{spacecrafts.length !== 1 ? 's' : ''})</h2>
        <Link to="/construction" className="btn btn-primary">
          🔧 Build New Spacecraft
        </Link>
      </div>

      {spacecrafts.length === 0 ? (
        <div className="card text-center">
          <h3>No Spacecraft in Fleet</h3>
          <p>You haven't built any spacecraft yet. Start by constructing your first spacecraft!</p>
          <Link to="/construction" className="btn btn-primary">
            Build Your First Spacecraft
          </Link>
        </div>
      ) : (
        <div className="card-grid">
          {spacecrafts.map((spacecraft) => (
            <div key={spacecraft.id} className="card">
              {spacecraft.pictureUrl && (
                <img 
                  src={spacecraft.pictureUrl} 
                  alt={spacecraft.name}
                  className="spacecraft-image"
                />
              )}
              <div className="spacecraft-info">
                <h3>{spacecraft.name}</h3>
                <div className="flex gap-10">
                  <span className="capacity-badge">
                    👥 {spacecraft.capacity.toLocaleString()}
                  </span>
                  <span className="location-badge">
                    📍 {getPlanetName(spacecraft.currentLocation)}
                  </span>
                </div>
              </div>
              <p style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical',
                marginBottom: '15px',
                opacity: 0.8
              }}>
                {spacecraft.description}
              </p>
              <div className={styles.spacecraftActions}>
                <Link 
                  to={`/spacecraft/${spacecraft.id}`} 
                  className="btn btn-primary"
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleDecommission(spacecraft.id)}
                  className="btn btn-danger"
                >
                  🗑️ Decommission
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpacecraftsPage;
