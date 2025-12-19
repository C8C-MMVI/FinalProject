package com.nav.agri.controllers.api;

import com.nav.agri.dto.transaction.TransactionRequestDTO;
import com.nav.agri.dto.transaction.TransactionResponseDTO;
import com.nav.agri.service.transaction.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponseDTO> getAll() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public TransactionResponseDTO get(@PathVariable int id) {
        return transactionService.getTransaction(id);
    }

    @PostMapping
    public TransactionResponseDTO create(@RequestBody TransactionRequestDTO request) {
        return transactionService.createTransaction(request);
    }

    @PutMapping("/{id}")
    public TransactionResponseDTO update(@PathVariable int id, @RequestBody TransactionRequestDTO request) {
        return transactionService.updateTransaction(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        transactionService.deleteTransaction(id);
    }
}
