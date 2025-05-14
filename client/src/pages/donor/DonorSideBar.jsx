import React from "react";

const DonorSideBar = () => {
  return (
    <aside className="donor-sidebar">
      <h2>Donor Sidebar</h2>
      <nav>
        <ul>
          <li>
            <a href="/donor/home">Home</a>
          </li>
          <li>
            <a href="/donor/donation-history">Donation History</a>
          </li>
          <li>
            <a href="/donor/beneficiary-stories">Beneficiary Stories</a>
          </li>
          <li>
            <a href="/donor/settings">Settings</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DonorSideBar;
