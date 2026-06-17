let feesRecords = [
    { 
      feeId: 101, 
      studentId: 1, 
      amountPaid: 5000, 
      feeType: "Tuition Fee", 
      paymentMode: "Cash",      // 👈 Naya column data jadd diya
      status: "Paid", 
      date: "2026-06-10" 
    },
    { 
      feeId: 102, 
      studentId: 2, 
      amountPaid: 5000, 
      feeType: "Tuition Fee", 
      paymentMode: "Online",    // 👈 Naya column data jadd diya
      status: "Paid", 
      date: "2026-06-10" 
    }
];

module.exports = feesRecords;