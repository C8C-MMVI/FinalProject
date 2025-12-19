package com.nav.agri.dto.transaction;

public class TransactionItemDTO {

    private int productId;
    private String productName; // <-- Add this
    private int quantity;
    private Double basePrice;
    private Double listPrice;

    // Getters and Setters
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }

    @Override
    public String toString() {
        return "TransactionItemDTO{" +
                "productId=" + productId +
                ", productName='" + productName + '\'' +
                ", quantity=" + quantity +
                ", basePrice=" + basePrice +
                ", listPrice=" + listPrice +
                '}';
    }

}
