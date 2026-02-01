// src/components/SeatSelection.jsx
import React, { useState } from "react";

function SeatSelection({
  screens,
  selectedScreen,
  selectedSeat,
  onSelect,
  onBack,
  onNext,
  order,
}) {
  const [hoveredSeat, setHoveredSeat] = useState("");

  const handleScreenSelect = (screen) => {
    onSelect(screen, null);
  };

  const handleSeatClick = (
    screen,
    row,
    seatNumber,
    seatType,
    priceMultiplier,
  ) => {
    onSelect(screen, {
      row,
      seatNumber,
      seatType,
      priceMultiplier,
    });
  };

  const generateSeatMap = () => {
    if (!selectedScreen || !selectedScreen.seatLayout) return null;

    return selectedScreen.seatLayout.rows.map((row) => (
      <div key={row.letter} className="seat-row">
        <div className="row-label">{row.letter}</div>
        {Array.from({ length: row.seats }, (_, i) => {
          const seatNumber = i + 1;
          const seatId = `${row.letter}${seatNumber}`;
          const isSelected = selectedSeat === seatId;
          const isHovered = hoveredSeat === seatId;
          const seatType = row.type;

          return (
            <div
              key={seatId}
              className={`seat seat-${seatType} ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
              onClick={() =>
                handleSeatClick(
                  selectedScreen,
                  row.letter,
                  seatNumber,
                  seatType,
                  row.priceMultiplier,
                )
              }
              onMouseEnter={() => setHoveredSeat(seatId)}
              onMouseLeave={() => setHoveredSeat("")}
              title={`${row.letter}${seatNumber} - ${seatType.charAt(0).toUpperCase() + seatType.slice(1)} Seat`}
            >
              {seatNumber}
            </div>
          );
        })}
        <div className="row-label">{row.letter}</div>
      </div>
    ));
  };

  const getSeatTypeDetails = (type) => {
    const details = {
      vip: { color: "#d4af37", label: "VIP", price: "2.0x" },
      premium: { color: "#4f46e5", label: "Premium", price: "1.5x" },
      standard: { color: "#10b981", label: "Standard", price: "1.0x" },
      economy: { color: "#6b7280", label: "Economy", price: "0.9x" },
    };
    return details[type] || details.standard;
  };

  return (
    <div className="seat-selection">
      <div className="section-title">
        <h2>Select Your Seat</h2>
        <p>Choose your preferred screen and seat for the ultimate experience</p>
      </div>

      <div className="screen-selection">
        <div className="form-group">
          <label className="form-label">Select Screen</label>
          <div className="screen-cards">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className={`screen-card ${selectedScreen?.id === screen.id ? "selected" : ""}`}
                onClick={() => handleScreenSelect(screen)}
              >
                <div className="screen-name">{screen.name}</div>
                <div className="screen-type">{screen.type}</div>
                <div className="screen-time">{screen.time}</div>
                <div className="screen-seats-info">
                  <small>
                    {screen.seatLayout.rows.length} rows •{" "}
                    {screen.seatLayout.rows.reduce(
                      (sum, row) => sum + row.seats,
                      0,
                    )}{" "}
                    seats
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedScreen && (
        <>
          <div className="screen-info">
            <div className="screen-display">
              <div className="screen-label">SCREEN</div>
              <div className="screen-name-display">
                {selectedScreen.name} - {selectedScreen.type}
              </div>
              <div className="screen-seats-total">
                Total Seats:{" "}
                {selectedScreen.seatLayout.rows.reduce(
                  (sum, row) => sum + row.seats,
                  0,
                )}
              </div>
            </div>
          </div>

          <div className="seat-map-container">
            <div className="seat-map">{generateSeatMap()}</div>

            <div className="seat-legend">
              {["vip", "premium", "standard", "economy"].map((type) => {
                const details = getSeatTypeDetails(type);
                return (
                  <div key={type} className="legend-item">
                    <div
                      className="legend-seat"
                      style={{ backgroundColor: details.color }}
                    ></div>
                    <span>
                      {details.label} ({details.price})
                    </span>
                  </div>
                );
              })}
              <div className="legend-item">
                <div className="legend-seat selected"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          {selectedSeat && (
            <div className="selected-seat-info">
              <div className="seat-info-card">
                <i className="fas fa-chair seat-info-icon"></i>
                <div className="seat-info-details">
                  <h4>Selected Seat</h4>
                  <p className="seat-info-text">
                    {selectedSeat} in {selectedScreen.name}
                  </p>
                  <p className="seat-info-type">
                    {getSeatTypeDetails(order.seatType).label} Seat
                  </p>
                  <p className="seat-info-hint">
                    Price multiplier: {order.seatPriceMultiplier}x
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Items
        </button>

        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!selectedScreen || !selectedSeat}
        >
          Continue to Payment
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;
