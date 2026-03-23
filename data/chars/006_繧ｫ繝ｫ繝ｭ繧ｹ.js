// ============================================================
// キャラクターデータ: カルロス (ID: 6)
// 新しいキャラを追加する場合はこのファイルをコピーして
// CHAR_DATA.push({ ... }) の中身を書き換えてください。
// ============================================================
CHAR_DATA.push(
{ id:6, name:'カルロス', element:'紅', class:'スナイパー', tags:['debuff'],
    quote:'一発で終わらせる。それが俺の流儀だ', title:'鉄火の狙撃者', sub:'業炎の執行者',
    gradient:'portrait-gradient-1', status:{hp:7800,atk:2050,def:820,spd:125},
    profile:{height:'178cm',weight:'72kg',blood:'A型',birthday:'2月5日',desc:'元軍人の傭兵狙撃手。冷静沈着な判断力と卓越した射撃技術で知られる。感情を表に出さないが、仲間には厚い信頼を寄せている。'},
    skills:{
      サタン:[{name:'アクティブスキル1',ct:3,desc:'炎弾射撃：高速の炎属性弾を放つ。クリティカル確率が高い。',summary:'高クリ単体射撃。'},{name:'アクティブスキル2',ct:6,desc:'焼夷弾：着弾地点に炎上エリアを設置する。踏んだ敵に<kw data-kw="継続ダメージ">継続ダメージ</kw>。',summary:'炎上エリア設置＋継続ダメージ。'},{name:'パッシブスキル1',ct:null,desc:'狙撃眼：クリティカル発生時、追加で対象のDEFを5%低下させる。',summary:'クリ時DEFデバフ。'},{name:'パッシブスキル2',ct:null,desc:'炎の弾丸：攻撃時15%の確率で弾薬を2発連続射出する。',summary:'15%で2連射。'},{name:'専用武器',ct:null,desc:'【サタンの銃火】装備時、クリティカルダメージが20%増加。',summary:'クリダメ+20%。'}],
      ミカエル:[{name:'アクティブスキル1',ct:3,desc:'聖炎弾：単体への聖なる炎弾。命中で対象のデバフ1つ解除。',summary:'単体攻撃＋デバフ解除。'},{name:'アクティブスキル2',ct:6,desc:'聖域爆弾：範囲内の味方のATKを上昇させる炎のフィールドを設置。',summary:'味方ATK UPフィールド設置。'},{name:'パッシブスキル1',ct:null,desc:'守護の弾丸：仲間が攻撃を受けた時、確率で代わりにダメージを受ける。',summary:'確率でかばう。'},{name:'パッシブスキル2',ct:null,desc:'聖炎纏い：自身が回復を受けた時、ATKが3%上昇（最大15%）。',summary:'回復を受けるたびATK+3%（最大15%）。'},{name:'専用武器',ct:null,desc:'【ミカエルの聖砲】装備時、聖炎纏いの上限が25%に上昇。',summary:'聖炎纏いATK上限25%に。'}],
      メタトロン:[{name:'アクティブスキル1',ct:3,desc:'封炎弾：命中するとスキルCTを増加させる炎弾。',summary:'単体攻撃＋CT妨害。'},{name:'アクティブスキル2',ct:6,desc:'封鎖爆弾：着弾地点の敵のスキルを一定時間封印する。',summary:'エリア封印設置。'},{name:'パッシブスキル1',ct:null,desc:'封炎眼：封印状態の敵へのクリダメが15%増加。',summary:'封印敵へのクリダメ+15%。'},{name:'パッシブスキル2',ct:null,desc:'炎記録：バトル終了後EXP+4%。',summary:'バトル後EXP+4%。'},{name:'専用武器',ct:null,desc:'【メタトロンの焰典】装備時、封印エリアの持続時間が1ターン延長。',summary:'封印エリア持続+1ターン。'}],
    },
    voices:{ホーム:['何だ','まあいいか','お前もか','邪魔するな','一人にしてくれ'],戦闘:['狙い通り','終わった','次だ']},
    lament:{タイトル:['引き金の重さ','消えない硝煙','誰かのために','終わらない任務','夜明けの銃声'],メモリー:['戦場の夢','帰れない日々']},
  },
];

let currentChar = null, currentWeapon = 'サタン', summaryOn = false;

