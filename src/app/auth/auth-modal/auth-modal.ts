import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.html',
  styleUrls: ['./auth-modal.css']
})
export class AuthModal {

  @Input() show = false;
  @Input() mode: 'login' | 'register' = 'login';

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ mode: string; email: string; password: string }>();

  auth = {
    email: '',
    password: ''
  };

  private isSubmitting = false;

  forceClose() {
  this.close.emit();
}


  switch(mode: 'login' | 'register') {
    this.mode = mode;
    this.auth = { email: '', password: '' };
  }

  submitAuth() {
    if (this.isSubmitting) {
      console.log('⚠️ Submission already in progress');
      return;
    }

    if (!this.auth.email || !this.auth.password) {
      alert('Please fill in all fields');
      return;
    }

    console.log('📤 Submitting auth request:', this.mode);
    this.isSubmitting = true;

    this.submit.emit({
      mode: this.mode,
      email: this.auth.email,
      password: this.auth.password
    });

    setTimeout(() => {
      this.isSubmitting = false;
    }, 3000);
  }

  ngOnChanges() {
    if (!this.show) {
          this.auth = { email: '', password: '' };

      // this.isSubmitting = false;
    }
  }
}
