// src/components/CartModal.jsx
import React from "react";

function CartModal({
  isOpen,
  order,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceed,
  currentStep,
}) {
  if (!isOpen) return null;

  const handleQuantityChange = (itemId, change) => {
    const item = order.items.find((i) => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        onUpdateQuantity(itemId, newQuantity);
      } else {
        onRemoveItem(itemId);
      }
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div
        className="cart-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-modal-content">
          <div className="cart-modal-header">
            <div className="cart-modal-title">
              <i className="fas fa-shopping-bag"></i>
              <h2>Your Cart</h2>
            </div>
            <button
              className="cart-modal-close"
              onClick={onClose}
              aria-label="Close cart"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="cart-modal-body">
            {order.items.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add items from the menu to get started</p>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-price">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      <div className="cart-item-controls">
                        <div className="cart-quantity-controls">
                          <button
                            className="cart-quantity-btn minus"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            aria-label={`Decrease ${item.name} quantity`}
                          >
                            -
                          </button>
                          <span className="cart-quantity">{item.quantity}</span>
                          <button
                            className="cart-quantity-btn plus"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            aria-label={`Increase ${item.name} quantity`}
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-total">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                          className="cart-item-remove"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary-details">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Tax ({order.taxRate}%)</span>
                    <span>${order.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row total">
                    <span>Total</span>
                    <span className="cart-total-amount">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="cart-modal-footer">
            {order.items.length > 0 ? (
              <>
                <div className="cart-footer-buttons">
                  <button
                    className="btn btn-secondary btn-clear"
                    onClick={onClearCart}
                  >
                    <i className="fas fa-trash"></i>
                    Clear Cart
                  </button>

                  {currentStep === 2 && (
                    <button
                      className="btn btn-primary btn-proceed"
                      onClick={onProceed}
                    >
                      Proceed to Seat Selection
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </div>

                {currentStep !== 2 && (
                  <p className="cart-proceed-note">
                    Complete item selection to proceed to seat selection
                  </p>
                )}
              </>
            ) : (
              <button
                className="btn btn-secondary btn-continue"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
