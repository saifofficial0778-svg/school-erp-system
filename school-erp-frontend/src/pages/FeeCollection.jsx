import React, { useState, useEffect } from 'react';
import API from '../services/api';

const FeeCollection = () => {
  const [loading, setLoading] = useState(false);


  // Unified state layout for structured parsing
  const [studentInfo, setStudentInfo] = useState({
    id: '',
    name: '',
    totalBill: 0,
    amountPaid: 0,
    balance: 0
  });

  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');

  // 🔥 SAFE PARAMETERS EXTRACTION LIFECYCLE
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const sId = params.get('studentId') || '';
    const name = params.get('name') || 'Verified Student';

    // String ko clean Float numbers me transform karna mandatory h parse mapping ke liye
    const total = parseFloat(params.get('total')) || 0;
    const paid = parseFloat(params.get('paid')) || 0;
    const calculatedBalance = total - paid;

    setStudentInfo({
      id: sId,
      name: decodeURIComponent(name),
      totalBill: total,
      amountPaid: paid,
      balance: calculatedBalance >= 0 ? calculatedBalance : 0
    });
  }, []);

  // SQL transaction committer
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(collectAmount);

    if (!amount || amount <= 0) {
      return alert("Bhai, valid transactional collection amount value input karo!");
    }
    if (amount > studentInfo.balance) {
      return alert("Bhai, collection amount outstanding balance boundaries cross kar rhi h!");
    }

    try {
      setLoading(true);
      const nextPaidTotal = studentInfo.amountPaid + amount;
      const calculatedStatus = nextPaidTotal >= studentInfo.totalBill ? 'paid' : 'partially_paid';

      // Live payload model keys matching your fees table schema exactly
      const payload = {
        studentId: parseInt(studentInfo.id),
        amount_paid: amount,
        payment_mode: paymentMode,
        transaction_id: `TXN_${Date.now()}`
      };

      console.log("Committing robust audit entry to database node...", payload);
      const res = await API.post('/fees', payload);

      if (res?.data?.success) {
        alert("Fees transaction committed flawlessly! Ledger updated. 💳🎉");
        window.location.href = '/fee-management'; // Return to index page desk
      } else {
        alert("Backend server side integration error!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Payment registration submission rejection:", error.message);
      alert("Database rejection or constraints network drop issue!");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen font-sans">

      {/* Top Header Back links navigation routing alignment */}
      <div className="flex items-center space-x-2 text-xs font-bold border-b border-gray-200 pb-3">
        <button
          onClick={() => window.location.href = '/fee-management'}
          className="text-gray-400 hover:text-slate-800 transition-all cursor-pointer"
        >
          ⬅️ Back to Fee Ledger
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-purple-900 font-semibold">Active Transaction Terminal</span>
      </div>

      {/* 📊 PREMIUM ANALYTICS LEDGER BLOCKS (No More NaN Strings!) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Card 1: Total Fees */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Assigned Bill</span>
          <h4 className="text-2xl font-black text-slate-800 font-mono mt-1">
            ₹{studentInfo.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[10px] text-gray-400 mt-1">Full base fee tenure allocation</p>
        </div>

        {/* Card 2: Cumulative Amount Paid */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cumulative Amount Paid</span>
          <h4 className="text-2xl font-black text-emerald-600 font-mono mt-1">
            ₹{studentInfo.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[10px] text-gray-400 mt-1">Cleared transactions amount ledger</p>
        </div>

        {/* Card 3: Safe Outstanding Balance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Net Outstanding Dues</span>
          <h4 className="text-2xl font-black text-rose-600 font-mono mt-1">
            ₹{studentInfo.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </h4>
          <p className="text-[10px] text-gray-400 mt-1">Remaining pending dues checklist</p>
        </div>

      </div>

      {/* Interactive Operational Form Container Desk */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-xl">
        <div className="bg-purple-900 px-5 py-3.5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            💳 Cashier Desk Context : {studentInfo.name || "Loading Name..."}
          </h3>
        </div>

        <form onSubmit={handleTransactionSubmit} className="p-6 space-y-5 text-xs">

          {/* Amount Input */}
          <div>
            <label className="block text-gray-600 font-bold mb-1.5">Collection Amount (INR) *</label>
            <input
              type="number"
              step="any"
              placeholder="Enter numerical digits value e.g. 3500"
              value={collectAmount}
              onChange={(e) => setCollectAmount(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 px-3 py-2.5 rounded-xl focus:outline-none focus:border-purple-600 text-gray-800 font-mono text-sm shadow-inner transition-all"
              required
            />
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-gray-600 font-bold mb-1.5">Transaction Execution Mode *</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full bg-slate-50 border border-gray-200 px-3 py-2.5 rounded-xl font-bold focus:outline-none outline-none cursor-pointer text-gray-700 transition-all"
            >
              <option value="cash">Hard Cash Counter</option>
              <option value="online">Net Banking / UPI Gateway</option>
              <option value="cheque">Clearing House Cheque</option>
            </select>
          </div>

          {/* Footer Submit action items */}
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {loading ? "Processing Ledger..." : "⚡ Commit Transaction to SQL"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default FeeCollection;