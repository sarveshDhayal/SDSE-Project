import React, { useState, useEffect } from 'react';
import api from '../api';
import BudgetModal from '../components/BudgetModal';
import { 
  PieChart, 
  Plus, 
  Target, 
  AlertCircle,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const BudgetsPage: React.FC = () => {
  const [budgets, setBudgets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, number>>({});

  const fetchData = async () => {
    try {
      const [budgetsRes, reportRes] = await Promise.all([
        api.get('/budgets'),
        api.get(`/reports/monthly?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`)
      ]);
      setBudgets(budgetsRes.data);
      setCategoryBreakdown(reportRes.data.categoryBreakdown || {});
    } catch (err) {
      console.error('Failed to fetch budgets/report', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBudgeted = budgets.reduce((acc: number, b: any) => acc + b.amount, 0);
  const totalSpent = budgets.reduce((acc: number, b: any) => acc + (categoryBreakdown[b.categoryId] || 0), 0);
  const remainingBudget = Math.max(0, totalBudgeted - totalSpent);

  return (
    <div className="budgets-page">
      <header className="page-header">
        <div>
          <h1>Budget Planning</h1>
          <p className="subtitle">Set and monitor your spending limits for each category.</p>
        </div>
        <div className="header-actions">
          <button className="action-btn primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Set New Budget</span>
          </button>
        </div>
      </header>

      <BudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchData} 
      />

      <div className="budgets-overview-grid">
        <div className="overview-card total-budget">
          <Target className="card-icon" />
          <div className="card-info">
            <p>Total Budgeted</p>
            <h3>₹{totalBudgeted.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="overview-card remaining-budget">
          <TrendingUp className="card-icon" />
          <div className="card-info">
            <p>Remaining Monthly</p>
            <h3>₹{remainingBudget.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      <motion.section 
        className="budgets-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="section-header">
          <h2>Active Budgets</h2>
        </div>

        <div className="budgets-list">
          {budgets.length === 0 ? (
            <div className="empty-budget-state">
              <div className="empty-icon"><PieChart size={48} /></div>
              <h3>No budgets set</h3>
              <p>Start managing your wealth by setting monthly limits for categories like Food, Rent, or Entertainment.</p>
            </div>
          ) : (
            budgets.map((budget: any) => {
              const spent = categoryBreakdown[budget.categoryId] || 0;
              const percentage = Math.min(100, Math.round((spent / budget.amount) * 100));
              return (
                <div key={budget.id} className="budget-item-card">
                  <div className="budget-item-header">
                    <div className="budget-category-info">
                      <div className="category-color-blob"></div>
                      <div>
                        <h4>{budget.category?.name || 'General'}</h4>
                        <p className="period-label">{budget.period}</p>
                      </div>
                    </div>
                    <button className="item-more-btn"><MoreVertical size={16} /></button>
                  </div>

                  <div className="budget-progress-section">
                    <div className="progress-labels">
                      <span>Spent: ₹{spent.toLocaleString('en-IN')}</span>
                      <span>Limit: ₹{budget.amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="progress-bar-container">
                      <motion.div 
                        className={`progress-bar-fill ${percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : ''}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1 }}
                      ></motion.div>
                    </div>
                    <div className={`status-indicator ${percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'safe'}`}>
                      {percentage >= 80 && <AlertCircle size={14} />}
                      <span>{percentage}% consumed</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default BudgetsPage;
