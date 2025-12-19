package com.nav.agri.service.supplier;

import com.nav.agri.dto.supplier.SupplierCreateDTO;
import com.nav.agri.dto.supplier.SupplierDTO;
import java.util.List;

public interface SupplierService {
    SupplierDTO createSupplier(SupplierCreateDTO dto);
    SupplierDTO getSupplier(int id);
    List<SupplierDTO> getAllSuppliers();
    SupplierDTO updateSupplier(int id, SupplierCreateDTO dto);
    void deleteSupplier(int id);
}
