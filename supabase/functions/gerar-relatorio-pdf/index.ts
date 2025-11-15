import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ItemLote {
  id: string;
  categoria: string;
  raca?: string;
  quantidade: number;
  pesoIndividual?: number;
  pesoTotal?: number;
  valorPorAnimal?: number;
  valorTotal?: number;
  observacoes?: string;
}

interface LoteData {
  id: string;
  data: string;
  fazenda: string;
  produtor: string;
  itens: ItemLote[];
  kgPorArroba: number;
}

const categoryLabels: Record<string, string> = {
  bezerro: 'Bezerro (M)',
  bezerra: 'Bezerra (F)',
  vaca: 'Vaca',
  novilha: 'Novilha',
  garrote: 'Garrote',
  boi: 'Boi',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Iniciando geração de PDF...');
    
    const loteData: LoteData = await req.json();
    console.log('Dados do lote recebidos:', loteData);

    // Criar documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    // Carregar fontes
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    let yPosition = height - 50;
    const marginLeft = 50;
    const lineHeight = 20;

    // Título
    page.drawText('RELATÓRIO DE COMPRA DE GADO', {
      x: width / 2 - 150,
      y: yPosition,
      size: 18,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight * 2;

    // Informações do Lote
    page.drawText('INFORMAÇÕES DO LOTE', {
      x: marginLeft,
      y: yPosition,
      size: 14,
      font: fontBold,
    });
    yPosition -= lineHeight;

    page.drawText(`Data: ${new Date(loteData.data).toLocaleDateString('pt-BR')}`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight;

    page.drawText(`Fazenda: ${loteData.fazenda}`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight;

    page.drawText(`Produtor: ${loteData.produtor}`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight * 1.5;

    // Calcular totais
    const quantidadeTotal = loteData.itens.reduce((acc, item) => acc + item.quantidade, 0);
    const pesoTotal = loteData.itens.reduce((acc, item) => acc + (item.pesoTotal || 0), 0);
    const valorTotal = loteData.itens.reduce((acc, item) => acc + (item.valorTotal || 0), 0);
    const arrobas = pesoTotal / loteData.kgPorArroba;

    // Resumo
    page.drawText('RESUMO', {
      x: marginLeft,
      y: yPosition,
      size: 14,
      font: fontBold,
    });
    yPosition -= lineHeight;

    page.drawText(`Total de Animais: ${quantidadeTotal}`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight;

    page.drawText(`Peso Total: ${pesoTotal.toFixed(0)} kg (${arrobas.toFixed(2)} arrobas)`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight;

    page.drawText(`Valor Total: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, {
      x: marginLeft,
      y: yPosition,
      size: 10,
      font: fontNormal,
    });
    yPosition -= lineHeight * 1.5;

    // Tabela de Itens
    page.drawText('ITENS DO LOTE', {
      x: marginLeft,
      y: yPosition,
      size: 14,
      font: fontBold,
    });
    yPosition -= lineHeight;

    // Cabeçalho da tabela
    page.drawText('Categoria', { x: marginLeft, y: yPosition, size: 9, font: fontBold });
    page.drawText('Raça', { x: marginLeft + 80, y: yPosition, size: 9, font: fontBold });
    page.drawText('Qtd', { x: marginLeft + 150, y: yPosition, size: 9, font: fontBold });
    page.drawText('Peso Ind.', { x: marginLeft + 200, y: yPosition, size: 9, font: fontBold });
    page.drawText('Peso Total', { x: marginLeft + 280, y: yPosition, size: 9, font: fontBold });
    page.drawText('Valor Total', { x: marginLeft + 370, y: yPosition, size: 9, font: fontBold });
    yPosition -= lineHeight;

    // Linha separadora
    page.drawLine({
      start: { x: marginLeft, y: yPosition + 5 },
      end: { x: width - 50, y: yPosition + 5 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    // Itens
    for (const item of loteData.itens) {
      if (yPosition < 100) {
        // Adicionar nova página se necessário
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 50;
      }

      page.drawText(categoryLabels[item.categoria] || item.categoria, {
        x: marginLeft,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      page.drawText(item.raca || '-', {
        x: marginLeft + 80,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      page.drawText(item.quantidade.toString(), {
        x: marginLeft + 150,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      page.drawText(item.pesoIndividual ? `${item.pesoIndividual} kg` : '-', {
        x: marginLeft + 200,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      page.drawText(item.pesoTotal ? `${item.pesoTotal.toFixed(0)} kg` : '-', {
        x: marginLeft + 280,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      page.drawText(item.valorTotal ? `R$ ${item.valorTotal.toFixed(2)}` : '-', {
        x: marginLeft + 370,
        y: yPosition,
        size: 8,
        font: fontNormal,
      });

      yPosition -= lineHeight * 0.8;
    }

    // Rodapé
    yPosition -= lineHeight * 0.5;
    page.drawLine({
      start: { x: marginLeft, y: yPosition },
      end: { x: width - 50, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight;

    page.drawText(`TOTAL GERAL: R$ ${valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, {
      x: marginLeft,
      y: yPosition,
      size: 12,
      font: fontBold,
    });

    // Salvar PDF
    const pdfBytes = await pdfDoc.save();
    console.log('PDF gerado com sucesso');

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-lote-${loteData.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
