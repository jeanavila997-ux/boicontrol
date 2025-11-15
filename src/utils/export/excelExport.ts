/**
 * Utilitário para exportação de dados em formato Excel (offline)
 */
import * as XLSX from 'xlsx';

export const exportToExcel = (filename: string, sheetName: string, data: any[]) => {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  
  // Converter dados para worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Adicionar worksheet ao workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Gerar arquivo Excel
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportMultipleSheetsToExcel = (
  filename: string,
  sheets: Array<{ name: string; data: any[] }>
) => {
  if (!sheets || sheets.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Criar workbook
  const workbook = XLSX.utils.book_new();
  
  // Adicionar cada sheet
  sheets.forEach(sheet => {
    if (sheet.data && sheet.data.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    }
  });
  
  // Gerar arquivo Excel
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
