import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// EXPORTAR A EXCEL
export const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// GENERAR TICKET (PDF FORMATO 80mm)
export const generarTicketPDF = (venta: any, items: any[]) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Formato ticket térmico
    });

    doc.setFontSize(12);
    doc.text('PAPELERÍA PRO', 40, 10, { align: 'center' });
    doc.setFontSize(8);
    doc.text('RFC: XAXX010101000', 40, 15, { align: 'center' });
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 5, 25);
    doc.text('-------------------------------------------', 5, 28);

    let y = 35;
    items.forEach((item: any) => {
        const nombre = item.nombre.substring(0, 15); // Cortar nombre largo
        doc.text(`${item.cantidad} x ${nombre}`, 5, y);
        doc.text(`$${item.subtotal.toFixed(2)}`, 75, y, { align: 'right' });
        y += 5;
    });

    doc.text('-------------------------------------------', 5, y);
    y += 5;
    doc.setFontSize(10);
    doc.text(`TOTAL: $${venta.total.toFixed(2)}`, 75, y, { align: 'right' });
    
    y += 10;
    doc.setFontSize(8);
    doc.text('¡Gracias por su compra!', 40, y, { align: 'center' });

    // Abrir PDF en nueva ventana para imprimir
    window.open(doc.output('bloburl'), '_blank');
};
