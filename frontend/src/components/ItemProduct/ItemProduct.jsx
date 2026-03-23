import React from "react";
import "./ItemProduct.css";

function ItemProduct({ id, creatorId, title, description, basePrice, itemType }) {
  return (
    <div className="item-product">
      <div className="item-product-header">
        <h3>{title}</h3>
        <span>{itemType}</span>
      </div>
      <p>{description}</p>
      <div className="item-product-footer">
        <span>ID: {id}</span>
        <span>Creator: {creatorId}</span>
        <span>{basePrice}€</span>
      </div>
    </div>
  );
}

export default ItemProduct;