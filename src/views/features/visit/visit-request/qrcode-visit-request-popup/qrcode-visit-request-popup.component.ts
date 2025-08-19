import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Visit } from '@/models/features/visit/visit';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { AlertService } from '@/services/shared/alert.service';
import { formatDateOnly, formatTimeTo12Hour } from '@/utils/general-helper';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-qrcode-visit-request-popup',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './qrcode-visit-request-popup.component.html',
  styleUrl: './qrcode-visit-request-popup.component.scss',
})
export class QrcodeVisitRequestPopupComponent implements OnInit {
  declare model: Visit;
  declare direction: LAYOUT_DIRECTION_ENUM;

  alertService = inject(AlertService);
  translateService = inject(TranslateService);
  languageService = inject(LanguageService);
  dialogRef = inject(MatDialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
  }

  ngOnInit(): void {
    this.initPopup();
  }

  initPopup() {
    this.model = this.data.model || new Visit();
  }

  // Helper methods for template
  isCurrentLanguageEnglish(): boolean {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
  }

  formatTime(timeString: string | Date | null | undefined): string {
    if (!timeString) return '';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(timeString.toString(), locale);
  }

  formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) return '';
    return formatDateOnly(dateString);
  }

  getDepartmentName(): string {
    if (!this.model.targetDepartment) return '';
    return this.isCurrentLanguageEnglish()
      ? this.model.targetDepartment.nameEn || ''
      : this.model.targetDepartment.nameAr || '';
  }

  getCreatorName(): string {
    if (!this.model.creationUser) return '';
    return this.isCurrentLanguageEnglish()
      ? this.model.creationUser.nameEn || ''
      : this.model.creationUser.nameAr || '';
  }

  close() {
    this.dialogRef.close();
  }

  downloadAsPDF(): void {
    try {
      const isRTL = !this.isCurrentLanguageEnglish();
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Set font for Arabic support if needed
      if (isRTL) {
        // You might need to load Arabic font here, then use its name instead of 'helvetica'
        // doc.addFont('path-to-arabic-font.ttf', 'ArabicFont', 'normal');
        // doc.setFont('ArabicFont');
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // Helper function to add text with proper alignment
      const addText = (text: string, y: number, options: any = {}) => {
        const align = isRTL ? 'right' : 'left';
        const x = isRTL ? pageWidth - margin : margin;
        doc.text(text, x, y, { align, ...options });
        return y + (options.lineHeight || 8);
      };

      // Title
      doc.setFontSize(20);
      // use an explicit font name (avoid passing undefined)
      doc.setFont('helvetica', 'bold');
      yPosition = addText(this.translateService.instant('QR_CODE_POPUP.VISIT_QR_CODE'), yPosition, {
        lineHeight: 12,
      });

      yPosition += 10;

      // Visitor Information
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.VISITOR_NAME'),
        yPosition
      );

      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.model.fullName || '', yPosition, { lineHeight: 10 });

      yPosition += 5;

      // National ID
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.NATIONAL_ID') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.model.nationalId || '', yPosition, { lineHeight: 10 });

      yPosition += 5;

      // Mobile Number
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.MOBILE_NUMBER') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.model.phoneNumber || '', yPosition, { lineHeight: 10 });

      yPosition += 5;

      // Target Department
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.TARGET_DEPARTMENT') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.getDepartmentName(), yPosition, { lineHeight: 10 });

      yPosition += 10;

      // Visit Details Section
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_DATA'),
        yPosition,
        { lineHeight: 12 }
      );

      yPosition += 5;

      doc.setFontSize(14);

      // Visit Date
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_DATE') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.formatDate(this.model.visitDate), yPosition, { lineHeight: 10 });

      yPosition += 5;

      // Visit Time
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_TIME_FROM_TO') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      const timeText = `${this.formatTime(this.model.visitTimeFrom)} - ${this.formatTime(this.model.visitTimeTo)}`;
      yPosition = addText(timeText, yPosition, { lineHeight: 10 });

      yPosition += 5;

      // Visit Creator
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_CREATOR') + ':',
        yPosition
      );

      doc.setFont('helvetica', 'normal');
      yPosition = addText(this.getCreatorName(), yPosition, { lineHeight: 10 });

      yPosition += 15;

      // QR Code placeholder (you would need to add actual QR code here)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('QR Code:', yPosition);

      // Add a placeholder rectangle for QR code
      const qrSize = 50;
      const qrX = isRTL ? pageWidth - margin - qrSize : margin;
      doc.rect(qrX, yPosition, qrSize, qrSize);

      // Add text inside rectangle
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('QR Code', qrX + qrSize / 2, yPosition + qrSize / 2, { align: 'center' });

      yPosition += qrSize + 15;

      // Warnings section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      yPosition = addText(
        this.translateService.instant('QR_CODE_POPUP.GENERAL_WARNINGS'),
        yPosition
      );

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      yPosition = addText(
        '• ' + this.translateService.instant('QR_CODE_POPUP.NO_SMOKING'),
        yPosition,
        { lineHeight: 8 }
      );
      yPosition = addText(
        '• ' + this.translateService.instant('QR_CODE_POPUP.NO_PARKING'),
        yPosition,
        { lineHeight: 8 }
      );

      // Generate filename
      const fileName = `visit-qr-${this.model.nationalId || 'unknown'}-${Date.now()}.pdf`;

      // Save the PDF
      doc.save(fileName);

      // Show success message
      this.alertService.showSuccessMessage(
        this.translateService.instant('QR_CODE_POPUP.DOWNLOAD_SUCCESS')
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.alertService.showErrorMessage(
        this.translateService.instant('QR_CODE_POPUP.DOWNLOAD_ERROR')
      );
    }
  }
}
