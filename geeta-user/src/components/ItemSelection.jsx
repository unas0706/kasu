// src/components/ItemSelection.jsx - Add onOpenCart prop
import React from "react";

function ItemSelection({
  categories,
  selectedCategory,
  menuItems,
  order,
  onAddToOrder,
  onUpdateQuantity,
  onRemoveFromOrder,
  onBack,
  onNext,
  onOpenCart, // Add this prop
}) {
  const category = categories.find((c) => c.id === selectedCategory);
  const cartTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleQuantityChange = (itemId, change) => {
    const orderItem = order.items.find((item) => item.id === itemId);
    if (orderItem) {
      const newQuantity = orderItem.quantity + change;
      if (newQuantity > 0) {
        onUpdateQuantity(itemId, newQuantity);
      } else {
        onRemoveFromOrder(itemId);
      }
    }
  };

  const handleAddToCart = (item) => {
    const orderItem = order.items.find((orderItem) => orderItem.id === item.id);

    if (orderItem) {
      onUpdateQuantity(item.id, orderItem.quantity + 1);
    } else {
      onAddToOrder(item, 1);
    }
  };

  return (
    <div className="item-selection animate-slide-up">
      <div className="section-title">
        <h2> {category?.name}</h2>
        <p>{category?.description}</p>
      </div>

      <div className="items-header">
        {/* <div className="category-header">
          <div className="category-header-icon">
            <i className={`fas ${category?.icon}`}></i>
          </div>
          <div className="category-header-text">
            <h3>{category?.name}</h3>
            <p>{category?.description}</p>
          </div>
        </div> */}

        <div
          className="cart-summary"
          onClick={onOpenCart}
          role="button"
          tabIndex={0}
          aria-label="View cart details"
        >
          <div className="cart-summary-content">
            <i className="fas fa-shopping-bag cart-summary-icon"></i>
            <div className="cart-summary-text">
              <h4>Your Cart</h4>
              <p>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items
              </p>
            </div>
            <div className="cart-total">${cartTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="items-grid">
        {menuItems.length > 0 ? (
          menuItems.map((item) => {
            const orderItem = order.items.find(
              (orderItem) => orderItem.id === item.id,
            );
            const quantity = orderItem ? orderItem.quantity : 0;

            return (
              <div key={item.id} className="item-card">
                <div className="item-image">
                  <i className={`fas ${item.icon}`}></i>
                  {/* {item.badge && <div className="item-badge">{item.badge}</div>} */}
                </div>

                <div className="item-content">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                  </div>

                  <p className="item-description">{item.description}</p>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn minus"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, -1);
                        }}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        -
                      </button>
                      <span className="quantity">{quantity}</span>
                      <button
                        className="quantity-btn plus"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuantityChange(item.id, 1);
                        }}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={`add-btn ${quantity > 0 ? "added" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                      aria-label={
                        quantity > 0
                          ? `Update ${item.name} in cart`
                          : `Add ${item.name} to cart`
                      }
                    >
                      {quantity > 0 ? (
                        <>
                          <i className="fas fa-check"></i>
                          Added
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus"></i>
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-items">
            <p>No items available in this category.</p>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          Back to Categories
        </button>

        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={order.items.length === 0}
        >
          Continue to Seat Selection
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default ItemSelection;
