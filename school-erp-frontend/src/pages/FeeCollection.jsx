import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const FeeCollection = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const receiptRef = useRef(null);

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
    { id: 'cash', label: 'Cash' },
    { id: 'online', label: 'UPI / Net Banking' },
    { id: 'cheque', label: 'Cheque' },
  ];

  // Amount to words (Indian numbering) — for the receipt, like a real fee slip
  const numberToWords = (num) => {
    if (!num || num <= 0) return 'Zero';
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
    };

    return inWords(Math.round(num));
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(collectAmount);

    if (!amount || amount <= 0) {
      return alert("Please enter a valid collection amount.");
    }
    if (amount > studentInfo.balance) {
      return alert("Collection amount exceeds the outstanding balance.");
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
        setSuccess({
          amount,
          txnId,
          mode: paymentMode,
          newBalance: studentInfo.balance - amount,
          status: calculatedStatus,
          date: new Date()
        });
      } else {
        alert("Server error while recording the transaction.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Payment registration submission rejection:", error.message);
      alert(error.response?.data?.message || "Could not process the transaction. Please try again.");
      setLoading(false);
    }
  };

  const collectionRate = studentInfo.totalBill > 0
    ? Math.round((studentInfo.amountPaid / studentInfo.totalBill) * 100)
    : 0;

  const handlePrint = () => window.print();

  // ══════════════════════════════════════════════════
  // ✅ RECEIPT VIEW — plain black & white printed slip
  // ══════════════════════════════════════════════════
  if (success) {
    const receiptNo = success.txnId.replace('TXN_', 'RCPT-');
    const formattedDate = success.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const formattedTime = success.date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4 print:bg-white print:p-0">

        {/* Screen-only action bar */}
        <div className="w-full max-w-[620px] flex justify-between items-center mb-4 print:hidden">
          <button
            onClick={() => window.location.href = '/fees'}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-4 py-2 bg-white"
          >
            ← Back to Fee Ledger
          </button>
          <button
            onClick={handlePrint}
            className="text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded px-5 py-2"
          >
            Print Receipt
          </button>
        </div>

        {/* PRINTABLE RECEIPT — pure black & white, bordered, formal */}
        <div
          ref={receiptRef}
          className="w-full max-w-[620px] bg-white border-2 border-black text-black font-mono text-[13px] print:border-black print:shadow-none"
        >
          {/* Header */}
          <div className="text-center border-b-2 border-black py-4 px-6">
            <p className="text-lg font-bold tracking-wide uppercase">School ERP System</p>
            <p className="text-[11px] mt-0.5">123 Academic Road, Your City — 000000</p>
            <p className="text-[15px] font-bold mt-3 uppercase tracking-widest">Fee Payment Receipt</p>
          </div>

          {/* Receipt meta */}
          <div className="grid grid-cols-2 border-b border-black text-[12px]">
            <div className="px-6 py-2 border-r border-black">
              <span className="text-slate-600">Receipt No.:</span> <strong>{receiptNo}</strong>
            </div>
            <div className="px-6 py-2">
              <span className="text-slate-600">Date:</span> <strong>{formattedDate}, {formattedTime}</strong>
            </div>
          </div>

          {/* Student details */}
          <div className="px-6 py-4 border-b border-black space-y-1.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-slate-600">Student Name</span>
              <strong>{studentInfo.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Student ID</span>
              <strong>#{studentInfo.id}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Payment Mode</span>
              <strong className="capitalize">{success.mode}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Transaction ID</span>
              <strong>{success.txnId}</strong>
            </div>
          </div>

          {/* Amount table */}
          <table className="w-full text-[13px] border-b border-black">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left px-6 py-2 font-semibold">Particulars</th>
                <th className="text-right px-6 py-2 font-semibold">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dashed border-black">
                <td className="px-6 py-2">Total Fee Assigned</td>
                <td className="text-right px-6 py-2">{studentInfo.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-dashed border-black">
                <td className="px-6 py-2">Previously Paid</td>
                <td className="text-right px-6 py-2">{studentInfo.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="border-b border-dashed border-black font-bold">
                <td className="px-6 py-2">Amount Paid Now</td>
                <td className="text-right px-6 py-2">{success.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr className="font-bold">
                <td className="px-6 py-2">Balance Due</td>
                <td className="text-right px-6 py-2">{success.newBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>

          {/* Amount in words */}
          <div className="px-6 py-3 border-b border-black text-[12px]">
            <span className="text-slate-600">Amount in words:</span>{' '}
            <strong>Rupees {numberToWords(success.amount)} Only</strong>
          </div>

          {/* Status stamp */}
          <div className="px-6 py-3 border-b border-black flex justify-between items-center text-[12px]">
            <span className="text-slate-600">Payment Status</span>
            <span className="border-2 border-black px-3 py-0.5 font-bold uppercase tracking-wider text-[11px]">
              {success.status === 'paid' ? 'Fully Paid' : 'Partially Paid'}
            </span>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 text-[12px] px-6 py-8">
            <div>
              <div className="border-t border-black w-32 pt-1">Received By</div>
            </div>
            <div className="text-right">
              <div className="border-t border-black w-32 pt-1 ml-auto">Authorized Signatory</div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 border-t border-black py-2">
            This is a computer-generated receipt and does not require a physical signature.
          </div>
        </div>

        {/* Print-only styling */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .print\\:bg-white, .print\\:bg-white * { visibility: visible; }
            .print\\:bg-white { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  // MAIN PAGE — clean, formal, Tally-style
  // ══════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50 font-sans">

      {/* Formal top bar — no gradients, no glow */}
      <div className="bg-white border-b border-slate-300 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/fees'}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded px-3 py-1.5"
          >
            ← Back
          </button>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Accounts / Fee Collection</p>
            <h1 className="text-lg font-bold text-slate-900">Collect Fee Payment</h1>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Voucher Date</p>
          <p className="font-semibold text-slate-700">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* LEFT: Ledger summary — table style, not cards */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-300 rounded-sm">
            <div className="border-b border-slate-300 px-5 py-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Party Details</p>
            </div>
            <div className="px-5 py-4 border-b border-slate-200">
              <p className="font-bold text-slate-900 text-base">{studentInfo.name || 'Loading...'}</p>
              <p className="text-xs text-slate-400 mt-0.5">Student ID: #{studentInfo.id}</p>
            </div>

            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-5 py-2.5 text-slate-500">Total Fee Assigned</td>
                  <td className="px-5 py-2.5 text-right font-mono font-semibold text-slate-800">
                    ₹{studentInfo.totalBill.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-5 py-2.5 text-slate-500">Amount Already Paid</td>
                  <td className="px-5 py-2.5 text-right font-mono font-semibold text-slate-800">
                    ₹{studentInfo.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="px-5 py-3 text-slate-700 font-semibold">Outstanding Balance</td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-slate-900 text-base">
                    ₹{studentInfo.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="px-5 py-4 border-t border-slate-200">
              <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                <span>Collection Progress</span>
                <span>{collectionRate}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5">
                <div
                  className="h-full bg-slate-800"
                  style={{ width: `${Math.min(collectionRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Payment voucher form */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-slate-300 rounded-sm">
            <div className="border-b border-slate-300 px-5 py-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Payment Voucher</p>
            </div>

            <form onSubmit={handleTransactionSubmit} className="p-5 space-y-5">

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Collection Amount (₹)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2.5 text-slate-900 font-mono text-lg focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-400"
                  required
                />
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map(q => (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setCollectAmount(q.value)}
                      disabled={q.value <= 0}
                      className="text-[11px] font-semibold px-3 py-1 border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {q.label} (₹{q.value.toLocaleString('en-IN')})
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Payment Mode</label>
                <div className="border border-slate-300 divide-y divide-slate-200">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="radio"
                        name="paymentMode"
                        checked={paymentMode === method.id}
                        onChange={() => setPaymentMode(method.id)}
                        className="w-4 h-4 accent-slate-800"
                      />
                      <span className="text-sm text-slate-700">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-semibold py-3 transition-all"
              >
                {loading ? "Processing..." : "Commit Transaction"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeeCollection;