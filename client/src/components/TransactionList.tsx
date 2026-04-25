import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Trash2,
  Search
} from 'lucide-react';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  category?: { name: string };
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  hideSearch?: boolean;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, hideSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(tx => 
    tx.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h4 className="transaction-title">Recent Transactions</h4>
        {!hideSearch && (
          <div className="transaction-actions">
            <div className="search-bar">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="transaction-list">
        {filtered.length === 0 ? (
          <div className="empty-state">No transactions yet</div>
        ) : (
          filtered.map((tx) => (
            <div key={tx.id} className="transaction-item">
              <div className={`tx-icon ${tx.type === 'INCOME' ? 'income' : 'expense'}`}>
                {tx.type === 'INCOME' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              
              <div className="tx-details">
                <p className="tx-description">{tx.description || 'No description'}</p>
                <p className="tx-meta">
                  {new Date(tx.date).toLocaleDateString()} • {tx.category?.name || 'Uncategorized'}
                </p>
              </div>
              
              <div className="tx-amount-section">
                <p className={`tx-amount ${tx.type === 'INCOME' ? 'income' : 'expense'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                </p>
                {onDelete && (
                  <button className="tx-more" onClick={() => onDelete(tx.id)} style={{ color: '#ef4444' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
