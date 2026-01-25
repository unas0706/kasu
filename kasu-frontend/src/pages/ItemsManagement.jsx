import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { toast } from "react-hot-toast";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { Plus, FolderPlus, Edit, Trash2, Search, Filter } from "lucide-react";

const ItemsManagement = () => {
  const { categories, items, addCategory, addItem, updateItem, deleteItem } =
    useData();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    availability: "all",
    stock: "all",
    search: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [itemForm, setItemForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    isAvailable: true,
  });

  // Filter items based on filters
  const filteredItems = items.filter((item) => {
    const categoryMatch =
      filters.category === "all" || item.category._id === filters.category;
    const availabilityMatch =
      filters.availability === "all" ||
      (filters.availability === "active"
        ? item.isAvailable
        : !item.isAvailable);
    const stockMatch =
      filters.stock === "all" ||
      (filters.stock === "in-stock" && item.stock > 10) ||
      (filters.stock === "low" && item.stock <= 10 && item.stock > 0) ||
      (filters.stock === "out" && item.stock === 0);
    const searchMatch =
      !filters.search ||
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(filters.search.toLowerCase());

    return categoryMatch && availabilityMatch && stockMatch && searchMatch;
  });

  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    addCategory(categoryForm);
    setCategoryForm({ name: "", description: "", isActive: true });
    setIsCategoryModalOpen(false);
  };

  const handleAddItem = () => {
    if (!itemForm.name.trim() || !itemForm.price || !itemForm.categoryId) {
      toast.error("Please fill all required fields");
      return;
    }

    addItem({
      ...itemForm,
      price: parseFloat(itemForm.price),
      cost: parseFloat(itemForm.cost) || 0,
      stock: parseInt(itemForm.stock) || 0,
    });

    setItemForm({
      name: "",
      categoryId: "",
      description: "",
      price: "",
      cost: "",
      stock: "",
      isAvailable: true,
    });
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = () => {
    if (selectedItem) {
      deleteItem(selectedItem._id);
      setSelectedItem(null);
      setIsDeleteModalOpen(false);
      toast.success("Item deleted successfully");
    }
  };

  const handleItemAvailabilityToggle = (itemId, isAvailable) => {
    updateItem(itemId, { isAvailable: !isAvailable });
  };

  // Group items by category
  const itemsByCategory = categories
    .filter((cat) => cat.isActive)
    .map((category) => ({
      ...category,
      items: filteredItems.filter((item) => item.category._id === category._id),
    }))
    .filter(
      (category) => category.items.length > 0 || filters.category === "all",
    );

  // Calculate category revenue (for demo purposes)
  const calculateCategoryRevenue = (categoryItems) => {
    return categoryItems.reduce((total, item) => {
      return total + item.price * item.stock * 0.2; // 20% of stock as sold
    }, 0);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isItemModalOpen && !selectedItem) {
      setItemForm({
        name: "",
        categoryId: "",
        description: "",
        price: "",
        cost: "",
        stock: "",
        isAvailable: true,
      });
    }
  }, [isItemModalOpen, selectedItem]);

  // Initialize form when editing item
  useEffect(() => {
    if (selectedItem && isItemModalOpen) {
      setItemForm({
        name: selectedItem.name,
        categoryId: selectedItem.category._id,
        description: selectedItem.description || "",
        price: selectedItem.price.toString(),
        cost: selectedItem.cost?.toString() || "",
        stock: selectedItem.stock.toString(),
        isAvailable: selectedItem.isAvailable,
      });
    }
  }, [selectedItem, isItemModalOpen]);

  return (
    <div className="page active">
      <div className="page-header">
        <h1 className="page-title">Items & Categories Management</h1>
        <div className="page-actions">
          <Button
            variant="outline"
            icon={FolderPlus}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Add Category
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setSelectedItem(null);
              setIsItemModalOpen(true);
            }}
          >
            Add New Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container mb-6">
        <div className="filter-group">
          <div className="filter-label">Category</div>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Availability</div>
          <select
            className="filter-select"
            value={filters.availability}
            onChange={(e) =>
              setFilters({ ...filters, availability: e.target.value })
            }
          >
            <option value="all">All Items</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Stock Status</div>
          <select
            className="filter-select"
            value={filters.stock}
            onChange={(e) => setFilters({ ...filters, stock: e.target.value })}
          >
            <option value="all">All Stock</option>
            <option value="in-stock">In Stock (&gt;10)</option>
            <option value="low">Low Stock (1-10)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>

        <div className="filter-group">
          <div className="filter-label">Search Items</div>
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search items..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {itemsByCategory.length > 0 ? (
          itemsByCategory.map((category) => (
            <Card key={category._id} className="category-card">
              <div className="card-header">
                <div className="category-header">
                  <div>
                    <div className="category-name">{category.name}</div>
                    {/* <div className="category-items-count">
                      {category.items.length} items •{" "}
                      {Math.floor(category.items.length * 3.5)} sold today
                    </div> */}
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      // checked={category.isActive}
                      onChange={() => {
                        // Update category active status
                        updateItem(category._id, {
                          isActive: !category.isActive,
                        });
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="card-body">
                <div className="items-list">
                  {category.items.length === 0 && (
                    <div className="no-items-in-category">
                      <h3>No items found</h3>
                      <p className="text-gray-600">
                        {filters.category !== "all" ||
                        filters.search ||
                        filters.availability !== "all" ||
                        filters.stock !== "all"
                          ? "Try adjusting your filters to see more results"
                          : "Start by adding your first item"}
                      </p>
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => {
                          setSelectedItem(null);
                          setIsItemModalOpen(true);
                        }}
                      >
                        Add Your First Item
                      </Button>
                    </div>
                  )}
                  {category.items.map((item) => (
                    <div key={item._id} className="item-card">
                      <div className="item-info">
                        <div className="item-name">
                          <b>{item.name}</b>
                        </div>
                        <div className="item-stock">{item.description}</div>
                        <div className="item-price-stock">
                          {/* <span className="item-price">
                            ${item.price.toFixed(2)}
                          </span> */}
                          <span className="item-cost">
                            Cost: ${item.cost?.toFixed(2) || "0.00"}
                          </span>
                          <br />
                          <span
                            className={`item-stock ${item.stock <= 10 ? "low" : ""}`}
                          >
                            Stock: {item.stock}
                          </span>
                        </div>
                      </div>
                      <div className="item-actions">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            // checked={item.isAvailable}
                            onChange={() =>
                              handleItemAvailabilityToggle(
                                item._id,
                                item.isAvailable,
                              )
                            }
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsItemModalOpen(true);
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* <div className="card-footer">
                <span className="text-gray-600 text-sm">
                  Total Category Revenue: $
                  {calculateCategoryRevenue(category.items).toFixed(2)}
                </span>
                <Button variant="outline" size="sm">
                  View All Items
                </Button>
              </div> */}
            </Card>
          ))
        ) : (
          <div className="no-items-message">
            <div className="no-items-icon">📦</div>
            <h3>No items found</h3>
            <p className="text-gray-600">
              {filters.category !== "all" ||
              filters.search ||
              filters.availability !== "all" ||
              filters.stock !== "all"
                ? "Try adjusting your filters to see more results"
                : "Start by adding your first item"}
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => {
                setSelectedItem(null);
                setIsItemModalOpen(true);
              }}
            >
              Add Your First Item
            </Button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Add New Category"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsCategoryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Create Category
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label required">Category Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Snacks, Beverages"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Brief description of this category"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="form-group">
            <div className="flex items-center gap-3">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      isActive: e.target.checked,
                    })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Active (visible to customers)</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? `Edit ${selectedItem.name}` : "Add New Item"}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setIsItemModalOpen(false);
                setSelectedItem(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={
                selectedItem
                  ? () => {
                      updateItem(selectedItem._id, {
                        ...itemForm,
                        price: parseFloat(itemForm.price),
                        cost: parseFloat(itemForm.cost) || 0,
                        stock: parseInt(itemForm.stock) || 0,
                      });
                      setIsItemModalOpen(false);
                      setSelectedItem(null);
                      toast.success("Item updated successfully");
                    }
                  : handleAddItem
              }
            >
              {selectedItem ? "Update Item" : "Save Item"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label required">Item Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Classic Popcorn"
              value={itemForm.name}
              onChange={(e) =>
                setItemForm({ ...itemForm, name: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Category</label>
            <select
              className="form-input"
              value={itemForm.categoryId}
              onChange={(e) =>
                setItemForm({ ...itemForm, categoryId: e.target.value })
              }
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label required">Price ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm({ ...itemForm, price: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cost ($)</label>
              <input
                type="number"
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={itemForm.cost}
                onChange={(e) =>
                  setItemForm({ ...itemForm, cost: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label required">Initial Stock</label>
              <input
                type="number"
                className="form-input"
                placeholder="0"
                min="0"
                value={itemForm.stock}
                onChange={(e) =>
                  setItemForm({ ...itemForm, stock: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input form-textarea"
              placeholder="Describe the item, ingredients, etc."
              value={itemForm.description}
              onChange={(e) =>
                setItemForm({ ...itemForm, description: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <div className="flex items-center gap-3">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={itemForm.isAvailable}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, isAvailable: e.target.checked })
                  }
                />
                <span className="toggle-slider"></span>
              </label>
              <span>Available (customers can order)</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Delete
            </Button>
          </>
        }
      >
        <div className="text-center py-4">
          <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">
            Delete {selectedItem?.name}
          </h3>
          <p className="text-gray-600">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ItemsManagement;
