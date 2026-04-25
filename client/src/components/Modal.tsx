import React from 'react';
import { X } from 'lucide-react';

// props for modal
interface ModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
}

// Modal component
export const Modal = (props: ModalProps) => {
  // console.log("modal rendered");
  // console.log(props.isOpen);

  // check if its open
  if (props.isOpen == false) {
    return null; // do nothing
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* this is the dark background */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={props.onClose} />
      
      {/* modal box */}
      <div className="relative w-full sm:max-w-lg bg-[#161B2E] border border-[#252D45] rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 z-10 animate-slideUp">
        <div className="w-10 h-1 bg-[#252D45] rounded-full mx-auto mb-6 sm:hidden" />
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">{props.title}</h2>
          
          {/* close button */}
          <button onClick={props.onClose} className="p-2 rounded-xl hover:bg-[#252D45] text-[#64748B] hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* put children here */}
        {props.children}
      </div>
    </div>
  );
};