function renderCards(chars) {
  const grid = document.getElementById('charGrid');
  grid.innerHTML = '';
  chars.forEach(c => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.dataset.element = c.element; card.dataset.class = c.class;
    card.dataset.name = c.name; card.dataset.tags = (c.tags||[]).join(',');
    card.innerHTML = `<div class="card-inner"><div class="card-portrait-placeholder ${c.gradient}" style="position:relative;"><div class="portrait-silhouette"></div></div><div class="card-icon">✦</div><div class="card-element el-${c.element}">${c.element}</div><div class="card-name">${c.name}</div></div>`;
    card.addEventListener('click', () => openDetail(c));
    grid.appendChild(card);
  });
}

// Multi-select filters for the "all" list page
const listFilters = new Set();

function toggleListFilter(key, btn) {
  if (listFilters.has(key)) { listFilters.delete(key); btn.classList.remove('active'); }
  else { listFilters.add(key); btn.classList.add('active'); }
  applyListFilters();
}

function resetListFilters() {
  listFilters.clear();
  document.querySelectorAll('.filter-bar .filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
  applyListFilters();
}

function applyListFilters() {
  const nameVal = document.getElementById('nameSearch').value.trim();
  const elements = ['藍','紅','翠','黄'];
  const classes  = ['ウォーリア','スナイパー','ソーサラー'];
  const activeElems   = [...listFilters].filter(k => elements.includes(k));
  const activeClasses = [...listFilters].filter(k => classes.includes(k));

  document.querySelectorAll('.char-card').forEach(card => {
    let show = true;
    if (activeElems.length > 0)   show = show && activeElems.includes(card.dataset.element);
    if (activeClasses.length > 0) show = show && activeClasses.includes(card.dataset.class);
    if (nameVal) show = show && card.dataset.name.includes(nameVal);
    card.classList.toggle('hidden', !show);
  });
}

// Keep filterChars for sort sidebar (buff/debuff) - simplified version
let currentFilter = 'all';
function filterChars(type, btn) {
  currentFilter = type;
  if (['buff','debuff'].includes(type)) {
    document.querySelectorAll('.char-card').forEach(card => {
      card.classList.toggle('hidden', !card.dataset.tags.includes(type));
    });
  }
}
function filterByName() { applyListFilters(); }
function sortCharacters() { renderCards([...characters].sort((a,b) => a.name.localeCompare(b.name,'ja'))); }

function openDetail(char) {
  currentChar = char; currentWeapon = 'サタン'; summaryOn = false;
  document.getElementById('detailName').textContent = char.name;
  document.getElementById('detailQuote').textContent = char.quote;
  document.getElementById('detailTitle').textContent = char.title;
  document.getElementById('detailSub').textContent = char.sub;
  document.getElementById('detailPortrait').innerHTML = `<div class="portrait-icon-large">🔥</div><div class="${char.gradient}" style="width:100%;height:100%;"></div><div class="portrait-silhouette"></div>`;
  const st = char.status;
  const sd = char.sortData || {};
  document.getElementById('st-hp').textContent = (st.hp||0).toLocaleString();
  document.getElementById('st-atk').textContent = (st.atk||0).toLocaleString();
  document.getElementById('st-def').textContent = (st.def||0).toLocaleString();
  document.getElementById('st-spd').textContent = st.spd||0;
  // Use sortData (stable, computed once) for derived stats
  const sd2 = char.sortData || {};
  document.getElementById('st-mp').textContent = (sd2.mp||0).toLocaleString();
  document.getElementById('st-evade').textContent = sd2.evade||0;
  document.getElementById('st-hit').textContent = sd2.hit||0;
  document.getElementById('st-ct').textContent = (sd2.ct||0) + '%';
  document.getElementById('st-crit').textContent = (sd2.crit||0) + '%';
  document.getElementById('st-critd').textContent = (sd2.critd||0) + '%';
  document.getElementById('st-pen').textContent = (sd2.pen||0) + '%';
  document.getElementById('st-res').textContent = (sd2.res||0) + '%';
  document.getElementById('st-heal').textContent = (sd2.heal||0).toLocaleString();
  document.getElementById('st-mpreg').textContent = (sd2.mpreg||0).toLocaleString();
  document.getElementById('st-move').textContent = sd2.move||0;
  document.getElementById('st-wt').textContent = sd2.wt||0;
  document.getElementById('statusPanel').classList.remove('open');
  document.getElementById('pf-height').textContent = char.profile.height;
  document.getElementById('pf-weight').textContent = char.profile.weight;
  document.getElementById('pf-blood').textContent = char.profile.blood;
  document.getElementById('pf-bday').textContent = char.profile.birthday;
  document.getElementById('pf-desc').textContent = char.profile.desc;
  document.getElementById('memoEditor').innerHTML = '';
  document.getElementById('summaryToggle').classList.remove('checked');
  document.getElementById('skillSummaryText').classList.remove('show');
  document.querySelectorAll('.weapon-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.weapon-tab-btn').classList.add('active');
  renderSkills(); renderVoice(); renderLament();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.tab-btn').classList.add('active');
  document.getElementById('tab-skill').classList.add('active');
  showPage('detail');
}

function renderSkills() {
  if (!currentChar) return;
  const skills = currentChar.skills[currentWeapon] || [];
  document.getElementById('skillContent').innerHTML = skills.map(s => {
    const descHtml = s.desc.replace(/<kw data-kw="([^"]+)">([^<]+)<\/kw>/g, (m,kw,text) =>
      `<span class="skill-keyword" onclick="showKeyword('${kw}',event)">${text}</span>`);
    return `<div class="skill-block"><div class="skill-header"><span class="skill-name">${s.name}</span>${s.ct?`<span class="skill-ct">CT ${s.ct}</span>`:''}</div><div class="skill-desc">${descHtml}</div></div>`;
  }).join('');
  const summaryLines = skills.map(s => `【${s.name}】${s.summary}`).join('<br>');
  document.getElementById('skillSummaryText').innerHTML = `<b>専用武器：${currentWeapon}</b><br>${summaryLines}`;
  if (summaryOn) document.getElementById('skillSummaryText').classList.add('show');
}

