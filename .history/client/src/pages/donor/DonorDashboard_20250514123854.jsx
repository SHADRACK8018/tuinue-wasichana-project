import React, { useEffect, useState } from "react";
import CharityCard from "./CharityCard";

const DonorDashboard = () => {
  const [charities, setCharities] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("/api/charities")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load charities");
        }
        return response.json();
      })
      .then((data) => {
        // Map full_name to name for compatibility with CharityCard
        const mappedCharities = data.map((charity) => ({
          ...charity,
          name: charity.full_name,
        }));
        setCharities(mappedCharities);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load charities");
        setLoading(false);
      });
  }, []);

  const toggleFavorite = (charityId) => {
    setFavorites((prev) =>
      prev.includes(charityId)
        ? prev.filter((id) => id !== charityId)
        : [...prev, charityId]
    );
  };

  const displayedCharities =
    activeTab === "favorites"
      ? charities.filter((c) => favorites.includes(c.id))
      : charities;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Welcome</h2>
        <nav>
          <ul className="nav-links">
            <li>
              <a href="/donor/123">Home</a>
            </li>
            <li>
              <a href="/donor/123/donation-history">Donation History</a>
            </li>
            <li>
              <a href="/donor/123/beneficiary-stories">Beneficiary Stories</a>
            </li>
          </ul>
          <button className="button">Logout</button>
        </nav>
      </aside>
      <main className="main-content">
        <div className="charity-header">
          <h2>Choose a Charity to Support</h2>
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Charities
            </button>
            <button
              className={`tab-button ${
                activeTab === "favorites" ? "active" : ""
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </button>
          </div>
        </div>
        {loading && <p>Loading charities...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <ul className="charity-list">
            {displayedCharities.length === 0 ? (
              <p>No charities to display.</p>
            ) : (
              displayedCharities.map((charity) => (
                <CharityCard
                  key={charity.id}
                  charity={charity}
                  isFavorite={favorites.includes(charity.id)}
                  onToggleFavorite={() => toggleFavorite(charity.id)}
                />
              ))
            )}
          </ul>
        )}
      </main>
    </div>
  );
};

export default DonorDashboard;
