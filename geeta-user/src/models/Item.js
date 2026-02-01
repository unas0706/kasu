export class Item {
  constructor(data) {
    this.id = data._id || data.id;
    this.name = data.name;
    this.category = data.category;
    this.description = data.description || "";
    this.price = data.price;
    this.cost = data.cost || 0;
    this.stock = data.stock || 0;
    this.image = data.image || "";
    this.isAvailable = data.isAvailable !== undefined ? data.isAvailable : true;
    this.icon = data.icon || "fa-utensils";
    this.badge = data.badge || "";
  }
}
