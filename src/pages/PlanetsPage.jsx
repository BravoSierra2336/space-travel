import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SpaceTravelApi from '../services/SpaceTravelApi';
import Loading from '../components/Loading';
import styles from '../App.module.css';

function PlanetsPage() {
  const [planets, setPlanets] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [selectedSpacecraft, setSelectedSpacecraft] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [planetsResponse, spacecraftsResponse] = await Promise.all([
        SpaceTravelApi.getPlanets(),
        SpaceTravelApi.getSpacecrafts()
      ]);

      if (planetsResponse.isError) {
        throw new Error('Failed to load planets');
      }
      if (spacecraftsResponse.isError) {
        throw new Error('Failed to load spacecrafts');
      }

      setPlanets(planetsResponse.data);
      setSpacecrafts(spacecraftsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSpacecraftsOnPlanet = (planetId) => {
    return spacecrafts.filter(spacecraft => spacecraft.currentLocation === planetId);
  };

  const getAvailableSpacecrafts = (targetPlanetId) => {
    return spacecrafts.filter(spacecraft => spacecraft.currentLocation !== targetPlanetId);
  };

  const handlePlanetSelect = (planet) => {
    setSelectedPlanet(planet);
    setSelectedSpacecraft('');
  };

  const handleDispatch = async () => {
    if (!selectedSpacecraft || !selectedPlanet) {
      return;
    }

    try {
      setIsDispatching(true);
      const response = await SpaceTravelApi.sendSpacecraftToPlanet({
        spacecraftId: selectedSpacecraft,
        targetPlanetId: selectedPlanet.id
      });

      if (response.isError) {
        throw new Error('Failed to dispatch spacecraft');
      }

      const spacecraft = spacecrafts.find(s => s.id === selectedSpacecraft);
      alert(`Successfully dispatched ${spacecraft.name} to ${selectedPlanet.name}!`);
      
      // Reload data to reflect changes
      await loadData();
      setSelectedPlanet(null);
      setSelectedSpacecraft('');
    } catch (err) {
      alert('Error dispatching spacecraft: ' + err.message);
    } finally {
      setIsDispatching(false);
    }
  };

  if (loading) {
    return <Loading message="Loading planetary system..." />;
  }

  if (error) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2>Error Loading Planets</h2>
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
        <h1>Planetary System</h1>
        <p>Explore planets and manage spacecraft deployments</p>
      </div>

      <div className="flex justify-between align-center mb-20">
        <h2>Solar System Overview</h2>
        <div className="flex gap-10">
          <Link to="/spacecrafts" className="btn btn-secondary">
            View Fleet
          </Link>
          <Link to="/construction" className="btn btn-primary">
            Build Spacecraft
          </Link>
        </div>
      </div>

      <div className={styles.planetsGrid}>
        {planets.map((planet) => {
          const planetSpacecrafts = getSpacecraftsOnPlanet(planet.id);
          const availableSpacecrafts = getAvailableSpacecrafts(planet.id);
          
          return (
            <div 
              key={planet.id} 
              className={`${styles.planetCard} ${selectedPlanet?.id === planet.id ? 'card' : ''}`}
              onClick={() => handlePlanetSelect(planet)}
              style={{
                border: selectedPlanet?.id === planet.id ? '2px solid #667eea' : 'none'
              }}
            >
              <img 
                src={planet.pictureUrl} 
                alt={planet.name}
                className={styles.planetImage}
              />
              <div className={styles.planetInfo}>
                <h3>{planet.name}</h3>
                <div className={styles.populationInfo}>
                  <span>Population:</span>
                  <span className="capacity-badge">
                    👥 {planet.currentPopulation.toLocaleString()}
                  </span>
                </div>
                
                {planetSpacecrafts.length > 0 && (
                  <div className={styles.spacecraftList}>
                    <h4>Stationed Spacecraft ({planetSpacecrafts.length})</h4>
                    {planetSpacecrafts.map((spacecraft) => (
                      <div key={spacecraft.id} className={styles.spacecraftListItem}>
                        <span>{spacecraft.name}</span>
                        <span className="capacity-badge">
                          {spacecraft.capacity.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedPlanet?.id === planet.id && availableSpacecrafts.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <h4 style={{ marginBottom: '10px', color: '#f093fb' }}>
                      Dispatch Spacecraft
                    </h4>
                    <select
                      value={selectedSpacecraft}
                      onChange={(e) => setSelectedSpacecraft(e.target.value)}
                      className="w-full"
                      style={{ marginBottom: '10px' }}
                    >
                      <option value="">Select spacecraft to dispatch...</option>
                      {availableSpacecrafts.map((spacecraft) => (
                        <option key={spacecraft.id} value={spacecraft.id}>
                          {spacecraft.name} (Capacity: {spacecraft.capacity.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleDispatch}
                      disabled={!selectedSpacecraft || isDispatching}
                      className="btn btn-primary w-full"
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                      {isDispatching ? '🚀 Dispatching...' : '🚀 Dispatch'}
                    </button>
                  </div>
                )}

                {selectedPlanet?.id === planet.id && availableSpacecrafts.length === 0 && (
                  <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '14px', opacity: 0.8 }}>
                      No spacecraft available for dispatch to this planet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-20">
        <h3 style={{ color: '#667eea', marginBottom: '15px' }}>Mission Control Tips</h3>
        <div style={{ maxWidth: '700px', margin: '0 auto', opacity: 0.8 }}>
          <p style={{ marginBottom: '10px' }}>
            • Click on a planet to view dispatch options
          </p>
          <p style={{ marginBottom: '10px' }}>
            • Spacecraft can only be dispatched to planets where they are not currently located
          </p>
          <p style={{ marginBottom: '10px' }}>
            • Population transfers automatically when spacecraft move between planets
          </p>
          <p>
            • Monitor your fleet's positions to optimize interplanetary operations
          </p>
        </div>
      </div>
    </div>
  );
}

export default PlanetsPage;
