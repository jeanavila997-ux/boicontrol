/**
 * Utilitário para exportação de dados em formato PDF (offline)
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (filename: string, title: string, data: any[]) => {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Criar documento PDF
  const doc = new jsPDF();
  
  // Adicionar título
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  // Adicionar data de geração
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleString('pt-BR');
  doc.text(`Gerado em: ${dateStr}`, 14, 28);
  
  // Obter cabeçalhos e dados para a tabela
  const headers = Object.keys(data[0]);
  const rows = data.map(item => 
    headers.map(header => {
      const value = item[header];
      
      // Tratar valores especiais
      if (value === null || value === undefined) {
        return '-';
      }
      
      // Converter objetos e arrays para string
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      return String(value);
    })
  );
  
  // Adicionar tabela
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Salvar PDF
  doc.save(`${filename}.pdf`);
};

export const exportCustomPDF = (
  filename: string,
  title: string,
  sections: Array<{
    subtitle?: string;
    data: any[];
    headers?: string[];
  }>
) => {
  if (!sections || sections.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Criar documento PDF
  const doc = new jsPDF();
  
  // Adicionar título principal
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  
  // Adicionar data de geração
  doc.setFontSize(10);
  const dateStr = new Date().toLocaleString('pt-BR');
  doc.text(`Gerado em: ${dateStr}`, 14, 28);
  
  let currentY = 35;
  
  // Adicionar cada seção
  sections.forEach((section, index) => {
    if (section.data && section.data.length > 0) {
      // Adicionar subtítulo se fornecido
      if (section.subtitle) {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFontSize(12);
        doc.text(section.subtitle, 14, currentY);
        currentY += 7;
      }
      
      // Obter cabeçalhos
      const headers = section.headers || Object.keys(section.data[0]);
      const rows = section.data.map(item => 
        headers.map(header => {
          const value = item[header];
          
          if (value === null || value === undefined) {
            return '-';
          }
          
          if (typeof value === 'object') {
            return JSON.stringify(value);
          }
          
          return String(value);
        })
      );
      
      // Adicionar tabela
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: currentY,
        theme: 'striped',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      // @ts-ignore - autoTable adiciona finalY ao documento
      currentY = doc.lastAutoTable.finalY + 10;
    }
  });
  
  // Salvar PDF
  doc.save(`${filename}.pdf`);
};
