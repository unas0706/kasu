import React from "react";

function CategorySelection({ categories, selectedCategory, onSelect }) {
  return (
    <div className="category-selection animate-slide-up">
      <div className="section-title">
        <h2>Select Your Favourite Category</h2>
        <p>Choose from our premium selection of gourmet categories</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory === category.id ? "selected" : ""}`}
            onClick={() => onSelect(category.id)}
          >
            <div className="category-card-inner">
              {/* <div className="category-icon">
                <i className={`fas ${category.icon}`}></i>
              </div> */}

              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>

                {/* <div className="category-footer">
                  <span className="category-browse">Browse Selection</span>
                  <i className="fas fa-arrow-right category-arrow"></i>
                </div> */}
              </div>

              <div className="category-glow"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="category-hint">
        <i className="fas fa-lightbulb"></i>
        <span>
          Click any category to automatically proceed to item selection
        </span>
      </div>
    </div>
  );
}

export default CategorySelection;
