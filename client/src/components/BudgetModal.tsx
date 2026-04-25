import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Target, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    period: 'MONTHLY',
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
      await api.post('/budgets', {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        amount: '',
        categoryId: '',
        period: 'MONTHLY',
      });
    } catch (err) {
      alert('Failed to save budget');
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
              <h3>Set New Budget</h3>
              <button onClick={onClose} className="close-btn"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="input-group">
                <label>Budget Limit (₹)</label>
                <div className="input-wrapper">
                  <Target size={18} />
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

              <button type="submit" className="submit-btn highlight" disabled={submitting}>
                {submitting ? 'Saving...' : 'Confirm Budget'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BudgetModal;
