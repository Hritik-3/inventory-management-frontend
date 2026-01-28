import { ProcurementProductDTO } from './procurement-product.dto';
import { ProcurementPurchaseOrderDTO } from './procurement-po.dto';

export interface ProcurementDashboardDTO {
  lowStockProducts: ProcurementProductDTO[];
  supplierOrders: ProcurementPurchaseOrderDTO[];
  customerOrders: ProcurementPurchaseOrderDTO[];
  pendingSupplierOrders: ProcurementPurchaseOrderDTO[];
  pendingCustomerOrders: ProcurementPurchaseOrderDTO[];
  inTransitOrders: ProcurementPurchaseOrderDTO[];
  deliveredOrders: ProcurementPurchaseOrderDTO[];
}
