import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const A4_PAGE_HEIGHT_MM = 297;
const CONTENT_WIDTH_MM = 195;
const HORIZONTAL_MARGIN_MM = 5;
const TOP_MARGIN_MM = 15;

/**
 * Rasterizes a DOM element and downloads it as an A4 PDF file.
 */
export async function exportElementToPdf(element: HTMLElement, fileName: string): Promise<void> {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2, // higher scale = better quality
    useCORS: true, // if images are hosted externally
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgHeight = (canvas.height * CONTENT_WIDTH_MM) / canvas.width;

  let heightLeft = imgHeight;
  let position = TOP_MARGIN_MM;

  // Add first page
  pdf.addImage(imgData, 'PNG', HORIZONTAL_MARGIN_MM, position, CONTENT_WIDTH_MM, imgHeight);
  heightLeft -= A4_PAGE_HEIGHT_MM;

  // Add extra pages if content is longer than one A4
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', HORIZONTAL_MARGIN_MM, position, CONTENT_WIDTH_MM, imgHeight);
    heightLeft -= A4_PAGE_HEIGHT_MM;
  }

  pdf.save(fileName);
}
