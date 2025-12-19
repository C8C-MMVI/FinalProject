package com.nav.agri.service.transactiondetails;

import com.nav.agri.models.TransactionDetails;
import com.nav.agri.models.Product;
import com.nav.agri.models.Transaction;
import com.nav.agri.repositories.TransactionDetailsRepository;
import com.nav.agri.repositories.ProductRepository;
import com.nav.agri.repositories.TransactionRepository;
import com.nav.agri.dto.transactiondetails.TransactionDetailsRequestDTO;
import com.nav.agri.dto.transactiondetails.TransactionDetailsResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionDetailsServiceImpl implements TransactionDetailsService {

    private final TransactionDetailsRepository repo;
    private final ProductRepository productRepo;
    private final TransactionRepository transactionRepo;

    public TransactionDetailsServiceImpl(TransactionDetailsRepository repo, ProductRepository productRepo,
                                         TransactionRepository transactionRepo) {
        this.repo = repo;
        this.productRepo = productRepo;
        this.transactionRepo = transactionRepo;
    }

    @Override
    public TransactionDetailsResponseDTO createTransactionDetails(TransactionDetailsRequestDTO dto) {
        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Transaction transaction = transactionRepo.findById(dto.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        TransactionDetails details = new TransactionDetails();
        details.setProduct(product);
        details.setTransaction(transaction);
        details.setQuantity(dto.getQuantity());
        details.setBasePrice(dto.getBasePrice());
        details.setListPrice(dto.getListPrice());

        return toResponseDTO(repo.save(details));
    }

    @Override
    public TransactionDetailsResponseDTO getTransactionDetails(int id) {
        return toResponseDTO(repo.findById(id)
                .orElseThrow(() -> new RuntimeException("TransactionDetails not found")));
    }

    @Override
    public List<TransactionDetailsResponseDTO> getAllTransactionDetails() {
        return repo.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TransactionDetailsResponseDTO updateTransactionDetails(int id, TransactionDetailsRequestDTO dto) {
        TransactionDetails details = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("TransactionDetails not found"));

        Product product = productRepo.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        Transaction transaction = transactionRepo.findById(dto.getTransactionId())
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        details.setProduct(product);
        details.setTransaction(transaction);
        details.setQuantity(dto.getQuantity());
        details.setBasePrice(dto.getBasePrice());
        details.setListPrice(dto.getListPrice());

        return toResponseDTO(repo.save(details));
    }

    @Override
    public void deleteTransactionDetails(int id) {
        repo.deleteById(id);
    }

    private TransactionDetailsResponseDTO toResponseDTO(TransactionDetails details) {
        return new TransactionDetailsResponseDTO(
                details.getTransactionDetailsId(),
                details.getProduct().getProductId(),
                details.getProduct().getProductName(),
                details.getQuantity(),
                details.getBasePrice(),
                details.getListPrice()
        );
    }
}
