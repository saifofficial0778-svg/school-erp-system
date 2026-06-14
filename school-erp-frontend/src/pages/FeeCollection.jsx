import { useState } from 'react';

const FeeCollectionWithReceipt = () => {
    // 1. Saved Students List
    const [studentsList] = useState([
        { id: 'S101', name: 'Aarav Sharma', class: '10th-A' },
        { id: 'S102', name: 'Isha Patel', class: '12th-B' },
        { id: 'S103', name: 'Kabir Verma', class: '9th-C' },
        { id: 'S104', name: 'Diya Nair', class: '11th-A' },
    ]);

    // 2. Transaction History List
    const [feeHistory, setFeeHistory] = useState([
        { id: 1, rollNo: 'S101', name: 'Aarav Sharma', amount: '5000', type: 'Cash', date: '2026-06-08' },
        { id: 2, rollNo: 'S102', name: 'Isha Patel', amount: '4500', type: 'Online', date: '2026-06-07' },
    ]);

    // 3. Form Input State
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        paymentType: 'Cash',
    });

    // 🚨 4. TODAY'S NEW STATE: Yeh dabba yaad rakhega ki abhi screen par kaunsi receipt preview ho rahi hai.
    // Isme hum default roop se history ka pehla record (Aarav ka) set kar rahe hain.
    const [selectedReceipt, setSelectedReceipt] = useState(feeHistory[0]);

    // CHUNK 1: Input Change Handler (Kal tumne dho dala tha isse)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 🛠️ CHUNK 2: Form Submit & Auto-Preview Logic
    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (formData.studentId === "" || formData.amount === "") {
            alert("bhai value to bhar mere bacche");
            return;
        }

        const studentObj = studentsList.find((student) => student.id === formData.studentId);

        const newLog = {
            id: Date.now(),
            rollNo: formData.studentId,
            name: studentObj.name,
            amount: formData.amount,
            type: formData.paymentType,
            date: '2026-06-09'
        };

        // Old Array me top par data insert kar diya
        setFeeHistory([newLog, ...feeHistory]);

        // 👇 BHAI, YAHAN APNA LOGIC LIKHO! (TASK 1)
        setSelectedReceipt(newLog);

        // Form Reset
        setFormData({ studentId: '', amount: '', paymentType: 'Cash' });
        alert("Fee Collected Successfully! 💸");
    };

    // 🛠️ CHUNK 3: Print Button Trigger
   const handlePrintReceipt = () => {
    // 1. Apni asli receipt card ka andar ka HTML nikal lo
    const receiptContent = document.getElementById('printable-receipt').innerHTML;
    
    // 2. Poore page ke body ka HTML backup lekar safe rakh lo
    const originalContent = document.body.innerHTML;

    // 3. Browser ki screen par sirf receipt ka content chada do
    document.body.innerHTML = receiptContent;

    // 4. Sarkaari print window khol do (Ab sirf receipt hi dikhegi toh wahi print hogi!)
    window.print();

    // 5. Print khatam hone ke baad, poora original page wapas load kar do
    document.body.innerHTML = originalContent;
    
    // Extra tip: html reload hone par state wapas lane ke liye page refresh mardenge
    window.location.reload();
  };

    return (
        <div className="space-y-8 p-4">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Fee Module — Invoice Center</h1>
                <p className="text-sm text-gray-500">Collect fees, preview premium receipts, and print instantly</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📥 LEFT COLUMN: Form Container */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit space-y-6">
                    <h2 className="text-lg font-bold text-gray-800 border-b pb-2">New Fee Receipt</h2>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Student</label>
                            <select
                                name="studentId"
                                value={formData.studentId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="">-- Choose Student --</option>
                                {studentsList.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {student.name} ({student.class})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 uppercase mb-2">Payment Mode</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="Cash"
                                        checked={formData.paymentType === 'Cash'}
                                        onChange={handleInputChange}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    💸 Cash
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentType"
                                        value="Online"
                                        checked={formData.paymentType === 'Online'}
                                        onChange={handleInputChange}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    🌐 Online
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors text-sm shadow-sm"
                        >
                            ➕ Collect Fee
                        </button>
                    </form>
                </div>

                {/* 📜 MIDDLE COLUMN: Today's Target — Receipt Preview Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[400px]">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-6">Live Receipt Preview</h2>

                        {/* Asli Receipt Card Structure */}
                        {selectedReceipt ? (
                            <div id="printable-receipt" className="border-2 border-dashed border-gray-200 rounded-xl p-5 bg-amber-50/20 space-y-4">
                                <div className="text-center border-b pb-3 border-gray-100">
                                    <h3 className="font-bold text-slate-800 tracking-wide uppercase text-sm">🍁 GLOBAL PUBLIC SCHOOL</h3>
                                    <p className="text-[10px] text-gray-400 font-mono">INVOICE SEC-D9 / OFFICIAL</p>
                                </div>

                                {/* Receipt Details fields mapping data */}
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Transaction ID:</span>
                                        <span className="font-mono font-semibold text-gray-700">{selectedReceipt.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Roll Number:</span>
                                        <span className="font-semibold text-gray-800">{selectedReceipt.rollNo}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Student Name:</span>
                                        <span className="font-bold text-slate-900">{selectedReceipt.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Payment Mode:</span>
                                        <span className="font-semibold text-indigo-600">{selectedReceipt.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="font-mono text-gray-600">{selectedReceipt.date}</span>
                                    </div>
                                    <hr className="border-gray-100 my-2" />
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-sm font-bold text-gray-700">Total Paid:</span>
                                        <span className="text-lg font-black text-emerald-600">₹{selectedReceipt.amount}</span>
                                    </div>
                                </div>

                                <div className="text-center pt-4 border-t border-dotted border-gray-200">
                                    <p className="text-[10px] text-emerald-600 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded">✓ Verified Electronic Copy</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-12">No transaction selected for preview</p>
                        )}
                    </div>

                    {/* Print Button Actuator */}
                    <button
                        onClick={handlePrintReceipt}
                        disabled={!selectedReceipt}
                        className="w-full mt-4 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 rounded-lg transition-colors text-sm shadow-sm disabled:opacity-50"
                    >
                        🖨️ Print Official Receipt
                    </button>
                </div>

                {/* 📊 RIGHT COLUMN: History Table with Row Selection */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-md font-bold text-gray-800">Logs (Click to view)</h2>
                    </div>

                    <div className="overflow-x-auto text-xs">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 text-slate-500 uppercase font-semibold border-b border-gray-100">
                                    <th className="px-4 py-2.5">Student Name</th>
                                    <th className="px-4 py-2.5">Amount</th>
                                    <th className="px-4 py-2.5">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {feeHistory.map((log) => (
                                    <tr
                                        key={log.id}
                                        onClick={() => setSelectedReceipt(log)} // 🔥 Remote control yahan laga diya!
                                        className={`cursor-pointer transition-colors ${selectedReceipt?.id === log.id ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="px-4 py-3 font-medium text-gray-900">{log.name}</td>
                                        <td className="px-4 py-3 font-semibold text-emerald-600">₹{log.amount}</td>
                                        <td className="px-4 py-3">
                                            <button className="text-[10px] text-blue-600 font-medium hover:underline">Preview</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FeeCollectionWithReceipt;