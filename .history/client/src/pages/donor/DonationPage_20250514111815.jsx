import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useParams } from "react-router-dom";
import "../../styles/DonationPage.css";
import paypalLogo from "../../assets/paypal_888870.png";

const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
      <p className="text-gray-800 mb-4">{message}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
);

const DonationPage = ({ onSubmit }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [donationType, setDonationType] = useState("one-time");

  const { donorId } = useParams();

  const [charityId, setCharityId] = useState("");
  const [amountError, setAmountError] = useState("");
  const [charityError, setCharityError] = useState("");

  const quickAmounts = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];

  const handleQuickAmountClick = (value) => {
    setAmount(value);
    setSelectedQuickAmount(value);
  };

  const handleSetReminder = () => {
    if (donationType === "monthly") {
      setModalMessage("Monthly donation reminder has been set!");
    } else {
      setModalMessage("Reminder is only available for monthly donations.");
    }
    setShowModal(true);
  };

  const isMonthly = donationType === "monthly";

  const handleBackendDonation = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/donors/${donorId}/donate/${charityId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            charity_id: parseInt(charityId),
            amount: parseFloat(amount),
            frequency: isMonthly ? "monthly" : "one-time",
            anonymous: anonymous,
            repeat_donation: isMonthly,
            reminder_set: isMonthly,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Donation failed.");
      }

      console.log("Donation recorded:", result);
    } catch (err) {
      console.error("Backend donation error:", err);
      setModalMessage(
        "Donation succeeded with PayPal, but saving to backend failed."
      );
      setShowModal(true);
      throw err;
    }
  };

  const validateForm = () => {
    let valid = true;
    setAmountError("");
    setCharityError("");

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError("Amount is required and must be a positive number.");
      valid = false;
    }
    if (!charityId) {
      setCharityError("Charity is required.");
      valid = false;
    }
    return valid;
  };

  // Removed duplicate handleBackendDonation function to fix redeclaration error

  const handleDonateClick = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      if (onSubmit) {
        onSubmit({ amount, charity: charityId });
      }
      await handleBackendDonation();
      setModalMessage("Donation successful! Thank you.");
      setShowModal(true);
    } catch (error) {
      setModalMessage("Donation failed. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <section className="donation-container">
      <div className="donation-left">
        <img src={paypalLogo} alt="PayPal Logo" className="paypal-logo" />
      </div>

      <div className="donation-right">
        <h1>Make a Donation</h1>

        <div className="quick-amounts">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              className={`amount-button ${
                selectedQuickAmount === amt ? "selected" : ""
              }`}
              onClick={() => handleQuickAmountClick(amt)}
              aria-label={`Quick amount ${amt}`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="$.00"
          className="amount-input"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setSelectedQuickAmount(null);
          }}
          aria-label="Custom donation amount"
        />
        {amountError && (
          <p style={{ color: "red", marginTop: "0.25rem" }}>{amountError}</p>
        )}

        <label
          htmlFor="charity-select"
          className="charity-label"
          style={{ display: "block", marginTop: "1rem" }}
        >
          Charity
        </label>
        <select
          id="charity-select"
          value={charityId}
          onChange={(e) => {
            setCharityId(e.target.value);
          }}
          aria-label="Charity"
          style={{ display: "block", marginTop: "0.5rem" }}
        >
          <option value="">Select a charity</option>
          <option value="1">Charity 1</option>
          <option value="2">Charity 2</option>
          <option value="3">Charity 3</option>
        </select>
        {charityError && (
          <p style={{ color: "red", marginTop: "0.25rem" }}>{charityError}</p>
        )}

        <div className="options">
          <label className="option-label">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            Donate Anonymously
          </label>

          <label className="option-label">
            <input
              type="radio"
              name="donation-type"
              checked={donationType === "one-time"}
              onChange={() => setDonationType("one-time")}
            />
            One Time Donation
          </label>

          <label className="option-label">
            <input
              type="radio"
              name="donation-type"
              checked={donationType === "monthly"}
              onChange={() => setDonationType("monthly")}
            />
            Monthly Donation
          </label>
        </div>

        <div className="buttons-row">
          <button className="reminder-button" onClick={handleSetReminder}>
            Set Reminder
          </button>
        </div>

        <div className="paypal-button-wrapper">
          <PayPalButtons
            style={{ layout: "vertical" }}
            disabled={!amount || isNaN(amount) || Number(amount) <= 0}
            forceReRender={[amount]}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toString(),
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(async (details) => {
                setModalMessage(
                  `Donation successful! Thank you, ${details.payer.name.given_name}.`
                );
                setShowModal(true);

                await handleBackendDonation();
              });
            }}
            onError={(err) => {
              console.error("PayPal Checkout error:", err);
              setModalMessage("An error occurred during payment.");
              setShowModal(true);
            }}
          />
          <button
            type="button"
            onClick={handleDonateClick}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
            }}
          >
            Donate
          </button>
        </div>
      </div>
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            setModalMessage("");
          }}
        />
      )}
    </section>
  );
};

export default DonationPage;
