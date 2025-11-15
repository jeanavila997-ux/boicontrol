/**
 * Utilitário para exportação de dados em formato CSV (offline)
 */

export const exportToCSV = (filename: string, data: any[]) => {
  if (!data || data.length === 0) {
    throw new Error('Nenhum dado para exportar');
  }

  // Obter cabeçalhos do primeiro objeto
  const headers = Object.keys(data[0]);
  
  // Criar linhas CSV
  const csvRows = [];
  
  // Adicionar cabeçalho
  csvRows.push(headers.join(';'));
  
  // Adicionar dados
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      
      // Tratar valores especiais
      if (value === null || value === undefined) {
        return '';
      }
      
      // Converter objetos e arrays para string
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      // Escapar aspas duplas e adicionar aspas se houver vírgula ou ponto e vírgula
      const stringValue = String(value);
      if (stringValue.includes(';') || stringValue.includes(',') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      
      return stringValue;
    });
    
    csvRows.push(values.join(';'));
  }
  
  // Criar conteúdo CSV
  const csvContent = '\uFEFF' + csvRows.join('\n'); // BOM para UTF-8
  
  // Criar blob e fazer download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${filename}.csv`);
};

// Função auxiliar para download
const downloadFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpar URL
  URL.revokeObjectURL(url);
};
