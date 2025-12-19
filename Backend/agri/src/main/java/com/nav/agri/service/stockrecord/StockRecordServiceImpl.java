package com.nav.agri.service.stockrecord;

import com.nav.agri.dto.stock.StockRecordCreateDTO;
import com.nav.agri.dto.stock.StockRecordDTO;
import com.nav.agri.models.Product;
import com.nav.agri.models.StockRecord;
import com.nav.agri.models.Supplier;
import com.nav.agri.repositories.ProductRepository;
import com.nav.agri.repositories.StockRecordRepository;
import com.nav.agri.repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockRecordServiceImpl implements StockRecordService {

    private final StockRecordRepository repo;
    private final ProductRepository productRepo;
    private final SupplierRepository supplierRepo;

    public StockRecordServiceImpl(
            StockRecordRepository repo,
            ProductRepository productRepo,
            SupplierRepository supplierRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
        this.supplierRepo = supplierRepo;
    }

    @Override
    public StockRecordDTO createStockRecord(StockRecordCreateDTO dto) {
        StockRecord record = mapDTOToEntity(dto);
        return mapEntityToDTO(repo.save(record));
    }

    @Override
    public StockRecordDTO getStockRecord(int id) {
        return repo.findById(id)
                .map(this::mapEntityToDTO)
                .orElseThrow(() -> new RuntimeException("StockRecord not found"));
    }

    @Override
    public List<StockRecordDTO> getAllStockRecords() {
        return repo.findAll().stream()
                .map(this::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StockRecordDTO updateStockRecord(int id, StockRecordCreateDTO dto) {
        StockRecord record = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("StockRecord not found"));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        record.setQuantity(dto.getQuantity());
        record.setUnitPrice(dto.getUnitPrice());
        record.setLastUpdated(dto.getLastUpdated());
        record.setProduct(product);
        record.setSupplier(supplier);

        return mapEntityToDTO(repo.save(record));
    }

    @Override
    public void deleteStockRecord(int id) {
        repo.deleteById(id);
    }

    /* ===================== Helpers ===================== */
    private StockRecord mapDTOToEntity(StockRecordCreateDTO dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Supplier supplier = supplierRepo.findById(dto.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        StockRecord record = new StockRecord();
        record.setQuantity(dto.getQuantity());
        record.setUnitPrice(dto.getUnitPrice());
        record.setLastUpdated(dto.getLastUpdated());
        record.setProduct(product);
        record.setSupplier(supplier);

        return record;
    }

    private StockRecordDTO mapEntityToDTO(StockRecord record) {
        StockRecordDTO dto = new StockRecordDTO();
        dto.setStockRecordId(record.getStockRecordId());
        dto.setQuantity(record.getQuantity());
        dto.setUnitPrice(record.getUnitPrice());
        dto.setLastUpdated(record.getLastUpdated());

        dto.setProductId(record.getProduct().getProductId());
        dto.setProductName(record.getProduct().getProductName());

        dto.setSupplierId(record.getSupplier().getSupplierId());
        dto.setSupplierName(record.getSupplier().getName());

        return dto;
    }
}
