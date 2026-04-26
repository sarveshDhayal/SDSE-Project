import { Component } from 'react';
import axios from 'axios';
import { AlertTriangle, Plus } from 'lucide-react';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';

interface BudgetsProps {
  userId: string;
  viewDate: Date;
}

interface BudgetsState {
  budgets: any[];
  transactions: any[];
  isOpen: boolean;
  form: { 
    categoryId: string; 
    amount: string; 
  };
}

export class Budgets extends Component<BudgetsProps, BudgetsState> {
  constructor(props: BudgetsProps) {
    super(props);
    this.state = {
      budgets: [],
      transactions: [],
      isOpen: false,
      form: { categoryId: '', amount: '' }
    };
    
    this.loadData = this.loadData.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.setIsOpen = this.setIsOpen.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: BudgetsProps) {
    if (prevProps.userId !== this.props.userId || prevProps.viewDate !== this.props.viewDate) {
      this.loadData();
    }
  }

  loadData() {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/budgets/${this.props.userId}`)
      .then((bRes) => {
        if (bRes.data != null) {
          this.setState({ budgets: bRes.data });
        }
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/transactions/${this.props.userId}`)
          .then((tRes) => {
            if (tRes.data != null) {
              this.setState({ transactions: tRes.data });
            }
          });
      })
      .catch((err) => {
        console.error("error loading budgets/transactions", err);
      });
  }

  setIsOpen(isOpen: boolean) {
    this.setState({ isOpen });
  }

  handleAdd(e: any) {
    e.preventDefault();
    const { form } = this.state;
    const { userId } = this.props;

    let payload = {
      amount: parseFloat(form.amount),
      categoryId: form.categoryId,
      userId: userId,
      period: 'MONTHLY'
    };

    axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/budgets`, payload)
      .then(() => {
        this.loadData();
      });

    this.setState({
      isOpen: false,
      form: { categoryId: '', amount: '' }
    });
  }

  render() {
    const { budgets, transactions, isOpen, form } = this.state;
    const { viewDate } = this.props;

    const targetMonth = viewDate.getMonth();
    const targetYear = viewDate.getFullYear();

    let totalBudget = 0;
    for (let i = 0; i < budgets.length; i++) {
      totalBudget = totalBudget + budgets[i].amount;
    }

    let totalSpent = 0;
    for (let i = 0; i < transactions.length; i++) {
      let t = transactions[i];
      let d = new Date(t.date);
      if (t.type == 'EXPENSE' && d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
        totalSpent = totalSpent + t.amount;
      }
    }

    let overallPct = 0;
    if (totalBudget > 0) overallPct = (totalSpent / totalBudget) * 100;

    return (
      <div className="space-y-6">
        {/* Monthly Overview Card */}
        <div className="bg-[var(--brand-primary)] rounded-[var(--radius-xl)] p-10 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--brand-accent)]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-20" />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Total Budget</p>
              <p className="text-5xl font-black tracking-tighter">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">Status</p>
              <p className="font-black text-sm uppercase text-[var(--brand-accent)]">{overallPct > 100 ? 'Limit Exceeded' : 'Safe Zone'}</p>
            </div>
          </div>
          
          <ProgressBar progress={overallPct} sublabel={`${overallPct.toFixed(0)}% consumed`}/>
          
          <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
            <span>Spent: ${totalSpent.toLocaleString()}</span>
            <span>Available: ${(totalBudget - totalSpent).toLocaleString()}</span>
          </div>
        </div>

        {/* Envelopes Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Budget Envelopes</h3>
          <Button variant="accent" size="sm" onClick={() => this.setIsOpen(true)} className="rounded-full px-5 font-black uppercase tracking-widest text-[9px]">
            <Plus size={14} strokeWidth={4} className="mr-1"/> New Limit
          </Button>
        </div>

        {/* Grid of Envelopes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {budgets.map((b) => {
            let spent = 0;
            for (let i = 0; i < transactions.length; i++) {
              let t = transactions[i];
              let d = new Date(t.date);
              if (t.type == 'EXPENSE' && t.category == b.categoryId && d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
                spent += t.amount;
              }
            }

            let pct = b.amount > 0 ? (spent / b.amount) * 100 : 0;
            let isOver = pct >= 100;

            return (
              <div key={b.id} className="bg-[var(--bg-primary)] border border-[var(--border-color)] p-7 rounded-[var(--radius-xl)] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center font-black text-xs text-[var(--brand-primary)] border border-[var(--border-color)]">
                      {b.categoryId.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-tight text-[var(--text-primary)]">{b.categoryId}</h4>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest uppercase mt-1">Limit: ${b.amount}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black ${isOver ? 'bg-[var(--accent-danger)] text-white' : 'bg-[var(--brand-accent)] text-[var(--brand-primary)]'}`}>
                     {pct.toFixed(0)}%
                  </div>
                </div>

                <ProgressBar progress={pct} isWarn={pct > 80} isDanger={isOver}/>
                
                <div className="mt-6 pt-5 border-t border-[var(--border-color)] flex justify-between items-center">
                   <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Spent: ${spent.toLocaleString()}</span>
                   {isOver && (
                     <span className="text-[9px] font-black text-[var(--accent-danger)] uppercase animate-pulse flex items-center gap-1 tracking-widest">
                       <AlertTriangle size={12}/> Critical
                     </span>
                   )}
                </div>
              </div>
            );
          })}
        </div>

        <Modal isOpen={isOpen} onClose={() => this.setIsOpen(false)} title="New Envelope">
          <form onSubmit={this.handleAdd} className="space-y-6">
            <Input label="Envelope Name" placeholder="ENTER CATEGORY EX: RENT" value={form.categoryId} onChange={e => this.setState({ form: { ...form, categoryId: e.target.value } })} required/>
            <Input label="Monthly Limit Amount" type="number" placeholder="0.00" value={form.amount} onChange={e => this.setState({ form: { ...form, amount: e.target.value } })} required/>
            <Button fullWidth variant="primary" size="lg" className="py-5 text-sm uppercase tracking-[0.3em] font-black">Create Envelope</Button>
          </form>
        </Modal>
      </div>
    );
  }
}
;