function renderVoice() {
  if (!currentChar) return;
  let first = true;
  document.getElementById('voiceContent').innerHTML = Object.entries(currentChar.voices).map(([sec, lines]) => {
    const open = first; first = false;
    return `<div class="accordion-section"><div class="accordion-header" onclick="toggleAccordion(this)"><span class="accordion-arrow">${open?'▽':'▷'}</span><span>${sec}</span></div><div class="accordion-content ${open?'open':''}"><div class="voice-list">${lines.map(l=>`<div class="voice-item"><span class="voice-bullet">・</span><span>${l}</span></div>`).join('')}</div></div></div>`;
  }).join('');
}

function renderLament() {
  if (!currentChar) return;
  let first = true;
  document.getElementById('lamentContent').innerHTML = Object.entries(currentChar.lament).map(([sec, lines]) => {
    const open = first; first = false;
    const notes = (currentChar.lamentNotes && currentChar.lamentNotes[sec]) || [];
    return `<div class="accordion-section"><div class="accordion-header" onclick="toggleAccordion(this)"><span class="accordion-arrow">${open?'▽':'▷'}</span><span>${sec}</span></div><div class="accordion-content ${open?'open':''}"><div class="lament-list">${lines.map((l,i)=>`<div class="lament-line-wrap"><span class="lament-line-text">${l}</span><span class="lament-note-static">${(notes[i]||'')}</span></div>`).join('')}</div></div></div>`;
  }).join('');
}

