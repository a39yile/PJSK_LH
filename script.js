/**
 * 主题切换逻辑（APP WebView 适配版）
 * 优先级：localStorage 记忆 > 系统偏好 > 按时间判断（6-18 点亮色）
 */
;(function () {
  'use strict';

  const btn = document.getElementById('theme-toggle');
  if (!btn) return; // 页面无切换按钮时安全退出

  const root = document.documentElement;

  /** 检测应使用的初始主题 */
  function detectTheme() {
    if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    }
    // 无法读取系统偏好时按时间回退
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  }

  /** 应用主题到页面并同步按钮文字 */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '切换白色' : '切换黑色';
  }

  // 初始化：优先使用用户上次的选择
  applyTheme(localStorage.getItem('theme') || detectTheme());

  btn.addEventListener('click', () => {
    const newTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
})();
