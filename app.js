// ============================================
// 配置与常量
// ============================================

const groupColors = {
  "Leo/need": "#4455DD",
  "MORE MORE JUMP!": "#88DD44",
  "Vivid BAD SQUAD": "#EE1166",
  "Wonderlands×Showtime": "#FF9900",
  "25时，在Nightcord见": "#884499",
  "Virtual Singers": "#33CCBB"
};

const groupsOrder = [
  "Leo/need",
  "MORE MORE JUMP!",
  "Vivid BAD SQUAD",
  "Wonderlands×Showtime",
  "25时，在Nightcord见",
  "Virtual Singers"
];

// 团队-角色名单
const teamCharacters = {
  "Virtual Singers": ["初音未来", "镜音铃", "镜音连", "巡音流歌", "MEIKO", "KAITO"],
  "Leo/need": ["星乃一歌", "天马咲希", "望月穗波", "日野森志步"],
  "MORE MORE JUMP!": ["花里实乃理", "桐谷遥", "桃井爱莉", "日野森雫"],
  "Vivid BAD SQUAD": ["小豆泽心羽", "白石杏", "东云彰人", "青柳冬弥"],
  "Wonderlands×Showtime": ["天马司", "凤笑梦", "草薙宁宁", "神代类"],
  "25时，在Nightcord见": ["宵崎奏", "朝比奈真冬", "东云绘名", "晓山瑞希"]
};

// 团队图标路径
const groupIcons = {
  'Leo/need': 'icon/Tuant/ln.webp',
  'MORE MORE JUMP!': 'icon/Tuant/mmj.webp',
  'Vivid BAD SQUAD': 'icon/Tuant/vbs.webp',
  'Wonderlands×Showtime': 'icon/Tuant/wxs.webp',
  '25时，在Nightcord见': 'icon/Tuant/n25.webp',
  'Virtual Singers': 'icon/Tuant/vs.webp'
};


// ============================================
// DOM 工具函数
// ============================================

function getGroupIcon(group) {
  return groupIcons[group] || '';
}

function createCardElement(card, color) {
  let imageHtml;
  if (card.image && card.image !== '') {
    imageHtml = '<img src="' + card.image + '" alt="' + card.character + ' - ' + card.card_name + '">';
  } else {
    imageHtml = '<span style="color:#666;">[ 图片占位 - 请在数据中添加 image 字段 ]</span>';
  }

  return '<div class="card-item">' +
    '<div class="card-image-placeholder" style="border-color: ' + color + '">' + imageHtml + '</div>' +
    '<div class="card-content">' +
    '<div class="character-name" style="color: ' + color + '">' + card.character + '</div>' +
    '<div class="card-name">' + card.card_name + '</div>' +
    '<span class="card-type type-' + card.type + '">' + card.type + '</span>' +
    '</div></div>';
}


// ============================================
// 角色筛选器
// ============================================

function updateCharacterFilter(groupValue) {
  const charSelect = document.getElementById('characterFilter');
  charSelect.innerHTML = '<option value="all">全部角色</option>';

  if (groupValue === 'all') {
    // 显示所有团队的所有角色（用 optgroup 分组）
    Object.keys(teamCharacters).forEach(group => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = group;
      teamCharacters[group].forEach(char => {
        const opt = document.createElement('option');
        opt.value = char;
        opt.textContent = char;
        optgroup.appendChild(opt);
      });
      charSelect.appendChild(optgroup);
    });
  } else {
    // 只显示选中团队的角色
    const chars = teamCharacters[groupValue] || [];
    chars.forEach(char => {
      const opt = document.createElement('option');
      opt.value = char;
      opt.textContent = char;
      charSelect.appendChild(opt);
    });
  }
}


// ============================================
// 图标栏
// ============================================

function renderIconBar(cards) {
  const bar = document.getElementById('iconBar');
  bar.innerHTML = '';

  groupsOrder.forEach(group => {
    const groupCards = cards.filter(c => c.group === group);
    if (groupCards.length === 0) return;

    const color = groupColors[group] || '#888';
    const icon = getGroupIcon(group);
    const btn = document.createElement('div');
    btn.className = 'icon-btn';
    btn.style.color = color;
    btn.setAttribute('data-group', group);
    btn.onclick = function () { toggleGroup(group); };
    btn.innerHTML =
      '<span class="icon-emoji"><img src="' + icon + '" alt="' + group + '"></span>' +
      '<span class="icon-count">' + groupCards.length + ' 张</span>';
    bar.appendChild(btn);
  });
}


// ============================================
// 卡片渲染
// ============================================

function renderCards(cards, isFiltered) {
  renderIconBar(cards);

  const container = document.getElementById('cardContainer');
  container.innerHTML = '';

  groupsOrder.forEach(group => {
    const groupCards = cards.filter(c => c.group === group);
    if (groupCards.length === 0) return;

    const section = document.createElement('div');
    section.className = 'group-section';
    section.setAttribute('data-group', group);

    const color = groupColors[group] || '#ffffff';

    let cardsHtml = '<div class="card-grid">';
    groupCards.forEach(card => {
      cardsHtml += createCardElement(card, color);
    });
    cardsHtml += '</div>';

    section.innerHTML = cardsHtml;
    if (isFiltered) {
      section.classList.add('expanded');
    }
    container.appendChild(section);
  });

  if (isFiltered) {
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.add('active'));
  }

  document.getElementById('totalCount').textContent = cards.length;
  document.getElementById('stats').textContent = '共 ' + cards.length + ' 张卡片 | ' + groupsOrder.length + ' 个团体';
}


// ============================================
// 团体展开/折叠
// ============================================

function toggleGroup(group) {
  const section = document.querySelector('.group-section[data-group="' + group + '"]');
  const btn = document.querySelector('.icon-btn[data-group="' + group + '"]');
  if (section) section.classList.toggle('expanded');
  if (btn) btn.classList.toggle('active');
}


// ============================================
// 筛选逻辑
// ============================================

function filterCards() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const typeValue = document.getElementById('typeFilter').value;
  const groupValue = document.getElementById('groupFilter').value;
  const characterValue = document.getElementById('characterFilter').value;

  const isFiltered =
    searchTerm !== '' ||
    typeValue !== 'all' ||
    groupValue !== 'all' ||
    characterValue !== 'all';

  const filtered = cardsData.filter(card => {
    const matchSearch = card.character.toLowerCase().includes(searchTerm) ||
                        card.card_name.toLowerCase().includes(searchTerm);
    const matchType = typeValue === 'all' || card.type === typeValue;
    const matchGroup = groupValue === 'all' || card.group === groupValue;
    const matchCharacter = characterValue === 'all' || card.character === characterValue;
    return matchSearch && matchType && matchGroup && matchCharacter;
  });

  renderCards(filtered, isFiltered);
}


// ============================================
// 事件绑定
// ============================================

document.getElementById('searchInput').addEventListener('input', filterCards);
document.getElementById('typeFilter').addEventListener('change', filterCards);

document.getElementById('groupFilter').addEventListener('change', function () {
  document.getElementById('characterFilter').value = 'all';
  updateCharacterFilter(this.value);
  filterCards();
});

document.getElementById('characterFilter').addEventListener('change', filterCards);


// ============================================
// 初始化
// ============================================

updateCharacterFilter('all');
renderCards(cardsData, false);
