import { Cloud, CloudRain, Sun, CloudSnow, Zap, Droplets, Wind, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { Badge } from './ui';
import { weatherForecast, products } from '../data/businessData';
import { weatherAgentInsights } from '../ai/agents';
import type { TranslationKey } from '../i18n/translations';

const weatherIcons: Record<string, typeof Cloud> = {
  rainy: CloudRain, sunny: Sun, hot: Sun, cloudy: Cloud, cold: CloudSnow, storm: Zap,
};

export function WeatherView() {
  const { t, lang } = useLang();
  const insights = weatherAgentInsights(lang);
  const tomorrow = weatherForecast[1];

  const increaseProducts = products.filter((p) => p.weatherSensitive && (p.seasonal === tomorrow.condition || p.seasonal === 'all')).slice(0, 5);
  const decreaseProducts = products.filter((p) => p.seasonal === 'hot' && tomorrow.condition === 'rainy').slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Tomorrow's weather hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-brand-600 p-6 text-white shadow-lg animate-slideUp">
        <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">{t('weatherTomorrow')}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-5xl">{tomorrow.condition === 'rainy' ? '🌧️' : tomorrow.condition === 'hot' ? '☀️' : tomorrow.condition === 'sunny' ? '🌤️' : tomorrow.condition === 'storm' ? '⛈️' : '☁️'}</span>
              <div>
                <p className="text-3xl font-bold">{tomorrow.temp}°C</p>
                <p className="text-sm opacity-90">{t(`weather${tomorrow.condition.charAt(0).toUpperCase() + tomorrow.condition.slice(1)}` as TranslationKey)}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-right">
            <div><Droplets className="inline h-4 w-4 opacity-70" /> <span className="text-sm font-semibold">{tomorrow.humidity}%</span></div>
            <div><Wind className="inline h-4 w-4 opacity-70" /> <span className="text-sm font-semibold">{tomorrow.wind}km/h</span></div>
            <div><CloudRain className="inline h-4 w-4 opacity-70" /> <span className="text-sm font-semibold">{tomorrow.precipitation}%</span></div>
            <div><Sun className="inline h-4 w-4 opacity-70" /> <span className="text-sm font-semibold">UV {tomorrow.uv}</span></div>
          </div>
        </div>
      </div>

      {/* 7-day forecast */}
      <div className="card p-5 animate-slideUp">
        <h3 className="mb-4 text-sm font-bold text-ink-900">{t('weatherForecast')}</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weatherForecast.map((w) => {
            const Icon = weatherIcons[w.condition] || Cloud;
            return (
              <div key={w.day} className={`rounded-xl border p-3 text-center transition-all ${w.day === 'Tomorrow' ? 'border-brand-300 bg-brand-50' : 'border-ink-100'}`}>
                <p className="text-xs font-semibold text-ink-500">{w.day}</p>
                <div className="my-2 flex justify-center">
                  <Icon className={`h-7 w-7 ${w.condition === 'rainy' || w.condition === 'storm' ? 'text-blue-500' : w.condition === 'hot' || w.condition === 'sunny' ? 'text-amber-500' : 'text-ink-400'}`} />
                </div>
                <p className="text-sm font-bold text-ink-900">{w.temp}°C</p>
                <p className="text-[10px] text-ink-400">{w.precipitation}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stock recommendations */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5 animate-slideUp">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">📈</span>
            <h3 className="text-sm font-bold text-ink-900">{t('increaseStock')}</h3>
          </div>
          <div className="space-y-2.5">
            {increaseProducts.map((p) => {
              const increasePct = p.seasonal === tomorrow.condition ? 35 : 15;
              return (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50/30 p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-400">{t('stock')}: {p.stock} {t('units')}</p>
                  </div>
                  <Badge variant="success">+{increasePct}%</Badge>
                </div>
              );
            })}
          </div>
        </div>
        {decreaseProducts.length > 0 && (
          <div className="card p-5 animate-slideUp">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">📉</span>
              <h3 className="text-sm font-bold text-ink-900">{t('reduceStock')}</h3>
            </div>
            <div className="space-y-2.5">
              {decreaseProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50/30 p-3">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-400">{t('stock')}: {p.stock} {t('units')}</p>
                  </div>
                  <Badge variant="danger">-70%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="card p-5 animate-slideUp">
        <h3 className="mb-3 text-sm font-bold text-ink-900">{t('weatherAnalysis')}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl border border-ink-100 p-3.5">
              <div className="flex items-center justify-between">
                <Badge variant={ins.priority === 'high' ? 'danger' : 'warning'}>{ins.title}</Badge>
                {ins.value && <span className="text-xs font-semibold text-ink-500">{ins.value}</span>}
              </div>
              <p className="mt-2 text-xs text-ink-500">{ins.message}</p>
              {ins.action && <button className="mt-2 flex items-center gap-1 text-xs font-semibold text-brand-600">{ins.action} <ArrowRight className="h-3 w-3" /></button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
