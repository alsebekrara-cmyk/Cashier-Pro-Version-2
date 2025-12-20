/**
 * Element SDK - نظام إدارة عناصر DOM
 * معرض يعقوب - شركة الإبداع الرقمي
 */

class ElementSDK {
    /**
     * اختيار عنصر واحد
     */
    $(selector) {
        return document.querySelector(selector);
    }

    /**
     * اختيار عناصر متعددة
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * إنشاء عنصر
     */
    create(tag, attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        
        // إضافة الخصائص
        Object.keys(attributes).forEach(key => {
            if (key === 'class') {
                element.className = attributes[key];
            } else if (key === 'style') {
                Object.assign(element.style, attributes[key]);
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // إضافة المحتوى
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        
        return element;
    }

    /**
     * إضافة مستمع حدث
     */
    on(selector, event, callback) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.addEventListener(event, callback);
            }
        });
    }

    /**
     * إزالة مستمع حدث
     */
    off(selector, event, callback) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.removeEventListener(event, callback);
            }
        });
    }

    /**
     * إضافة class
     */
    addClass(selector, className) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.classList.add(className);
            }
        });
    }

    /**
     * إزالة class
     */
    removeClass(selector, className) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.classList.remove(className);
            }
        });
    }

    /**
     * toggle class
     */
    toggleClass(selector, className) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.classList.toggle(className);
            }
        });
    }

    /**
     * إظهار عنصر
     */
    show(selector) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.style.display = 'block';
            }
        });
    }

    /**
     * إخفاء عنصر
     */
    hide(selector) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.style.display = 'none';
            }
        });
    }

    /**
     * toggle عنصر
     */
    toggle(selector) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el) {
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    /**
     * الحصول على قيمة
     */
    getValue(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        return el ? el.value : null;
    }

    /**
     * تعيين قيمة
     */
    setValue(selector, value) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) {
            el.value = value;
        }
    }

    /**
     * الحصول على نص
     */
    getText(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        return el ? el.textContent : null;
    }

    /**
     * تعيين نص
     */
    setText(selector, text) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) {
            el.textContent = text;
        }
    }

    /**
     * الحصول على HTML
     */
    getHTML(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        return el ? el.innerHTML : null;
    }

    /**
     * تعيين HTML
     */
    setHTML(selector, html) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) {
            el.innerHTML = html;
        }
    }

    /**
     * إزالة عنصر
     */
    remove(selector) {
        const elements = typeof selector === 'string' 
            ? this.$$(selector) 
            : [selector];
            
        elements.forEach(el => {
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }

    /**
     * إفراغ عنصر
     */
    empty(selector) {
        const el = typeof selector === 'string' ? this.$(selector) : selector;
        if (el) {
            el.innerHTML = '';
        }
    }

    /**
     * append
     */
    append(selector, element) {
        const parent = typeof selector === 'string' ? this.$(selector) : selector;
        if (parent) {
            parent.appendChild(element);
        }
    }

    /**
     * prepend
     */
    prepend(selector, element) {
        const parent = typeof selector === 'string' ? this.$(selector) : selector;
        if (parent && parent.firstChild) {
            parent.insertBefore(element, parent.firstChild);
        } else if (parent) {
            parent.appendChild(element);
        }
    }
}

// إنشاء instance واحد
const elementSdk = new ElementSDK();

// تصدير
if (typeof module !== 'undefined' && module.exports) {
    module.exports = elementSdk;
}
