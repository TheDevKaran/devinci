import { Injectable, NgZone } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  getToasts() {
  return this.toasts;
}

  toasts: Toast[] = [];
  private AUTO_CLOSE_TIME = 10000; // 10 sec
  private idCounter = 0;

  constructor(private zone: NgZone) {}

  show(message: string, type: ToastType = 'info') {
    const toast: Toast = {
      id: ++this.idCounter,
      message,
      type
    };

    this.toasts = [...this.toasts, toast]; // immutable update

  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  clearAll() {
    this.toasts = [];
  }
}
