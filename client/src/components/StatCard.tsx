import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, icon: Icon, color, trend }) => {
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}15`, color: color }}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-amount">
          ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </h3>
        {trend && (
          <div className={`stat-trend ${trend.isUp ? 'trend-up' : 'trend-down'}`}>
            <span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
            <span className="trend-label">vs last month</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
