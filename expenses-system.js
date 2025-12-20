/**
 * Expenses System - نظام المصروفات
 * معرض يعقوب - شركة الإبداع الرقمي
 */

// نظام المصروفات - يتم دمجه مع index.html
console.log('✅ تم تحميل نظام المصروفات');

// دالة لإضافة مصروف
function addExpense(expenseData) {
    console.log('➕ إضافة مصروف جديد');
    // المزيد من الوظائف...
}

// دالة لحساب إجمالي المصروفات
function calculateTotalExpenses(startDate, endDate) {
    console.log('🧮 حساب إجمالي المصروفات');
    // المزيد من الوظائف...
}

// تصدير الدوال
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addExpense,
        calculateTotalExpenses
    };
}
