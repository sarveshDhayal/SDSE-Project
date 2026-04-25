import React, { useState, useEffect } from 'react';
import api from '../api';
import TransactionList from '../components/TransactionList';
import { 
  Search, 
  Filter, 
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'ALL',
    categoryId: 'ALL',
  });
  const [last30Days, setLast30Days] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchTransactions = async () => {
    try {
      let url = '/transactions';
      if (last30Days) {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        url += `?startDate=${d.toISOString()}`;
      }
      const res = await api.get(url);
      setTransactions(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [last30Days]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Failed to delete transaction', err);
    }
  };

  const handleExportCSV = () => {
    const header = "Date,Type,Category,Description,Amount\n";
    const csv = transactions.map((tx: any) => {
      const date = new Date(tx.date).toLocaleDateString();
      const type = tx.type;
      const cat = tx.category?.name || 'Uncategorized';
      const desc = (tx.description || '').replace(/"/g, '""');
      const amount = tx.amount;
      return `"${date}","${type}","${cat}","${desc}",${amount}`;
    }).join("\n");

    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch = (tx.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'ALL' || tx.type === filters.type;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="transactions-page">
      <header className="page-header">
        <div>
          <h1>Transaction History</h1>
          <p className="subtitle">Detailed view of all your recorded financial activities.</p>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary" onClick={handleExportCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <div className="table-controls">
        <div className="search-group">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <div className="filter-select">
            <Filter size={16} />
            <select 
              value={filters.type} 
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income Only</option>
              <option value="EXPENSE">Expenses Only</option>
            </select>
          </div>
          
          <button 
            className={`date-picker-btn ${last30Days ? 'active' : ''}`}
            onClick={() => setLast30Days(!last30Days)}
            style={last30Days ? { backgroundColor: 'var(--primary-color)', color: '#fff', borderColor: 'var(--primary-color)' } : {}}
          >
            <Calendar size={16} />
            <span>Last 30 Days</span>
          </button>
        </div>
      </div>

      <motion.div 
        className="transactions-grid-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <TransactionList transactions={paginatedTransactions} onDelete={handleDelete} hideSearch={true} />
        
        {/* Simple Pagination UI */}
        <div className="pagination">
          <p className="pagination-info">Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions</p>
          <div className="pagination-btns">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            ><ChevronLeft size={18} /></button>
            <button className="active">{currentPage}</button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            ><ChevronRight size={18} /></button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TransactionsPage;
