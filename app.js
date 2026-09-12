/**
 * 世界计划卡片图鉴 - 主应用逻辑
 * 功能：卡片渲染 / 四维筛选 / 筛选状态 URL 同步 / 重置 / 分组折叠
 */
;(function () {
  'use strict';

  // ============================================
  // 1. 配置（唯一数据源：团体元信息集中管理）
  // ============================================
  const CONFIG = {
    groupsOrder: [
      'Leo/need',
      'MORE MORE JUMP!',
      'Vivid BAD SQUAD',
      'Wonderlands×Showtime',
      '25时，在Nightcord见',
      'Virtual Singers',
    ],
    groupColors: {
      'Leo/need': '#4455DD',
      'MORE MORE JUMP!': '#88DD44',
      'Vivid BAD SQUAD': '#EE1166',
      'Wonderlands×Showtime': '#FF9900',
      '25时，在Nightcord见': '#884499',
      'Virtual Singers': '#33CCBB',
    },
    groupIcons: {
      'Leo/need': 'icon/Tuant/ln.webp',
      'MORE MORE JUMP!': 'icon/Tuant/mmj.webp',
      'Vivid BAD SQUAD': 'icon/Tuant/vbs.webp',
      'Wonderlands×Showtime': 'icon/Tuant/wxs.webp',
      '25时，在Nightcord见': 'icon/Tuant/n25.webp',
      'Virtual Singers': 'icon/Tuant/vs.webp',
    },
    teamCharacters: {
      'Virtual Singers': ['初音未来', '镜音铃', '镜音连', '巡音流歌', 'MEIKO', 'KAITO'],
      'Leo/need': ['星乃一歌', '天马咲希', '望月穗波', '日野森志步'],
      'MORE MORE JUMP!': ['花里实乃理', '桐谷遥', '桃井爱莉', '日野森雫'],
      'Vivid BAD SQUAD': ['小豆泽心羽', '白石杏', '东云彰人', '青柳冬弥'],
      'Wonderlands×Showtime': ['天马司', '凤笑梦', '草薙宁宁', '神代类'],
      '25时，在Nightcord见': ['宵崎奏', '朝比奈真冬', '东云绘名', '晓山瑞希'],
    },
    cardTypes: ['常驻', '期间限定', 'WL限定', 'BFES', 'CFES', '联动限定'],
    groupLabels: {
      'Virtual Singers': 'VOCALOID',
      '25时，在Nightcord见': '25点，Nightcord见。',
    },
  };

  // ============================================
  // 2. DOM 缓存（初始化时一次性获取，避免重复查询）
  // ============================================
  const DOM_IDS = [
    'searchInput', 'typeFilter', 'groupFilter', 'characterFilter',
    'iconBar', 'cardContainer', 'totalCount', 'stats', 'resetFilter',
  ];
  const DOM = {};

  function cacheDom() {
    DOM_IDS.forEach(id => { DOM[id] = document.getElementById(id); });
  }

  // ============================================
  // 3. 工具函数
  // ============================================
  function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  const groupLabel = group => CONFIG.groupLabels[group] || group;
  const groupColor = group => CONFIG.groupColors[group] || '#888';

  /** 通用下拉框填充：items 为 [value, text] 数组 */
  function fillSelect(select, allLabel, items) {
    select.innerHTML = '';
    select.appendChild(new Option(allLabel, 'all'));
    items.forEach(([value, text]) => select.appendChild(new Option(text, value)));
  }

  /** 单次遍历将卡片按团体分组（保持 groupsOrder 顺序），避免每个团体重复 filter */
  function groupCards(cards) {
    const map = new Map(CONFIG.groupsOrder.map(g => [g, []]));
    cards.forEach(card => {
      const list = map.get(card.group);
      if (list) list.push(card);
    });
    return map;
  }

  // ============================================
  // 4. 渲染函数
  // ============================================
  function renderCard(card, color) {
    const imgPath = card.image ? esc(card.image) : '';
    const imageHtml = card.image
      ? `<img src="${imgPath}" alt="${esc(card.character)} - ${esc(card.card_name)}" loading="lazy">`
      : '<span style="color:#666;">[ 图片占位 ]</span>';

    return `
        <a href="detail.html?img=${imgPath}" class="card-link">
        <div class="card-item">
            <div class="card-image-placeholder" style="border-color: ${color}">
                ${imageHtml}
            </div>
            <div class="card-content">
                <div class="character-name" style="color: ${color}">${esc(card.character)}</div>
                <div class="card-name">${esc(card.card_name)}</div>
                <span class="card-type type-${esc(card.type)}">${esc(card.type)}</span>
            </div>
        </div>
        </a>`;
  }

  function renderIconBar(grouped) {
    return CONFIG.groupsOrder
      .map(group => {
        const count = grouped.get(group).length;
        if (count === 0) return '';
        const icon = CONFIG.groupIcons[group] || '';
        return `
          <div class="icon-btn" data-group="${esc(group)}" style="color: ${groupColor(group)}">
            <span class="icon-emoji"><img src="${esc(icon)}" alt="${esc(group)}"></span>
            <span class="icon-count">${count} 张</span>
          </div>`;
      })
      .join('');
  }

  function renderCardSections(grouped, isFiltered) {
    const expandedClass = isFiltered ? ' expanded' : '';
    return CONFIG.groupsOrder
      .map(group => {
        const groupCardsList = grouped.get(group);
        if (groupCardsList.length === 0) return '';
        const color = groupColor(group);
        const cardsHtml = groupCardsList.map(c => renderCard(c, color)).join('');
        return `
          <div class="group-section${expandedClass}" data-group="${esc(group)}">
            <div class="card-grid">${cardsHtml}</div>
          </div>`;
      })
      .join('');
  }

  // ============================================
  // 5. 下拉框逻辑
  // ============================================
  function populateGroupFilter() {
    fillSelect(
      DOM.groupFilter,
      '团队',
      CONFIG.groupsOrder.map(g => [g, groupLabel(g)])
    );
  }

  function populateTypeFilter() {
    fillSelect(
      DOM.typeFilter,
      '卡片类型',
      CONFIG.cardTypes.map(t => [t, t])
    );
  }

  function updateCharacterFilter(groupValue) {
    const groups = groupValue === 'all' ? CONFIG.groupsOrder : [groupValue];
    const items = [];
    groups.forEach(group => {
      (CONFIG.teamCharacters[group] || []).forEach(char => items.push([char, char]));
    });
    fillSelect(DOM.characterFilter, '角色', items);
  }

  // ============================================
  // 6. 筛选与 URL 同步
  // ============================================
  function getFilteredCards() {
    const searchTerm = DOM.searchInput.value.toLowerCase();
    const typeValue = DOM.typeFilter.value;
    const groupValue = DOM.groupFilter.value;
    const characterValue = DOM.characterFilter.value;

    const isFiltered = searchTerm !== '' || typeValue !== 'all' ||
                       groupValue !== 'all' || characterValue !== 'all';

    const filtered = cardsData.filter(card =>
      (!searchTerm ||
        card.character.toLowerCase().includes(searchTerm) ||
        card.card_name.toLowerCase().includes(searchTerm)) &&
      (typeValue === 'all' || card.type === typeValue) &&
      (groupValue === 'all' || card.group === groupValue) &&
      (characterValue === 'all' || card.character === characterValue)
    );

    return { filtered, isFiltered };
  }

  /** 将当前筛选状态写入地址栏（pushState 不刷新页面，可分享/可恢复） */
  function updateURL() {
    const params = new URLSearchParams();
    const search = DOM.searchInput.value.trim();
    if (search) params.set('q', search);
    if (DOM.typeFilter.value !== 'all') params.set('type', DOM.typeFilter.value);
    if (DOM.groupFilter.value !== 'all') params.set('group', DOM.groupFilter.value);
    if (DOM.characterFilter.value !== 'all') params.set('char', DOM.characterFilter.value);

    const newURL = params.toString() ? `?${params}` : window.location.pathname;
    window.history.pushState({}, '', newURL);
  }

  /** 页面加载时从 URL 参数恢复筛选状态 */
  function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) DOM.searchInput.value = params.get('q');
    if (params.has('type')) DOM.typeFilter.value = params.get('type');
    if (params.has('group')) {
      DOM.groupFilter.value = params.get('group');
      updateCharacterFilter(params.get('group'));
    }
    if (params.has('char')) DOM.characterFilter.value = params.get('char');
  }

  function refresh() {
    const { filtered, isFiltered } = getFilteredCards();
    const grouped = groupCards(filtered);

    DOM.iconBar.innerHTML = renderIconBar(grouped);
    DOM.cardContainer.innerHTML = renderCardSections(grouped, isFiltered);
    DOM.totalCount.textContent = filtered.length;
    DOM.stats.textContent = `共 ${filtered.length} 张卡片 | ${CONFIG.groupsOrder.length} 个团体`;

    if (isFiltered) {
      document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.add('active'));
    }
    updateURL();
  }

  /** 重置所有筛选条件 */
  function resetFilters() {
    DOM.searchInput.value = '';
    DOM.typeFilter.value = 'all';
    DOM.groupFilter.value = 'all';
    updateCharacterFilter('all');
    DOM.characterFilter.value = 'all';
    refresh();
  }

  // ============================================
  // 7. 事件绑定
  // ============================================
  function handleIconClick(e) {
    const btn = e.target.closest('.icon-btn');
    if (!btn) return;
    const section = document.querySelector(`.group-section[data-group="${btn.dataset.group}"]`);
    if (section) section.classList.toggle('expanded');
    btn.classList.toggle('active');
  }

  function bindEvents() {
    DOM.searchInput.addEventListener('input', refresh);
    DOM.typeFilter.addEventListener('change', refresh);
    DOM.groupFilter.addEventListener('change', function () {
      DOM.characterFilter.value = 'all';
      updateCharacterFilter(this.value);
      refresh();
    });
    DOM.characterFilter.addEventListener('change', refresh);
    DOM.iconBar.addEventListener('click', handleIconClick);
    DOM.resetFilter.addEventListener('click', resetFilters);
  }

  // ============================================
  // 8. 初始化
  // ============================================
  function init() {
    cacheDom();
    populateGroupFilter();
    populateTypeFilter();
    updateCharacterFilter('all');
    bindEvents();
    initFromURL();
    refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
