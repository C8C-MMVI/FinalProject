package com.nav.agri.controllers.api;

import com.nav.agri.dto.stock.StockRecordCreateDTO;
import com.nav.agri.dto.stock.StockRecordDTO;
import com.nav.agri.service.stockrecord.StockRecordService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-records")
public class StockRecordController {

    private final StockRecordService stockRecordService;

    public StockRecordController(StockRecordService stockRecordService) {
        this.stockRecordService = stockRecordService;
    }

    /* ===================== READ ===================== */
    @GetMapping
    public List<StockRecordDTO> getAll() {
        return stockRecordService.getAllStockRecords();
    }

    @GetMapping("/{id}")
    public StockRecordDTO get(@PathVariable int id) {
        return stockRecordService.getStockRecord(id);
    }

    /* ===================== CREATE ===================== */
    @PostMapping
    public StockRecordDTO create(@RequestBody @Valid StockRecordCreateDTO dto) {
        return stockRecordService.createStockRecord(dto);
    }

    /* ===================== UPDATE ===================== */
    @PutMapping("/{id}")
    public StockRecordDTO update(@PathVariable int id, @RequestBody @Valid StockRecordCreateDTO dto) {
        return stockRecordService.updateStockRecord(id, dto);
    }

    /* ===================== DELETE ===================== */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        stockRecordService.deleteStockRecord(id);
    }
}