function toggleAccordion(header) {
  const content = header.nextElementSibling;
  const isOpen = content.classList.toggle('open');
  header.querySelector('.accordion-arrow').textContent = isOpen ? '▽' : '▷';
}
function toggleStatus() { document.getElementById('statusPanel').classList.toggle('open'); }
function toggleSummary() {
  summaryOn = !summaryOn;
  document.getElementById('summaryToggle').classList.toggle('checked', summaryOn);
  document.getElementById('skillSummaryText').classList.toggle('show', summaryOn);
}
function selectWeapon(weapon, btn) {
  currentWeapon = weapon;
  document.querySelectorAll('.weapon-tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSkills();
}
function showKeyword(kw, e) {
  e.stopPropagation();
  const popup = document.getElementById('keywordPopup');
  document.getElementById('kwTitle').textContent = kw;
  document.getElementById('kwBody').textContent = keywords[kw] || '説明がありません。';

  // スキル効果ページに該当するものがあればリンクを表示
  let linkHtml = '';
  if (typeof skillEffectData !== 'undefined') {
    let found = null, foundType = '';
    ['buff','debuff'].forEach(type => {
      (skillEffectData[type]||[]).forEach(effect => {
        if (effect.name === kw || (effect.keywords||[]).some(k => k === kw)) {
          found = effect; foundType = type;
        }
      });
    });
    if (found) {
      linkHtml = `<span class="keyword-popup-link" onclick="closeKeywordPopup(); showSkillList('${foundType}'); setTimeout(()=>openSkillDetail(skillEffectData['${foundType}'].find(e=>e.id==='${found.id}')),50);">→ スキル効果ページへ</span>`;
    }
  }
  document.getElementById('kwLink').innerHTML = linkHtml;

  popup.style.top = (e.clientY + 12) + 'px';
  popup.style.left = Math.min(e.clientX, window.innerWidth - 300) + 'px';
  popup.classList.add('open');
}
function closeKeywordPopup() { document.getElementById('keywordPopup').classList.remove('open'); }
document.addEventListener('click', () => closeKeywordPopup());

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
}
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`tab-${name}`).classList.add('active');
}
function setSidebarActive(el) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
}
function execMemoCmd(cmd) { document.getElementById('memoEditor').focus(); document.execCommand(cmd, false, null); }
function insertMemoImage() {
  const url = prompt('画像URLを入力してください:');
  if (url) { document.getElementById('memoEditor').focus(); document.execCommand('insertImage', false, url); }
}

function openSearchPanel() {
  const val = document.getElementById('globalSearchInput').value.trim();
  if (val) doGlobalSearch();
  else { document.getElementById('searchResultsBody').innerHTML = '<div class="search-no-result">キーワードを入力してください</div>'; document.getElementById('searchPanel').classList.add('open'); }
}
function closeSearchPanel(e) {
  if (!e.target.closest('.global-search-wrap') && !e.target.closest('.search-results-panel')) document.getElementById('searchPanel').classList.remove('open');
}
function doGlobalSearch() {
  const val = document.getElementById('globalSearchInput').value.trim().toLowerCase();
  if (!val) {
    document.getElementById('searchResultsBody').innerHTML = '<div class="search-no-result">キーワードを入力してください</div>';
    document.getElementById('searchPanel').classList.add('open');
    return;
  }

  const results = [];

  // --- キャラクターデータ全体を検索 ---
  characters.forEach(c => {
    const checks = [
      { text: c.name,    type: 'キャラ名' },
      { text: c.title,   type: '肩書き' },
      { text: c.sub,     type: '肩書き' },
      { text: c.quote,   type: 'セリフ' },
      { text: c.element, type: '元素' },
      { text: c.class,   type: 'クラス' },
      { text: c.profile && c.profile.desc, type: 'プロフィール' },
    ];
    // lament lines
    if (c.lament) Object.values(c.lament).flat().forEach(l => checks.push({text: l, type: 'ラメント'}));
    // voice lines
    if (c.voices) Object.values(c.voices).flat().forEach(l => checks.push({text: l, type: 'ボイス'}));
    // skill descriptions
    if (c.skills) Object.values(c.skills).flat().forEach(s => {
      checks.push({text: s.name, type: 'スキル名'});
      checks.push({text: s.desc.replace(/<[^>]+>/g,''), type: 'スキル説明'});
      checks.push({text: s.summary, type: 'スキル要約'});
    });

    let matchType = '';
    for (const {text, type} of checks) {
      if (text && text.toLowerCase().includes(val)) { matchType = type; break; }
    }
    if (matchType) results.push({ kind: 'char', char: c, matchType });
  });

  // --- スキル効果ページを検索 ---
  if (typeof skillEffectData !== 'undefined') {
    ['buff','debuff'].forEach(type => {
      (skillEffectData[type]||[]).forEach(effect => {
        if (effect.name.toLowerCase().includes(val) || effect.desc.replace(/<[^>]+>/g,'').toLowerCase().includes(val)) {
          results.push({ kind: 'skilleffect', effect, effectType: type });
        }
      });
    });
  }

  if (results.length === 0) {
    document.getElementById('searchResultsBody').innerHTML = `<div class="search-no-result">「${val}」に一致する結果が見つかりませんでした</div>`;
  } else {
    document.getElementById('searchResultsBody').innerHTML = results.map(r => {
      if (r.kind === 'char') {
        return `<div class="search-result-item" onclick="openDetail(characters.find(c=>c.id===${r.char.id})); document.getElementById('searchPanel').classList.remove('open');"><div class="search-result-thumb ${r.char.gradient}">🔥</div><div><div class="search-result-name">${r.char.name}</div><div class="search-result-sub">${r.char.title}</div></div><span class="search-result-tag">${r.matchType}</span></div>`;
      } else {
        return `<div class="search-result-item" onclick="showSkillList('${r.effectType}'); setTimeout(()=>openSkillDetail(skillEffectData['${r.effectType}'].find(e=>e.id==='${r.effect.id}')),50); document.getElementById('searchPanel').classList.remove('open');"><div class="search-result-thumb" style="background:#17171e;font-size:14px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-gold);">${r.effectType==='buff'?'＋':'－'}</div><div><div class="search-result-name">${r.effect.name}</div><div class="search-result-sub">スキル効果 · ${r.effectType.toUpperCase()}</div></div><span class="search-result-tag">スキル効果</span></div>`;
      }
    }).join('');
  }
  document.getElementById('searchPanel').classList.add('open');
}


