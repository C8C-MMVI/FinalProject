package com.nav.agri.dto.transaction;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.List;

public class TransactionRequestDTO {

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd") // matches ISO date
    private LocalDate transactionDate;
    private Double totalAmount;
    private int userId;
    private List<TransactionItemDTO> items;

    // Getters and Setters
    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public List<TransactionItemDTO> getItems() { return items; }
    public void setItems(List<TransactionItemDTO> items) { this.items = items; }

    @Override
    public String toString() {
        return "TransactionRequestDTO{" +
                "transactionDate=" + transactionDate +
                ", totalAmount=" + totalAmount +
                ", userId=" + userId +
                ", items=" + items +
                '}';
    }
}
