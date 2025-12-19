package com.nav.agri.service.transactiondetails;

import com.nav.agri.dto.transactiondetails.TransactionDetailsRequestDTO;
import com.nav.agri.dto.transactiondetails.TransactionDetailsResponseDTO;

import java.util.List;

public interface TransactionDetailsService {
    TransactionDetailsResponseDTO createTransactionDetails(TransactionDetailsRequestDTO dto);
    TransactionDetailsResponseDTO getTransactionDetails(int id);
    List<TransactionDetailsResponseDTO> getAllTransactionDetails();
    TransactionDetailsResponseDTO updateTransactionDetails(int id, TransactionDetailsRequestDTO dto);
    void deleteTransactionDetails(int id);
}
