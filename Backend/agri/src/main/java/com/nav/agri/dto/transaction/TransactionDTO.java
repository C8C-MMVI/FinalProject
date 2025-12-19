package com.nav.agri.dto.transaction;

import java.time.LocalDate;

public class TransactionDTO {
    private int transactionId;
    private LocalDate transactionDate;
    private Double totalAmount;
    private int userId;

    public TransactionDTO() {}

    public TransactionDTO(int transactionId, LocalDate transactionDate, Double totalAmount, int userId) {
        this.transactionId = transactionId;
        this.transactionDate = transactionDate;
        this.totalAmount = totalAmount;
        this.userId = userId;
    }

    public int getTransactionId() { return transactionId; }
    public void setTransactionId(int transactionId) { this.transactionId = transactionId; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
}
