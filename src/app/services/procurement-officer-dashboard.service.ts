import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcurementDashboardDTO } from '../models/procurement-dashboard.dto';


@Injectable({
  providedIn: 'root'
})
export class ProcurementOfficerDashboardService {

  private BASE_URL = 'http://localhost:8086/api/procurement-officer';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<ProcurementDashboardDTO> {
    return this.http.get<ProcurementDashboardDTO>(`${this.BASE_URL}/dashboard`);
  }
}
