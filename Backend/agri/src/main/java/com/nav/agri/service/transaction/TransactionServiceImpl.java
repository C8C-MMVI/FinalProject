package com.nav.agri.service.transaction;

import com.nav.agri.dto.transaction.TransactionRequestDTO;
import com.nav.agri.dto.transaction.TransactionResponseDTO;
import com.nav.agri.dto.transaction.TransactionItemDTO;
import com.nav.agri.models.*;
import com.nav.agri.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final StockRecordRepository stockRecordRepo;

    public TransactionServiceImpl(TransactionRepository transactionRepo, UserRepository userRepo,
                                  ProductRepository productRepo, StockRecordRepository stockRecordRepo) {
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.stockRecordRepo = stockRecordRepo;
    }

    @Override
    @Transactional
    public TransactionResponseDTO createTransaction(TransactionRequestDTO request) {
        System.out.println("🟢 Creating transaction for userId: " + request.getUserId());

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setTotalAmount(request.getTotalAmount());

        // Save parent transaction first to generate ID
        Transaction savedTransaction = transactionRepo.save(transaction);
        final Transaction parentTransaction = savedTransaction; // final for lambda
        System.out.println("💾 Saved parent transaction ID: " + savedTransaction.getTransactionId());

        // Map transaction items and decrement stock
        List<TransactionDetails> details = request.getItems().stream().map(item -> {
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            StockRecord stock = stockRecordRepo.findByProduct_ProductId(product.getProductId())
                    .orElseThrow(() -> new RuntimeException("Stock not found for product: " + product.getProductName()));

            int newQuantity = stock.getQuantity() - item.getQuantity();
            if (newQuantity < 0)
                throw new RuntimeException("Insufficient stock for product: " + product.getProductName());

            stock.setQuantity(newQuantity);
            stock.setLastUpdated(LocalDate.now());
            stockRecordRepo.save(stock);
            System.out.println("📉 Stock updated for product: " + product.getProductName() + " -> " + stock.getQuantity());

            TransactionDetails td = new TransactionDetails();
            td.setProduct(product);
            td.setQuantity(item.getQuantity());
            td.setBasePrice(item.getBasePrice());
            td.setListPrice(item.getListPrice());
            td.setTransaction(parentTransaction); // ✅ use final variable
            return td;
        }).collect(Collectors.toCollection(ArrayList::new)); // ✅ Changed to mutable list

        // Attach details and save transaction again
        parentTransaction.setTransactionDetails(details);
        savedTransaction = transactionRepo.save(parentTransaction);
        System.out.println("✅ Transaction saved with details, ID: " + savedTransaction.getTransactionId());

        return mapToResponseDTO(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponseDTO updateTransaction(int id, TransactionRequestDTO request) {
        System.out.println("🟡 Updating transaction ID: " + id);

        Transaction transaction = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        User user = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        transaction.setUser(user);
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setTotalAmount(request.getTotalAmount());

        // Restore stock from old transaction
        transaction.getTransactionDetails().forEach(td -> {
            StockRecord stock = stockRecordRepo.findByProduct_ProductId(td.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Stock not found for product: " + td.getProduct().getProductName()));
            stock.setQuantity(stock.getQuantity() + td.getQuantity());
            stock.setLastUpdated(LocalDate.now());
            stockRecordRepo.save(stock);
        });

        transaction.getTransactionDetails().clear();

        // Map new transaction details
        final Transaction parentTransaction = transaction; // final for lambda
        List<TransactionDetails> updatedDetails = request.getItems().stream().map(item -> {
            Product product = productRepo.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            StockRecord stock = stockRecordRepo.findByProduct_ProductId(product.getProductId())
                    .orElseThrow(() -> new RuntimeException("Stock not found for product: " + product.getProductName()));

            int newQty = stock.getQuantity() - item.getQuantity();
            if (newQty < 0)
                throw new RuntimeException("Insufficient stock for product: " + product.getProductName());

            stock.setQuantity(newQty);
            stock.setLastUpdated(LocalDate.now());
            stockRecordRepo.save(stock);

            TransactionDetails td = new TransactionDetails();
            td.setProduct(product);
            td.setQuantity(item.getQuantity());
            td.setBasePrice(item.getBasePrice());
            td.setListPrice(item.getListPrice());
            td.setTransaction(parentTransaction);
            return td;
        }).collect(Collectors.toCollection(ArrayList::new)); // ✅ Changed to mutable list

        parentTransaction.setTransactionDetails(updatedDetails);
        Transaction savedTransaction = transactionRepo.save(parentTransaction);
        System.out.println("✅ Transaction updated successfully, ID: " + savedTransaction.getTransactionId());

        return mapToResponseDTO(savedTransaction);
    }

    @Override
    @Transactional
    public void deleteTransaction(int id) {
        System.out.println("🛑 Deleting transaction ID: " + id);

        Transaction transaction = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        // Restore stock when deleting a transaction
        transaction.getTransactionDetails().forEach(td -> {
            StockRecord stock = stockRecordRepo.findByProduct_ProductId(td.getProduct().getProductId())
                    .orElseThrow(() -> new RuntimeException("Stock not found for product: " + td.getProduct().getProductName()));
            stock.setQuantity(stock.getQuantity() + td.getQuantity());
            stock.setLastUpdated(LocalDate.now());
            stockRecordRepo.save(stock);
        });

        transactionRepo.delete(transaction);
        System.out.println("✅ Transaction deleted successfully, ID: " + id);
    }

    @Override
    public TransactionResponseDTO getTransaction(int id) {
        Transaction transaction = transactionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        return mapToResponseDTO(transaction);
    }

    @Override
    public List<TransactionResponseDTO> getAllTransactions() {
        return transactionRepo.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private TransactionResponseDTO mapToResponseDTO(Transaction transaction) {
        TransactionResponseDTO response = new TransactionResponseDTO();
        response.setTransactionId(transaction.getTransactionId());
        response.setTransactionDate(transaction.getTransactionDate());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setUserId(transaction.getUser().getId());

        List<TransactionItemDTO> items = transaction.getTransactionDetails().stream().map(td -> {
            TransactionItemDTO itemDTO = new TransactionItemDTO();
            itemDTO.setProductId(td.getProduct().getProductId());
            itemDTO.setProductName(td.getProduct().getProductName());
            itemDTO.setQuantity(td.getQuantity());
            itemDTO.setBasePrice(td.getBasePrice());
            itemDTO.setListPrice(td.getListPrice());
            return itemDTO;
        }).toList();

        response.setItems(items);
        return response;
    }
}