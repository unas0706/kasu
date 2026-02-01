import React from "react";

function SuccessModal({ isOpen, order, onClose, onNewOrder }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>

          <h2 className="modal-title">Order Confirmed! 🎉</h2>

          <div className="modal-message">
            <p>Your e-bill has been sent to your WhatsApp</p>
            <p className="hint">Show the e-bill at the concession counter</p>
          </div>

          <div className="order-details-card">
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{order.orderId}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Screen & Seat:</span>
              <span className="detail-value">
                {order.screenNumber} • {order.seatNumber}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value total">
                ${order.total.toFixed(2)}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">WhatsApp Sent To:</span>
              <span className="detail-value">
                {order.customer.whatsappNumber}
              </span>
            </div>
          </div>

          <div className="modal-instructions">
            <h4>
              <i className="fas fa-concierge-bell"></i>
              Collection Instructions
            </h4>
            <ul>
              <li>Show e-bill at concession counter</li>
              <li>Collection starts 30 mins before showtime</li>
              <li>Enjoy your movie experience!</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onNewOrder}>
              <i className="fas fa-plus"></i>
              New Order
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              <i className="fas fa-times"></i>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
