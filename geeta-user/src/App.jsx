// src/App.jsx - Update seat selection logic
import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import TopBar from "./components/TopBar";
import ProgressSteps from "./components/ProgressSteps";
import CategorySelection from "./components/CategorySelection";
import ItemSelection from "./components/ItemSelection";
import SeatSelection from "./components/SeatSelection";
import Payment from "./components/Payment";
import SuccessModal from "./components/SuccessModal";
import CartModal from "./components/CartModal";
import Toast from "./components/Toast";
import { Order } from "./models/Order";
import { useUser } from "./context/userContext";
import { screens } from "./data/data";

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [order, setOrder] = useState(new Order());
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const { placeOrder, categories, menuItems } = useUser();

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  const handleOpenCart = () => {
    if (order.items.length === 0) {
      showToast("Your cart is empty", "info");
    } else {
      setShowCartModal(true);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    showToast(
      `Selected ${categories.find((c) => c.id === categoryId)?.name}`,
      "info",
    );
    setTimeout(() => {
      setCurrentStep(2);
    }, 500);
  };

  const handleAddToOrder = (item, quantity) => {
    const newOrder = new Order(order);
    console.log(item);

    newOrder.addItem(item, quantity);
    setOrder(newOrder);
    showToast(`${item.name} added to cart`, "success");
  };

  const handleUpdateQuantity = (itemId, quantity) => {
    const newOrder = new Order(order);
    newOrder.updateItemQuantity(itemId, quantity);
    setOrder(newOrder);
    if (quantity === 0) {
      showToast("Item removed from cart", "info");
    }
  };

  const handleRemoveFromOrder = (itemId) => {
    const newOrder = new Order(order);
    newOrder.removeItem(itemId);
    setOrder(newOrder);
    showToast("Item removed from cart", "info");
  };

  const handleClearCart = () => {
    const newOrder = new Order(order);
    newOrder.clear();
    setOrder(newOrder);
    setShowCartModal(false);
    showToast("Cart cleared", "info");
  };

  // Enhanced seat selection
  const handleSeatSelect = (screen, seatDetails) => {
    if (!seatDetails) {
      setSelectedScreen(screen);
      setSelectedSeat(null);
      showToast(`Selected ${screen.name}`, "info");
    } else {
      const { row, seatNumber, seatType, priceMultiplier } = seatDetails;
      const seatLabel = `${row}${seatNumber}`;

      const newOrder = new Order(order);
      newOrder.setSeatDetails(
        screen,
        row,
        seatNumber,
        seatType,
        priceMultiplier,
      );

      setOrder(newOrder);
      setSelectedScreen(screen);
      setSelectedSeat(seatLabel);

      showToast(
        `Selected ${seatLabel} (${seatType}) in ${screen.name}`,
        "info",
      );
    }
  };

  const handlePaymentComplete = async (paymentData) => {
    const newOrder = new Order(order);
    newOrder.customer.phone = paymentData.whatsappNumber;
    newOrder.customer.upiId = paymentData.upiId;
    newOrder.paymentMethod = paymentData.method;
    newOrder.transactionId = paymentData.transactionId;
    newOrder.paymentStatus = paymentData.method === "cash" ? "pending" : "paid";

    setOrder(newOrder);

    await placeOrder(newOrder);

    // setShowSuccessModal(true);

    // sendWhatsAppBill(newOrder);
  };

  const sendWhatsAppBill = (order) => {
    const itemsText = order.items
      .map(
        (item) =>
          `• ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`,
      )
      .join("\n");

    const seatDetails = order.seatNumber
      ? `🎬 *Screen:* ${order.screenNumber} (${order.screenType})\n` +
        `💺 *Seat:* ${order.seatRow}${order.seatNumber} (${order.seatType})\n`
      : "";

    const message =
      `*🎬 Theatre Express - Order Confirmation*\n\n` +
      `📋 *Order ID:* ${order.orderId}\n` +
      seatDetails +
      `💳 *Payment Method:* ${order.paymentMethod.toUpperCase()}\n` +
      `🕒 *Time:* ${new Date().toLocaleString()}\n\n` +
      `*📦 Order Items:*\n${itemsText}\n\n` +
      `💰 *Subtotal:* $${order.subtotal.toFixed(2)}\n` +
      `📊 *Tax (${order.taxRate}%):* $${order.taxAmount.toFixed(2)}\n` +
      `💵 *Total:* $${order.total.toFixed(2)}\n\n` +
      `🎉 *Thank you for your order!*\n` +
      `📍 Collect from concession counter\n` +
      `⏰ 30 mins before showtime`;

    const whatsappUrl = `https://wa.me/${order.customer.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleNewOrder = () => {
    setOrder(new Order());
    setSelectedCategory(null);
    setSelectedScreen(null);
    setSelectedSeat(null);
    setCurrentStep(1);
    setShowSuccessModal(false);
    showToast("New order started", "info");
  };

  return (
    categories &&
    menuItems && (
      <div className="app">
        {/* <TopBar
        cartCount={order.items.reduce((sum, item) => sum + item.quantity, 0)}
        currentStep={currentStep}
        onCartClick={handleOpenCart}
      /> */}

        <ProgressSteps
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step === 2 && !selectedCategory) {
              showToast("Please select a category first", "warning");
              return;
            }
            if (step === 3 && order.items.length === 0) {
              showToast("Please add items to your cart first", "warning");
              return;
            }
            if (step === 4 && (!selectedScreen || !selectedSeat)) {
              showToast("Please select screen and seat first", "warning");
              return;
            }
            setCurrentStep(step);
          }}
          selectedCategory={selectedCategory}
          hasItems={order.items.length > 0}
          hasSeat={selectedScreen && selectedSeat}
        />

        <main className="main-content">
          {currentStep === 1 && (
            <CategorySelection
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={handleCategorySelect}
            />
          )}

          {currentStep === 2 && (
            <ItemSelection
              categories={categories}
              selectedCategory={selectedCategory}
              menuItems={selectedCategory ? menuItems[selectedCategory] : []}
              order={order}
              onAddToOrder={handleAddToOrder}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveFromOrder={handleRemoveFromOrder}
              onBack={() => setCurrentStep(1)}
              onNext={() => setCurrentStep(3)}
              onOpenCart={handleOpenCart}
            />
          )}

          {currentStep === 3 && (
            <SeatSelection
              screens={screens}
              selectedScreen={selectedScreen}
              order={order}
              selectedSeat={selectedSeat}
              onSelect={handleSeatSelect}
              onBack={() => setCurrentStep(2)}
              onNext={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <Payment
              order={order}
              selectedScreen={selectedScreen}
              selectedSeat={selectedSeat}
              onBack={() => setCurrentStep(3)}
              onComplete={handlePaymentComplete}
            />
          )}
        </main>

        <CartModal
          isOpen={showCartModal}
          order={order}
          onClose={() => setShowCartModal(false)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromOrder}
          onClearCart={handleClearCart}
          onProceed={() => {
            setShowCartModal(false);
            if (currentStep === 2) {
              setCurrentStep(3);
            }
          }}
          currentStep={currentStep}
        />

        <SuccessModal
          isOpen={showSuccessModal}
          order={order}
          onClose={() => setShowSuccessModal(false)}
          onNewOrder={handleNewOrder}
        />

        <Toast
          show={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    )
  );
}

export default App;
