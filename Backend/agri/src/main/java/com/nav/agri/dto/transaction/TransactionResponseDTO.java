package com.nav.agri.dto.transaction;

import java.time.LocalDate;
import java.util.List;

public class TransactionResponseDTO {

    private int transactionId;
    private LocalDate transactionDate;
    private Double totalAmount;
    private int userId;
    private List<TransactionItemDTO> items;

    // Getters and Setters
    public int getTransactionId() { return transactionId; }
    public void setTransactionId(int transactionId) { this.transactionId = transactionId; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public List<TransactionItemDTO> getItems() { return items; }
    public void setItems(List<TransactionItemDTO> items) { this.items = items; }
}
