package com.nav.agri.service.stockrecord;

import com.nav.agri.dto.stock.StockRecordCreateDTO;
import com.nav.agri.dto.stock.StockRecordDTO;
import java.util.List;

public interface StockRecordService {
    StockRecordDTO createStockRecord(StockRecordCreateDTO dto);
    StockRecordDTO getStockRecord(int id);
    List<StockRecordDTO> getAllStockRecords();
    StockRecordDTO updateStockRecord(int id, StockRecordCreateDTO dto);
    void deleteStockRecord(int id);
}
