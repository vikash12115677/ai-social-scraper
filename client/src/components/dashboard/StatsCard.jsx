import { motion } from 'framer-motion';

const GLOW_CLASSES = {
  blue: 'stat-glow-blue',
  green: 'stat-glow-green',
  red: 'stat-glow-red',
  purple: 'stat-glow-purple',
};

const ICON_BG = {
  blue: 'bg-blue-500/20 text-blue-400',
  green: 'bg-emerald-500/20 text-emerald-400',
  red: 'bg-red-500/20 text-red-400',
  purple: 'bg-purple-500/20 text-purple-400',
};

export default function StatsCard({ title, value, icon, change, changeType = 'neutral', color = 'blue', subtitle, index = 0 }) {
  return (
    <motion.div
      className={`glass-card p-5 ${GLOW_CLASSES[color]} hover:scale-[1.02] transition-transform cursor-default`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${ICON_BG[color]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            changeType === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
            changeType === 'negative' ? 'bg-red-500/20 text-red-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '→'} {change}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-0.5">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p className="text-sm text-gray-400">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
