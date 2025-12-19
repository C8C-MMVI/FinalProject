package com.nav.agri.repositories;

import com.nav.agri.models.StockRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRecordRepository extends JpaRepository<StockRecord, Integer> {

    // Finds a stock record by the product's ID
    Optional<StockRecord> findByProduct_ProductId(int productId);

}
