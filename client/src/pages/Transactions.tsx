import React, { Component } from 'react';
import axios from 'axios';
import { Plus, ShoppingCart, Home, Car, Coffee, Music, MoreHorizontal, Zap, Briefcase } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { format } from 'date-fns';

const CATEGORY_ICONS: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Housing':    { icon: <Home size={18}/>,         color: '#FFB300', bg: '#FFF8E1' },
  'Food':       { icon: <ShoppingCart size={18}/>,  color: '#43A047', bg: '#E8F5E9' },
  'Transport':  { icon: <Car size={18}/>,           color: '#1E88E5', bg: '#E3F2FD' },
  'Utilities':  { icon: <Zap size={18}/>,           color: '#8E24AA', bg: '#F3E5F5' },
  'Coffee':     { icon: <Coffee size={18}/>,        color: '#6D4C41', bg: '#EFEBE9' },
  'Entertainment': { icon: <Music size={18}/>,      color: '#D81B60', bg: '#FCE4EC' },
  'Salary':     { icon: <Briefcase size={18}/>,     color: '#00796B', bg: '#E0F2F1' },
};

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface TransactionsProps {
  userId: string;
  viewDate: Date;
}

interface TransactionsState {
  transactions: Transaction[];
  isModalOpen: boolean;
  filter: string;
  form: {
    description: string;
    amount: string;
    type: string;
    category: string;
    date: string;
  };
}

export class Transactions extends Component<TransactionsProps, TransactionsState> {
  constructor(props: TransactionsProps) {
    super(props);
    this.state = {
      transactions: [],
      isModalOpen: false,
      filter: 'ALL',
      form: { 
        description: '', 
        amount: '', 
        type: 'EXPENSE', 
        category: 'Food', 
        date: props.viewDate.toISOString().split('T')[0] 
      }
    };
    
    this.loadData = this.loadData.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.setModalOpen = this.setModalOpen.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: TransactionsProps) {
    if (prevProps.userId !== this.props.userId || prevProps.viewDate !== this.props.viewDate) {
      this.loadData();
      // Reset form date when viewDate changes
      this.setState({
        form: { ...this.state.form, date: this.props.viewDate.toISOString().split('T')[0] }
      });
    }
  }

  loadData() {
    axios.get(`http://localhost:3001/api/transactions/${this.props.userId}`)
      .then((res) => {
        this.setState({ transactions: res.data || [] });
      })
      .catch((err) => {
        console.error("could not load transactions", err);
        this.setState({ transactions: [] });
      });
  }

  setFilter(filter: string) {
    this.setState({ filter });
  }

  setModalOpen(isOpen: boolean) {
    this.setState({ isModalOpen: isOpen });
  }

  handleAdd(e: any) {
    e.preventDefault();
    const { form } = this.state;
    const { userId, viewDate } = this.props;

    let floatAmount = parseFloat(form.amount);
    let payload = {
      description: form.description,
      amount: floatAmount,
      type: form.type,
      category: form.category,
      date: new Date(form.date).toISOString(),
      userId: userId
    };

    axios.post('http://localhost:3001/api/transactions', payload)
      .then(() => {
        this.loadData();
      });

    this.setState({
      isModalOpen: false,
      form: { 
        description: '', 
        amount: '', 
        type: 'EXPENSE', 
        category: 'Food', 
        date: viewDate.toISOString().split('T')[0] 
      }
    });
  }

  render() {
    const { transactions, isModalOpen, filter, form } = this.state;
    const { viewDate } = this.props;

    let filtered: Transaction[] = [];
    let totalIncome = 0;
    let totalExpense = 0;
    
    const targetMonth = viewDate.getMonth();
    const targetYear = viewDate.getFullYear();

    for (let i = 0; i < transactions.length; i++) {
      let t = transactions[i];
      let d = new Date(t.date);
      
      // Filter by Month and Year
      if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
        if (t.type == 'INCOME') totalIncome += t.amount;
        if (t.type == 'EXPENSE') totalExpense += t.amount;
        
        if (filter == 'ALL' || t.type == filter) {
          filtered.push(t);
        }
      }
    }

