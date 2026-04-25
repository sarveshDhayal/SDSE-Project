import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, CreditCard, Tag, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    categoryId: '',
    type: 'EXPENSE',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/transactions', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        amount: '',
        description: '',
        categoryId: '',
        type: 'EXPENSE',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      alert('Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="transaction-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <div className="modal-header">
              <h3>Record Transaction</h3>
              <button onClick={onClose} className="close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="type-toggle">
                <button 
                  type="button"
                  className={`toggle-btn ${formData.type === 'EXPENSE' ? 'active expense' : ''}`}
                  onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                >
                  Expense
                </button>
                <button 
                  type="button"
                  className={`toggle-btn ${formData.type === 'INCOME' ? 'active income' : ''}`}
                  onClick={() => setFormData({...formData, type: 'INCOME'})}
                >
                  Income
                </button>
              </div>

              <div className="input-group">
                <label>Amount (₹)</label>
                <div className="input-wrapper">
                  <CreditCard size={18} />
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Category</label>
                <div className="input-wrapper select-container">
                  <Tag size={18} />
                  <select 
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <div className="select-arrow"></div>
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <div className="input-wrapper">
                  <FileText size={18} />
                  <input 
                    type="text" 
                    placeholder="What was this for?" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Date</label>
                <div className="input-wrapper">
                  <Calendar size={18} />
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <button type="submit" className="submit-btn highlight" disabled={submitting}>
                {submitting ? 'Saving...' : 'Confirm Transaction'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TransactionModal;
