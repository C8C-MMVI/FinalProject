// Response DTO
package com.nav.agri.dto.transactiondetails;

public class TransactionDetailsResponseDTO {
    private int transactionDetailsId;
    private int productId;
    private String productName;
    private int quantity;
    private double basePrice;
    private double listPrice;

    // Constructor
    public TransactionDetailsResponseDTO(int transactionDetailsId, int productId, String productName,
                                         int quantity, double basePrice, double listPrice) {
        this.transactionDetailsId = transactionDetailsId;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
    }

    // Getters and Setters
    public int getTransactionDetailsId() { return transactionDetailsId; }
    public void setTransactionDetailsId(int transactionDetailsId) { this.transactionDetailsId = transactionDetailsId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }
    public double getListPrice() { return listPrice; }
    public void setListPrice(double listPrice) { this.listPrice = listPrice; }
}
