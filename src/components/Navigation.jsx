import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🚀 Space Travel
        </Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/spacecrafts" 
              className={isActive('/spacecrafts') ? 'active' : ''}
            >
              Spacecrafts
            </Link>
          </li>
          <li>
            <Link 
              to="/construction" 
              className={isActive('/construction') ? 'active' : ''}
            >
              Construction
            </Link>
          </li>
          <li>
            <Link 
              to="/planets" 
              className={isActive('/planets') ? 'active' : ''}
            >
              Planets
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