// ===== THEME TOGGLE =====
function toggleTheme() {
  const root = document.documentElement;
  const isLight = root.classList.toggle('light');
  document.getElementById('themeIcon').textContent  = isLight ? '🌙' : '☀';
  document.getElementById('themeLabel').textContent = isLight ? 'ダーク' : 'ライト';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}
// Default: light mode. Only switch to dark if explicitly saved.
(function() {
  const saved = localStorage.getItem('theme');
  const isLight = saved !== 'dark'; // default to light
  if (isLight) {
    document.documentElement.classList.add('light');
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon) icon.textContent  = '🌙';
    if (label) label.textContent = 'ダーク';
  }
})();


// ===== HOME PAGE =====
function renderHome() {
  document.getElementById('homeCharCount').textContent = characters.length;
  const grid = document.getElementById('homeCharGrid');
  if (!grid) return;
  grid.innerHTML = '';
  characters.slice(0, 12).forEach(c => {
    const chip = document.createElement('div');
    chip.className = 'home-char-chip';
    chip.innerHTML = `
      <div class="home-char-thumb">
        <div class="home-char-thumb-inner ${c.gradient}">
          <div class="portrait-silhouette"></div>
        </div>
      </div>
      <div class="home-char-label">${c.name}</div>
    `;
    chip.addEventListener('click', () => {
      openDetail(c);
      setSidebarActive(document.querySelector('.sidebar-link'));
    });
    grid.appendChild(chip);
  });
}

renderCards(characters);
renderHome();

// ===== SORT PAGE =====
// Extend character data with extra sort fields
characters.forEach(c => {
  // parse numeric values from profile strings
  const st = c.status;
  c.sortData = {
    hp:       st.hp,
    atk:      st.atk,
    def:      st.def,
    spd:      st.spd,
    mp:       st.mp || Math.round((st.atk||0)*0.6),
    evade:    st.evade || Math.round((st.spd||0)*0.5+40),
    hit:      st.hit  || Math.round((st.atk||0)*0.03+85),
    ct:       st.ct   || (Math.floor(Math.random()*10+5)),
    crit:     st.crit || (Math.floor(Math.random()*15+8)),
    critd:    st.critd|| (Math.floor(Math.random()*40+120)),
    pen:      st.pen  || (Math.floor(Math.random()*20+5)),
    res:      st.res  || (Math.floor(Math.random()*20+10)),
    heal:     st.heal || Math.round((st.def||0)*0.4+50),
    mpreg:    st.mpreg|| (Math.floor(Math.random()*30+20)),
    move:     st.move || Math.round((st.spd||0)*0.8+20),
    wt:       st.wt   || Math.round(100-(st.spd||0)*0.1),
    height:   parseInt(c.profile.height),
    weight:   parseInt(c.profile.weight),
    birthday: (() => {
      const m = c.profile.birthday.match(/(\d+)月(\d+)日/);
      return m ? parseInt(m[1]) * 100 + parseInt(m[2]) : 0;
    })(),
  };
});

