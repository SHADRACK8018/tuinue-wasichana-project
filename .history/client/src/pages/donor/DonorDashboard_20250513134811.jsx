import { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../../features/auth/authSlice";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import "../../styles/DonorDashboard.css";

const CharityCard = ({ charity, handleDonateClick, toggleFavorite, favorited }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <img className="card-img" alt="charity" src={
    charity.image.startsWith("http")
      ? charity.image
      : `http://127.0.0.1:5000/${charity.image}`} />
      <div className="card-content">
        <h3>{charity.full_name}</h3>
        <p className="card-description">{charity.description || 'No description available.'}</p>
        <div className="card-buttons">
          <button className="button" onClick={() => handleDonateClick(charity.id)}>
            Donate Now
          </button>
          <button className="button button-secondary" onClick={() => navigate(`/charity-details/${charity.id}/`)}>
            View
          </button>
          <button className="button favorite" onClick={() => toggleFavorite(charity)}>
            {favorited ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
          </button>
        </div>
      </div>
    </div>
  );
};

const DonorDashboard = () => {
  const [charities, setCharities] = useState([]);
  const [favoriteCharities, setFavoriteCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('all');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/charities/')
      .then((res) => res.json())
      .then((data) => {
        setCharities(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load charities. Please try again.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCharities');
    if (savedFavorites) {
      setFavoriteCharities(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteCharities', JSON.stringify(favoriteCharities));
  }, [favoriteCharities]);

  const toggleFavorite = (charity) => {
    setFavoriteCharities((prev) => {
      const isFavorited = prev.some((c) => c.id === charity.id);
      return isFavorited ? prev.filter((c) => c.id !== charity.id) : [...prev, charity];
    });
  };

  const handleDonateClick = (charityId) => {
    navigate(`/donor/${id}/donate/${charityId}`);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate('/login');
  };

  const displayedCharities = tab === 'favorites' ? favoriteCharities : charities;

  return (
    <div className="dashboard-container">
      <div className="dashboard-body">
        <aside className="sidebar">
          <h2>Welcome</h2>
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to={`/donor/${id}`} end className="nav-link">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={`/donor/${id}/donation-history`} className="nav-link">
                  Donation History
                </NavLink>
              </li>
              <li>
                <NavLink to={`/donor/${id}/beneficiary-stories`} className="nav-link">
                  Beneficiary Stories
                </NavLink>
              </li>
            </ul>
            <button onClick={handleLogout} className="button">Logout</button>
          </nav>
        </aside>
        <main className="main-content">
          <div className="charity-header">
            <h2>Choose a Charity to Support</h2>
            <div className="tabs">
              <button
                className={`tab-button ${tab === 'all' ? 'active' : ''}`}
                onClick={() => setTab('all')}
              >
                All Charities
              </button>
              <button
                className={`tab-button ${tab === 'favorites' ? 'active' : ''}`}
                onClick={() => setTab('favorites')}
              >
                Favorites
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading charities...</p>
          ) : error ? (
            <p>{error}</p>
          ) : displayedCharities.length === 0 ? (
            <p>{tab === 'favorites' ? 'No favorites yet.' : 'No charities available.'}</p>
          ) : (
            <div className="charity-grid">
              {displayedCharities.map((charity) => (
                <CharityCard
                  key={charity.id}
                  charity={charity}
                  handleDonateClick={handleDonateClick}
                  toggleFavorite={toggleFavorite}
                  favorited={favoriteCharities.some((c) => c.id === charity.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;