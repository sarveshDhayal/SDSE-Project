import React, { useState, useEffect } from 'react';
import api from '../api';
import StatCard from '../components/StatCard';
import SpendingChart from '../components/SpendingChart';
import TransactionList from '../components/TransactionList';
import TransactionModal from '../components/TransactionModal';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet as WalletIcon, 
  Plus,
  RefreshCcw 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch recent transactions
      const txRes = await api.get('/transactions');
      setTransactions(txRes.data.slice(0, 5));

      // Fetch actual monthly report
      const reportRes = await api.get(`/reports/monthly?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`);
      
      setStats({
        income: reportRes.data.totalIncome || 0,
        expense: reportRes.data.totalExpense || 0,
        balance: (reportRes.data.totalIncome || 0) - (reportRes.data.totalExpense || 0)
      });

      // Aggregate chart data
      const aggregated: Record<string, { date: string; income: number; expense: number }> = {};
      [...txRes.data].reverse().forEach((t: any) => {
        const d = new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
        if (!aggregated[d]) aggregated[d] = { date: d, income: 0, expense: 0 };
        if (t.type === 'INCOME') aggregated[d].income += t.amount;
        if (t.type === 'EXPENSE') aggregated[d].expense += t.amount;
      });
      setChartData(Object.values(aggregated));

    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  };

  return (
    <div className="dashboard-content">
      <header className="page-header">
        <div>
          <h1>Financial Overview</h1>
          <p className="subtitle">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary" onClick={fetchData}>
            <RefreshCcw size={18} />
          </button>
          <button className="action-btn primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>New Transaction</span>
          </button>
        </div>
      </header>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      <section className="stats-grid">
        <StatCard 
          title="Total Balance" 
          amount={stats.balance} 
          icon={WalletIcon} 
          color="#6366f1"
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Monthly Income" 
          amount={stats.income} 
          icon={TrendingUp} 
          color="#10b981" 
        />
        <StatCard 
          title="Monthly Expense" 
          amount={stats.expense} 
          icon={TrendingDown} 
          color="#ef4444" 
          trend={{ value: 5, isUp: false }}
        />
      </section>

      <div className="charts-and-history">
        <motion.section 
          className="main-chart"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SpendingChart 
            title="Spending Velocity" 
            data={chartData} 
          />
        </motion.section>

        <motion.section 
          className="history-list"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <TransactionList transactions={transactions} onDelete={handleDelete} hideSearch={true} />
        </motion.section>
      </div>
    </div>
  );
};

export default DashboardPage;
