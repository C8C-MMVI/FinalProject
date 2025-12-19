package com.nav.agri.dto.stock;

import java.time.LocalDate;

public class StockRecordDTO {
    private int stockRecordId;
    private Integer quantity;
    private Double unitPrice;
    private LocalDate lastUpdated;

    private int productId;
    private String productName;

    private int supplierId;
    private String supplierName;

    public StockRecordDTO() {}

    public int getStockRecordId() { return stockRecordId; }
    public void setStockRecordId(int stockRecordId) { this.stockRecordId = stockRecordId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public LocalDate getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDate lastUpdated) { this.lastUpdated = lastUpdated; }

    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public int getSupplierId() { return supplierId; }
    public void setSupplierId(int supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
}
