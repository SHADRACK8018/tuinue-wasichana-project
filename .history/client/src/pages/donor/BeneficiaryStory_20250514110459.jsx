import React, { useEffect, useState } from "react";

const BeneficiaryStory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stories, setStories] = useState([]);
  const [charities, setCharities] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch donations
        const donorId = localStorage.getItem("donorId");
        const donationsRes = await fetch(`/donors/${donorId}/donations`);
        if (!donationsRes.ok) throw new Error("Failed to fetch donations");
        const donations = await donationsRes.json();

        if (!Array.isArray(donations) || donations.length === 0) {
          setStories([]);
          setLoading(false);
          return;
        }

        // Fetch charities info
        const charityIds = [...new Set(donations.map((d) => d.charity_id))];
        const charitiesData = {};
        for (const id of charityIds) {
          const charityRes = await fetch(`/charities/${id}`);
          if (!charityRes.ok) throw new Error("Failed to fetch charity info");
          const charity = await charityRes.json();
          charitiesData[id] = charity;
        }
        setCharities(charitiesData);

        // Fetch stories for each charity
        let allStories = [];
        for (const id of charityIds) {
          const storiesRes = await fetch(`/charity/${id}/stories`);
          if (!storiesRes.ok) throw new Error("Failed to fetch stories");
          let charityStories = await storiesRes.json();
          if (Array.isArray(charityStories)) {
            // Add charity_id to each story for mapping
            charityStories = charityStories.map((story) => ({
              ...story,
              charity_id: id,
            }));
            allStories = allStories.concat(charityStories);
          }
        }
        console.log("Fetched stories:", allStories);
        setStories(allStories);
        setLoading(false);
      } catch (err) {
        setError("Failed to load beneficiary stories");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (story) => {
    setSelectedStory(story);
    setShowFullContent(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStory(null);
    setModalOpen(false);
  };

  const toggleContent = () => {
    setShowFullContent((prev) => !prev);
  };

  if (loading) {
    return <p>Loading stories...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!stories.length) {
    return <p>You haven't donated to any charities with stories yet.</p>;
  }

  return (
    <div className="beneficiary-stories">
      <h2>Beneficiary Stories</h2>
      <ul>
        {stories.map((story) => (
          <li key={story.id}>
            <h3>{story.title}</h3>
            <p>{charities[story.charity_id]?.description || ""}</p>
            <p>
              {showFullContent && selectedStory?.id === story.id
                ? story.content
                : story.content?.slice(0, 100) +
                  (story.content?.length > 100 ? "..." : "")}
            </p>
            <button onClick={() => openModal(story)}>View Full Story</button>
          </li>
        ))}
      </ul>

      {modalOpen && selectedStory && (
        <div role="dialog" aria-modal="true" className="modal">
          <h3>{selectedStory.title}</h3>
          <p>
            {showFullContent
              ? selectedStory.content
              : selectedStory.content?.slice(0, 100) +
                (selectedStory.content?.length > 100 ? "..." : "")}
          </p>
          <button onClick={toggleContent}>
            {showFullContent ? "See Less" : "See More"}
          </button>
          <button onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryStory;