    filtered.sort(function(a, b) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    let groupedElements = [];
    let lastDateStr = "";

    for (let i = 0; i < filtered.length; i++) {
      let tx = filtered[i];
      let dateObj = new Date(tx.date);
      let dateStr = format(dateObj, 'EEEE, MMM dd');

      if (dateStr != lastDateStr) {
        groupedElements.push(
          <div key={`header-${dateStr}`} className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest -mx-4 mb-2 first:mt-0 mt-4 px-4 py-1 bg-[var(--bg-secondary)] rounded-lg">
            {dateStr}
          </div>
        );
        lastDateStr = dateStr;
      }

      let cat = CATEGORY_ICONS[tx.category] || { icon: <MoreHorizontal size={18}/>, color: '#757575', bg: '#F5F5F5' };
      
      groupedElements.push(
        <div key={tx.id} className="flex items-center gap-4 p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-sm mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat.bg, color: cat.color }}>
            {cat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-[var(--text-primary)] truncate uppercase tracking-tight">{tx.description}</p>
            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{tx.category}</p>
          </div>
          <span className={`text-base font-black flex-shrink-0 ${tx.type == 'INCOME' ? 'text-[var(--accent-success)]' : 'text-[var(--text-primary)]'}`}>
            {tx.type == 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
          </span>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-primary)] border-2 border-[var(--accent-success)] p-5 rounded-[var(--radius-xl)] shadow-sm">
            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Total Income</p>
            <p className="text-2xl font-black text-[var(--accent-success)] tracking-tight">+${totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-[var(--bg-primary)] border-2 border-[var(--accent-danger)] p-5 rounded-[var(--radius-xl)] shadow-sm">
            <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-1">Total Expenses</p>
            <p className="text-2xl font-black text-[var(--accent-danger)] tracking-tight">-${totalExpense.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border-color)]">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map(f => (
            <button key={f} onClick={() => this.setFilter(f)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[var(--brand-accent)] text-[var(--brand-primary)] shadow-md' : 'text-[var(--text-muted)] hover:text-[var(--brand-primary)]'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="pb-24">
          {filtered.length === 0 ? (
            <div className="p-20 text-center opacity-40 grayscale">
              <div className="text-6xl mb-6">📜</div>
              <p className="font-black text-xs uppercase tracking-widest text-[var(--text-muted)]">No matching history</p>
            </div>
          ) : groupedElements}
        </div>

        <button
          onClick={() => this.setModalOpen(true)}
          className="fixed bottom-44 right-6 z-30 w-16 h-16 rounded-2xl bg-[var(--brand-accent)] text-[var(--brand-primary)] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
        >
          <Plus size={32} strokeWidth={3}/>
        </button>

        {/* Add Modal */}
        <Modal isOpen={isModalOpen} onClose={() => this.setModalOpen(false)} title="New Entry">
          <form onSubmit={this.handleAdd} className="space-y-6">
            <Input label="Short Description" placeholder="ENTER TITLE EX: COFFEE" value={form.description} onChange={e => this.setState({ form: { ...form, description: e.target.value } })} required/>
            <Input label="Amount" type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => this.setState({ form: { ...form, amount: e.target.value } })} required/>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Movement Type</label>
              <div className="grid grid-cols-2 gap-4">
                {(['EXPENSE','INCOME'] as const).map(t => (
                  <button type="button" key={t} onClick={() => this.setState({ form: { ...form, type: t } })}
                    className={`py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-[var(--brand-primary)] text-white shadow-lg scale-[1.02]' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Select Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['Food','Housing','Transport','Utilities','Coffee','Entertainment'].map(cat => (
                  <button type="button" key={cat} onClick={() => this.setState({ form: { ...form, category: cat } })}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${form.category === cat ? 'border-[var(--brand-accent)] bg-[var(--brand-accent)]/10 text-[var(--brand-primary)]' : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-muted)] opacity-60'}`}>
                    {React.cloneElement(CATEGORY_ICONS[cat].icon as React.ReactElement, { size: 24, strokeWidth: 2.5 } as any)}
                    <span className="text-[9px] font-black uppercase">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <Input label="Transaction Date" type="date" value={form.date} onChange={e => this.setState({ form: { ...form, date: e.target.value } })} required/>
            
            <Button fullWidth variant="primary" size="lg" className="py-5 text-sm uppercase tracking-[0.3em] font-black">Add Entry</Button>
          </form>
        </Modal>
      </div>
    );
  }
}
