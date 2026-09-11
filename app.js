/**
 * 世界计划卡片图鉴 - 主应用逻辑
 *
 * 架构说明：
 *   1. CONFIG —— 所有可变配置集中在此处，新增团队/类型只改这一个对象
 *   2. State  —— 极简的运行时状态
 *   3. Render —— 纯函数式渲染（输入 → HTML 字符串）
 *   4. App    —— 事件绑定、筛选逻辑、初始化
 *
 * 依赖：data.js 中定义的 cardsData 数组
 */

;(function () {
  'use strict';

  // ============================================
  // 1. 配置（唯一真相源）
  // ============================================

  const CONFIG = {
    /** 团队显示顺序（数组索引即为渲染顺序） */
    groupsOrder: [
      'Leo/need',
      'MORE MORE JUMP!',
      'Vivid BAD SQUAD',
      'Wonderlands×Showtime',
      '25时，在Nightcord见',
      'Virtual Singers',
    ],

    /** 团队主题色 */
    groupColors: {
      'Leo/need':               '#4455DD',
      'MORE MORE JUMP!':        '#88DD44',
      'Vivid BAD SQUAD':        '#EE1166',
      'Wonderlands×Showtime':   '#FF9900',
      '25时，在Nightcord见':    '#884499',
      'Virtual Singers':        '#33CCBB',
    },

    /** 团队图标路径 */
    groupIcons: {
      'Leo/need':               'icon/Tuant/ln.webp',
      'MORE MORE JUMP!':        'icon/Tuant/mmj.webp',
      'Vivid BAD SQUAD':        'icon/Tuant/vbs.webp',
      'Wonderlands×Showtime':   'icon/Tuant/wxs.webp',
      '25时，在Nightcord见':    'icon/Tuant/n25.webp',
      'Virtual Singers':        'icon/Tuant/vs.webp',
    },

    /** 团队 → 角色名单（用于角色下拉框） */
    teamCharacters: {
      'Virtual Singers':        ['初音未来', '镜音铃', '镜音连', '巡音流歌', 'MEIKO', 'KAITO'],
      'Leo/need':               ['星乃一歌', '天马咲希', '望月穗波', '日野森志步'],
      'MORE MORE JUMP!':        ['花里实乃理', '桐谷遥', '桃井爱莉', '日野森雫'],
      'Vivid BAD SQUAD':        ['小豆泽心羽', '白石杏', '东云彰人', '青柳冬弥'],
      'Wonderlands×Showtime':   ['天马司', '凤笑梦', '草薙宁宁', '神代类'],
      '25时，在Nightcord见':    ['宵崎奏', '朝比奈真冬', '东云绘名', '晓山瑞希'],
    },

    /** 卡片类型列表（用于类型下拉框，顺序即显示顺序） */
    cardTypes: ['常驻', '期间限定', 'WL限定', 'BFES', 'CFES', '联动限定'],

    /** 团队在下拉框中的显示名（可选别名，缺省则用 key 本身） */
    groupLabels: {
      'Virtual Singers': 'VOCALOID',
      '25时，在Nightcord见': '25点，Nightcord见。',
    },
  };

  // ============================================
  // 2. DOM 缓存
  // ============================================

  const DOM = {
    searchInput:      () => document.getElementById('searchInput'),
    typeFilter:       () => document.getElementById('typeFilter'),
    groupFilter:      () => document.getElementById('groupFilter'),
    characterFilter:  () => document.getElementById('characterFilter'),
    iconBar:          () => document.getElementById('iconBar'),
    cardContainer:    () => document.getElementById('cardContainer'),
    totalCount:       () => document.getElementById('totalCount'),
    stats:            () => document.getElementById('stats'),
  };

  // ============================================
  // 3. 工具函数
  // ============================================

  /** HTML 转义，防止 XSS */
  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** 获取团队显示名 */
  function groupLabel(group) {
    return CONFIG.groupLabels[group] || group;
  }

  /** 获取团队颜色（带降级） */
  function groupColor(group) {
    return CONFIG.groupColors[group] || '#888';
  }

  // ============================================
  // 4. 渲染函数（纯函数，输入 → HTML 字符串）
  // ============================================

  /**
   * 渲染单张卡片
   * @param {Object} card - 卡片数据
   * @param {string} color - 团队主题色
   * @returns {string} HTML 字符串
   */
  function renderCard(card, color) {
    const imageHtml = card.image
      ? `<img src="${esc(card.image)}" alt="${esc(card.character)} - ${esc(card.card_name)}">`
      : '<span style="color:#666;">[ 图片占位 ]</span>';

    return `
      <div class="card-item">
        <div class="card-image-placeholder" style="border-color: ${color}">
          ${imageHtml}
        </div>
        <div class="card-content">
          <div class="character-name" style="color: ${color}">${esc(card.character)}</div>
          <div class="card-name">${esc(card.card_name)}</div>
          <span class="card-type type-${esc(card.type)}">${esc(card.type)}</span>
        </div>
      </div>`;
  }

  /**
   * 渲染图标栏
   * @param {Object[]} cards - 当前（筛选后的）卡片列表
   * @returns {string} HTML 字符串
   */
  function renderIconBar(cards) {
    return CONFIG.groupsOrder
      .map(group => {
        const count = cards.filter(c => c.group === group).length;
        if (count === 0) return '';
        const color = groupColor(group);
        const icon = CONFIG.groupIcons[group] || '';
        return `
          <div class="icon-btn" data-group="${esc(group)}" style="color: ${color}">
            <span class="icon-emoji"><img src="${esc(icon)}" alt="${esc(group)}"></span>
            <span class="icon-count">${count} 张</span>
          </div>`;
      })
      .join('');
  }

  /**
   * 渲染所有卡片分区
   * @param {Object[]} cards - 当前卡片列表
   * @param {boolean} isFiltered - 是否处于筛选状态（影响默认展开）
   * @returns {string} HTML 字符串
   */
  function renderCardSections(cards, isFiltered) {
    return CONFIG.groupsOrder
      .map(group => {
        const groupCards = cards.filter(c => c.group === group);
        if (groupCards.length === 0) return '';
        const color = groupColor(group);
        const expandedClass = isFiltered ? ' expanded' : '';
        const cardsHtml = groupCards.map(c => renderCard(c, color)).join('');
        return `
          <div class="group-section${expandedClass}" data-group="${esc(group)}">
            <div class="card-grid">${cardsHtml}</div>
          </div>`;
      })
      .join('');
  }

  // ============================================
  // 5. 下拉框动态生成
  // ============================================

  /** 填充团队筛选下拉框 */
  function populateGroupFilter() {
    const select = DOM.groupFilter();
    // 保留第一个 "团队" 占位选项
    select.innerHTML = '<option value="all">团队</option>';
    CONFIG.groupsOrder.forEach(group => {
      const opt = document.createElement('option');
      opt.value = group;
      opt.textContent = groupLabel(group);
      select.appendChild(opt);
    });
  }

  /** 填充卡片类型筛选下拉框 */
  function populateTypeFilter() {
    const select = DOM.typeFilter();
    select.innerHTML = '<option value="all">卡片类型</option>';
    CONFIG.cardTypes.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      select.appendChild(opt);
    });
  }

  /**
   * 更新角色筛选下拉框
   * @param {string} groupValue - 当前选中的团队（'all' 表示全部）
   */
  function updateCharacterFilter(groupValue) {
    const select = DOM.characterFilter();
    select.innerHTML = '<option value="all">角色</option>';

    const groupsToShow = groupValue === 'all'
      ? CONFIG.groupsOrder
      : [groupValue];

    groupsToShow.forEach(group => {
      const chars = CONFIG.teamCharacters[group];
      if (!chars || chars.length === 0) return;

      if (groupValue === 'all') {
        // 全部团队时用 optgroup 分组
        const optgroup = document.createElement('optgroup');
        optgroup.label = groupLabel(group);
        chars.forEach(char => {
          const opt = document.createElement('option');
          opt.value = char;
          opt.textContent = char;
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
      } else {
        chars.forEach(char => {
          const opt = document.createElement('option');
          opt.value = char;
          opt.textContent = char;
          select.appendChild(opt);
        });
      }
    });
  }

  // ============================================
  // 6. 筛选逻辑
  // ============================================

  /**
   * 根据当前 UI 状态筛选卡片
   * @returns {{ filtered: Object[], isFiltered: boolean }}
   */
  function getFilteredCards() {
    const searchTerm     = DOM.searchInput().value.toLowerCase();
    const typeValue      = DOM.typeFilter().value;
    const groupValue     = DOM.groupFilter().value;
    const characterValue = DOM.characterFilter().value;

    const isFiltered =
      searchTerm !== '' ||
      typeValue !== 'all' ||
      groupValue !== 'all' ||
      characterValue !== 'all';

    const filtered = cardsData.filter(card => {
      const matchSearch = !searchTerm ||
        card.character.toLowerCase().includes(searchTerm) ||
        card.card_name.toLowerCase().includes(searchTerm);
      const matchType      = typeValue === 'all' || card.type === typeValue;
      const matchGroup     = groupValue === 'all' || card.group === groupValue;
      const matchCharacter = characterValue === 'all' || card.character === characterValue;
      return matchSearch && matchType && matchGroup && matchCharacter;
    });

    return { filtered, isFiltered };
  }

  // ============================================
  // 7. 主渲染入口
  // ============================================

  function refresh() {
    const { filtered, isFiltered } = getFilteredCards();

    // 图标栏
    DOM.iconBar().innerHTML = renderIconBar(filtered);

    // 卡片区域
    DOM.cardContainer().innerHTML = renderCardSections(filtered, isFiltered);

    // 统计数字
    DOM.totalCount().textContent = filtered.length;
    DOM.stats().textContent =
      `共 ${filtered.length} 张卡片 | ${CONFIG.groupsOrder.length} 个团体`;

    // 筛选模式下图标全部高亮
    if (isFiltered) {
      document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.add('active'));
    }
  }

  // ============================================
  // 8. 事件绑定
  // ============================================

  /** 团队展开/折叠 */
  function handleIconClick(e) {
    const btn = e.target.closest('.icon-btn');
    if (!btn) return;
    const group = btn.getAttribute('data-group');
    const section = document.querySelector(`.group-section[data-group="${group}"]`);
    if (section) section.classList.toggle('expanded');
    btn.classList.toggle('active');
  }

  function bindEvents() {
    // 搜索 & 类型筛选
    DOM.searchInput().addEventListener('input', refresh);
    DOM.typeFilter().addEventListener('change', refresh);

    // 团队筛选 → 联动更新角色下拉框
    DOM.groupFilter().addEventListener('change', function () {
      DOM.characterFilter().value = 'all';
      updateCharacterFilter(this.value);
      refresh();
    });

    // 角色筛选
    DOM.characterFilter().addEventListener('change', refresh);

    // 图标栏点击（事件委托）
    DOM.iconBar().addEventListener('click', handleIconClick);
  }

  // ============================================
  // 9. 初始化
  // ============================================

  function init() {
    populateGroupFilter();
    populateTypeFilter();
    updateCharacterFilter('all');
    bindEvents();
    refresh();
  }

  // DOM 就绪后启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
