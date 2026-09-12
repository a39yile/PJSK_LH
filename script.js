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
