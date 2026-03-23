// ============================================================
// 相関図データ
// countries: 国・勢力エリアの定義 (x,y,w,h,color,border)
// nodes: キャラクターの配置 (charId はキャラファイルの id と対応)
// edges: 関係線の定義 (from/to は charId, label は関係名)
// ============================================================
const REL_LAYOUT = {
  countries: [
    { id:'ブルク', label:'ブルク', x:60,  y:60,  w:420, h:340, color:'rgba(30,60,90,0.55)',  border:'rgba(60,110,160,0.5)' },
    { id:'ルプス', label:'ルプス', x:560, y:60,  w:380, h:340, color:'rgba(80,40,30,0.55)',  border:'rgba(160,80,60,0.5)' },
    { id:'無所属', label:'無所属', x:200, y:460, w:500, h:220, color:'rgba(40,40,40,0.45)',  border:'rgba(80,80,80,0.4)' },
  ],
  nodes: [
    { charId:1, x:130, y:140, countryId:'ブルク' },
    { charId:2, x:320, y:140, countryId:'ブルク' },
    { charId:3, x:130, y:300, countryId:'ブルク' },
    { charId:4, x:640, y:130, countryId:'ルプス' },
    { charId:5, x:820, y:130, countryId:'ルプス' },
    { charId:6, x:730, y:290, countryId:'ルプス' },
    { charId:1, x:300, y:520, countryId:'無所属', alias:'アムレート（客員）' },
  ],
  edges: [
    { from:1, to:2, label:'親友',   color:'#e8c96a' },
    { from:2, to:3, label:'同僚',   color:'#a09880' },
    { from:1, to:3, label:'師弟',   color:'#4abfc9' },
    { from:4, to:5, label:'ライバル', color:'#bf3a3a' },
    { from:4, to:6, label:'上官',   color:'#a09880' },
    { from:2, to:4, label:'因縁',   color:'#c9604a' },
    { from:3, to:5, label:'旧友',   color:'#3abf6a' },
  ],
};
