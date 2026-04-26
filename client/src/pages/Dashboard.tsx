import React, { Component } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, ShoppingCart, Home, Car, Zap, Coffee, Music, MoreHorizontal } from 'lucide-react';
import { Card } from '../components/Card';

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Housing': { icon: <Home size={18}/>, color: '#FFB300', bg: '#FFF8E1' },
  'Food':    { icon: <ShoppingCart size={18}/>, color: '#43A047', bg: '#E8F5E9' },
  'Transport': { icon: <Car size={18}/>, color: '#1E88E5', bg: '#E3F2FD' },
  'Utilities': { icon: <Zap size={18}/>, color: '#8E24AA', bg: '#F3E5F5' },
  'Coffee':  { icon: <Coffee size={18}/>, color: '#6D4C41', bg: '#EFEBE9' },
  'Entertainment': { icon: <Music size={18}/>, color: '#D81B60', bg: '#FCE4EC' },
};

const PIE_COLORS = ['#1A237E', '#FFB300', '#3949AB', '#2E7D32', '#C62828', '#1565C0'];

interface DashboardProps {
  userId: string;
  viewDate: Date;
}

interface DashboardState {
  transactions: any[];
}

export class Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      transactions: []
    };
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: DashboardProps) {
    if (prevProps.userId !== this.props.userId || prevProps.viewDate !== this.props.viewDate) {
      this.loadData();
    }
  }

  loadData() {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/transactions/${this.props.userId}`)
      .then((res) => {
        this.setState({ transactions: res.data || [] });
      })
      .catch((error) => {
        console.error("error loading transactions", error);
        this.setState({ transactions: [] });
      });
  }

  render() {
    const { transactions } = this.state;
    const { viewDate } = this.props;

    // calculate totals for selected month
    let income = 0;
    let expense = 0;
    let pieDataMap: any = {};
    
    const targetMonth = viewDate.getMonth();
    const targetYear = viewDate.getFullYear();

    for (let i = 0; i < transactions.length; i++) {
      let t = transactions[i];
      let d = new Date(t.date);
      
      // ONLY include if it matches current month/year
      if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
        if (t.type == 'INCOME') {
          income = income + t.amount;
        } else if (t.type == 'EXPENSE') {
          expense = expense + t.amount;
          if (pieDataMap[t.category] == null) {
            pieDataMap[t.category] = t.amount;
          } else {
            pieDataMap[t.category] = pieDataMap[t.category] + t.amount;
          }
        }
      }
    }

    let balance = income - expense;

    let pieData = [];
    let categoryKeys = Object.keys(pieDataMap);
    for (let i = 0; i < categoryKeys.length; i++) {
      let key = categoryKeys[i];
      pieData.push({ name: key, value: pieDataMap[key] });
    }

    // Also filter history for display
    const monthlyHistory = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });

    return (
      <div className="space-y-6">
        {/* FinAura Hero Balance Card */}
        <div className="bg-[var(--brand-primary)] rounded-[var(--radius-xl)] p-10 shadow-lg text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--brand-accent)]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-30" />
          
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-3">Total Balance</p>
          <h1 className="text-5xl font-black tracking-tighter mb-10">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
          
          <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-[var(--radius-lg)] p-5 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Income</p>
              <p className="text-xl font-black text-[var(--brand-accent)] tracking-tight">${income.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-[var(--radius-lg)] p-5 border border-white/10">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">Expenses</p>
              <p className="text-xl font-black text-white tracking-tight">${expense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Spending Breakdown */}
        <Card className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Spending Insight</h3>
            <TrendingUp size={20} className="text-[var(--brand-accent)]" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="h-52 w-52 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} stroke="none" dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full space-y-5">
              {pieData.length === 0 ? (
                <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50">No data for this month</p>
              ) : pieData.slice(0, 4).map((d, i) => {
                const pct = ((d.value / expense) * 100).toFixed(0);
                return (
                  <div key={d.name}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tight mb-2">
                      <span className="text-[var(--text-secondary)]">{d.name}</span>
                      <span className="text-[var(--text-primary)]">{pct}%</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                      <div className="h-full rounded-full transition-all duration-1000 ease-in-out" style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length]}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Recent History */}
        <div>
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Monthly Activity</h3>
            <span className="text-[10px] font-black text-[var(--brand-accent)] uppercase tracking-widest cursor-pointer hover:opacity-80">Full History</span>
          </div>
          <div className="space-y-4">
            {monthlyHistory.length === 0 ? (
               <p className="text-center py-10 text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">No transactions found</p>
            ) : monthlyHistory.slice(0, 5).map(function(tx) {
              let cat = CATEGORY_ICONS[tx.category] || { icon: <MoreHorizontal size={18}/>, color: '#757575', bg: '#F5F5F5' };
              return (
                <div key={tx.id} className="flex items-center gap-5 p-5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-xl)] shadow-sm hover:translate-x-1 transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border border-[var(--border-color)]" style={{ backgroundColor: cat.bg, color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[var(--text-primary)] truncate uppercase tracking-tight">{tx.description}</p>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{tx.category} • {tx.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-black ${tx.type == 'INCOME' ? 'text-[var(--accent-success)]' : 'text-[var(--text-primary)]'}`}>
                      {tx.type == 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
