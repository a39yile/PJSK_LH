/** 
 * 世界计划卡片图鉴 - 主应用逻辑 (带筛选状态记忆)
 */ 
;(function () { 
  'use strict'; 

  // ============================================ 
  // 1. 配置 
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
  // 2. DOM 缓存 
  // ============================================ 
  const DOM = { 
    searchInput: () => document.getElementById('searchInput'), 
    typeFilter: () => document.getElementById('typeFilter'), 
    groupFilter: () => document.getElementById('groupFilter'), 
    characterFilter: () => document.getElementById('characterFilter'), 
    iconBar: () => document.getElementById('iconBar'), 
    cardContainer: () => document.getElementById('cardContainer'), 
    totalCount: () => document.getElementById('totalCount'), 
    stats: () => document.getElementById('stats'), 
    resetFilter: () => document.getElementById('resetFilter'), 
  }; 

  // ============================================ 
  // 3. 工具函数 
  // ============================================ 
  function esc(str) { 
    const div = document.createElement('div'); 
    div.textContent = str; 
    return div.innerHTML; 
  } 
  function groupLabel(group) { 
    return CONFIG.groupLabels[group] || group; 
  } 
  function groupColor(group) { 
    return CONFIG.groupColors[group] || '#888'; 
  } 

  // ============================================ 
  // 4. 渲染函数 
  // ============================================ 
  function renderCard(card, color) { 
    const imgPath = card.image ? esc(card.image) : '';
    // 携带卡名/种类/角色/团队序号，供详情页两排文字与跳「关于」页展开定位
    const detailParams = `?img=${imgPath}`
      + `&name=${encodeURIComponent(card.card_name)}`
      + `&type=${encodeURIComponent(card.type)}`
      + `&char=${encodeURIComponent(card.character)}`
      + `&g=${CONFIG.groupsOrder.indexOf(card.group)}`;
    const linkStart = `<a href="detail.html${detailParams}" class="card-link">`;
    const linkEnd = `</a>`;

    const imageHtml = card.image 
      ? `<img src="${imgPath}" alt="${esc(card.character)} - ${esc(card.card_name)}">` 
      : '<span style="color:#666;">[ 图片占位 ]</span>';

    return ` 
        ${linkStart}
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
        ${linkEnd}`; 
  } 

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
  // 5. 下拉框逻辑 
  // ============================================ 
  function populateGroupFilter() { 
    const select = DOM.groupFilter(); 
    select.innerHTML = '<option value="all">团队</option>'; 
    CONFIG.groupsOrder.forEach(group => { 
      const opt = document.createElement('option'); 
      opt.value = group; 
      opt.textContent = groupLabel(group); 
      select.appendChild(opt); 
    }); 
  } 
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
  function updateCharacterFilter(groupValue) { 
    const select = DOM.characterFilter(); 
    select.innerHTML = '<option value="all">角色</option>'; 
    const groupsToShow = groupValue === 'all' ? CONFIG.groupsOrder : [groupValue]; 
    groupsToShow.forEach(group => { 
      const chars = CONFIG.teamCharacters[group]; 
      if (!chars || chars.length === 0) return; 
      // 【修改】不再按团体分类（移除 optgroup），角色直接平铺 
      chars.forEach(char => { 
        const opt = document.createElement('option'); 
        opt.value = char; 
        opt.textContent = char; 
        select.appendChild(opt); 
      }); 
    }); 
  } 

  // ============================================ 
  // 6. 筛选与 URL 同步逻辑 
  // ============================================ 
  function getFilteredCards() { 
    const searchTerm = DOM.searchInput().value.toLowerCase(); 
    const typeValue = DOM.typeFilter().value; 
    const groupValue = DOM.groupFilter().value; 
    const characterValue = DOM.characterFilter().value; 
    const isFiltered = searchTerm !== '' || typeValue !== 'all' || groupValue !== 'all' || characterValue !== 'all'; 
    const filtered = cardsData.filter(card => { 
      const matchSearch = !searchTerm || card.character.toLowerCase().includes(searchTerm) || card.card_name.toLowerCase().includes(searchTerm); 
      const matchType = typeValue === 'all' || card.type === typeValue; 
      const matchGroup = groupValue === 'all' || card.group === groupValue; 
      const matchCharacter = characterValue === 'all' || card.character === characterValue; 
      return matchSearch && matchType && matchGroup && matchCharacter; 
    }); 
    return { filtered, isFiltered }; 
  } 

  /** 
   * 新增：更新浏览器地址栏参数，但不刷新页面 
   */
  function updateURL() {
      const params = new URLSearchParams();
      const search = DOM.searchInput().value.trim();
      const type = DOM.typeFilter().value;
      const group = DOM.groupFilter().value;
      const char = DOM.characterFilter().value;

      if (search) params.set('q', search);
      if (type !== 'all') params.set('type', type);
      if (group !== 'all') params.set('group', group);
      if (char !== 'all') params.set('char', char);

      // 使用 pushState 避免页面刷新，同时记录历史
      const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
      window.history.pushState({}, '', newURL);
  }

  /** 
   * 新增：从 URL 参数恢复筛选状态 
   */
  function initFromURL() {
      const params = new URLSearchParams(window.location.search);
      
      if (params.has('q')) DOM.searchInput().value = params.get('q');
      if (params.has('type')) DOM.typeFilter().value = params.get('type');
      if (params.has('group')) {
          DOM.groupFilter().value = params.get('group');
          updateCharacterFilter(params.get('group')); // 先更新角色列表
      }
      if (params.has('char')) DOM.characterFilter().value = params.get('char');
  }

  /** 
   * 新增：重置所有筛选条件（搜索词、类型、团队、角色） 
   */ 
  function resetFilters() { 
    DOM.searchInput().value = ''; 
    DOM.typeFilter().value = 'all'; 
    DOM.groupFilter().value = 'all'; 
    updateCharacterFilter('all'); 
    DOM.characterFilter().value = 'all'; 
    // 清除所有分组的展开/选中状态由 refresh 重新渲染完成 
    refresh(); 
  } 

  function refresh() { 
    const { filtered, isFiltered } = getFilteredCards(); 
    DOM.iconBar().innerHTML = renderIconBar(filtered); 
    DOM.cardContainer().innerHTML = renderCardSections(filtered, isFiltered); 
    DOM.totalCount().textContent = filtered.length; 
    DOM.stats().textContent = `共 ${filtered.length} 张卡片 | ${CONFIG.groupsOrder.length} 个团体`; 
    if (isFiltered) { 
      document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.add('active')); 
    } 
    // 每次刷新视图后，同步更新 URL
    updateURL();
  } 

  // ============================================ 
  // 7. 事件绑定 
  // ============================================ 
  function handleIconClick(e) { 
    const btn = e.target.closest('.icon-btn'); 
    if (!btn) return; 
    const group = btn.getAttribute('data-group'); 
    const section = document.querySelector(`.group-section[data-group="${group}"]`); 
    if (section) section.classList.toggle('expanded'); 
    btn.classList.toggle('active'); 
  } 
  function bindEvents() { 
    DOM.searchInput().addEventListener('input', refresh); 
    DOM.typeFilter().addEventListener('change', refresh); 
    DOM.groupFilter().addEventListener('change', function () { 
      DOM.characterFilter().value = 'all'; 
      updateCharacterFilter(this.value); 
      refresh(); 
    }); 
    DOM.characterFilter().addEventListener('change', refresh); 
    DOM.iconBar().addEventListener('click', handleIconClick); 
    DOM.resetFilter().addEventListener('click', resetFilters); 
  } 

  // ============================================ 
  // 8. 初始化 
  // ============================================ 
  function init() { 
    populateGroupFilter(); 
    populateTypeFilter(); 
    updateCharacterFilter('all'); 
    bindEvents(); 
    // 先尝试从 URL 恢复状态
    initFromURL();
    // 再进行首次渲染
    refresh(); 
  } 
  if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', init); 
  } else { 
    init(); 
  } 
})();
