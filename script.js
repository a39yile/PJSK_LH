// ============================================ //
// 主题切换逻辑 (APP WebView 完美适配版)
// ============================================ //

// 获取按钮元素
const themeToggle = document.getElementById('theme-toggle');

// 页面加载时，检查本地存储中是否有保存的主题
let savedTheme = localStorage.getItem('theme');

// 如果没有保存的主题，则开始自动判断
if (!savedTheme) {
    let canDetectSystem = false;
    
    // 1. 优先尝试读取系统/APP内置浏览器的偏好
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');
        
        if (darkModeQuery.matches) {
            savedTheme = 'dark';
            canDetectSystem = true;
        } else if (lightModeQuery.matches) {
            savedTheme = 'light';
            canDetectSystem = true;
        }
    }

    // 2. 如果无法读取系统模式，回退到按时间判断
    if (!canDetectSystem) {
        const currentHour = new Date().getHours();
        // 6点到18点之间为白天模式(light)，其他时间为黑夜模式(dark)
        savedTheme = (currentHour >= 6 && currentHour < 18) ? 'light' : 'dark';
    }
}

// 将主题应用到页面
document.documentElement.setAttribute('data-theme', savedTheme);
updateButtonText(savedTheme);

// 监听按钮点击事件
themeToggle.addEventListener('click', () => {
    // 获取当前主题
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // 切换主题：如果是 light 就变成 dark，如果是 dark 就变成 light
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    // 将新主题应用到页面
    document.documentElement.setAttribute('data-theme', newTheme);
    // 将用户的选择保存到浏览器的本地存储中
    localStorage.setItem('theme', newTheme);
    // 更新按钮文字
    updateButtonText(newTheme);
});

// 辅助函数：根据当前主题更新按钮上的文字
function updateButtonText(theme) {
    if (theme === 'dark') {
        themeToggle.textContent = '切换白色';
    } else {
        themeToggle.textContent = '切换黑色';
    }
}


// ============================================ //
// 角色筛选框按团队配色（仅 index.html 生效，其他页面无该元素自动跳过）
// ============================================ //
const GROUP_COLORS = {
    'Leo/need': '#4455DD',
    'MORE MORE JUMP!': '#88DD44',
    'Vivid BAD SQUAD': '#EE1166',
    'Wonderlands×Showtime': '#FF9900',
    '25时，在Nightcord见': '#884499',
    'Virtual Singers': '#33CCBB',
};

const charFilterEl = document.getElementById('characterFilter');
const groupFilterEl = document.getElementById('groupFilter');

function applyCharColor() {
    if (!charFilterEl) return;
    const g = groupFilterEl ? groupFilterEl.value : 'all';
    const c = GROUP_COLORS[g] || '#6a5af9';
    charFilterEl.style.color = c;              // 文字用团队色
    charFilterEl.style.backgroundColor = c + '22'; // 同色淡底（13%透明度）
}

if (charFilterEl) {
    charFilterEl.addEventListener('change', applyCharColor);
    if (groupFilterEl) {
        groupFilterEl.addEventListener('change', function () { setTimeout(applyCharColor, 0); });
    }
    applyCharColor();
}


// ============================================ //
// 全站外链跳转统一经 external.html 警告确认页中转
// 任何页面（index/mine/以后新增页）点击指向其他网站的链接
// 都会先弹出"即将离开图鉴"确认页；同站内部链接不受影响
// ============================================ //
;(function () {
    'use strict';

    function isExternalUrl(absUrl) {
        try {
            var u = new URL(absUrl, location.href);
            return (u.protocol === 'http:' || u.protocol === 'https:') && u.host !== location.host;
        } catch (err) {
            return false;
        }
    }

    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!a) return;
        var raw = a.getAttribute('href');
        if (!raw || raw.indexOf('external.html') === 0 || raw.indexOf('javascript:') === 0) return; // 已中转/伪链接跳过，防套娃
        if (isExternalUrl(a.href)) {
            e.preventDefault();
            window.location.href = 'external.html?u=' + encodeURIComponent(a.href);
        }
    }, true);
})();
