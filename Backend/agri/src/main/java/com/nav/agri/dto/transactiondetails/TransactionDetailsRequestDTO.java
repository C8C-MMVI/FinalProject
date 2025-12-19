package com.nav.agri.dto.transactiondetails;

public class TransactionDetailsRequestDTO {

    private int transactionId;
    private int productId;
    private int quantity;
    private double basePrice;
    private double listPrice;

    // Constructors
    public TransactionDetailsRequestDTO() {}

    public TransactionDetailsRequestDTO(int transactionId, int productId, int quantity, double basePrice, double listPrice) {
        this.transactionId = transactionId;
        this.productId = productId;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
    }

    // Getters and Setters
    public int getTransactionId() { return transactionId; }
    public void setTransactionId(int transactionId) { this.transactionId = transactionId; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public double getListPrice() { return listPrice; }
    public void setListPrice(double listPrice) { this.listPrice = listPrice; }
}
