import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class CreditService {

  private KEY = 'user_credits';

  getCredits(): number {
    return Number(localStorage.getItem(this.KEY) || 0);
  }

  setCredits(value: number) {
    localStorage.setItem(this.KEY, String(value));
  }

  consume(): boolean {
    const credits = this.getCredits();
    if (credits <= 0) return false;
    this.setCredits(credits - 1);
    return true;
  }

  // ✅ FREE USER RESET (login / register)
  setFreeCredits() {
    this.setCredits(1);
  }

  // ✅ PREMIUM RESET (ONLY when user upgrades)
  setPremiumCredits() {
    this.setCredits(5);
  }

  clear() {
    this.setCredits(0);
  }
}
