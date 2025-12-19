package com.nav.agri.controllers.api;

import com.nav.agri.models.Supplier;
import com.nav.agri.repositories.SupplierRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository repo;

    public SupplierController(SupplierRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Supplier getSupplier(@PathVariable int id) {
        return repo.findById(id).orElse(null);
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return repo.save(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable int id, @RequestBody Supplier supplier) {
        supplier.setSupplierId(id);
        return repo.save(supplier);
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable int id) {
        repo.deleteById(id);
    }
}