const sortKeyLabels = {
  hp:'HP', atk:'ATK', def:'DEF', spd:'SPD',
  mp:'MP', evade:'回避', hit:'命中', ct:'CT短縮',
  crit:'クリ率', critd:'クリダメ', pen:'貫通', res:'耐性',
  heal:'回復力', mpreg:'魔力回復', move:'移動速度', wt:'WT',
  height:'身長', weight:'体重', birthday:'誕生日',
};
const sortKeyUnits = {
  hp:'', atk:'', def:'', spd:'',
  mp:'', evade:'', hit:'', ct:'%',
  crit:'%', critd:'%', pen:'%', res:'%',
  heal:'', mpreg:'', move:'', wt:'',
  height:'cm', weight:'kg', birthday:'',
};
let currentSortKey = 'spd';
let sortFilters = new Set();

function getSortVal(c, key) { return c.sortData[key] || 0; }

function getStatLabel(c, key) {
  if (key === 'height') return c.profile.height;
  if (key === 'weight') return c.profile.weight;
  if (key === 'birthday') return c.profile.birthday;
  return getSortVal(c, key).toLocaleString() + sortKeyUnits[key];
}

function setSortKey(key, btn) {
  currentSortKey = key;
  document.querySelectorAll('#sortCriteriaGrid .sort-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderSortResults();
}

function toggleSortFilter(key, btn) {
  if (sortFilters.has(key)) { sortFilters.delete(key); btn.classList.remove('active'); }
  else { sortFilters.add(key); btn.classList.add('active'); }
  renderSortResults();
}

function renderSortResults() {
  let list = [...characters];
  if (sortFilters.size > 0) {
    const _elements = ['藍','紅','翠','黄'];
    const _classes  = ['ウォーリア','スナイパー','ソーサラー'];
    const activeElems   = [...sortFilters].filter(k => _elements.includes(k));
    const activeClasses = [...sortFilters].filter(k => _classes.includes(k));
    // 元素同士はOR、クラス同士はOR、元素とクラス間はAND
    list = list.filter(c => {
      const elemOk   = activeElems.length   === 0 || activeElems.includes(c.element);
      const classOk  = activeClasses.length === 0 || activeClasses.includes(c.class);
      return elemOk && classOk;
    });
  }
  list.sort((a, b) => {
    if (currentSortKey === 'birthday') return getSortVal(a,'birthday') - getSortVal(b,'birthday');
    return getSortVal(b, currentSortKey) - getSortVal(a, currentSortKey);
  });
  const maxVal = Math.max(...list.map(c => getSortVal(c, currentSortKey))) || 1;
  const container = document.getElementById('sortResults');
  container.innerHTML = list.map((c, i) => {
    const rank = i + 1;
    const val = getSortVal(c, currentSortKey);
    const pct = currentSortKey === 'birthday' ? 100 : Math.round(val / maxVal * 100);
    return `
      <div class="sort-row" onclick="openDetail(c); setSidebarActive(document.querySelectorAll('.sidebar-link')[0]);" style="--c:${c}">
        <div class="sort-rank rank-${rank <= 3 ? rank : 0}">${rank}</div>
        <div class="sort-portrait">
          <div class="sort-portrait-inner ${c.gradient}">
            <div class="sort-icon">🔥</div>
            <div class="portrait-silhouette"></div>
          </div>
        </div>
        <div>
          <div class="sort-char-name">${c.name}</div>
          <div class="sort-char-sub">${c.title}</div>
        </div>
        <div class="sort-stat-bar">
          <span class="sort-stat-label">${sortKeyLabels[currentSortKey]}</span>
          ${currentSortKey !== 'birthday' ? `<div class="sort-stat-track"><div class="sort-stat-fill" style="width:${pct}%"></div></div>` : ''}
          <span class="sort-stat-val">${getStatLabel(c, currentSortKey)}</span>
        </div>
        <div class="sort-elem-dot el-${c.element}"></div>
      </div>
    `;
  }).join('');
  // Fix onclick to use index
  container.querySelectorAll('.sort-row').forEach((row, i) => {
    const char = list[i];
    row.onclick = () => { openDetail(char); setSidebarActive(document.querySelectorAll('.sidebar-link')[0]); };
  });
}

// ===== RELATIONSHIP PAGE =====
// Define country regions and character placements
);
