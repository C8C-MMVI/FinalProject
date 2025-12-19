package com.nav.agri.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int productId;

    @Column(nullable = false)
    private String productName;

    private String description;

    @Column(nullable = false)
    private Double basePrice;

    @Column(nullable = false)
    private Double listPrice;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<StockRecord> stockRecords;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<TransactionDetails> transactionDetails;

    // Getters and Setters
    public int getProductId() { return productId; }
    public void setProductId(int id) { this.productId = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
    public Double getListPrice() { return listPrice; }
    public void setListPrice(Double listPrice) { this.listPrice = listPrice; }
    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    public List<StockRecord> getStockRecords() { return stockRecords; }
    public void setStockRecords(List<StockRecord> stockRecords) { this.stockRecords = stockRecords; }
    public List<TransactionDetails> getTransactionDetails() { return transactionDetails; }
    public void setTransactionDetails(List<TransactionDetails> transactionDetails) { this.transactionDetails = transactionDetails; }
}
