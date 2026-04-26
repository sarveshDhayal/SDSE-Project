import { Component } from 'react';
import axios from 'axios';
import { TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const monthlyData = [
  { month: 'Jan', income: 4200, expense: 2800 },
  { month: 'Feb', income: 3900, expense: 2400 },
  { month: 'Mar', income: 4500, expense: 3100 },
  { month: 'Apr', income: 4200, expense: 1950 },
];

interface ReportsProps {
  userId: string;
  viewDate: Date;
}

interface ReportsState {
  report: any;
}

export class Reports extends Component<ReportsProps, ReportsState> {
  constructor(props: ReportsProps) {
    super(props);
    this.state = {
      report: null
    };
    this.loadReport = this.loadReport.bind(this);
  }

  componentDidMount() {
    this.loadReport();
  }

  componentDidUpdate(prevProps: ReportsProps) {
    if (prevProps.userId !== this.props.userId || prevProps.viewDate !== this.props.viewDate) {
      this.loadReport();
    }
  }

  loadReport() {
    const { userId, viewDate } = this.props;
    const month = viewDate.getMonth() + 1;
    const year = viewDate.getFullYear();
    
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/reports/${userId}`, {
      params: { month, year }
    })
      .then((res) => {
        if (res.data != null) {
          this.setState({ report: res.data });
        }
      })
      .catch((err) => {
        console.error("error fetching report", err);
      });
  }

  render() {
    const { report } = this.state;
    const { viewDate } = this.props;

    let savingsRate = "0%";
    let insightText = "Preparing your financial insights...";
    let chartData = monthlyData;

    if (report != null) {
      savingsRate = (report.savingRate * 100).toFixed(0) + "%";
      insightText = `Impressive! You saved ${savingsRate} of your total income this month.`;
      
      const currentMonthLabel = viewDate.toLocaleString('default', { month: 'short' });
      
      chartData = [
        { month: 'Feb', income: 3900, expense: 2400 },
        { month: 'Mar', income: 4500, expense: 3100 },
        { month: 'Apr', income: 4200, expense: 1950 },
        { month: currentMonthLabel, income: report.totalIncome, expense: report.totalExpense }
      ];
    }

    return (
      <div className="space-y-6">
        {/* Smart Insights Hero */}
        <div className="bg-[var(--brand-primary)] rounded-[var(--radius-xl)] p-10 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <Sparkles size={16} strokeWidth={3} className="text-[var(--brand-accent)]"/>
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">FinAura AI Analyst</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-tight max-w-md">{insightText}</h2>
          <p className="text-[9px] font-black uppercase mt-6 tracking-[0.2em] opacity-50 border-t border-white/10 pt-4">Strategic Insight: Diversify your category allocations to optimize net savings.</p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Cash Flow Trends</h3>
              <BarChart3 size={20} className="text-[var(--brand-accent)]"/>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={10} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false}/>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} dy={10}/>
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`}/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}/>
                  <Bar dataKey="income" fill="var(--accent-success)" radius={[6,6,0,0]} maxBarSize={32}/>
                  <Bar dataKey="expense" fill="var(--accent-danger)" radius={[6,6,0,0]} maxBarSize={32}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-8 mt-8 justify-center">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                <div className="w-3 h-3 rounded-full bg-[var(--accent-success)]"></div> Income
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                <div className="w-3 h-3 rounded-full bg-[var(--accent-danger)]"></div> Expense
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Financial Growth</h3>
              <TrendingUp size={20} className="text-[var(--accent-success)]"/>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--border-color)" vertical={false}/>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} dy={10}/>
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `$${v/1000}k`}/>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}/>
                  <Line type="monotone" dataKey="income" stroke="var(--brand-accent)" strokeWidth={4} dot={{ fill:'var(--brand-accent)', r:6, strokeWidth:2, stroke:'#fff' }} activeDot={{ r:8, strokeWidth:0 }}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {report != null ? (
            [
              { label: 'Total Revenue', val: `$${report.totalIncome}`, status: 'success' },
              { label: 'Operational Cost', val: `$${report.totalExpense}`, status: 'danger' },
              { label: 'Net Surplus', val: `$${report.netSavings}`, status: 'primary' },
              { label: 'Efficiency Rate', val: savingsRate, status: 'accent' },
            ].map((s) => {
              let colorClass = 'text-[var(--text-primary)]';
              if (s.status === 'success') colorClass = 'text-[var(--accent-success)]';
              if (s.status === 'danger') colorClass = 'text-[var(--accent-danger)]';
              if (s.status === 'accent') colorClass = 'text-[var(--brand-accent)]';
              
              return (
                <div key={s.label} className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-7 rounded-[var(--radius-xl)] shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-3">{s.label}</p>
                  <p className={`text-2xl font-black tracking-tighter ${colorClass}`}>{s.val}</p>
                </div>
              );
            })
          ) : null}
        </div>
      </div>
    );
  }
}
