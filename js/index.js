// ============================================================
// データアセンブラ
// 各ファイルから読み込んだグローバル変数をメインスクリプトが
// 使う変数名に割り当てます。
//
// 新しいキャラを追加する手順:
//   1. data/chars/ に新しい .js ファイルを作成
//   2. CHAR_DATA.push({ id: <新ID>, name: '...', ... }) を記述
//   3. index.html の <script> ブロックに
//      <script src="data/chars/007_新キャラ名.js"></script>
//      を追加する (他のキャラファイルの直後)
// ============================================================

// キャラクター配列を昇順ソートして確定
const characters = CHAR_DATA.sort((a, b) => a.id - b.id);

// 共通データをメイン変数に割り当て
const keywords       = KEYWORDS;
const mapData        = MAP_DATA;
const skillEffectData = SKILL_EFFECT_DATA;
const relLayout      = REL_LAYOUT;
