package com.nav.agri.repositories;

import com.nav.agri.models.TransactionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionDetailsRepository extends JpaRepository<TransactionDetails, Integer> {
    List<TransactionDetails> findByTransactionTransactionId(int transactionId);
}
