import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Save, DollarSign, Clock, Calendar, Bell } from "lucide-react";

const Settings = () => {
  const {
    businessSettings,
    taxConfig,
    updateBusinessSettings,
    updateTaxConfig,
  } = useData();
  const [settings, setSettings] = useState(businessSettings);
  const [tax, setTax] = useState(taxConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleTaxChange = (key, value) => {
    const newTax = { ...tax, [key]: value };
    setTax(newTax);

    // Update preview
    const subtotal = 50.0;
    const taxAmount = subtotal * (newTax.taxPercentage / 100);
    setTaxPreview({
      percentage: newTax.taxPercentage,
      amount: taxAmount,
      total: subtotal + taxAmount,
    });
  };

  const [taxPreview, setTaxPreview] = useState({
    percentage: tax.taxPercentage,
    amount: 50.0 * (tax.taxPercentage / 100),
    total: 50.0 + 50.0 * (tax.taxPercentage / 100),
  });

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await Promise.all([
        updateBusinessSettings(settings),
        updateTaxConfig(tax),
      ]);

      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page active">
      <div className="page-header">
        <h1 className="page-title">Tax & Settings</h1>
        <div className="page-actions">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Tax Configuration */}
        <Card>
          <div className="card-header">
            <div className="card-title">Tax Configuration</div>
          </div>
          <div className="card-body">
            <div className="tax-configuration">
              <div className="form-group">
                <label className="form-label required">Tax Percentage</label>
                <div className="tax-input-container">
                  <input
                    type="number"
                    className="tax-input"
                    value={tax.taxPercentage}
                    onChange={(e) =>
                      handleTaxChange(
                        "taxPercentage",
                        parseFloat(e.target.value),
                      )
                    }
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="text-lg font-semibold">%</span>
                </div>
                <p className="form-hint">
                  Set the tax percentage that will be applied to all orders.
                  Current: {tax.taxPercentage}%
                </p>
              </div>

              <div className="tax-preview mb-6">
                <div className="tax-preview-item">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">$50.00</span>
                </div>
                <div className="tax-preview-item">
                  <span className="text-gray-600">
                    Tax ({taxPreview.percentage}%):
                  </span>
                  <span className="font-medium">
                    ${taxPreview.amount.toFixed(2)}
                  </span>
                </div>
                <div className="tax-preview-item total">
                  <span>Total Amount:</span>
                  <span className="font-bold">
                    ${taxPreview.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* <div className="form-group">
                <label className="form-label">
                  Tax Inclusive/Exclusive Pricing
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tax-type"
                      checked={!tax.taxInclusive}
                      onChange={() => handleTaxChange("taxInclusive", false)}
                    />
                    <span>Tax Exclusive (Add tax at checkout)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="tax-type"
                      checked={tax.taxInclusive}
                      onChange={() => handleTaxChange("taxInclusive", true)}
                    />
                    <span>Tax Inclusive (Prices include tax)</span>
                  </label>
                </div>
              </div> */}
            </div>
          </div>
        </Card>

        {/* General Settings */}
        {/* <Card>
          <div className="card-header">
            <div className="card-title">General Settings</div>
          </div>
          <div className="card-body">
            <div className="grid gap-6">
              <div className="form-group">
                <label className="form-label">Currency</label>
                <select
                  className="form-input"
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                >
                  <option value="USD">US Dollar ($) - USD</option>
                  <option value="EUR">Euro (€) - EUR</option>
                  <option value="GBP">British Pound (£) - GBP</option>
                  <option value="JPY">Japanese Yen (¥) - JPY</option>
                  <option value="CAD">Canadian Dollar ($) - CAD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Time Zone</label>
                <select
                  className="form-input"
                  value={settings.timeZone}
                  onChange={(e) =>
                    setSettings({ ...settings, timeZone: e.target.value })
                  }
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date Format</label>
                <select
                  className="form-input"
                  value={settings.dateFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, dateFormat: e.target.value })
                  }
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Auto-refresh Live Orders</label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.autoRefreshOrders}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            autoRefreshOrders: e.target.checked,
                          })
                        }
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span>Enable auto-refresh</span>
                  </div>
                  <select
                    className="filter-select"
                    style={{ width: "auto" }}
                    value={settings.autoRefreshInterval}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoRefreshInterval: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={15}>Every 15 seconds</option>
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every 1 minute</option>
                    <option value={120}>Every 2 minutes</option>
                    <option value={300}>Every 5 minutes</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Low Stock Alert Threshold</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: "100px" }}
                    value={settings.lowStockAlert}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        lowStockAlert: parseInt(e.target.value),
                      })
                    }
                    min="1"
                  />
                  <span>items</span>
                </div>
                <p className="form-hint">
                  Receive notifications when item stock falls below this number
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Order Notification Sound</label>
                <div className="flex items-center gap-3">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.orderNotificationSound}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          orderNotificationSound: e.target.checked,
                        })
                      }
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span>Play sound for new orders</span>
                </div>
              </div>
            </div>
          </div>
        </Card> */}

        {/* Business Information */}
        {/* <Card>
          <div className="card-header">
            <div className="card-title">Business Information</div>
          </div>
          <div className="card-body">
            <div className="grid gap-6">
              <div className="form-group">
                <label className="form-label required">Business Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.businessName}
                  onChange={(e) =>
                    setSettings({ ...settings, businessName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Address</label>
                <textarea
                  className="form-input form-textarea"
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business Hours</label>
                <div className="grid gap-3">
                  {Object.entries(settings.businessHours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between"
                      >
                        <span className="capitalize">{day}</span>
                        <span>
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
};

export default Settings;
