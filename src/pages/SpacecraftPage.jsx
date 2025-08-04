import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import Loading from '../components/Loading';
import styles from '../App.module.css';

function SpacecraftPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [spacecraft, setSpacecraft] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spacecraftResponse, planetsResponse] = await Promise.all([
        SpaceTravelApi.getSpacecraftById({ id }),
        SpaceTravelApi.getPlanets()
      ]);

      if (spacecraftResponse.isError) {
        throw new Error('Failed to load spacecraft details');
      }
      if (planetsResponse.isError) {
        throw new Error('Failed to load planets');
      }

      if (!spacecraftResponse.data) {
        throw new Error('Spacecraft not found');
      }

      setSpacecraft(spacecraftResponse.data);
      setPlanets(planetsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecommission = async () => {
    if (!window.confirm(`Are you sure you want to decommission ${spacecraft.name}?`)) {
      return;
    }

    try {
      const response = await SpaceTravelApi.destroySpacecraftById({ id: spacecraft.id });
      if (response.isError) {
        throw new Error('Failed to decommission spacecraft');
      }
      navigate('/spacecrafts');
    } catch (err) {
      alert('Error decommissioning spacecraft: ' + err.message);
    }
  };

  const getCurrentPlanet = () => {
    return planets.find(p => p.id === spacecraft?.currentLocation);
  };

  if (loading) {
    return <Loading message="Loading spacecraft details..." />;
  }

  if (error) {
    return (
      <div className="container">
        <div className={styles.backButton}>
          <Link to="/spacecrafts" className="btn btn-secondary">
            ← Back to Fleet
          </Link>
        </div>
        <div className="card text-center">
          <h2>Error Loading Spacecraft</h2>
          <p>{error}</p>
          <div className="flex gap-10 justify-center">
            <button onClick={loadData} className="btn btn-primary">
              Retry
            </button>
            <Link to="/spacecrafts" className="btn btn-secondary">
              Back to Fleet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPlanet = getCurrentPlanet();

  return (
    <div className="container">
      <div className={styles.backButton}>
        <Link to="/spacecrafts" className="btn btn-secondary">
          ← Back to Fleet
        </Link>
      </div>

      <div className={styles.spacecraftDetail}>
        <div className="card">
          <div className="flex justify-between align-center mb-20">
            <h1>{spacecraft.name}</h1>
            <div className="flex gap-10">
              <Link to="/planets" className="btn btn-primary">
                🚀 Send to Planet
              </Link>
              <button 
                onClick={handleDecommission}
                className="btn btn-danger"
              >
                🗑️ Decommission
              </button>
            </div>
          </div>

          {spacecraft.pictureUrl && (
            <img 
              src={spacecraft.pictureUrl} 
              alt={spacecraft.name}
              className={styles.spacecraftImage}
            />
          )}

          <div className={styles.spacecraftStats}>
            <div className={styles.stat}>
              <h3>{spacecraft.capacity.toLocaleString()}</h3>
              <p>Passenger Capacity</p>
            </div>
            <div className={styles.stat}>
              <h3>{currentPlanet?.name || 'Unknown'}</h3>
              <p>Current Location</p>
            </div>
            <div className={styles.stat}>
              <h3>{currentPlanet?.currentPopulation?.toLocaleString() || '0'}</h3>
              <p>Local Population</p>
            </div>
          </div>

          <div className={styles.description}>
            <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Description</h3>
            <p>{spacecraft.description}</p>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', color: '#667eea' }}>Spacecraft Information</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <span>ID:</span>
                <span style={{ fontFamily: 'monospace' }}>{spacecraft.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <span>Status:</span>
                <span style={{ color: '#4ade80' }}>Operational</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <span>Available Passengers:</span>
                <span>{Math.min(spacecraft.capacity, currentPlanet?.currentPopulation || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpacecraftPage;
