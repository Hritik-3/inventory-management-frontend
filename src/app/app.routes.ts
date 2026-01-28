

import { Routes } from '@angular/router';
import { AdminComponent } from './dashboard/admin/admin.component';
import { ProcurementComponent } from './dashboard/procurement/procurement.component';
import { ProductionComponent } from './dashboard/production/production.component';
import { InventoryComponent } from './dashboard/inventory/inventory.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './password/forgotpassword/forgotpassword.component';
import { RegisterComponent } from './dashboard/admin/register/register.component';
import { UnlockUserComponent } from './dashboard/admin/unlock-user/unlock-user.component';
import { authGuard } from './auth.guard';
import { SuppliersComponent } from './dashboard/admin/suppliers/suppliers.component';
import { UsersComponent } from './dashboard/admin/users/users.component';
import { OrderProductsComponent } from './dashboard/procurement/order-products/order-products.component';
import { CustomerComponent } from './dashboard/procurement/customerlist/customer/customer.component';
import { TrackorderComponent } from './dashboard/procurement/trackorder/trackorder.component';
import { PaymentComponent } from './dashboard/procurement/payment/payment.component';
import { OrderhistoryComponent } from './dashboard/procurement/orderhistory/orderhistory.component';
import { CustomerlistComponent } from './dashboard/procurement/customerlist/customerlist.component';
import { ViewOrderComponent } from './dashboard/procurement/view-order/view-order.component';
import { ConfirmReturnModalComponent } from './dashboard/procurement/view-order/confirm-return-modal/confirm-return-modal.component';
import { EditOrderComponent } from './dashboard/procurement/view-order/edit-order/edit-order.component';
import { SupplierOrdersComponent } from './dashboard/procurement/supplier-orders/supplier-orders.component';
import { CreateOrderComponent } from './dashboard/procurement/supplier-orders/create-order/create-order.component';
import { AlertComponent } from './dashboard/inventory/alert/alert.component';
import { DashboardHomeComponent } from './dashboard/inventory/dashboard-home/dashboard-home.component';
import { ScheduleListComponent } from './dashboard/inventory/schedule-list/schedule-list.component';
import { TrackOrdersComponent } from './dashboard/inventory/track-orders/track-orders.component';
import { StockViewComponent } from './dashboard/inventory/stock-view/stock-view.component';
import { ReportComponent } from './dashboard/inventory/report/report.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ManageInventoryComponent } from './dashboard/inventory/manage-inventory/manage-inventory.component';
import { CategoriesComponent } from './dashboard/inventory/manage-inventory/categories/categories.component';
import { ProductsComponent } from './dashboard/inventory/manage-inventory/products/products.component';
import { ReturnOrderFetchComponent } from './dashboard/procurement/return-order-fetch/return-order-fetch.component';
import { ProcurementDashboardComponent } from './dashboard/procurement/procurement-dashboard/procurement-dashboard.component';
import { ProductionManagerScheduleComponent } from './dashboard/production/production-manager-schedule/production-manager-schedule.component';
import { ProductionTrackingService } from './services/production-tracking.service';
import { ProductionScheduleTrackingComponent } from './dashboard/production/production-schedule-tracking/production-schedule-tracking.component';
import { ProductionScheduleTimelineComponent } from './dashboard/production/production-schedule-timeline/production-schedule-timeline.component';
import { SupplierContactComponent } from './dashboard/procurement/supplier-contact/supplier-contact.component';
import { ProcurementOrderRequestsComponent } from './dashboard/inventory/procurement-order-requests/procurement-order-requests.component';
import { AdmindashboardComponent } from './dashboard/admin/admindashboard/admindashboard.component';
import { ProductionDashboardComponent } from './dashboard/production/production-dashboard/production-dashboard.component';
import { ProcurementOfficerDashboardComponent } from './dashboard/procurement/procurement-officer-dashboard/procurement-officer-dashboard.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  { path: 'dashboard/admin', component: AdminComponent },
  { path: 'dashboard/procurement', component: ProcurementComponent },
  { path: 'dashboard/inventory', component: InventoryComponent },
  { path: 'dashboard/production', component: ProductionComponent },

  {
    path: 'admin', component: AdminComponent, canActivate: [authGuard],
    children: [
      { path: 'register', component: RegisterComponent, canActivate: [authGuard] },
      { path: 'suppliers', component: SuppliersComponent, canActivate: [authGuard] },
      { path: 'users', component: UsersComponent, canActivate: [authGuard] },
      { path: 'unlockuser', component: UnlockUserComponent, canActivate: [authGuard] },
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
      {path: 'home', component: AdmindashboardComponent,canActivate:[authGuard]},
      {path: 'update-profile', component: UpdateProfileComponent, canActivate: [authGuard]}
    ]
  },

  {
    path: 'procurement', component: ProcurementComponent, canActivate: [authGuard],
    children: [
      {
        path: 'customerList', component: CustomerlistComponent, canActivate: [authGuard],
        children: [
          { path: 'customer', component: CustomerComponent, canActivate: [authGuard] },
        ]
      },
      { path: 'order-product', component: OrderProductsComponent, canActivate: [authGuard] },
      { path: 'order-rawMaterial', component: SupplierOrdersComponent, canActivate: [authGuard] },
      { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
      { path: 'view-order', component: ViewOrderComponent, canActivate: [authGuard] },
      { path: 'edit-order/:id', component: EditOrderComponent, canActivate: [authGuard] },
      {path: 'view-return', component:ReturnOrderFetchComponent, canActivate:[authGuard]},
      { path: 'track-order', component: TrackorderComponent, canActivate: [authGuard] },
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
      {path: 'home', component: ProcurementOfficerDashboardComponent,canActivate:[authGuard]},

      { path: 'supplier-orders', component: SupplierOrdersComponent, canActivate: [authGuard] },
      { path: 'create-order/:supplierId', component: CreateOrderComponent, canActivate: [authGuard] },
      { path: 'suppliers-list', component: SupplierOrdersComponent, canActivate: [authGuard] },
      {path: 'update-profile', component: UpdateProfileComponent, canActivate: [authGuard]},
      {path: 'update-supplier', component: SupplierContactComponent, canActivate: [authGuard]}
      // you can replace with dedicated supplier-selection component later
    ]
  },

  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] ,
    children:[
      { path: 'alert', component: AlertComponent, canActivate: [authGuard] },
      {path: 'allschedules', component: ScheduleListComponent, canActivate: [authGuard]},
      {path: 'stockview', component : StockViewComponent, canActivate:[authGuard]},
      {path: 'schedule-tracking', component: TrackOrdersComponent, canActivate: [authGuard] },
      {path: 'home', component: DashboardHomeComponent, canActivate: [authGuard]},
      {path: 'report', component: ReportComponent, canActivate:[authGuard]},
      {path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
      {path: 'procurement-orders-requests', component: ProcurementOrderRequestsComponent, canActivate: [authGuard]},
      {path: 'update-profile', component: UpdateProfileComponent, canActivate: [authGuard]},
      {
        path: 'manage-inventory', component: ManageInventoryComponent, canActivate: [authGuard],
        children: [
          { path: 'add-category', component: CategoriesComponent, canActivate: [authGuard] },
          { path: 'add-product', component: ProductsComponent, canActivate: [authGuard] }
        ]
      },
 

 
 
    ]
  },
  


  { path: 'production', component: ProductionComponent, canActivate: [authGuard], 
    children:[
      {path: 'production-manager-schedule', component: ProductionManagerScheduleComponent, canActivate: [authGuard]  },
      {path: 'tracking-schedules', component : ProductionScheduleTrackingComponent, canActivate: [authGuard] },
      {path: 'timeline-schedules', component: ProductionScheduleTimelineComponent, canActivate: [authGuard]},
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
      {path: 'home', component: ProductionDashboardComponent,canActivate:[authGuard]},
      {path: 'update-profile', component: UpdateProfileComponent, canActivate: [authGuard]}
      

    ]
   },

  { path: '**', redirectTo: 'login' }

];
 