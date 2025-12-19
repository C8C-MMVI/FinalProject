package com.nav.agri.controllers.api;

import com.nav.agri.models.TransactionDetails;
import com.nav.agri.repositories.TransactionDetailsRepository;
import com.nav.agri.dto.transactiondetails.TransactionDetailsDTO;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transaction-details")
public class TransactionDetailsController {

    private final TransactionDetailsRepository repo;

    public TransactionDetailsController(TransactionDetailsRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<TransactionDetails> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public TransactionDetails get(@PathVariable int id) {
        return repo.findById(id).orElse(null);
    }

    // Existing endpoint
    @GetMapping("/transaction/{transactionId}")
    public List<TransactionDetails> getByTransactionId(@PathVariable int transactionId) {
        return repo.findByTransactionTransactionId(transactionId);
    }

    // ✅ New DTO-based endpoint
    @GetMapping("/transaction/{transactionId}/with-product-name")
    public List<TransactionDetailsDTO> getByTransactionIdWithName(@PathVariable int transactionId) {
        List<TransactionDetails> details = repo.findByTransactionTransactionId(transactionId);
        return details.stream()
                .map(td -> new TransactionDetailsDTO(
                        td.getTransactionDetailsId(),
                        td.getQuantity(),
                        td.getBasePrice(),
                        td.getListPrice(),
                        td.getProduct().getProductId(),
                        td.getProduct().getProductName(), // <-- map product name
                        td.getTransaction().getTransactionId()
                ))
                .collect(Collectors.toList());
    }

    @PostMapping
    public TransactionDetails create(@RequestBody TransactionDetails details) {
        return repo.save(details);
    }

    @PutMapping("/{id}")
    public TransactionDetails update(@PathVariable int id, @RequestBody TransactionDetails details) {
        details.setTransactionDetailsId(id);
        return repo.save(details);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        repo.deleteById(id);
    }
}
