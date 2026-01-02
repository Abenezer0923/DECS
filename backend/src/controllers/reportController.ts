import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';

const prisma = new PrismaClient();

// Define fonts for pdfmake
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

export const getProgressReport = async (req: Request, res: Response) => {
  try {
    const { format } = req.query;
    
    // Fetch data: All milestones grouped by status
    const milestones = await prisma.milestone.findMany({
      orderBy: { startDate: 'asc' }
    });

    const total = milestones.length;
    const completed = milestones.filter(m => m.status === 'Completed').length;
    const delayed = milestones.filter(m => m.status === 'Delayed').length;
    const ongoing = milestones.filter(m => m.status === 'Ongoing').length;
    const planned = milestones.filter(m => m.status === 'Planned').length;

    const stats = { total, completed, delayed, ongoing, planned };

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Progress Report');

      sheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Start Date', key: 'startDate', width: 15 },
        { header: 'End Date', key: 'endDate', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Department', key: 'responsibleDepartment', width: 20 },
      ];

      milestones.forEach(m => {
        sheet.addRow({
          id: m.id,
          title: m.title,
          startDate: m.startDate,
          endDate: m.endDate,
          status: m.status,
          responsibleDepartment: m.responsibleDepartment
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=progress_report.xlsx');
      
      await workbook.xlsx.write(res);
      res.end();

    } else if (format === 'pdf') {
      const printer = new PdfPrinter(fonts);
      
      const docDefinition = {
        content: [
          { text: 'DECS Progress Report', style: 'header' },
          { text: `Generated on: ${new Date().toLocaleDateString()}`, style: 'subheader' },
          { text: '\n' },
          {
            table: {
              widths: ['*', '*', '*', '*', '*'],
              body: [
                ['Total', 'Completed', 'Ongoing', 'Delayed', 'Planned'],
                [total, completed, ongoing, delayed, planned]
              ]
            }
          },
          { text: '\nDetailed Milestones', style: 'subheader' },
          {
            layout: 'lightHorizontalLines',
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto', 'auto', 'auto'],
              body: [
                ['ID', 'Title', 'Start', 'End', 'Status'],
                ...milestones.map(m => [
                  m.id, 
                  m.title, 
                  m.startDate ? new Date(m.startDate).toLocaleDateString() : 'N/A', 
                  m.endDate ? new Date(m.endDate).toLocaleDateString() : 'N/A', 
                  m.status
                ])
              ]
            }
          }
        ],
        styles: {
          header: { fontSize: 18, bold: true },
          subheader: { fontSize: 14, margin: [0, 10, 0, 5] as [number, number, number, number] }
        }
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=progress_report.pdf');
      pdfDoc.pipe(res);
      pdfDoc.end();

    } else {
      // Default JSON response
      res.json({ stats, milestones });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
