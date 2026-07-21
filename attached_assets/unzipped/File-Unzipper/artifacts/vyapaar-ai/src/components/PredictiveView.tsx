import { TrendingUp, Brain, Target, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { useLang } from '../i18n/LanguageContext';
import { StatCard, Badge, ProgressBar } from './ui';
import { monthlyRevenueData, weeklySalesData, healthScores } from '../data/businessData';

export function PredictiveView() {
  const { t } = useLang();

  const forecastData = [
    ...monthlyRevenueData.slice(-3),
    { month: 'Aug', revenue: 138000, expense: 82000, profit: 56000 },
    { month: 'Sep', revenue: 145000, expense: 85000, profit: 60000 },
    { month: 'Oct', revenue: 168000, expense: 95000, profit: 73000 },
    { month: 'Nov', revenue: 152000, expense: 88000, profit: 64000 },
  ];

  const demandData = products_demand();
  const accuracyData = [{ name: t('accuracyValue'), value: healthScores.accuracy, fill: '#1f9e6a' }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label={t('revenueForecast')} value="₹1,68,000" sublabel="Oct 2025" trend="up" color="brand" />
        <StatCard icon={Brain} label={t('profitForecast')} value="₹73,000" sublabel="Oct 2025" trend="up" color="brand" />
        <StatCard icon={Target} label={t('accuracyValue')} value={`${healthScores.accuracy}%`} trend="up" color="blue" />
        <StatCard icon={Zap} label={t('aiConfidence')} value="92%" color="brand" />
      </div>

      {/* Revenue forecast */}
      <div className="card p-5 animate-slideUp">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink-900">{t('revenueForecast')}</h3>
          <Badge variant="brand"><Brain className="h-3 w-3" /> {t('predictiveModel')}</Badge>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f9e6a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1f9e6a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            <Area type="monotone" dataKey="revenue" stroke="#1f9e6a" strokeWidth={2.5} fill="url(#forecastGrad)" name={t('revenue')} />
            <Area type="monotone" dataKey="profit" stroke="#45b985" strokeWidth={2} fill="none" name={t('profit')} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Demand prediction */}
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('demandPrediction')}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={demandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} cursor={{ fill: '#f6f7f9' }} />
              <Bar dataKey="predicted" fill="#1f9e6a" radius={[4, 4, 0, 0]} name={t('demandPrediction')} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI accuracy gauge */}
        <div className="card p-5 animate-slideUp">
          <h3 className="mb-4 text-sm font-bold text-ink-900">{t('aiConfidence')}</h3>
          <div className="flex flex-col items-center">
            <div className="relative h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="75%" outerRadius="100%" data={accuracyData} startAngle={90} endAngle={-270}>
                  <RadialBar background dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-ink-900">{healthScores.accuracy}%</span>
                <span className="text-xs text-ink-400">{t('accuracyValue')}</span>
              </div>
            </div>
            <div className="mt-4 w-full space-y-2">
              <div><div className="flex justify-between text-xs"><span className="text-ink-500">{t('demandScore')}</span><span className="font-semibold">{healthScores.demand}/100</span></div><ProgressBar value={healthScores.demand} /></div>
              <div><div className="flex justify-between text-xs"><span className="text-ink-500">{t('accuracyScore')}</span><span className="font-semibold">{healthScores.accuracy}/100</span></div><ProgressBar value={healthScores.accuracy} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Seasonal patterns */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('seasonalPatterns')}</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#67718d' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eceef2', fontSize: 12 }} />
            <Line type="monotone" dataKey="sales" stroke="#1f9e6a" strokeWidth={2.5} dot={{ r: 4, fill: '#1f9e6a' }} name={t('weeklySales')} />
            <Line type="monotone" dataKey="profit" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name={t('profit')} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function products_demand() {
  return [
    { name: 'Tea', predicted: 65 },
    { name: 'Milk', predicted: 78 },
    { name: 'Biscuits', predicted: 70 },
    { name: 'Ice Cream', predicted: 6 },
    { name: 'Chips', predicted: 52 },
    { name: 'Coffee', predicted: 38 },
  ];
}
