import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RoomsService } from '../../services/rooms.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { environment } from '../../../../../../../environments/environment';
import Swal from 'sweetalert2';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ButtonModule, FormsModule, TranslatePipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
  private readonly roomsService = inject(RoomsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);

  @ViewChild('cardInfo') cardInfo!: ElementRef;

  activeStep = signal<number>(1);
  bookingId = '';
  subTotal = 0;

  stripe!: Stripe | null;
  elements!: StripeElements;
  cardElement!: StripeCardElement;

  asalBank: string = '';
  namaPengirim: string = '';
  isProcessing = signal<boolean>(false);

  ngOnInit() {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId') ?? '';
    this.subTotal = Number(this.route.snapshot.queryParamMap.get('price') ?? 0);

    this.initStripe();
  }

  async initStripe() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      setTimeout(() => {
        if (this.cardInfo && this.cardInfo.nativeElement) {
          this.cardElement.mount(this.cardInfo.nativeElement);
        }
      }, 50);
    }
  }

  async confirmPayment() {
    if (!this.namaPengirim.trim()) {
      Swal.fire({
        icon: 'warning',
        title: this.translate.instant('payment.errors.requiredTitle'),
        text: this.translate.instant('payment.errors.senderNameRequired'),
        confirmButtonText: this.translate.instant('payment.errors.ok'),
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    this.isProcessing.set(true);

    if (this.stripe && this.cardElement) {
      const { token, error } = await this.stripe.createToken(this.cardElement, {
        name: this.namaPengirim,
      });

      if (error) {
        this.isProcessing.set(false);

        Swal.fire({
          icon: 'error',
          title: this.translate.instant('payment.errors.paymentFailedTitle'),
          text: `${this.translate.instant('payment.errors.cardErrorPrefix')}: ${error.message}`,
          confirmButtonText: this.translate.instant('payment.errors.ok'),
          confirmButtonColor: '#d33',
        });

        return;
      }

      if (token) {
        this.roomsService.payBooking(this.bookingId, token.id).subscribe({
          next: (res) => {
            this.isProcessing.set(false);
            this.activeStep.set(2);
          },
          error: (err) => {
            this.isProcessing.set(false);
            const errorMsg = err.error?.message;
            Swal.fire({
              icon: 'error',
              title: this.translate.instant('payment.errors.sorryTitle'),
              text: errorMsg,
              confirmButtonText: this.translate.instant('payment.errors.ok'),
              confirmButtonColor: '#d33',
            });
          },
        });
      }
    } else {
      this.isProcessing.set(false);

      Swal.fire({
        icon: 'error',
        title: this.translate.instant('payment.errors.paymentErrorTitle'),
        text: this.translate.instant('payment.errors.stripeNotInitialized'),
        confirmButtonText: this.translate.instant('payment.errors.ok'),
        confirmButtonColor: '#3085d6',
      });
    }
  }
  cancelPayment() {
    window.history.back();
  }

  backToHome() {
    this.router.navigate(['/']);
  }
}
