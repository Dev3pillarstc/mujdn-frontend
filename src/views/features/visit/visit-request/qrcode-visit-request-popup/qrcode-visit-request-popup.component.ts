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
import { registerIBMPlexArabicFont } from '../../../../../../public/assets/fonts/ibm-plex-font';

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
      // Create new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Register Arabic font first
      registerIBMPlexArabicFont(pdf);

      const isEnglish = this.isCurrentLanguageEnglish();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Colors
      const primaryColor = '#1f2a37';
      const secondaryColor = '#6c737f';
      const darkGray = '#161616';

      // Header section
      let currentY = 25;

      if (!isEnglish) {
        // Set Arabic font for header
        pdf.setFont('IBMPlexSansArabic', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);

        // Header text - right aligned
        pdf.text('الإدارة العامة للمجاهدين', pageWidth - 15, currentY, { align: 'right' });
        pdf.text('وزارة الداخلية', pageWidth - 15, currentY + 8, { align: 'right' });
      } else {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.text('General Directorate for Mujahideen', 15, currentY);
        pdf.text('Ministry of Interior', 15, currentY + 8);
      }

      // Draw horizontal line after header
      currentY += 20;
      pdf.setDrawColor(210, 214, 219);
      pdf.setLineWidth(0.5);
      pdf.line(15, currentY, pageWidth - 15, currentY);

      // Main content box
      currentY += 15;
      const contentY = currentY;
      const boxHeight = 140;

      // Draw main content border
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(15, contentY, pageWidth - 30, boxHeight);

      // QR Code section (left side)
      const qrSize = 60;
      const qrX = 25;
      const qrY = contentY + 15;

      // For now, create a simple QR-like pattern
      // In production, you should generate actual QR code here
      pdf.setFillColor(255, 255, 255);
      pdf.rect(qrX, qrY, qrSize, qrSize, 'F');

      // QR border
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(2);
      pdf.rect(qrX, qrY, qrSize, qrSize);

      // Simple QR pattern
      pdf.setFillColor(0, 0, 0);
      const cellSize = 4;
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          // Create a checkerboard-like pattern
          if ((i + j) % 2 === 0 || (i < 3 && j < 3) || (i > 11 && j < 3) || (i < 3 && j > 11)) {
            pdf.rect(qrX + i * cellSize, qrY + j * cellSize, cellSize, cellSize, 'F');
          }
        }
      }

      // Visitor information (right side)
      const infoStartX = qrX + qrSize + 20;
      let infoY = contentY + 20;

      // Helper function to add info field
      const addInfoField = (label: string, value: string, y: number) => {
        if (!isEnglish) {
          pdf.setFont('IBMPlexSansArabic', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(108, 115, 127); // Secondary color
          pdf.text(label, pageWidth - 25, y, { align: 'right' });

          pdf.setFont('IBMPlexSansArabic', 'normal');
          pdf.setFontSize(12);
          pdf.setTextColor(22, 22, 22);
          pdf.text(value, pageWidth - 25, y + 6, { align: 'right' });
        } else {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(108, 115, 127);
          pdf.text(label, infoStartX, y);

          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(12);
          pdf.setTextColor(22, 22, 22);
          pdf.text(value, infoStartX, y + 6);
        }
      };

      // Add visitor information
      if (!isEnglish) {
        addInfoField('اسم الزائر:', this.model.fullName || 'visi sd tor 2', infoY);
        infoY += 20;
        addInfoField('رقم الهوية:', this.model.nationalId || '1234567899', infoY);
        infoY += 20;
        addInfoField('رقم الجوال:', this.model.phoneNumber || '5467891235', infoY);
        infoY += 20;
        addInfoField('الإدارة المستهدفة:', this.getDepartmentName() || 'إدارة الدعم الفني', infoY);
      } else {
        addInfoField('Visitor Name:', this.model.fullName || 'visi sd tor 2', infoY);
        infoY += 20;
        addInfoField('National ID:', this.model.nationalId || '1234567899', infoY);
        infoY += 20;
        addInfoField('Mobile Number:', this.model.phoneNumber || '5467891235', infoY);
        infoY += 20;
        addInfoField(
          'Target Department:',
          this.getDepartmentName() || 'Technical Support Department',
          infoY
        );
      }

      // Visit details section (below the main box)
      currentY = contentY + boxHeight + 20;

      // Two column layout for visit details
      const col1X = 25;
      const col2X = pageWidth / 2 + 10;

      if (!isEnglish) {
        // Visit Date (right column)
        pdf.setFont('IBMPlexSansArabic', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('تاريخ الزيارة:', pageWidth - 25, currentY, { align: 'right' });

        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        const visitDate = this.formatDate(this.model.visitDate) || '08/11/2025';
        pdf.text(visitDate, pageWidth - 25, currentY + 8, { align: 'right' });

        // Visit Time (left column)
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('وقت الزيارة (من-إلى):', col2X + 40, currentY, { align: 'right' });

        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        const visitTimeFrom = this.formatTime(this.model.visitTimeFrom) || '11:01 ص';
        const visitTimeTo = this.formatTime(this.model.visitTimeTo) || '3:48 م';
        pdf.text(`${visitTimeFrom} - ${visitTimeTo}`, col2X + 40, currentY + 8, { align: 'right' });

        currentY += 25;

        // Visit Creator (right column)
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('منشئ الزيارة:', pageWidth - 25, currentY, { align: 'right' });

        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        const creatorName = this.getCreatorName() || 'مدير النظام';
        pdf.text(creatorName, pageWidth - 25, currentY + 8, { align: 'right' });

        // Mobile (left column - duplicate)
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('رقم الجوال:', col2X + 40, currentY, { align: 'right' });

        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        pdf.text(this.model.phoneNumber || '5467891235', col2X + 40, currentY + 8, {
          align: 'right',
        });
      } else {
        // English version
        addInfoField(
          'Visit Date:',
          this.formatDate(this.model.visitDate) || '08/11/2025',
          currentY
        );

        const visitTimeFrom = this.formatTime(this.model.visitTimeFrom) || '11:01 AM';
        const visitTimeTo = this.formatTime(this.model.visitTimeTo) || '3:48 PM';

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('Visit Time (From-To):', col2X, currentY);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        pdf.text(`${visitTimeFrom} - ${visitTimeTo}`, col2X, currentY + 8);

        currentY += 25;

        addInfoField('Visit Creator:', this.getCreatorName() || 'System Admin', currentY);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(108, 115, 127);
        pdf.text('Mobile Number:', col2X, currentY);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(22, 22, 22);
        pdf.text(this.model.phoneNumber || '5467891235', col2X, currentY + 8);
      }

      // Warning section
      currentY += 35;
      const warningBoxHeight = 25;

      // Warning background
      pdf.setFillColor(254, 223, 137);
      pdf.rect(15, currentY, pageWidth - 30, warningBoxHeight, 'F');

      // Warning left border
      pdf.setFillColor(220, 104, 3);
      pdf.rect(15, currentY, 3, warningBoxHeight, 'F');

      // Warning icon (triangle)
      pdf.setFillColor(220, 104, 3);
      const iconX = 25;
      const iconY = currentY + 8;
      pdf.triangle(iconX, iconY, iconX + 5, iconY + 8, iconX - 5, iconY + 8, 'F');

      // Warning text
      if (!isEnglish) {
        pdf.setFont('IBMPlexSansArabic', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(181, 71, 8);
        pdf.text('تحذيرات عامة', pageWidth - 25, currentY + 8, { align: 'right' });

        pdf.setFont('IBMPlexSansArabic', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(56, 66, 80);
        pdf.text('ممنوع التدخين', pageWidth - 25, currentY + 16, { align: 'right' });
        pdf.text('ممنوع الوقوف', pageWidth - 25, currentY + 22, { align: 'right' });
      } else {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(181, 71, 8);
        pdf.text('General Warnings', 35, currentY + 8);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(56, 66, 80);
        pdf.text('No Smoking', 35, currentY + 16);
        pdf.text('No Parking', 35, currentY + 22);
      }

      // Footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 15, {
        align: 'center',
      });

      // Save the PDF
      const fileName = `visit-request-${this.model.nationalId || Date.now()}.pdf`;
      pdf.save(fileName);

      // Success message
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}
