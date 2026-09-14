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
      const newURL = (params.toString() ? `?${params.toString()}` : window.location.pathname) + window.location.hash;
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
  // 7.5 「我的」视图（数据来自 data/gy_data.js，由 index.html 提前引入） 
  // ============================================ 
  const MINE_COLORS = ['6a5af9', 'ff8a00', 'e52e71', '00c1b5', '88dd44', '9d50bb']; 
  const MINE_URL_COLORS = { 
    'proj SEKAI': '#64b5f4', 'SEKAI': '#64b5f4', 'Twitter': '#14b8a6', 'X': '#14b8a6', 
    'YouTube': '#ef5350', 'Instagram': '#ab47bc', 'GitHub': '#8d99ae', 
    'facebook': '#5c6bc0', 'Bilibili': '#ff8a80', 'App Store': '#42a5f5', 'Google Play': '#66bb6a', 
  }; 
  let mineRendered = false; 

  function mineSvgPlaceholder(n) { 
    const color = MINE_COLORS[(n - 1) % MINE_COLORS.length]; 
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E" 
      + "%3Crect width='48' height='48' rx='12' fill='%23" + color + "'/%3E" 
      + "%3Ctext x='24' y='32' font-size='22' font-family='sans-serif' text-anchor='middle' fill='white'%3E" 
      + n + "%3C/text%3E%3C/svg%3E"; 
  } 

  function mineMainImg(iconSrc, index) { 
    const img = document.createElement('img'); 
    img.className = 'link-icon'; 
    img.alt = '链接图标' + index; 
    img.src = iconSrc || mineSvgPlaceholder(index); 
    img.onerror = function () { this.onerror = null; this.src = mineSvgPlaceholder(index); }; 
    return img; 
  } 

  function mineSubImg(src) { 
    const img = document.createElement('img'); 
    img.className = 'sub-icon'; 
    img.alt = ''; 
    img.src = src; 
    img.onerror = function () { 
      const dot = document.createElement('span'); 
      dot.className = 'sub-dot'; 
      this.replaceWith(dot); 
    }; 
    return img; 
  } 

  function renderLinkGroups() { 
    if (mineRendered) return; 
    const list = document.getElementById('linkList'); 
    if (!list) return; 
    const DATA = (typeof gy_data !== 'undefined') ? gy_data 
      : (typeof linkData !== 'undefined') ? linkData 
      : (typeof gyData !== 'undefined') ? gyData : null; 
    if (!DATA) return; 
    list.innerHTML = ''; 
    mineRendered = true; 

    DATA.forEach(function (group, gi) { 
      const wrap = document.createElement('div'); 
      wrap.className = 'link-group'; 

      const card = document.createElement('div'); 
      card.className = 'link-card'; 
      card.appendChild(mineMainImg(group.icon, gi + 1)); 
      const info = document.createElement('div'); 
      info.className = 'link-info'; 
      info.innerHTML = '<span class="link-title">' + esc(group.title) + '</span>' 
        + '<span class="link-desc">' + esc(group.desc) + '</span>'; 
      card.appendChild(info); 
      card.insertAdjacentHTML('beforeend', '<span class="link-arrow">›</span>'); 
      card.addEventListener('click', function () { wrap.classList.toggle('open'); }); 
      wrap.appendChild(card); 

      const subList = document.createElement('div'); 
      subList.className = 'link-sub-list'; 
      (group.links || []).forEach(function (item) { 
        const a = document.createElement('a'); 
        a.className = 'link-sub-item'; 
        // 外链统一经 external.html 确认页中转 
        a.href = (item.url && /^https?:\/\//i.test(item.url)) 
          ? 'external.html?u=' + encodeURIComponent(item.url) 
          : 'javascript:void(0)'; 
        a.appendChild(mineSubImg(item.img)); 
        const label = document.createElement('span'); 
        if (item.text && typeof item.text === 'object') { 
          const t = document.createElement('span'); 
          t.className = 'sub-label'; 
          t.textContent = item.text.name || ''; 
          label.appendChild(t); 
          const u = document.createElement('span'); 
          const key = item.text.urlKey || ''; 
          u.textContent = key; 
          u.className = 'sub-url'; 
          u.style.color = MINE_URL_COLORS[key] || '#999'; 
          label.appendChild(u); 
        } else { 
          label.textContent = item.text == null ? '' : item.text; 
        } 
        a.appendChild(label); 
        subList.appendChild(a); 
      }); 
      wrap.appendChild(subList); 
      list.appendChild(wrap); 
    }); 
  } 

  /** #mine?open=N 或旧链接 ?open=N：自动展开对应团队卡片 */ 
  function mineAutoOpen(query) { 
    let idx = query ? parseInt(new URLSearchParams(query).get('open')) : NaN; 
    if (isNaN(idx)) { 
      const legacy = new URLSearchParams(window.location.search).get('open'); 
      if (legacy !== null) idx = parseInt(legacy); 
    } 
    if (isNaN(idx)) return; 
    const el = document.querySelectorAll('#view-mine .link-group')[idx]; 
    if (!el) return; 
    el.classList.add('open'); 
    setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80); 
  } 

  // ---- hash 路由：#home / #mine（可带 ?open=N） ---- 
  function parseHash() { 
    const h = window.location.hash.replace(/^#/, '') || 'home'; 
    const qi = h.indexOf('?'); 
    return { view: qi === -1 ? h : h.slice(0, qi), query: qi === -1 ? '' : h.slice(qi + 1) }; 
  } 

  function routeView() { 
    const { view, query } = parseHash(); 
    const isMine = view === 'mine'; 
    document.getElementById('view-home').classList.toggle('active', !isMine); 
    document.getElementById('view-mine').classList.toggle('active', isMine); 
    document.querySelectorAll('.nav-item').forEach(function (n) { 
      n.classList.toggle('active', n.dataset.view === (isMine ? 'mine' : 'home')); 
    }); 
    document.title = isMine ? '我的 - Project SEKAI' : '世界计划卡片个人收集图鉴 | Project SEKAI Cards'; 
    if (isMine) { 
      renderLinkGroups(); 
      mineAutoOpen(query); 
    } 
    window.scrollTo(0, 0); 
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
    // 视图路由：hashchange 无刷新切换主页/我的
    window.addEventListener('hashchange', routeView); 
    routeView(); 
    // 兜底：若以 mine.html?open=N 旧地址进来被重定向，参数可能落在 search 上
    if (parseHash().view === 'mine') mineAutoOpen(''); 
  } 
  if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', init); 
  } else { 
    init(); 
  } 
})();
