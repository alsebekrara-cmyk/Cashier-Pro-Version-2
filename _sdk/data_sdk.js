/**
 * Data SDK - نظام إدارة البيانات المحلي
 * معرض يعقوب - شركة الإبداع الرقمي
 */

class DataSDK {
    constructor() {
        this.data = {};
        this.listeners = {};
        this.initialized = false;
    }

    /**
     * تهيئة SDK
     */
    async init(config = {}) {
        try {
            console.log('🔄 جاري تهيئة Data SDK...');
            
            // تحميل البيانات من localStorage
            this.loadFromLocalStorage();
            
            this.initialized = true;
            console.log('✅ تم تهيئة Data SDK بنجاح');
            
            return true;
        } catch (error) {
            console.error('❌ خطأ في تهيئة Data SDK:', error);
            return false;
        }
    }

    /**
     * تحميل البيانات من localStorage
     */
    loadFromLocalStorage() {
        try {
            const savedData = localStorage.getItem('dataSdk_data');
            if (savedData) {
                this.data = JSON.parse(savedData);
                console.log('✅ تم تحميل البيانات من localStorage');
            }
        } catch (error) {
            console.error('❌ خطأ في تحميل البيانات:', error);
            this.data = {};
        }
    }

    /**
     * حفظ البيانات في localStorage
     */
    saveToLocalStorage() {
        try {
            localStorage.setItem('dataSdk_data', JSON.stringify(this.data));
            console.log('✅ تم حفظ البيانات في localStorage');
        } catch (error) {
            console.error('❌ خطأ في حفظ البيانات:', error);
        }
    }

    /**
     * الحصول على قيمة
     */
    get(key) {
        return this.data[key];
    }

    /**
     * تعيين قيمة
     */
    set(key, value) {
        this.data[key] = value;
        this.saveToLocalStorage();
        this.notifyListeners(key, value);
        return value;
    }

    /**
     * حذف قيمة
     */
    delete(key) {
        delete this.data[key];
        this.saveToLocalStorage();
        this.notifyListeners(key, null);
    }

    /**
     * إضافة مستمع للتغييرات
     */
    on(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        this.listeners[key].push(callback);
    }

    /**
     * إزالة مستمع
     */
    off(key, callback) {
        if (this.listeners[key]) {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        }
    }

    /**
     * إشعار المستمعين
     */
    notifyListeners(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                try {
                    callback(value);
                } catch (error) {
                    console.error('❌ خطأ في استدعاء المستمع:', error);
                }
            });
        }
    }

    /**
     * إنشاء سجل جديد
     */
    create(collection, data) {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        
        const id = Date.now().toString();
        const record = { id, ...data, createdAt: new Date().toISOString() };
        
        this.data[collection].push(record);
        this.saveToLocalStorage();
        this.notifyListeners(collection, this.data[collection]);
        
        return record;
    }

    /**
     * قراءة سجلات
     */
    read(collection) {
        return this.data[collection] || [];
    }

    /**
     * تحديث سجل
     */
    update(collection, id, updates) {
        if (!this.data[collection]) {
            return null;
        }
        
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index === -1) {
            return null;
        }
        
        this.data[collection][index] = {
            ...this.data[collection][index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        
        this.saveToLocalStorage();
        this.notifyListeners(collection, this.data[collection]);
        
        return this.data[collection][index];
    }

    /**
     * حذف سجل
     */
    remove(collection, id) {
        if (!this.data[collection]) {
            return false;
        }
        
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index === -1) {
            return false;
        }
        
        this.data[collection].splice(index, 1);
        this.saveToLocalStorage();
        this.notifyListeners(collection, this.data[collection]);
        
        return true;
    }

    /**
     * مسح مجموعة
     */
    clear(collection) {
        if (collection) {
            this.data[collection] = [];
        } else {
            this.data = {};
        }
        this.saveToLocalStorage();
        this.notifyListeners(collection, this.data[collection]);
    }

    /**
     * إعادة تعيين كل شيء
     */
    reset() {
        this.data = {};
        this.listeners = {};
        localStorage.removeItem('dataSdk_data');
        console.log('✅ تم إعادة تعيين Data SDK');
    }
}

// إنشاء instance واحد
const dataSdk = new DataSDK();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataSdk;
}
