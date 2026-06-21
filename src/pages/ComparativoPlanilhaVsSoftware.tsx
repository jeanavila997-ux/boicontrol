import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Check,
  X,
  Clock,
  Calculator,
  FileText,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

const comparativo = [
  {
    criterio: 'Tempo para registrar um lote',
    manual: '30 a 60 minutos por lote, com risco de retrabalho',
    software: 'Menos de 10 minutos no terminal de pesagem do BoiControl',
    icon: Clock,
  },
  {
    criterio: 'Cálculo de arrobas, peso e valor',
    manual: 'Fórmulas manuais sujeitas a erro de digitação',
    software: 'Cálculo automático por kg, por cabeça ou valor total',
    icon: Calculator,
  },
  {
    criterio: 'Geração de relatórios',
    manual: 'Cópia e formatação manual no Excel ou Word',
    software: 'Relatórios em PDF, Excel e CSV com um clique',
    icon: FileText,
  },
  {
    criterio: 'Segurança e backup',
    manual: 'Planilha pode ser apagada, perdida ou corrompida',
    software: 'Dados salvos no dispositivo e disponíveis offline',
    icon: ShieldCheck,
  },
  {
    criterio: 'Uso no campo',
    manual: 'Caderno e planilha não funcionam bem no curral',
    software: 'PWA instalável no celular, funciona sem internet',
    icon: Smartphone,
  },
  {
    criterio: 'Visão do negócio',
    manual: 'Difícil consolidar histórico por fazenda ou produtor',
    software: 'Dashboard com totais, médias e filtros por período',
    icon: TrendingUp,
  },
];

const ComparativoPlanilhaVsSoftware = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <SEO
        title="Planilha vs Software de Gestão de Gado | BoiControl"
        description="Compare o controle manual em planilhas com um software de gestão de gado: tempo, precisão, relatórios e segurança. Veja por que o BoiControl acelera o trabalho do pecuarista."
        path="/comparativo-planilha-vs-software"
      />

      <header className="mb-10 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-wide mb-3">
          Guia comparativo
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Planilha manual vs. software de gestão de gado: qual compensa mais?
        </h1>
        <p className="text-lg text-muted-foreground">
          Se você ainda controla compras de gado em caderno ou planilha,
          este comparativo mostra onde o trabalho manual custa caro — e como um
          software como o BoiControl resolve cada ponto.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Por que repensar o controle manual?
        </h2>
        <p className="text-muted-foreground mb-3">
          Planilhas funcionam até o ponto em que o volume de lotes, produtores
          e fazendas começa a crescer. A partir daí, cada nova compra significa
          mais tempo digitando, mais chance de erro em valores por arroba e
          mais dificuldade para enxergar o desempenho real do negócio.
        </p>
        <p className="text-muted-foreground">
          Um software de gestão de gado centraliza pesagem, precificação,
          cadastros e relatórios em um único fluxo — pensado para o ritmo do
          curral, não o do escritório.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Comparativo direto: manual vs. BoiControl
        </h2>
        <div className="grid gap-4">
          {comparativo.map((row) => (
            <Card key={row.criterio}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <row.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {row.criterio}
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pl-1">
                  <div className="flex gap-2">
                    <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        Planilha manual
                      </p>
                      <p className="text-sm text-muted-foreground">{row.manual}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        BoiControl
                      </p>
                      <p className="text-sm text-muted-foreground">{row.software}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Quando ainda faz sentido usar planilha?
        </h2>
        <p className="text-muted-foreground">
          Se você compra poucos animais por ano e não precisa de relatórios
          formais para parceiros ou contabilidade, uma planilha pode atender.
          A partir do momento em que existem múltiplas fazendas, vários
          produtores ou pesagem individual recorrente, o ganho de tempo do
          software paga o investimento já nos primeiros lotes.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          O que você ganha migrando para o BoiControl
        </h2>
        <ul className="space-y-3">
          {[
            'Terminal de pesagem com cálculo automático de peso médio por categoria',
            'Preço travado por sexo e raça para acelerar a pesagem no curral',
            'Cadastro centralizado de fazendas, produtores e lotes',
            'Relatórios profissionais em PDF, Excel e CSV',
            'Funciona offline e pode ser instalado como app no celular',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-muted-foreground">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-primary text-primary-foreground p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Pare de perder tempo com planilha
        </h2>
        <p className="mb-6 opacity-90">
          Registre seu próximo lote em minutos com o terminal de pesagem do
          BoiControl. É grátis para começar e funciona offline.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link to="/nova-compra">
              Registrar um lote agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <Link to="/">Ver dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ComparativoPlanilhaVsSoftware;
