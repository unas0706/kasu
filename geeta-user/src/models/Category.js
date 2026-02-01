export class Category {
  constructor(data) {
    this.id = data._id || data.id;
    this.name = data.name;
    this.description = data.description || "";
    this.image = data.image || "";
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.icon = data.icon || "fa-utensils";
  }
}
