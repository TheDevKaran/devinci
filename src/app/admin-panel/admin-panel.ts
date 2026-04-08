import { CommonModule, DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ChangeDetectorRef, OnInit } from "@angular/core";
import { environment } from "../../environments/environment";

@Component({
  standalone: true,
  templateUrl: `./admin-panel.html`,
  imports: [DatePipe, CommonModule],
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {

  users: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.http
      .get<any[]>(`${environment.apiBaseUrl}/api/admin/users`)
      .subscribe({
        next: (res) => {
          console.log('ADMIN USERS:', res);

          this.users = [...res];     // 🔥 NEW ARRAY reference
          this.cdr.detectChanges();  // 🔥 FORCE UI UPDATE
        },
        error: (err) => {
          console.error('ADMIN API ERROR:', err);
        }
      });
  }
}
