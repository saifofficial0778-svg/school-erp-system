import { useState, useEffect } from 'react';
import { collectStudentFee } from '../services/api';
import API from '../services/api';


const FeeCollection = () => {

    const [feeList, setFeeList] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 📝 FORM STATES (Input fields ke liye) ---
    const [rollNo, setRollNo] = useState('');
    const [feeType, setFeeType] = useState('Tuition Fee');
    const [amount, setAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('Cash');

    // --- 🛠️ CHUNK 1: useEffect (GET Real Data From Server) ---
    useEffect(() => {

        const loadFeeData = async () => {
            try {
                setLoading(true);

                const res = await API.get('/fees');

                // Safe-guard lagate hain jaise kal bacho ke liye lagaya tha
                if (res && res.data && Array.isArray(res.data.data)) {
                    setFeeList(res.data.data); // 🎯 Ekdum correct targeting!
                } else if (res && res.data && Array.isArray(res.data)) {
                    setFeeList(res.data);
                } else if (res && Array.isArray(res)) {
                    setFeeList(res);
                } else {
                    setFeeList([]);
                }

                setLoading(false)
            } catch (error) {
                console.error("Data load nhi ho rha hai")
                setFeeList([])
                setLoading(false)
            }

        }
        loadFeeData();
    }, []);


    // --- 🛠️ CHUNK 2: Handle Fee Submit (POST Request logic) ---
    const handleFeeSubmit = async (e) => {
        e.preventDefault();
        
        if(!rollNo || !amount )  return alert("Saari fields bharo bhai!");
        try{
            const newFeePayload={
                studentId:parseInt(rollNo),
                feeType:feeType,
                amountPaid:parseInt(amount),
                status:"Paid",
                paymentMode:paymentMode
            };
            console.log("Sending clean fee payload...", newFeePayload);

            await API.post('/fees',newFeePayload)
           setFeeList((prev) => [...(prev || []), newFeePayload]);
            setAmount("")
            setRollNo("")
            alert("Fees chadh gayi boss! 🎉🔥");
        }catch(error){
            console.log("Transaction fail ho gayi bhai:", error)
            alert("Kuch gadbad hui, check backend console!")
        }
    };

    return (
        <div className="space-y-6 p-4">
            {/* 💳 Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Fee Management & Connect</h1>
                <p className="text-sm text-gray-500">Live ledger integration with school financial database</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 📋 LEFT SIDE: COLLECT FEE FORM */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">💰 Collect New Fee</h2>

                    <form onSubmit={handleFeeSubmit} className="space-y-4">

                        {/* 1. Student ID / Roll No */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Student ID / Roll No</label>
                            <input
                                type="text"
                                placeholder="e.g. 1"
                                value={rollNo}
                                onChange={(e) => setRollNo(e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* 2. Fee Type (Name field ko humne change kar diya!) */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Fee Type</label>
                            <select
                                value={feeType} 
                                onChange={(e) => setFeeType(e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="Tuition Fee">📚 Tuition Fee</option>
                                <option value="Exam Fee">📝 Exam Fee</option>
                                <option value="Transport Fee">🚌 Transport Fee</option>
                                <option value="Library Fee">📖 Library Fee</option>
                            </select>
                        </div>

                        {/* 3. Amount Paid */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Amount Paid (₹)</label>
                            <input
                                type="number"
                                placeholder="e.g. 5000"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* 4. Payment Mode */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Payment Mode</label>
                            <select
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                                className="w-full bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="Cash">💵 Cash</option>
                                <option value="Online">📱 UPI / Online</option>
                                <option value="Cheque">🏦 Bank Cheque</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm"
                        >
                            🎯 Confirm & Submit Transaction
                        </button>
                    </form>
                </div>

                {/* 📊 RIGHT SIDE: LIVE TRANSACTION TABLE */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-3.5">Student ID</th>
                                    <th className="px-6 py-3.5">Fee Type</th>
                                    <th className="px-6 py-3.5">Amount Paid</th>
                                    <th className="px-6 py-3.5">Mode</th>
                                    <th className="px-6 py-3.5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">

                                {!feeList || feeList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                            No transactions found on server database.
                                        </td>
                                    </tr>
                                ) : (
                                    feeList.map((fee, index) => (
                                        <tr key={fee.feeId || index} className="hover:bg-slate-50/50 transition-colors">
                                            {/* 1. Student ID */}
                                            <td className="px-6 py-4 font-mono text-xs font-bold text-gray-500">
                                                {fee.studentId}
                                            </td>

                                            {/* 2. Fee Type */}
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                {fee.feeType}
                                            </td>

                                            {/* 3. Amount Paid */}
                                            <td className="px-6 py-4 text-emerald-600 font-bold">
                                                ₹{fee.amountPaid}
                                            </td>

                                            {/* 4. Payment Mode */}
                                            <td className="px-6 py-4 font-medium text-gray-600">
                                                {fee.paymentMode || "Cash"}
                                            </td>

                                            {/* 5. Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${fee.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {fee.status || "Paid"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FeeCollection;