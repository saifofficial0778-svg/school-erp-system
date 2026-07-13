import React, { useState, useEffect } from 'react';
import API from '../services/api';

const FeeCollection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null); // holds receipt data after successful payment

  const [studentInfo, setStudentInfo] = useState({
    id: '',
    name: '',
    totalBill: 0,
    amountPaid: 0,
    balance: 0
  });

  const [collectAmount, setCollectAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const sId = params.get('studentId') || '';
    const name = params.get('name') || 'Verified Student';

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

  const quickAmounts = [
    { label: '25%', value: Math.round(studentInfo.balance * 0.25) },
    { label: '50%', value: Math.round(studentInfo.balance * 0.5) },
    { label: 'Full', value: studentInfo.balance },
  ];

  const paymentMethods = [
    { id: 'cash', label: 'Cash Counter', icon: '💵', sub: 'Hard cash payment' },
    { id: 'online', label: 'UPI / Net Banking', icon: '📲', sub: 'Digital transfer' },
    { id: 'cheque', label: 'Cheque', icon: '🧾', sub: 'Clearing house' },
  ];

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
      const txnId = `TXN_${Date.now()}`;

      const payload = {
        studentId: parseInt(studentInfo.id),
        amount_paid: amount,
        payment_mode: paymentMode,
        transaction_id: txnId
      };

      const res = await API.post('/fees', payload);

      if (res?.data?.success) {
        // ✅ Show an on-screen receipt instead of an alert + hard redirect
        setSuccess({
          amount,
          txnId,
          mode: paymentMode,
          newBalance: studentInfo.balance - amount,
          status: calculatedStatus
        });
      } else {
        alert("Backend server side integration error!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Payment registration submission rejection:", error.message);
      alert(error.response?.data?.message || "Database rejection or constraints network drop issue!");
      setLoading(false);
    }
  };

  const collectionRate = studentInfo.totalBill > 0
    ? Math.round((studentInfo.amountPaid / studentInfo.totalBill) * 100)
    : 0;

  // ✅ SUCCESS / RECEIPT VIEW
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/40 flex items-center justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white">Payment Successful</h2>
            <p className="text-emerald-100 text-xs mt-1">Transaction committed to ledger</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Student</span>
              <span className="font-bold text-slate-800">{studentInfo.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Amount Paid</span>
              <span className="font-black text-emerald-600 font-mono text-lg">₹{success.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Payment Mode</span>
              <span className="font-bold text-slate-700 capitalize">{success.mode}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Transaction ID</span>
              <span className="font-mono text-slate-500 text-xs">{success.txnId}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t border-dashed border-gray-200">
              <span className="text-gray-400">Remaining Balance</span>
              <span className={`font-black font-mono ${success.newBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                ₹{success.newBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => window.location.href = '/fees'}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all mt-2"
            >
              Back to Fee Ledger
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50/40 min-h-screen font-sans">

      {/* 🎯 HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 p-8 shadow-xl">
        <div className="absolute -top-16 -right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl"></div>

        <div className="relative flex items-center gap-4">
          {/* ✅ FIX: '/fee-management' route exist nahi karti, sahi route '/fees' hai */}
          <button
            onClick={() => window.location.href = '/fees'}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            ← Back to Fee Ledger
          </button>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-widest mb-1">
              Cashier Desk
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Collect Fee Payment</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT: Student bill summary */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black shadow-sm">
                {(studentInfo.name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-800">{studentInfo.name || 'Loading...'}</p>
                <p className="text-[11px] text-gray-400">Student ID #{studentInfo.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Fee Assigned</span>
                <span className="font-bold text-slate-800 font-mono">₹{studentInfo.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount Already Paid</span>
                <span className="font-bold text-emerald-600 font-mono">₹{studentInfo.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-dashed border-gray-200">
                <span className="text-gray-500 font-semibold">Outstanding Balance</span>
                <span className="font-black text-rose-600 font-mono text-lg">₹{studentInfo.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                <span>Collection Progress</span>
                <span>{collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">💳 New Transaction</h3>
            </div>

            <form onSubmit={handleTransactionSubmit} className="p-6 space-y-6">

              {/* Amount input with quick-select chips */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Collection Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Enter amount e.g. 3500"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-mono text-lg font-bold transition-all"
                  required
                />
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map(q => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setCollectAmount(q.value)}
                      disabled={q.value <= 0}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      {q.label} (₹{q.value.toLocaleString('en-IN')})
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment method cards */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMode(method.id)}
                      className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                        paymentMode === method.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{method.icon}</div>
                      <p className={`text-[11px] font-bold ${paymentMode === method.id ? 'text-emerald-700' : 'text-slate-600'}`}>{method.label}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">{method.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-300 disabled:to-slate-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>⚡ Commit Transaction</>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeeCollection; 