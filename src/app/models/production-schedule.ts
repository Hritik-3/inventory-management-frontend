// production-schedule.ts

// 🔹 Request to create or check a production schedule
export interface ProductionScheduleRequest {
  productId: number;
  quantity: number;
  startDate?: string;
  endDate?: string;
  checkOnly?: boolean;
}

// 🔹 Frontend-friendly schedule response
export interface ProductionScheduleResponse {
  scheduleId: number;           // matches backend psId
  productId: number;            // product ID
  productName: string;          // product name
  quantity: number;             // scheduled quantity
  status: string;               // final status
  currentStatus?: string;       // optional dynamic status during execution
  startDate?: string | Date;    // start date
  endDate?: string | Date;      // end date
  productionLineName?: string;  // production line name
  message?: string;             // optional backend message
}

// 🔹 Response for raw material check
export interface RawMaterialCheckResponse {
  success: boolean;
  sufficientList: string[];
  insufficientList: string[];
}

// 🔹 Product info DTO
export interface ProductDTO {
  productsId: number;
  productsName: string;
  productsUnitPrice: number;
  productsQuantity: number;
  scheduled: boolean;
}

// 🔹 Response when creating schedules
export interface ScheduleCreateResponse {
  allocatedSchedules?: ProductionScheduleResponse[]; // list of successfully scheduled items
  success?: boolean;                                 // indicates overall success
  insufficientList?: string[];                       // raw materials not enough
  message?: string;                                  // backend message
}

// 🔹 Fully backend-aligned Product structure
export interface CategoryDTO {
  categoriesId: number;
  categoryName: string;
}

export interface SupplierAddressDTO {
  addressId: number;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  addressCountry: string;
}

export interface SupplierDTO {
  suppliersId: number;
  suppliersName: string;
  suppliersPhone: string;
  suppliersEmail: string;
  suppliersContactPerson: string;
  address: SupplierAddressDTO;
}

export interface ProductFullDTO {
  productsId: number;
  productsName: string;
  productsDescription?: string;
  productsUnitPrice?: number;
  productsQuantity?: number;
  productsImage?: string;
  minStockThreshold?: number;
  maxStockThreshold?: number;
  category?: CategoryDTO;
  supplier?: SupplierDTO;
}

// 🔹 Backend Production Unit
export interface ProductionUnitDTO {
  unitId: number;
  unitName: string;
  category?: CategoryDTO;
  status?: string;
}

// 🔹 Backend Production Line
export interface ProductionLineDTO {
  lineId: number;
  lineName: string;
  capacity?: number;
  status?: string;
  productionUnit?: ProductionUnitDTO;
}

// 🔹 Backend schedule returned by API
export interface BackendSchedule {
  psId: number;
  psQuantity: number;
  psStatus: string;
  psStartDate: string;
  psEndDate: string;
  actions: string;

  // Flattened values from backend
  productId: number;
  productName: string;
  productionLineId: number;
  productionLineName: string;
}


// 🔹 Single schedule tracking info
export interface ScheduleTracking {
  psStatus: string;
  psStartDate: string;
  psEndDate: string;
  psQuantity?: number;
  productId?: number;
  productName?: string;
  productionLineId?: number;
  productionLineName?: string;
}


// 🔹 Timeline events for a schedule
export interface TimelineEvent {
  status: string;
  date: string;
  note?: string;
  quantity?: number;          // number of units
  productionLine?: string;    // line name
}

// 🔹 Unit line status for dashboard
export interface UnitLineStatus {
  unitName: string;
  lineName: string;
  status: string;
  lines: LineStatus[]; 
}

export interface LineStatus {
  lineName: string;
  status: string;
}
