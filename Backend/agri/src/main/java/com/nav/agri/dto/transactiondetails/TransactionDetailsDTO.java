package com.nav.agri.dto.transactiondetails;

public class TransactionDetailsDTO {
    private int transactionDetailsId;
    private Integer quantity;
    private Double basePrice;
    private Double listPrice;
    private int productId;
    private String productName;   // <-- add this
    private int transactionId;

    public TransactionDetailsDTO() {}

    // Constructor including product name
    public TransactionDetailsDTO(int transactionDetailsId, Integer quantity, Double basePrice, Double listPrice,
                                 int productId, String productName, int transactionId) {
        this.transactionDetailsId = transactionDetailsId;
        this.quantity = quantity;
        this.basePrice = basePrice;
        this.listPrice = listPrice;
        this.productId = productId;
        this.productName = productName;
        this.transactionId = transactionId;
    }

    // Getters and setters
    public int getTransactionDetailsId() { return transactionDetailsId; }
    public void setTransactionDetailsId(int transactionDetailsId) { this.transactionDetailsId = transactionDetailsId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getTransactionId() { return transactionId; }
    public void setTransactionId(int transactionId) { this.transactionId = transactionId; }
}
