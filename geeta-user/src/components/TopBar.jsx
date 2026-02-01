// src/components/TopBar.jsx
import React from "react";

function TopBar({ cartCount, currentStep, onCartClick }) {
  return (
    <div className="top-bar">
      <div className="logo">
        <i className="fas fa-film logo-icon"></i>
        <div className="logo-text">
          <span className="logo-main">THEATRE</span>
          <span className="logo-accent">EXPRESS</span>
        </div>
      </div>

      <div className="top-bar-right">
        <div className="step-indicator">
          <span className="step-text">STEP {currentStep}</span>
          <div className="step-dots">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`step-dot ${step === currentStep ? "active" : ""} ${step < currentStep ? "completed" : ""}`}
              />
            ))}
          </div>
        </div>

        <div
          className="cart-icon-container"
          onClick={onCartClick}
          role="button"
          tabIndex={0}
          aria-label="Open cart"
        >
          <i className="fas fa-shopping-bag"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>
    </div>
  );
}

export default TopBar;
