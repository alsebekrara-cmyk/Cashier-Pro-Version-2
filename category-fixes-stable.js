/**
 * ========================================
 * إصلاح مستقر: التصنيفات في نافذة التعديل
 * نسخة محسّنة بدون وميض أو تحديثات متكررة
 * Digital Creativity Company - نظام يعقوب POS
 * الإصدار: 2.0.6 (مستقر)
 * ========================================
 * 
 * الإصلاحات:
 * ✅ إصلاح عدم ظهور التصنيفات في نافذة التعديل
 * ✅ إزالة الوميض المتكرر للمنتجات
 * ✅ إصلاح حفظ التصنيفات الجديدة
 * ✅ منع حلقات التحديث اللانهائية
 * 
 * يجب تحميل هذا الملف بعد ملف products-fixes.js
 */

(function() {
    'use strict';
    
    console.log('🔧 تحميل إصلاح التصنيفات المستقر (v2.0.6)...');
    
    // ==================== متغيرات التحكم لمنع التحديث المتكرر ====================
    
    let isUpdating = false;           // flag لمنع التحديث المتزامن
    let updateTimeout = null;         // للتحكم في التأخير
    let lastUpdateTime = 0;           // آخر وقت تحديث
    const UPDATE_DELAY = 500;         // تأخير بين التحديثات (ميلي ثانية)
    const MIN_UPDATE_INTERVAL = 2000; // الحد الأدنى بين التحديثات (ميلي ثانية)
    
    // ==================== دالة ملء قائمة التصنيفات المحسّنة ====================
    
    /**
     * ملء جميع قوائم التصنيفات مع منع التحديث المتكرر
     * @param {boolean} force - إجبار التحديث حتى لو كان هناك تحديث جاري
     * @returns {boolean} نجاح العملية
     */
    window.populateCategorySelects = function(force = false) {
        // ⭐ منع التحديث المتكرر
        const now = Date.now();
        
        // إذا كان هناك تحديث جاري ولم نجبر التحديث، تخطى
        if (isUpdating && !force) {
            console.log('⏸️ تحديث جاري بالفعل، تم التخطي');
            return false;
        }
        
        // إذا مر وقت قصير جداً منذ آخر تحديث، تخطى
        if (!force && (now - lastUpdateTime) < MIN_UPDATE_INTERVAL) {
            console.log('⏸️ تحديث حديث جداً، تم التخطي');
            return false;
        }
        
        isUpdating = true;
        lastUpdateTime = now;
        
        console.log('📋 ملء قوائم التصنيفات...');
        
        try {
            // قائمة جميع select elements للتصنيفات
            const selects = [
                'productCategory',      // نموذج إضافة منتج جديد
                'editProductCategory',  // نموذج تعديل المنتج ⭐
                'inventoryCategory'     // فلترة المخزون
            ];
            
            let successCount = 0;
            
            selects.forEach(selectId => {
                const select = document.getElementById(selectId);
                
                if (!select) {
                    return; // تخطي بهدوء
                }
                
                // حفظ القيمة الحالية
                const currentValue = select.value;
                
                // بناء الخيارات
                let optionsHtml = '';
                
                // خيار افتراضي حسب نوع القائمة
                if (selectId === 'inventoryCategory') {
                    optionsHtml = '<option value="all">جميع التصنيفات</option>';
                } else {
                    optionsHtml = '<option value="">اختر التصنيف</option>';
                }
                
                // إضافة جميع التصنيفات
                if (window.categories && Array.isArray(window.categories)) {
                    window.categories.forEach(category => {
                        const selected = currentValue === category.category_id ? 'selected' : '';
                        optionsHtml += `<option value="${category.category_id}" ${selected}>${category.category_name}</option>`;
                    });
                    
                    successCount++;
                }
                
                // تحديث محتوى القائمة
                select.innerHTML = optionsHtml;
                
                // استعادة القيمة الحالية
                if (currentValue && currentValue !== '') {
                    select.value = currentValue;
                }
            });
            
            console.log(`✅ تم ملء ${successCount} قائمة بنجاح`);
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في ملء قوائم التصنيفات:', error);
            return false;
        } finally {
            // السماح بالتحديث القادم بعد تأخير قصير
            setTimeout(() => {
                isUpdating = false;
            }, 100);
        }
    };
    
    // ==================== دالة التحديث المؤجل (Debounced Update) ====================
    
    /**
     * تحديث مؤجل لمنع التحديثات المتكررة
     */
    function debouncedUpdate() {
        // إلغاء أي تحديث مؤجل سابق
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }
        
        // جدولة تحديث جديد
        updateTimeout = setTimeout(() => {
            if (typeof window.populateCategorySelects === 'function') {
                window.populateCategorySelects(false); // بدون إجبار
            }
            updateTimeout = null;
        }, UPDATE_DELAY);
    }
    
    // ==================== دالة فتح نافذة التعديل المحسّنة ====================
    
    /**
     * فتح نافذة تعديل المنتج مع ملء التصنيفات
     * @param {string} productId - معرف المنتج
     */
    window.showEditProductModal = function(productId) {
        console.log('✏️ فتح نافذة تعديل المنتج:', productId);
        
        try {
            // البحث عن المنتج
            const product = window.products ? window.products.find(p => p.product_id === productId) : null;
            
            if (!product) {
                console.error('❌ المنتج غير موجود:', productId);
                if (typeof showToast === 'function') {
                    showToast('المنتج غير موجود', 'error');
                }
                return false;
            }
            
            // ⭐ ملء قائمة التصنيفات أولاً (بالإجبار)
            if (typeof window.populateCategorySelects === 'function') {
                window.populateCategorySelects(true); // إجبار التحديث
                console.log('✅ تم ملء قائمة التصنيفات');
            }
            
            // ملء جميع حقول النموذج
            const fields = {
                'editProductId': productId,
                'editProductName': product.product_name || '',
                'editProductBarcode': product.product_barcode || '',
                'editProductSupplier': product.supplier || '',
                'editProductCostRetail': product.product_cost_retail || 0,
                'editProductCostWholesale': product.product_cost_wholesale || product.product_cost_retail || 0,
                'editProductPriceRetail': product.product_price_retail || 0,
                'editProductPriceWholesale': product.product_price_wholesale || product.product_price_retail || 0,
                'editProductStock': product.stock_quantity || 0,
                'editProductMinStock': product.min_stock || 0
            };
            
            // تعبئة كل حقل
            Object.keys(fields).forEach(fieldId => {
                const element = document.getElementById(fieldId);
                if (element) {
                    element.value = fields[fieldId];
                }
            });
            
            // ⭐ تعيين التصنيف بعد ملء القائمة
            const categorySelect = document.getElementById('editProductCategory');
            if (categorySelect && product.product_category) {
                // المحاولة الأولى: فورية
                categorySelect.value = product.product_category;
                
                // المحاولة الثانية: بعد تأخير قصير
                setTimeout(() => {
                    if (product.product_category) {
                        categorySelect.value = product.product_category;
                        console.log('✅ تم تعيين التصنيف:', product.product_category);
                    }
                }, 100);
            }
            
            // فتح النافذة
            if (typeof showModal === 'function') {
                showModal('editProductModal');
                console.log('✅ تم فتح نافذة التعديل بنجاح');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ خطأ في فتح نافذة التعديل:', error);
            if (typeof showToast === 'function') {
                showToast('حدث خطأ في فتح نافذة التعديل', 'error');
            }
            return false;
        }
    };
    
    // ==================== تحديث ذكي عند تحميل البيانات فقط ====================
    
    /**
     * ربط تحديث التصنيفات مع تحميل البيانات فقط
     * (بدون ربط مع onDataChanged لتجنب الحلقات اللانهائية)
     */
    function setupSmartUpdate() {
        console.log('🔄 إعداد التحديث الذكي...');
        
        try {
            // ⭐ الربط فقط مع loadAllData (عند تحميل البيانات من القاعدة)
            if (window.dataSdk && typeof window.dataSdk.loadAllData === 'function') {
                const originalLoadAll = window.dataSdk.loadAllData.bind(window.dataSdk);
                
                window.dataSdk.loadAllData = async function() {
                    const result = await originalLoadAll();
                    
                    // تحديث مؤجل لتجنب الوميض
                    debouncedUpdate();
                    
                    return result;
                };
                
                console.log('✅ تم ربط التحديث مع تحميل البيانات');
            }
            
            // ⭐ لا نربط مع onDataChanged لأنه يسبب تحديثات متكررة!
            // ⭐ لا نستخدم setInterval لأنه يسبب وميض!
            // ⭐ لا نربط مع create/delete لأنه يسبب حلقات لانهائية!
            
            console.log('✅ تم إعداد التحديث الذكي بنجاح');
            
        } catch (error) {
            console.error('❌ خطأ في إعداد التحديث:', error);
        }
    }
    
    // تفعيل التحديث الذكي
    setupSmartUpdate();
    
    // ==================== تحديث أولي واحد فقط عند التحميل ====================
    
    // ملء التصنيفات مرة واحدة عند التحميل
    setTimeout(() => {
        if (typeof window.populateCategorySelects === 'function') {
            window.populateCategorySelects(true); // إجبار التحديث الأول
            console.log('✅ تم الملء الأولي للتصنيفات');
        }
    }, 1000);
    
    // ==================== إصلاح حفظ التصنيفات الجديدة ====================
    
    /**
     * تحسين حفظ التصنيفات الجديدة
     */
    function fixCategorySaving() {
        console.log('💾 إصلاح حفظ التصنيفات...');
        
        // البحث عن نموذج إضافة تصنيف
        const categoryForm = document.getElementById('addCategoryForm');
        
        if (categoryForm) {
            // إزالة أي event listeners قديمة
            const newForm = categoryForm.cloneNode(true);
            categoryForm.parentNode.replaceChild(newForm, categoryForm);
            
            // إضافة event listener جديد
            newForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                console.log('💾 محاولة حفظ التصنيف...');
                
                try {
                    const categoryName = document.getElementById('categoryName');
                    
                    if (!categoryName || !categoryName.value.trim()) {
                        if (typeof showToast === 'function') {
                            showToast('الرجاء إدخال اسم التصنيف', 'error');
                        }
                        return false;
                    }
                    
                    const newCategory = {
                        type: 'category',
                        category_id: 'cat_' + Date.now(),
                        category_name: categoryName.value.trim(),
                        created_at: new Date().toISOString(),
                        created_by: window.currentUser?.username || 'admin'
                    };
                    
                    console.log('📦 بيانات التصنيف:', newCategory);
                    
                    // حفظ في قاعدة البيانات
                    if (window.dataSdk && typeof window.dataSdk.create === 'function') {
                        const result = await window.dataSdk.create(newCategory);
                        
                        if (result.isOk) {
                            console.log('✅ تم حفظ التصنيف بنجاح');
                            
                            // إضافة للمصفوفة المحلية
                            if (window.categories && Array.isArray(window.categories)) {
                                window.categories.push(newCategory);
                            }
                            
                            // تحديث القوائم
                            setTimeout(() => {
                                if (typeof window.populateCategorySelects === 'function') {
                                    window.populateCategorySelects(true);
                                }
                            }, 300);
                            
                            // مسح النموذج
                            categoryName.value = '';
                            
                            // إغلاق النافذة
                            if (typeof closeModal === 'function') {
                                closeModal('addCategoryModal');
                            }
                            
                            // رسالة نجاح
                            if (typeof showToast === 'function') {
                                showToast('تم إضافة التصنيف بنجاح', 'success');
                            }
                            
                            // تحديث الإحصائيات
                            if (typeof updateAllViews === 'function') {
                                setTimeout(() => updateAllViews(), 500);
                            }
                            
                        } else {
                            console.error('❌ فشل حفظ التصنيف:', result.error);
                            if (typeof showToast === 'function') {
                                showToast('فشل حفظ التصنيف: ' + result.error, 'error');
                            }
                        }
                    } else {
                        console.error('❌ dataSdk.create غير موجود');
                        if (typeof showToast === 'function') {
                            showToast('خطأ في النظام', 'error');
                        }
                    }
                    
                } catch (error) {
                    console.error('❌ خطأ في حفظ التصنيف:', error);
                    if (typeof showToast === 'function') {
                        showToast('حدث خطأ أثناء الحفظ', 'error');
                    }
                }
                
                return false;
            });
            
            console.log('✅ تم إصلاح حفظ التصنيفات');
        } else {
            console.warn('⚠️ نموذج addCategoryForm غير موجود');
        }
    }
    
    // تطبيق إصلاح حفظ التصنيفات بعد تحميل الصفحة
    setTimeout(() => {
        fixCategorySaving();
    }, 1500);
    
    // ==================== منع التحديثات المتعددة عند فتح الصفحة ====================
    
    /**
     * منع updateAllViews من التسبب في وميض
     */
    function preventFlickering() {
        // التحقق من وجود updateAllViews
        if (typeof window.updateAllViews === 'function') {
            const originalUpdateAll = window.updateAllViews;
            let updateAllTimeout = null;
            let lastUpdateAllTime = 0;
            
            window.updateAllViews = function() {
                const now = Date.now();
                
                // منع التحديث المتكرر (كل 3 ثواني كحد أدنى)
                if (now - lastUpdateAllTime < 3000) {
                    console.log('⏸️ updateAllViews: تم تخطي التحديث المتكرر');
                    return;
                }
                
                lastUpdateAllTime = now;
                
                // إلغاء أي تحديث مجدول
                if (updateAllTimeout) {
                    clearTimeout(updateAllTimeout);
                }
                
                // جدولة التحديث
                updateAllTimeout = setTimeout(() => {
                    originalUpdateAll();
                    updateAllTimeout = null;
                }, 300);
            };
            
            console.log('✅ تم منع الوميض من updateAllViews');
        }
    }
    
    // تطبيق منع الوميض
    preventFlickering();
    
    console.log('✅ تم تحميل إصلاح التصنيفات المستقر بنجاح (v2.0.6)');
    console.log('🎯 الميزات: ملء التصنيفات ✓ | منع الوميض ✓ | حفظ مستقر ✓');
    
})();
