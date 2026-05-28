import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#f59e0b',
  twitter: '#0ea5e9',
  reddit: '#f97316',
  youtube: '#ef4444',
  linkedin: '#3b82f6',
  instagram: '#ec4899',
  facebook: '#6366f1',
  tiktok: '#14b8a6',
  mock: '#6b7280',
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#0ea5e9', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs border border-white/20">
      {label && <p className="text-gray-400 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }}>
          {entry.name}: <span className="font-bold text-white">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

// Platform distribution bar chart
export function PlatformChart({ data }) {
  if (!data) return <ChartSkeleton />;
  const chartData = Object.entries(data).map(([platform, count]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    count,
    fill: COLORS[platform] || '#6b7280',
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="platform" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Posts" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, idx) => <Cell key={idx} fill={entry.fill} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Sentiment pie chart
export function SentimentChart({ data }) {
  if (!data) return <ChartSkeleton />;
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), value, color: COLORS[key],
  })).filter(d => d.value > 0);
  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="60%" height={160}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
            {chartData.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
              <span className="text-gray-400">{item.name}</span>
            </div>
            <span className="text-white font-medium">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Engagement over time line chart
export function EngagementChart({ data }) {
  if (!data?.length) return <ChartSkeleton />;
  const chartData = data.map(d => ({
    date: d._id?.slice(5) || d.date,
    posts: d.count || 0,
    engagement: Math.round(d.avgEngagement || 0),
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ color: '#9ca3af', fontSize: '11px' }} />
        <Line type="monotone" dataKey="posts" stroke="#3b82f6" strokeWidth={2} dot={false} name="Posts" />
        <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} dot={false} name="Engagement" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Category distribution horizontal bar chart
export function CategoryChart({ data }) {
  if (!data) return <ChartSkeleton />;
  const chartData = Object.entries(data)
    .map(([cat, count]) => ({ cat: cat.length > 16 ? cat.slice(0, 14) + '…' : cat, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} layout="vertical" barSize={16}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="cat" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" name="Posts" radius={[0, 6, 6, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.8} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartSkeleton() {
  return <div className="h-48 skeleton rounded-xl" />;
}
