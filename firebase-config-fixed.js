// Firebase Configuration - معرض يعقوب
// هذا الملف يحتوي على إعدادات Firebase للتطبيق

// تأكد من تهيئة Firebase قبل الاستخدام
let firebaseApp = null;
let firebaseDatabase = null;
let firebaseAuth = null;

// دالة تهيئة Firebase
function initializeFirebase() {
    try {
        // إعدادات Firebase - استبدل هذه بإعداداتك الخاصة
        const firebaseConfig = {
            apiKey: "YOUR_API_KEY",
            authDomain: "YOUR_AUTH_DOMAIN",
            databaseURL: "YOUR_DATABASE_URL",
            projectId: "YOUR_PROJECT_ID",
            storageBucket: "YOUR_STORAGE_BUCKET",
            messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
            appId: "YOUR_APP_ID"
        };

        // تهيئة Firebase
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            firebaseDatabase = firebase.database();
            firebaseAuth = firebase.auth();
            console.log('✅ تم تهيئة Firebase بنجاح');
        } else {
            firebaseApp = firebase.app();
            firebaseDatabase = firebase.database();
            firebaseAuth = firebase.auth();
            console.log('✅ Firebase مهيأ مسبقاً');
        }

        return true;
    } catch (error) {
        console.error('❌ خطأ في تهيئة Firebase:', error);
        return false;
    }
}

// تهيئة تلقائية عند تحميل الملف
if (typeof firebase !== 'undefined') {
    initializeFirebase();
}

// تصدير الكائنات
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        firebaseApp,
        firebaseDatabase,
        firebaseAuth,
        initializeFirebase
    };
}
