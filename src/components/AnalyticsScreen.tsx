import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, TrendingUp, PieChart as PieChartIcon, Download, Calendar } from 'lucide-react';
import { TacticalCard, TacticalButton } from './TacticalComponents';
import { useAlerts } from '../useAlerts';

const TYPE_COLORS: Record<string, string> = {
  weapon: '#ff3e3e',
  fighting: '#00f1fe',
  shoplifting: '#00ffaa'
};
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AnalyticsScreen = () => {
  const { alerts } = useAlerts();

  // ---- Threat volume: alerts per day for the last 7 days ----
  const now = new Date();
  const volumeData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    const threats = alerts.filter((a) => {
      const t = new Date(a.timestamp).getTime();
      return t >= d.getTime() && t < next.getTime();
    }).length;
    return { name: DAY_LABELS[d.getDay()], threats };
  });

  // ---- Event classification: counts by detection type ----
  const typeCounts: Record<string, number> = {};
  alerts.forEach((a) => {
    const key = a.type.toLowerCase();
    typeCounts[key] = (typeCounts[key] || 0) + 1;
  });
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  const hasPie = pieData.length > 0;

  // ---- Hourly heatmap: alert count per hour-of-day (0-23) ----
  const hourly = Array.from({ length: 24 }, () => 0);
  alerts.forEach((a) => {
    hourly[new Date(a.timestamp).getHours()] += 1;
  });
  const maxHour = Math.max(1, ...hourly);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-headline font-black tracking-widest text-white uppercase">Intelligence_Analytics</h1>
        <div className="flex gap-3">
          <TacticalButton variant="ghost" className="text-[10px] py-2">
            <Calendar className="w-3 h-3 mr-2" />
            Last 7 Days
          </TacticalButton>
          <TacticalButton variant="primary" className="text-[10px] py-2">
            <Download className="w-3 h-3 mr-2" />
            Generate Report
          </TacticalButton>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <TacticalCard title="THREAT_DETECTION_VOLUME" icon={TrendingUp} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', fontSize: '10px' }}
                  itemStyle={{ color: '#00ffaa' }}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#00ffaa"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00ffaa' }}
                  activeDot={{ r: 6, fill: '#00ffaa', stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TacticalCard>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <TacticalCard title="EVENT_CLASSIFICATION" icon={PieChartIcon} className="h-[400px]">
            {hasPie ? (
              <>
                <ResponsiveContainer width="100%" height="60%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.name] || '#888'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff10', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2" style={{ backgroundColor: TYPE_COLORS[item.name] || '#888' }}></div>
                        <span className="text-text-dim uppercase">{item.name}</span>
                      </div>
                      <span className="text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-[10px] font-mono text-text-dim/50 uppercase">
                No detections yet
              </div>
            )}
          </TacticalCard>
        </div>

        <div className="col-span-12">
          <TacticalCard title="HOURLY_DETECTION_HEATMAP" icon={Activity}>
            <div className="h-48 flex items-end gap-2">
              {hourly.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col gap-1" title={`${count} alerts at ${i}:00`}>
                  <div className="flex-1 bg-surface-high relative group">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-secondary-glow/40 group-hover:bg-secondary-glow transition-all"
                      style={{ height: `${(count / maxHour) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] font-mono text-text-dim/40 text-center">{i}h</span>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
