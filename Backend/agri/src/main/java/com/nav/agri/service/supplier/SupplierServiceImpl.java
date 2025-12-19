package com.nav.agri.service.supplier;

import com.nav.agri.dto.supplier.SupplierCreateDTO;
import com.nav.agri.dto.supplier.SupplierDTO;
import com.nav.agri.models.Supplier;
import com.nav.agri.repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository repo;

    public SupplierServiceImpl(SupplierRepository repo) {
        this.repo = repo;
    }

    @Override
    public SupplierDTO createSupplier(SupplierCreateDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setName(dto.getName());
        supplier.setContactInfo(dto.getContactInfo());
        supplier.setAddress(dto.getAddress());
        return toDTO(repo.save(supplier));
    }

    @Override
    public SupplierDTO getSupplier(int id) {
        return toDTO(repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found")));
    }

    @Override
    public List<SupplierDTO> getAllSuppliers() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SupplierDTO updateSupplier(int id, SupplierCreateDTO dto) {
        Supplier supplier = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found"));
        supplier.setName(dto.getName());
        supplier.setContactInfo(dto.getContactInfo());
        supplier.setAddress(dto.getAddress());
        return toDTO(repo.save(supplier));
    }

    @Override
    public void deleteSupplier(int id) {
        repo.deleteById(id);
    }

    private SupplierDTO toDTO(Supplier supplier) {
        return new SupplierDTO(
                supplier.getSupplierId(),
                supplier.getName(),
                supplier.getContactInfo(),
                supplier.getAddress()
        );
    }
}
