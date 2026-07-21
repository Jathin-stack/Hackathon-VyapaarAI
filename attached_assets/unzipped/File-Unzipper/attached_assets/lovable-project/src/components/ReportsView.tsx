import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Package, Users, IndianRupee, BarChart3, FileSpreadsheet, FileBarChart, Clock } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { SectionCard } from './ui';
import { businessMetrics, weeklySalesData, monthlyRevenueData, products, customers } from '../data/businessData';

type ReportType = 'daily' | 'weekly' | 'monthly' | 'profit' | 'forecast' | 'inventory' | 'customer';

export function ReportsView() {
  const { t } = useLang();
  const [selectedReport, setSelectedReport] = useState<ReportType>('monthly');
  const [generating, setGenerating] = useState(false);

  const reportTypes: { key: ReportType; icon: typeof FileText; label: string; desc: string }[] = [
    { key: 'daily', icon: Clock, label: 'Daily Report', desc: 'Today\'s sales summary' },
    { key: 'weekly', icon: Calendar, label: 'Weekly Report', desc: '7-day business overview' },
    { key: 'monthly', icon: BarChart3, label: t('monthlyReport'), desc: 'Monthly revenue & profit' },
    { key: 'profit', icon: IndianRupee, label: t('profitReport'), desc: 'Profit analysis & margins' },
    { key: 'forecast', icon: TrendingUp, label: t('forecastReport'), desc: 'Predictive forecasts' },
    { key: 'inventory', icon: Package, label: t('inventoryReport'), desc: 'Stock & reorder analysis' },
    { key: 'customer', icon: Users, label: t('customerReport'), desc: 'Customer insights & segments' },
  ];

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const data = generateReportData(selectedReport);
      if (format === 'csv') downloadCSV(data, `${selectedReport}-report.csv`);
      else if (format === 'excel') downloadCSV(data, `${selectedReport}-report.xls`);
      else downloadPDFReport(selectedReport, data);
    }, 800);
  };

  const generateReportData = (type: ReportType) => {
    switch (type) {
      case 'daily':
        return [
          ['Metric', 'Value'],
          ['Today\'s Revenue', `₹${businessMetrics.todayRevenue}`],
          ['Today\'s Profit', `₹${businessMetrics.todayProfit}`],
          ['Today\'s Sales', `${businessMetrics.todaySales} units`],
          ['Active Customers', `${businessMetrics.activeCustomers}`],
          ['Avg Order Value', `₹${businessMetrics.avgOrderValue}`],
          ['New Customers', `${businessMetrics.newCustomers}`],
        ];
      case 'weekly':
        return [
          ['Day', 'Sales', 'Profit', 'Customers'],
          ...weeklySalesData.map(d => [d.day, `₹${d.sales}`, `₹${d.profit}`, `${d.customers}`]),
          ['Total', `₹${weeklySalesData.reduce((s, d) => s + d.sales, 0)}`, `₹${weeklySalesData.reduce((s, d) => s + d.profit, 0)}`, `${weeklySalesData.reduce((s, d) => s + d.customers, 0)}`],
        ];
      case 'monthly':
        return [
          ['Month', 'Revenue', 'Expense', 'Profit'],
          ...monthlyRevenueData.map(d => [d.month, `₹${d.revenue}`, `₹${d.expense}`, `₹${d.profit}`]),
        ];
      case 'profit':
        return [
          ['Metric', 'Value'],
          ['Monthly Revenue', `₹${businessMetrics.monthlyRevenue}`],
          ['Monthly Profit', `₹${businessMetrics.monthlyProfit}`],
          ['Profit Margin', `${((businessMetrics.monthlyProfit / businessMetrics.monthlyRevenue) * 100).toFixed(1)}%`],
          ['Growth Rate', `${businessMetrics.growthRate}%`],
          ['Today\'s Profit', `₹${businessMetrics.todayProfit}`],
        ];
      case 'forecast':
        return [
          ['Metric', 'Forecast'],
          ['Next Month Revenue', '₹1,42,000'],
          ['Next Month Profit', '₹52,000'],
          ['Expected Growth', '14.5%'],
          ['Top Product Forecast', 'Tea (+25%)'],
          ['Risk Products', 'Ice Cream (-15%)'],
        ];
      case 'inventory':
        return [
          ['Product', 'Stock', 'Reorder Level', 'Status'],
          ...products.map(p => [p.name, `${p.stock}`, `${p.reorderLevel}`, p.stock <= p.reorderLevel ? 'Low Stock' : 'OK']),
        ];
      case 'customer':
        return [
          ['Customer', 'Segment', 'Total Spent', 'Visits', 'Loyalty Points'],
          ...customers.map(c => [c.name, c.segment, `₹${c.totalSpent}`, `${c.visits}`, `${c.loyaltyPoints}`]),
        ];
    }
  };

  return (
    <div className="space-y-5">
      <div className="animate-slideUp">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('reports')}</h1>
        <p className="text-sm text-ink-soft mt-1">Generate and export business reports in your language</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {reportTypes.map((r) => (
          <button
            key={r.key}
            onClick={() => setSelectedReport(r.key)}
            className={`card card-hover p-4 text-left transition-all ${selectedReport === r.key ? 'ring-2 ring-secondary' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
              <r.icon className="w-5 h-5 text-secondary" />
            </div>
            <p className="text-sm font-bold text-ink">{r.label}</p>
            <p className="text-xs text-ink-soft mt-0.5">{r.desc}</p>
          </button>
        ))}
      </div>

      <SectionCard title={reportTypes.find(r => r.key === selectedReport)?.label || ''}>
        <div className="space-y-4">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100">
                  {generateReportData(selectedReport)[0].map((h, i) => (
                    <th key={i} className="text-left py-2 px-3 font-bold text-ink text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generateReportData(selectedReport).slice(1).map((row, i) => (
                  <tr key={i} className="border-b border-ink-100/50 hover:bg-primary-50/30 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className={`py-2 px-3 ${j === 0 ? 'font-semibold text-ink' : 'text-ink-soft'}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button onClick={() => handleExport('pdf')} disabled={generating} className="btn-primary text-xs">
              {generating ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FileBarChart className="w-4 h-4" />}
              {t('exportPdf')}
            </button>
            <button onClick={() => handleExport('excel')} disabled={generating} className="btn-ghost text-xs">
              <FileSpreadsheet className="w-4 h-4" />
              {t('exportExcel')}
            </button>
            <button onClick={() => handleExport('csv')} disabled={generating} className="btn-ghost text-xs">
              <Download className="w-4 h-4" />
              {t('exportCsv')}
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function downloadCSV(data: string[][], filename: string) {
  const csv = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadPDFReport(type: string, data: string[][]) {
  const win = window.open('', '_blank');
  if (!win) return;
  const html = `
    <html><head><title>${type} Report — VyapaarAI</title>
    <style>
      body { font-family: 'Inter', sans-serif; padding: 40px; color: #2A1F14; background: #FDF9F1; }
      h1 { font-family: 'Fraunces', serif; color: #C1440E; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { text-align: left; padding: 10px; border-bottom: 2px solid #C1440E; color: #9B2E00; font-size: 12px; text-transform: uppercase; }
      td { padding: 10px; border-bottom: 1px solid rgba(42,31,20,0.1); }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      .logo { font-family: 'Fraunces', serif; font-size: 24px; font-weight: bold; color: #C1440E; }
      .date { color: #888; font-size: 12px; }
    </style></head><body>
    <div class="header"><div class="logo">VyapaarAI</div><div class="date">${new Date().toLocaleDateString()}</div></div>
    <h1>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h1>
    <table><thead><tr>${data[0].map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${data.slice(1).map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </body></html>`;
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 500);
}
