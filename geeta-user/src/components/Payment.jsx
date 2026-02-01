import React, { useState } from "react";

function Payment({ order, selectedScreen, selectedSeat, onBack, onComplete }) {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!whatsappNumber) {
      alert("Please enter your WhatsApp number");
      return;
    }

    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter your UPI ID");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: paymentMethod,
        whatsappNumber,
        upiId,
        transactionId:
          paymentMethod === "upi"
            ? `UPI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
            : `CASH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      onComplete(paymentData);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="payment animate-slide-up">
      <div className="section-title">
        <h2>Complete Your Order</h2>
        <p>Review your order and choose your preferred payment method</p>
      </div>

      <div className="payment-container">
        <div className="order-summary-section">
          <div className="order-header">
            <h3>
              <i className="fas fa-receipt"></i>
              Order Summary
            </h3>
            <div className="order-meta">
              <span className="order-screen">{order.screenNumber}</span>
              <span className="order-seat">
                {order.seatRow}
                {order.seatNumber}
              </span>
              {order.seatType && (
                <span className="order-seat-type">{order.seatType}</span>
              )}
            </div>
          </div>

          <div className="order-items">
            {order.items.length > 0 ? (
              order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <p>No items in your order</p>
              </div>
            )}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax ({order.taxRate}%)</span>
              <span>${order.taxAmount.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Amount</span>
              <span className="total-amount">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="payment-methods">
            <div className="payment-options">
              <div
                className={`payment-option ${paymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="payment-icon">
                  <i className="fas fa-qrcode"></i>
                </div>
                <div className="payment-info">
                  <h4>UPI Payment</h4>
                  <p>Instant & Secure</p>
                </div>
                <div className="payment-check">
                  <i className="fas fa-check"></i>
                </div>
              </div>

              <div
                className={`payment-option ${paymentMethod === "cash" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cash")}
              >
                <div className="payment-icon">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
                <div className="payment-info">
                  <h4>Pay at Counter</h4>
                  <p>Cash Payment</p>
                </div>
                <div className="payment-check">
                  <i className="fas fa-check"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="payment-details">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-phone"></i>
                WhatsApp Number for E-Bill
              </label>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
              <small className="form-hint">
                Your e-bill will be sent to this number via WhatsApp
              </small>
            </div>

            {paymentMethod === "upi" && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    <i className="fas fa-wallet"></i>
                    Your UPI ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <small className="form-hint">
                    Payment request will be sent to this UPI ID
                  </small>
                </div>

                <div className="upi-qr-section">
                  <div className="upi-qr-container">
                    <div className="upi-qr-code">
                      <i className="fas fa-qrcode"></i>
                    </div>
                    <p className="upi-hint">
                      Scan QR Code with PhonePe, GPay or Paytm
                    </p>
                  </div>

                  <div className="upi-instructions">
                    <h4>
                      <i className="fas fa-info-circle"></i>
                      How to Pay via UPI
                    </h4>
                    <ol>
                      <li>Enter your UPI ID above</li>
                      <li>Payment request will be sent to your UPI app</li>
                      <li>Approve the payment in your app</li>
                      <li>E-bill will be sent to your WhatsApp</li>
                    </ol>
                  </div>
                </div>
              </>
            )}

            {paymentMethod === "cash" && (
              <div className="cash-instructions">
                <div className="cash-icon">
                  <i className="fas fa-concierge-bell"></i>
                </div>
                <div className="cash-info">
                  <h4>Pay at Concession Counter</h4>
                  <p>Show your e-bill and seat number to collect items</p>
                  <div className="cash-details">
                    <p>
                      <i className="fas fa-clock"></i>
                      Timing: 30 mins before showtime
                    </p>
                    <p>
                      <i className="fas fa-map-marker-alt"></i>
                      Location: Main Lobby Counter
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="payment-actions">
            <button
              type="submit"
              className="btn btn-primary btn-pay"
              disabled={isProcessing || order.items.length === 0}
            >
              {isProcessing ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-lock"></i>
                  {paymentMethod === "upi"
                    ? "Pay Now & Get E-Bill"
                    : "Confirm Order & Get E-Bill"}
                </>
              )}
            </button>

            <p className="payment-security">
              <i className="fas fa-shield-alt"></i>
              Your payment is secure and encrypted
            </p>
          </div>
        </form>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Seat Selection
        </button>

        <div className="order-total-display">
          <span>Total:</span>
          <span className="total-price">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

export default Payment;
