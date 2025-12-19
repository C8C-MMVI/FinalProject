package com.nav.agri.service.transaction;

import com.nav.agri.dto.transaction.TransactionRequestDTO;
import com.nav.agri.dto.transaction.TransactionResponseDTO;

import java.util.List;

public interface TransactionService {
    TransactionResponseDTO createTransaction(TransactionRequestDTO request);
    TransactionResponseDTO getTransaction(int id);
    List<TransactionResponseDTO> getAllTransactions();
    // Optional: update if POS allows editing past transactions
    TransactionResponseDTO updateTransaction(int id, TransactionRequestDTO request);
    void deleteTransaction(int id);
}
