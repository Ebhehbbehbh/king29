// نظام حماية مؤسسة نيزك الإلكترونية
class NizekSecuritySystem {
    constructor() {
        this.socket = io();
        this.attempts = 0;
        this.maxAttempts = 10;
        this.correctPassword = "20082008";
        this.isLocked = true;
        this.blockedWindows = [];
        
        this.initializeSecuritySystem();
    }

    initializeSecuritySystem() {
        console.log('🌙 نظام نيزك الإلكتروني: تم تفعيل نظام الحماية');
        this.activateSecurityMeasures();
        this.setupEventListeners();
    }

    activateSecurityMeasures() {
        // منع إغلاق الصفحة
        this.preventPageClose();
        
        // منع التحديث والإغلاق
        this.blockEscapeKeys();
        
        // فتح نوافذ احتياطية
        this.startBackupWindows();
        
        // حماية ضد أدوات المطور
        this.protectAgainstDevTools();
    }

    preventPageClose() {
        window.addEventListener('beforeunload', (e) => {
            if (this.isLocked) {
                e.preventDefault();
                e.returnValue = '';
                this.openBackupWindow();
                return '';
            }
        });

        window.addEventListener('unload', () => {
            if (this.isLocked) {
                this.openBackupWindow();
            }
        });
    }

    blockEscapeKeys() {
        document.addEventListener('keydown', (e) => {
            if (this.isLocked) {
                const blockedKeys = ['F5', 'F12', 'Escape', 'r', 'w'];
                
                if (blockedKeys.includes(e.key) || (e.ctrlKey && blockedKeys.includes(e.key))) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showWarning('تم منع هذا الإجراء لأسباب أمنية');
                    return false;
                }
            }
        });
    }

    startBackupWindows() {
        // فتح نافذة احتياطية كل 30 ثانية
        setInterval(() => {
            if (this.isLocked) {
                this.openBackupWindow();
            }
        }, 30000);

        // فتح نافذة احتياطية فورية
        setTimeout(() => {
            this.openBackupWindow();
        }, 5000);
    }

    openBackupWindow() {
        try {
            const newWindow = window.open(
                window.location.href,
                '_blank',
                'width=800,height=600,left=100,top=100'
            );
            
            if (newWindow) {
                this.blockedWindows.push(newWindow);
                
                // الحفاظ على 5 نوافذ كحد أقصى
                if (this.blockedWindows.length > 5) {
                    const oldWindow = this.blockedWindows.shift();
                    try { oldWindow.close(); } catch(e) {}
                }
            }
        } catch (error) {
            console.log('🌙 نظام نيزك: تم منع النافذة الجديدة');
        }
    }

    protectAgainstDevTools() {
        // كشف فتح أدوات المطور
        const checkDevTools = setInterval(() => {
            const widthDiff = window.outerWidth - window.innerWidth;
            const heightDiff = window.outerHeight - window.innerHeight;
            
            if (widthDiff > 100 || heightDiff > 100) {
                window.location.reload();
                this.openBackupWindow();
            }
        }, 1000);
    }

    setupEventListeners() {
        // التركيز على حقل كلمة المرور تلقائياً
        document.getElementById('passwordInput').focus();
        
        // السماح بالإدخال عند الضغط على Enter
        document.getElementById('passwordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.attemptUnlock();
            }
        });
    }

    attemptUnlock() {
        const passwordInput = document.getElementById('passwordInput');
        const enteredPassword = passwordInput.value;
        
        if (enteredPassword === this.correctPassword) {
            this.grantAccess();
        } else {
            this.handleWrongPassword();
        }
    }

    handleWrongPassword() {
        this.attempts++;
        document.getElementById('attemptsCount').textContent = this.attempts;
        
        const passwordInput = document.getElementById('passwordInput');
        passwordInput.value = '';
        passwordInput.focus();
        
        // فتح نوافذ عقابية بعد محاولات متعددة
        if (this.attempts % 3 === 0) {
            this.openBackupWindow();
        }
        
        this.showWarning('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.');
        
        if (this.attempts >= this.maxAttempts) {
            this.lockSystemTemporarily();
        }
    }

    lockSystemTemporarily() {
        this.showWarning('تم تعطيل النظام مؤقتاً بسبب محاولات متعددة خاطئة');
        
        const unlockBtn = document.querySelector('.unlock-btn');
        const passwordInput = document.getElementById('passwordInput');
        
        unlockBtn.disabled = true;
        passwordInput.disabled = true;
        unlockBtn.textContent = '⏳ النظام معطل مؤقتاً';
        unlockBtn.style.background = '#757575';
        
        // إعادة التفعيل بعد 5 دقائق
        setTimeout(() => {
            this.attempts = 0;
            document.getElementById('attemptsCount').textContent = '0';
            unlockBtn.disabled = false;
            passwordInput.disabled = false;
            unlockBtn.textContent = '🔓 فتح النظام';
            unlockBtn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
            this.showWarning('تم إعادة تفعيل النظام. يمكنك المحاولة مرة أخرى.');
        }, 300000);
    }

    grantAccess() {
        this.isLocked = false;
        
        // إغلاق جميع النوافذ الاحتياطية
        this.blockedWindows.forEach(window => {
            try { window.close(); } catch(e) {}
        });
        
        // إزالة جميع القيود
        window.onbeforeunload = null;
        
        // عرض شاشة النجاح
        document.getElementById('mainScreen').classList.add('hidden');
        document.getElementById('successScreen').classList.remove('hidden');
        
        this.socket.emit('verify_password', { password: this.correctPassword });
    }

    showWarning(message) {
        alert(`🌙 نظام نيزك: ${message}`);
    }
}

// الدوال العامة
function attemptUnlock() {
    if (window.nizekSystem) {
        window.nizekSystem.attemptUnlock();
    }
}

function restartSystem() {
    location.reload();
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.nizekSystem = new NizekSecuritySystem();
});

// طلب صلاحيات الإشعارات
if ('Notification' in window) {
    Notification.requestPermission();
}
