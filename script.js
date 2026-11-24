/**
 * ============================================================================
 * 《駕照別忘光！交通標誌辨識大挑戰》核心資料結構與互動程式 (script.js)
 *
 * 【交通法規與官方標準依據】
 * 1. 中華民國交通部《道路交通標誌標線號誌設置規則》
 * 2. 中華民國《道路交通安全規則》
 * 3. 中華民國《道路交通管理處罰條例》
 * ============================================================================
 */

/* ============================================================================
   一、獨立資料結構區（方便日後擴充題庫與標誌）
   ============================================================================ */

const SIGNS_CATALOG = [
  // ---------- (一) 警告標誌：紅邊白底正三角形 ----------
  {
    id: "sign_fork_road",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "岔路標誌（十字交叉）",
    meaning: "警告車輛駕駛人前方為十字交岔路口，應減速慢行並注意橫向來車。",
    usage: "設於視線不良或無號誌之交岔路口前，提醒駕駛人提前降速並確認路權順序。",
    lawRef: "設置規則第 24 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <path d="M50 34 V74 M32 54 H68" stroke="#111827" stroke-width="8" stroke-linecap="square"/>
    </svg>`
  },
  {
    id: "sign_winding",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "連續彎路標誌",
    meaning: "警告車輛駕駛人前方有連續彎道，應減速慢行並靠右行駛。",
    usage: "常見於山區或丘陵道路連續彎道前，進入彎道前應完成減速，嚴禁跨越雙黃線超車。",
    lawRef: "設置規則第 20 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <path d="M54 76 L54 64 L41 55 L58 45 L46 34" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="46,24 38,37 54,37" fill="#111827"/>
    </svg>`
  },
  {
    id: "sign_narrow_road",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "路幅漸縮標誌（雙側縮減）",
    meaning: "警告車輛駕駛人前方道路寬度縮減，應減速慢行並注意會車安全。",
    usage: "設於雙向車道寬度變窄或車道數減少路段前，避免併行搶道。",
    lawRef: "設置規則第 33 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <path d="M36 76 V58 L43 46 V32 M64 76 V58 L57 46 V32" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: "sign_pedestrian",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "當心行人標誌",
    meaning: "警告車輛駕駛人前方有行人穿越道或行人頻繁活動，應減速慢行並隨時準備停讓。",
    usage: "設於行人穿越道前或行人較多路段，遇有行人穿越時必須暫停禮讓。",
    lawRef: "設置規則第 44 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="50" cy="40" r="5.5" fill="#111827"/>
      <path d="M50 46 L50 63 M39 53 L61 53 M50 63 L41 76 M50 63 L59 76" stroke="#111827" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_children",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "當心兒童標誌",
    meaning: "用以促使車輛駕駛人減速慢行，特別注意學童及兒童通行安全。",
    usage: "設於小學、幼兒園、兒童遊樂場等學童經常出入處所附近道路。",
    lawRef: "設置規則第 45 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="42" cy="43" r="5" fill="#111827"/>
      <circle cx="58" cy="48" r="4.5" fill="#111827"/>
      <path d="M42 49 L42 65 M34 55 L58 57 M42 65 L36 76 M42 65 L48 76 M58 53 L58 66 M58 66 L53 76 M58 66 L63 76" stroke="#111827" stroke-width="3.8" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_road_work",
    topic: "signs",
    category: "warning",
    categoryName: "警告標誌",
    name: "道路施工標誌（橙底警告）",
    meaning: "警告車輛駕駛人前方道路正在施工，應減速慢行並依現場指引改道或小心通過。",
    usage: "施工期間臨時設置於工區前方，提醒駕駛人注意路面開挖、機具與施工人員。",
    lawRef: "設置規則第 54 條（施工標誌採用橙底黑邊黑色圖案）",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#F97316" stroke="#111827" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="46" cy="41" r="5" fill="#111827"/>
      <path d="M46 47 L42 62 L35 75 M42 62 L51 75 M45 52 L58 58 L66 74" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
      <polygon points="58,76 68,64 76,76" fill="#111827"/>
    </svg>`
  },

  // ---------- (二) 禁制標誌：遵行、禁止、限制 ----------
  {
    id: "sign_stop",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（遵行）",
    name: "停車再開標誌",
    meaning: "告示車輛駕駛人行至交岔路口前必須「完全停止」（車輪靜止），確認幹線道無來車且安全後，方得再開。",
    usage: "全台唯一八角形標誌！設於支線道與幹線道交會口，僅減速滑行而未完全停下即屬違規。",
    lawRef: "設置規則第 58 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" fill="#DC2626" stroke="#111827" stroke-width="4"/>
      <text x="50" y="61" text-anchor="middle" fill="#FFFFFF" font-size="32" font-weight="900">停</text>
    </svg>`
  },
  {
    id: "sign_yield",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（遵行）",
    name: "讓路標誌",
    meaning: "告示支線道車輛應減速慢行，禮讓幹線道車輛優先通行。",
    usage: "全台唯一倒三角形標誌！看到此標誌表示你位於支線道，應減速觀察左右幹線道來車並禮讓先行。",
    lawRef: "設置規則第 59 條",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="8,14 92,14 50,88" fill="#FFFFFF" stroke="#DC2626" stroke-width="9" stroke-linejoin="round"/>
      <text x="50" y="46" text-anchor="middle" fill="#111827" font-size="22" font-weight="900">讓</text>
    </svg>`
  },
  {
    id: "sign_no_entry",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（禁止）",
    name: "禁止進入標誌",
    meaning: "告示任何車輛（含汽車、機車、自行車）均禁止進入該路段。",
    usage: "常見於單行道出口端或特定管制道路入口，誤闖將構成逆向行駛。",
    lawRef: "設置規則第 60 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#DC2626" stroke="#111827" stroke-width="4"/>
      <rect x="18" y="42" width="64" height="16" rx="3" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: "sign_no_left_turn",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（禁止）",
    name: "禁止左轉標誌",
    meaning: "告示車輛行至該交岔路口時禁止向左轉彎。",
    usage: "設於車流量大或易因左轉造成壅塞事故之路口前，欲左轉車輛應依指示改道繞行。",
    lawRef: "設置規則第 62 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" stroke-width="9"/>
      <path d="M60 72 L60 44 Q60 34 50 34 L36 34" fill="none" stroke="#111827" stroke-width="7" stroke-linecap="round"/>
      <polygon points="38,25 25,34 38,43" fill="#111827"/>
      <line x1="22" y1="22" x2="78" y2="78" stroke="#DC2626" stroke-width="8"/>
    </svg>`
  },
  {
    id: "sign_two_stage_left",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（遵行）",
    name: "機慢車兩段左轉標誌",
    meaning: "告示普通重型機車、輕型機車及慢車行經該路口左轉時，應遵照兩段式左轉規定行駛。",
    usage: "看到此藍底圓形標誌時，機車左轉應先靠右行駛至右側待轉區停等，待橫向綠燈亮起後再直行通過。",
    lawRef: "設置規則第 65 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#0284C7" stroke="#111827" stroke-width="4"/>
      <path d="M62 72 L62 35 L32 35" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="32,25 18,35 32,45" fill="#FFFFFF"/>
      <circle cx="62" cy="56" r="6" fill="#FED90F"/>
    </svg>`
  },
  {
    id: "sign_no_parking",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（禁止）",
    name: "禁止停車標誌",
    meaning: "告示車輛禁止在該路段停放車輛，但可以「臨時停車」（停車時間未滿 3 分鐘，保持立即行駛狀態）。",
    usage: "藍底紅邊單斜線為「禁止停車」（對應黃線）；若為雙交叉斜線（✕）則為「禁止臨時停車」（對應紅線）。",
    lawRef: "設置規則第 79 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#0284C7" stroke="#DC2626" stroke-width="10"/>
      <line x1="23" y1="23" x2="77" y2="77" stroke="#DC2626" stroke-width="10"/>
    </svg>`
  },
  {
    id: "sign_no_stopping",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（禁止）",
    name: "禁止臨時停車標誌",
    meaning: "告示車輛嚴禁在該路段臨時停車及停車（連上下客或臨停 10 秒都不行）。",
    usage: "藍底紅邊雙交叉斜線（✕），通常與路邊「紅線」配合設置於消防栓、路口 10 公尺內或公車站區。",
    lawRef: "設置規則第 80 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#0284C7" stroke="#DC2626" stroke-width="10"/>
      <line x1="23" y1="23" x2="77" y2="77" stroke="#DC2626" stroke-width="9"/>
      <line x1="77" y1="23" x2="23" y2="77" stroke="#DC2626" stroke-width="9"/>
    </svg>`
  },
  {
    id: "sign_max_speed",
    topic: "signs",
    category: "prohibit",
    categoryName: "禁制標誌（限制）",
    name: "最高速限標誌（50）",
    meaning: "告示車輛行車時速不得超過標誌所示數字（本圖為每小時 50 公里）。",
    usage: "白底紅邊圓形內標註黑色數字，超過該速率即構成超速違規。",
    lawRef: "設置規則第 76 條",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" stroke-width="9"/>
      <text x="50" y="61" text-anchor="middle" fill="#111827" font-size="32" font-weight="900">50</text>
    </svg>`
  },

  // ---------- (三) 指示標誌：藍底 / 綠底方形 ----------
  {
    id: "sign_one_way",
    topic: "signs",
    category: "guide",
    categoryName: "指示標誌",
    name: "單行道指示標誌",
    meaning: "指示該道路僅准車輛依箭頭所指方向單向行駛。",
    usage: "藍底白箭頭方形標誌，設於單行道入口及沿途路口，提醒駕駛人依單一方向前進。",
    lawRef: "設置規則第 96 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="14" y="14" width="72" height="72" rx="10" fill="#0284C7" stroke="#111827" stroke-width="4"/>
      <path d="M50 74 L50 32" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
      <polygon points="50,20 34,38 66,38" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: "sign_crosswalk_guide",
    topic: "signs",
    category: "guide",
    categoryName: "指示標誌",
    name: "行人穿越道指示標誌",
    meaning: "指示前方設有行人穿越道（斑馬線），提醒用路人注意行人穿越位置。",
    usage: "藍底方形內嵌白色三角形與行人圖案，設於行人穿越道兩側。",
    lawRef: "設置規則第 98 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="12" y="12" width="76" height="76" rx="10" fill="#0284C7" stroke="#111827" stroke-width="4"/>
      <polygon points="50,20 82,76 18,76" fill="#FFFFFF"/>
      <circle cx="50" cy="40" r="4.5" fill="#111827"/>
      <path d="M50 45 L50 58 M42 50 L58 50 M50 58 L44 68 M50 58 L56 68" stroke="#111827" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_parking_area",
    topic: "signs",
    category: "guide",
    categoryName: "指示標誌",
    name: "停車場指示標誌",
    meaning: "指示附近設有公眾停車場，供駕駛人依箭頭方向前往停放車輛。",
    usage: "藍底白色「P」字方形標誌，常見於商圈、車站及觀光區周邊道路。",
    lawRef: "設置規則第 102 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="14" y="14" width="72" height="72" rx="10" fill="#0284C7" stroke="#111827" stroke-width="4"/>
      <text x="50" y="68" text-anchor="middle" fill="#FFFFFF" font-size="52" font-weight="900">P</text>
    </svg>`
  },
  {
    id: "sign_provincial_hwy",
    topic: "signs",
    category: "guide",
    categoryName: "指示標誌（路線編號）",
    name: "省道編號標誌（盾牌形）",
    meaning: "指示該道路為省道公路及其路線編號（如台 1 線）。",
    usage: "藍底白邊白字盾牌形為一般省道；紅底白邊白字盾牌形則為「省道快速公路」（如台 61 線、台 74 線）。",
    lawRef: "設置規則第 89 條",
    svg: `<svg viewBox="0 0 100 100">
      <path d="M22 16 H78 V52 Q78 78 50 88 Q22 78 22 52 Z" fill="#0284C7" stroke="#111827" stroke-width="4"/>
      <text x="50" y="58" text-anchor="middle" fill="#FFFFFF" font-size="34" font-weight="900">1</text>
    </svg>`
  },

  // ---------- (四) 輔助標誌：附掛於主標誌下方之白底黑字附牌 ----------
  {
    id: "sign_aux_time",
    topic: "signs",
    category: "auxiliary",
    categoryName: "輔助標誌",
    name: "管制時間輔助標誌",
    meaning: "附設於禁制標誌（如禁止左轉、禁止停車）下方，說明該管制僅在標示之特定時段生效。",
    usage: "白底黑邊黑字長方形附牌，非管制時段內車輛即可依一般規定通行或停放。",
    lawRef: "設置規則第 128 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="10" y="28" width="80" height="44" rx="6" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
      <text x="50" y="48" text-anchor="middle" fill="#111827" font-size="13" font-weight="900">07:00-09:00</text>
      <text x="50" y="64" text-anchor="middle" fill="#DC2626" font-size="12" font-weight="900">例假日除外</text>
    </svg>`
  },
  {
    id: "sign_aux_distance",
    topic: "signs",
    category: "auxiliary",
    categoryName: "輔助標誌",
    name: "前方距離輔助標誌",
    meaning: "附設於警告或指示標誌下方，告示駕駛人距離前方危險路段或設施還有多少公尺。",
    usage: "幫助駕駛人預估減速距離（例如配合「道路施工」或「當心行人」標誌使用）。",
    lawRef: "設置規則第 127 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="14" y="30" width="72" height="40" rx="6" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
      <text x="50" y="56" text-anchor="middle" fill="#111827" font-size="20" font-weight="900">前方 200M</text>
    </svg>`
  },
  {
    id: "sign_aux_tow",
    topic: "signs",
    category: "auxiliary",
    categoryName: "輔助標誌",
    name: "違規停車拖吊輔助標誌",
    meaning: "附設於禁止停車或禁止臨時停車標誌下方，警告違規停放車輛將依法拖吊移置。",
    usage: "提醒駕駛人切勿心存僥倖違規停車，以免遭開單並拖吊。",
    lawRef: "設置規則第 129 條",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="12" y="28" width="76" height="44" rx="6" fill="#FFFFFF" stroke="#111827" stroke-width="4"/>
      <text x="50" y="48" text-anchor="middle" fill="#DC2626" font-size="14" font-weight="900">違規停車</text>
      <text x="50" y="65" text-anchor="middle" fill="#111827" font-size="14" font-weight="900">依法拖吊</text>
    </svg>`
  }
];

const MARKINGS_CATALOG = [
  {
    id: "mark_double_yellow",
    topic: "markings",
    category: "longitudinal",
    name: "雙黃實線（分向限制線）",
    meaning: "用以劃分對向車道，雙向均「嚴禁超車、跨越或迴轉」。",
    rule: "黃色標線代表「分隔對向車流」。看到兩條平行黃實線，任何方向車輛均不得跨越駛入來車道超車或迴轉。",
    lawRef: "設置規則第 165 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <line x1="0" y1="56" x2="280" y2="56" stroke="#FED90F" stroke-width="4.5"/>
      <line x1="0" y1="64" x2="280" y2="64" stroke="#FED90F" stroke-width="4.5"/>
      <text x="140" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">← 對向來車道</text>
      <text x="140" y="96" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">本向行車道 →</text>
    </svg>`
  },
  {
    id: "mark_single_yellow_dash",
    topic: "markings",
    category: "longitudinal",
    name: "黃色虛線（行車分向線）",
    meaning: "用以劃分對向車道，在確認對向無來車且視距良好安全時，准許暫時跨越超車或迴轉。",
    rule: "同樣是黃線（分隔對向車流），但虛線代表「在安全條件下允許跨越超車」，超車後應立即駛回原車道。",
    lawRef: "設置規則第 164 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <line x1="10" y1="60" x2="270" y2="60" stroke="#FED90F" stroke-width="5.5" stroke-dasharray="24 18"/>
      <text x="140" y="34" text-anchor="middle" fill="#FEF08A" font-size="13" font-weight="bold">安全時可暫時跨越超車</text>
    </svg>`
  },
  {
    id: "mark_double_white",
    topic: "markings",
    category: "longitudinal",
    name: "雙白實線（禁止變換車道線）",
    meaning: "用以分隔「同向」車道，兩側車輛均「禁止變換車道」。",
    rule: "白色標線代表「分隔同向車流」！雙白實線常見於路口停止線前、隧道內或高架匝道口，壓線變換車道即屬違規。",
    lawRef: "設置規則第 167 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <line x1="0" y1="56" x2="280" y2="56" stroke="#FFFFFF" stroke-width="4.5"/>
      <line x1="0" y1="64" x2="280" y2="64" stroke="#FFFFFF" stroke-width="4.5"/>
      <text x="140" y="32" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">同向內側車道 →</text>
      <text x="140" y="96" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="bold">同向外側車道 →</text>
    </svg>`
  },
  {
    id: "mark_single_white_solid_dash",
    topic: "markings",
    category: "longitudinal",
    name: "單白實線 vs 白色虛線（同向車道線）",
    meaning: "白色虛線分隔同向車道，安全時可變換車道；單白實線分隔快慢車道或車道邊線，無必要不得任意跨越。",
    rule: "口訣：看顏色分「對向(黃) / 同向(白)」，看線型分「能跨(虛) / 不能跨(實)」。",
    lawRef: "設置規則第 166、167 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <line x1="10" y1="42" x2="270" y2="42" stroke="#FFFFFF" stroke-width="4.5" stroke-dasharray="20 16"/>
      <line x1="0" y1="82" x2="280" y2="82" stroke="#FFFFFF" stroke-width="4.5"/>
      <text x="140" y="26" text-anchor="middle" fill="#BAE6FD" font-size="12" font-weight="bold">白色虛線：同向可變換車道</text>
      <text x="140" y="106" text-anchor="middle" fill="#FEF08A" font-size="12" font-weight="bold">單白實線：不得任意跨越</text>
    </svg>`
  },
  {
    id: "mark_stop_line",
    topic: "markings",
    category: "transverse",
    name: "停止線（白色橫向粗實線）",
    meaning: "指示車輛在紅燈、閃光紅燈或「停車再開」時，前懸不得超越之停止位置。",
    rule: "停等紅燈時前輪壓過或超越停止線即屬「越線受罰」；且停止線後方常緊接行人穿越道，越線會擠壓行人空間。",
    lawRef: "設置規則第 170 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <rect x="115" y="10" width="12" height="100" fill="#FFFFFF"/>
      <rect x="32" y="40" width="68" height="38" rx="9" fill="#FF69B4" stroke="#111827" stroke-width="3"/>
      <text x="66" y="64" text-anchor="middle" fill="#FFF" font-size="12" font-weight="900">停在此線前</text>
      <text x="198" y="64" text-anchor="middle" fill="#FED90F" font-size="13" font-weight="900">← 停止線</text>
    </svg>`
  },
  {
    id: "mark_crosswalk",
    topic: "markings",
    category: "transverse",
    name: "枕木紋行人穿越道線（斑馬線）",
    meaning: "設於交岔路口供行人穿越道路之標線，行人擁有絕對優先通行權。",
    rule: "汽車與機車行近行人穿越道遇有行人穿越時，無論有無號誌均應暫停讓行人先行（保持 3 公尺以上安全距離）。",
    lawRef: "設置規則第 185 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <g fill="#FFFFFF" stroke="#111827" stroke-width="2">
        <rect x="85" y="14" width="16" height="92" rx="2"/>
        <rect x="115" y="14" width="16" height="92" rx="2"/>
        <rect x="145" y="14" width="16" height="92" rx="2"/>
        <rect x="175" y="14" width="16" height="92" rx="2"/>
      </g>
    </svg>`
  },
  {
    id: "mark_direction_arrow",
    topic: "markings",
    category: "special",
    name: "車道指向線（地面白色箭頭）",
    meaning: "指示該車道車輛行至交岔路口時所允許行駛之方向（直行、左轉、右轉或直行兼轉彎）。",
    rule: "行駛在僅畫有「左轉箭頭」的車道上，到路口時就必須左轉，不可直接直行，以免與直行車流衝突。",
    lawRef: "設置規則第 188 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <line x1="140" y1="0" x2="140" y2="120" stroke="#FFFFFF" stroke-width="3"/>
      <path d="M75 95 V35" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
      <polygon points="75,20 62,40 88,40" fill="#FFFFFF"/>
      <path d="M215 95 V55 Q215 42 200 42 H178" fill="none" stroke="#FED90F" stroke-width="7" stroke-linecap="round"/>
      <polygon points="180,30 162,42 180,54" fill="#FED90F"/>
    </svg>`
  },
  {
    id: "mark_red_yellow_curb",
    topic: "markings",
    category: "special",
    name: "路邊紅線 vs 黃線（禁止停車標線）",
    meaning: "紅實線為「禁止臨時停車線」（全天 24 小時連臨停都不行）；黃實線為「禁止停車線」（每日 07:00–20:00 禁止停車，但可未滿 3 分鐘臨停）。",
    rule: "口訣：「紅線連臨停都母湯；黃線白天可臨停 3 分鐘內（駕駛人須保持立即行駛狀態），晚上 8 點至隔早 7 點可停車」。",
    lawRef: "設置規則第 168、169 條",
    svg: `<svg viewBox="0 0 280 120">
      <rect width="280" height="120" fill="#334155"/>
      <rect x="0" y="0" width="280" height="22" fill="#E2E8F0"/>
      <rect x="0" y="22" width="135" height="8" fill="#EF4444"/>
      <rect x="145" y="22" width="135" height="8" fill="#FED90F"/>
      <text x="68" y="65" text-anchor="middle" fill="#FCA5A5" font-size="13" font-weight="900">紅線：禁臨停</text>
      <text x="212" y="65" text-anchor="middle" fill="#FEF08A" font-size="13" font-weight="900">黃線：禁停車</text>
    </svg>`
  }
];

const SIGNALS_CATALOG = [
  {
    id: "sig_green",
    topic: "signals",
    simKey: "green",
    name: "圓形綠燈",
    meaning: "表示准許車輛直行或左、右轉彎。但轉彎車輛應讓直行車及行人優先通行。",
    rule: "注意！「圓形綠燈」並未給予轉彎車絕對路權，左轉或右轉時仍須禮讓對向直行車與斑馬線行人。",
    lawRef: "設置規則第 206 條第 1 款",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="12" y="6" width="46" height="98" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="26" r="11" fill="#334155"/>
      <circle cx="35" cy="55" r="11" fill="#334155"/>
      <circle cx="35" cy="84" r="12" fill="#22C55E"/>
    </svg>`
  },
  {
    id: "sig_yellow",
    topic: "signals",
    simKey: "yellow",
    name: "圓形黃燈",
    meaning: "用以警告車輛駕駛人紅色燈號即將顯示，屆時將失去通行路權。",
    rule: "黃燈亮起時，尚未越過停止線之車輛「應減速煞車停於停止線前」；已越過停止線進入路口者，應迅速通過路口。",
    lawRef: "設置規則第 206 條第 2 款",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="12" y="6" width="46" height="98" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="26" r="11" fill="#334155"/>
      <circle cx="35" cy="55" r="12" fill="#FED90F"/>
      <circle cx="35" cy="84" r="11" fill="#334155"/>
    </svg>`
  },
  {
    id: "sig_red",
    topic: "signals",
    simKey: "red",
    name: "圓形紅燈",
    meaning: "表示車輛禁止通行，不得超越停止線或進入路口。",
    rule: "在台灣，圓形紅燈亮起時「紅燈右轉同樣屬於闖紅燈違規」（除非另有右轉箭頭綠燈亮起）！",
    lawRef: "設置規則第 206 條第 3 款",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="12" y="6" width="46" height="98" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="26" r="12" fill="#EF4444"/>
      <circle cx="35" cy="55" r="11" fill="#334155"/>
      <circle cx="35" cy="84" r="11" fill="#334155"/>
    </svg>`
  },
  {
    id: "sig_arrow_green",
    topic: "signals",
    simKey: "arrow_left",
    name: "箭頭綠燈（方向指示號誌）",
    meaning: "表示僅准許車輛依箭頭所指之方向行駛（例如僅亮直行箭頭綠燈時，不可左轉或右轉）。",
    rule: "常見考題陷阱！當路口亮「直行箭頭綠燈」而「左轉箭頭尚未亮起」時，左轉車輛必須停等，不可搶先左轉。",
    lawRef: "設置規則第 206 條第 4 款",
    svg: `<svg viewBox="0 0 90 110">
      <rect x="10" y="6" width="70" height="98" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="32" cy="26" r="10" fill="#EF4444"/>
      <circle cx="32" cy="55" r="10" fill="#334155"/>
      <circle cx="32" cy="84" r="10" fill="#334155"/>
      <circle cx="60" cy="84" r="12" fill="#14532D"/>
      <path d="M66 84 H53 M58 79 L52 84 L58 89" fill="none" stroke="#22C55E" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  },
  {
    id: "sig_flash_red",
    topic: "signals",
    simKey: "flash_red",
    name: "閃光紅燈",
    meaning: "表示「停車再開」，車輛應減速接近，先停止於交岔路口前，讓幹線道車優先通行後認為安全時，方得續行。",
    rule: "閃光紅燈設於「支線道」，效力等同於八角形「停」標誌，車輪必須完全靜止後再起步。",
    lawRef: "設置規則第 211 條第 1 款",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="14" y="22" width="42" height="66" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="55" r="15" fill="#EF4444" class="blink-red"/>
    </svg>`
  },
  {
    id: "sig_flash_yellow",
    topic: "signals",
    simKey: "flash_yellow",
    name: "閃光黃燈",
    meaning: "表示「警告」，車輛應減速接近，注意安全，小心通過。",
    rule: "閃光黃燈設於「幹線道」，雖擁有優先於閃光紅燈支線道的路權，仍須減速防禦駕駛。",
    lawRef: "設置規則第 211 條第 2 款",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="14" y="22" width="42" height="66" rx="12" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="55" r="15" fill="#FED90F" class="blink-yellow"/>
    </svg>`
  },
  {
    id: "sig_pedestrian",
    topic: "signals",
    simKey: "green",
    name: "行人專用號誌（小綠人／小紅人）",
    meaning: "「行走行人（綠燈）」准許行人快速穿越；「綠燈閃爍」警告尚未進入道路者禁止跨入；「站立行人（紅燈）」禁止行人穿越。",
    rule: "綠燈倒數閃爍時，已在斑馬線上的行人應加快腳步通過；尚未踏出人行道者應停下等待下一輪綠燈。",
    lawRef: "設置規則第 207 條",
    svg: `<svg viewBox="0 0 70 110">
      <rect x="12" y="6" width="46" height="98" rx="10" fill="#0F172A" stroke="#FED90F" stroke-width="3"/>
      <circle cx="35" cy="24" r="4" fill="#EF4444"/>
      <rect x="31" y="29" width="8" height="14" rx="2" fill="#EF4444"/>
      <circle cx="35" cy="64" r="4.5" fill="#22C55E"/>
      <path d="M35 69 L35 83 M28 74 L42 74 M35 83 L28 94 M35 83 L42 94" stroke="#22C55E" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  }
];

const CHALLENGE_BANK = [
  {
    id: "ch_01",
    topic: "signs",
    visualType: "sign",
    title: "停車再開標誌",
    promptMeaning: "行至交岔路口前必須「完全停止」，確認幹線道無來車安全後，方得再開。",
    wrongMeanings: [
      "只要減速至時速 20 公里以下滑行通過即可，不需完全停車",
      "前方為禁止任何車輛進入之單行道出口",
      "前方有連續下坡路段，應換低速檔行駛"
    ],
    tfStatement: "此八角形標誌為「停車再開標誌」，車輛行至路口前必須完全停止確認安全後才可起步。",
    tfIsTrue: true,
    explanation: "八角形紅底白字「停」為「停車再開標誌」（禁制標誌），支線道車輛必須在停止線前車輪完全靜止，確認幹線道無來車後才可再開。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 58 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_stop").svg
  },
  {
    id: "ch_02",
    topic: "signs",
    visualType: "sign",
    title: "讓路標誌",
    promptMeaning: "白底紅邊倒三角形，告示支線道車輛應減速慢行，禮讓幹線道車輛優先通行。",
    wrongMeanings: [
      "警告前方有急轉彎路段，禁止超車",
      "指示前方設有行人穿越道",
      "告示車輛必須在路口完全停止 3 秒鐘"
    ],
    tfStatement: "此倒三角形標誌代表「前方有陡坡」，提醒駕駛人注意煞車。",
    tfIsTrue: false,
    explanation: "白底紅邊倒三角形是全台唯一的「讓路標誌」，代表你位於支線道，應減速慢行禮讓幹線道車輛優先通行。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 59 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_yield").svg
  },
  {
    id: "ch_03",
    topic: "signs",
    visualType: "sign",
    title: "機慢車兩段左轉標誌",
    promptMeaning: "告示普通重型機車、輕型機車及慢車行經該路口左轉時，應先靠右駛入待轉區兩段式左轉。",
    wrongMeanings: [
      "告示機車必須直接切入最內側快車道跟隨汽車左轉",
      "指示前方為圓環路段，車輛應逆時針繞行",
      "禁止所有機車進入該路口"
    ],
    tfStatement: "看到此藍底圓形標誌時，普通重型機車左轉應先靠右行駛至待轉區停等。",
    tfIsTrue: true,
    explanation: "此為「機慢車兩段左轉標誌」（禁制遵行標誌），機車行經該路口左轉應先靠右進入機慢車左轉待轉區，待橫向綠燈亮起後再直行通過。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 65 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_two_stage_left").svg
  },
  {
    id: "ch_04",
    topic: "signs",
    visualType: "sign",
    title: "禁止進入標誌",
    promptMeaning: "紅底白橫槓圓形標誌，告示任何車輛均禁止進入該路段。",
    wrongMeanings: [
      "道路施工封閉，僅限當地住戶車輛進入",
      "前方設有收費站，車輛應減速繳費",
      "禁止停車，但允許臨時停車 3 分鐘"
    ],
    tfStatement: "此標誌為「禁止進入標誌」，任何汽車、機車與自行車均不得駛入。",
    tfIsTrue: true,
    explanation: "紅底中間一道白色橫槓為「禁止進入標誌」，常見於單行道出口端，任何車輛均禁止進入。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 60 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_no_entry").svg
  },
  {
    id: "ch_05",
    topic: "signs",
    visualType: "sign",
    title: "禁止臨時停車標誌",
    promptMeaning: "藍底紅邊雙交叉斜線（✕），告示車輛嚴禁在該路段臨時停車及停車。",
    wrongMeanings: [
      "禁止停車，但駕駛人在車上可臨時停車 3 分鐘內",
      "前方十字路口禁止左右轉彎",
      "前方為鐵路平交道警示區"
    ],
    tfStatement: "此藍底紅叉標誌為「禁止停車標誌」，只要不熄火就可以在路邊臨停 3 分鐘。",
    tfIsTrue: false,
    explanation: "雙交叉斜線（✕）是「禁止臨時停車標誌」（對應路邊紅線），連上下客臨停都不行；單斜線（／）才是「禁止停車標誌」（對應黃線）。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 80 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_no_stopping").svg
  },
  {
    id: "ch_06",
    topic: "signs",
    visualType: "sign",
    title: "當心行人標誌",
    promptMeaning: "紅邊三角形內繪有行人圖案，警告駕駛人前方有行人穿越道或行人活動，應減速準備停讓。",
    wrongMeanings: [
      "指示此處為行人徒步區，車輛完全禁止通行",
      "前方設有公園停車場",
      "警告前方有學童專車停靠站"
    ],
    tfStatement: "三角形紅邊標誌屬於「警告標誌」，此圖提醒駕駛人前方有行人穿越道或行人活動。",
    tfIsTrue: true,
    explanation: "紅邊正三角形為警告標誌，此標誌為「當心行人」，提醒駕駛人提前降速並注意停讓行人。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 44 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_pedestrian").svg
  },
  {
    id: "ch_07",
    topic: "signs",
    visualType: "sign",
    title: "道路施工標誌",
    promptMeaning: "橙底黑邊三角形標誌，警告駕駛人前方道路正在施工，應減速慢行小心通過。",
    wrongMeanings: [
      "前方有落石坍方，道路已永久封閉",
      "指示前方設有資源回收場",
      "警告前方為連續急轉彎山路"
    ],
    tfStatement: "施工標誌採用醒目的「橙底黑圖案」，提醒駕駛人前方施工應減速慢行。",
    tfIsTrue: true,
    explanation: "依規定道路施工警告標誌採用橙色底黑色邊線及圖案，提醒駕駛人注意前方工區與人員機具。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 54 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_road_work").svg
  },
  {
    id: "ch_08",
    topic: "signs",
    visualType: "sign",
    title: "單行道指示標誌",
    promptMeaning: "藍底白色向上箭頭方形標誌，指示該道路僅准車輛依箭頭方向單向行駛。",
    wrongMeanings: [
      "強制規定車輛行至路口只能直行，禁止左右轉",
      "前方為上坡路段，大型車應靠右行駛",
      "指示前方有高速公路交流道入口"
    ],
    tfStatement: "藍底白箭頭的方形標誌是「單行道指示標誌」，表示該路段僅能依箭頭方向單向行駛。",
    tfIsTrue: true,
    explanation: "藍底方形為指示標誌，此為「單行道指示標誌」（圓形藍底白箭頭才是禁制標誌的「遵行方向」）。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 96 條",
    svg: SIGNS_CATALOG.find((s) => s.id === "sign_one_way").svg
  },
  {
    id: "ch_09",
    topic: "markings",
    visualType: "marking",
    title: "雙黃實線（分向限制線）",
    promptMeaning: "用以劃分對向車道，雙向車輛均嚴禁超車、跨越或迴轉。",
    wrongMeanings: [
      "分隔同向快慢車道，確認後方無車時可隨時跨越",
      "僅禁止對向車輛跨越，本向車輛可以跨越超車",
      "表示該路段夜間開放路邊停車"
    ],
    tfStatement: "雙黃實線用於分隔同向車道，只要打方向燈就可以變換車道。",
    tfIsTrue: false,
    explanation: "黃線是用來分隔「對向」車流，雙黃實線更是雙向嚴禁超車、跨越或迴轉！分隔同向車道的實線是「雙白實線」。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 165 條",
    svg: MARKINGS_CATALOG.find((m) => m.id === "mark_double_yellow").svg
  },
  {
    id: "ch_10",
    topic: "markings",
    visualType: "marking",
    title: "雙白實線（禁止變換車道線）",
    promptMeaning: "用以分隔同向車道，兩側同向車輛均禁止跨越變換車道。",
    wrongMeanings: [
      "用以分隔對向來車，雙向禁止迴轉",
      "表示前方設有減速丘，車輛應減速",
      "表示機慢車專用道邊線"
    ],
    tfStatement: "白色標線分隔同向車流，看到雙白實線時，左右兩側車道均禁止變換車道。",
    tfIsTrue: true,
    explanation: "正確！白色標線分隔同向車道，雙白實線常見於路口停止線前或隧道內，兩側車輛均不得壓線變換車道。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 167 條",
    svg: MARKINGS_CATALOG.find((m) => m.id === "mark_double_white").svg
  },
  {
    id: "ch_11",
    topic: "markings",
    visualType: "marking",
    title: "枕木紋行人穿越道線（斑馬線）",
    promptMeaning: "供行人穿越道路之標線，車輛行近遇有行人穿越時無論有無號誌均應暫停禮讓。",
    wrongMeanings: [
      "僅供自行車騎乘穿越之專用通道",
      "只有行人號誌為綠燈時車輛才需要禮讓行人",
      "黃網狀禁停區，車輛不可在上方暫停"
    ],
    tfStatement: "車輛行近枕木紋行人穿越道遇有行人穿越時，無論有無號誌均應暫停讓行人先行。",
    tfIsTrue: true,
    explanation: "依據《道路交通安全規則》第 103 條，行近行人穿越道遇有行人穿越時，無論有無指揮人員或號誌，均應暫停讓行人先行。",
    lawRef: "依據：《道路交通安全規則》第 103 條",
    svg: MARKINGS_CATALOG.find((m) => m.id === "mark_crosswalk").svg
  },
  {
    id: "ch_12",
    topic: "signals",
    visualType: "signal",
    title: "閃光紅燈號誌",
    promptMeaning: "設於支線道，表示「停車再開」，車輛應先停止於交岔路口前，讓幹線道車優先通行後安全方得續行。",
    wrongMeanings: [
      "設於幹線道，車輛只需減速慢行不需停車即可通過",
      "表示號誌設備故障維修中，所有車輛自由通行",
      "表示禁止所有車輛進入該路口，必須立即調頭"
    ],
    tfStatement: "深夜行經閃光紅燈路口時，只要左右看沒車，減速慢行直接通過即可，不需要完全停車。",
    tfIsTrue: false,
    explanation: "閃光紅燈代表「停車再開」，無論白天或深夜，車輛都必須在停止線前完全停下（車輪靜止），確認幹線道無來車後才可通過。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 211 條",
    svg: SIGNALS_CATALOG.find((s) => s.id === "sig_flash_red").svg
  },
  {
    id: "ch_13",
    topic: "signals",
    visualType: "signal",
    title: "圓形紅燈號誌",
    promptMeaning: "表示車輛禁止通行，不得超越停止線或進入路口（含禁止紅燈右轉）。",
    wrongMeanings: [
      "直行車停止，但右轉車可以直接紅燈右轉不需停等",
      "警告綠燈即將亮起，車輛可提前起步",
      "僅限制大型車停止，機車可繼續直行"
    ],
    tfStatement: "台灣交通規則中，圓形紅燈亮起時，車輛不得紅燈右轉（除非另有右轉箭頭綠燈亮起）。",
    tfIsTrue: true,
    explanation: "正確！圓形紅燈禁止車輛超越停止線通行，未設右轉箭頭綠燈而逕行紅燈右轉者，依闖紅燈論處。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 206 條",
    svg: SIGNALS_CATALOG.find((s) => s.id === "sig_red").svg
  },
  {
    id: "ch_14",
    topic: "signals",
    visualType: "signal",
    title: "箭頭綠燈號誌",
    promptMeaning: "表示僅准許車輛依箭頭所指之方向行駛，其他方向車流仍須依指示停等。",
    wrongMeanings: [
      "與圓形綠燈完全相同，直行、左轉、右轉皆可自由通行",
      "警告前方道路改道，所有車輛強制左轉",
      "僅供公車與計程車專用之優先燈號"
    ],
    tfStatement: "當號誌僅亮「左轉箭頭綠燈」而無直行綠燈時，表示左轉車輛可依箭頭方向左轉。",
    tfIsTrue: true,
    explanation: "箭頭綠燈代表僅准許依箭頭所指方向行駛，使該方向車流能在受保護的時相中安全通過。",
    lawRef: "依據：《道路交通標誌標線號誌設置規則》第 206 條",
    svg: SIGNALS_CATALOG.find((s) => s.id === "sig_arrow_green").svg
  }
];

const BADGES_LIST = [
  {
    id: "badge_first_try",
    icon: "🌱",
    title: "重返駕訓班",
    desc: "完成第 1 局互動闖關測驗，踏出複習第一步！"
  },
  {
    id: "badge_sharp_eye",
    icon: "👀",
    title: "鷹眼辨識王",
    desc: "在單局測驗中獲得 85%（含）以上的高正確率！"
  },
  {
    id: "badge_speedster",
    icon: "⚡",
    title: "閃電反應王",
    desc: "完成 1 次「60 秒限時挑戰」並答對至少 5 題！"
  },
  {
    id: "badge_fixer",
    icon: "🛠️",
    title: "錯題終結者",
    desc: "透過錯題複習功能重練並成功答對曾做錯的題目！"
  },
  {
    id: "badge_points_300",
    icon: "🍩",
    title: "甜甜圈優良駕駛",
    desc: "累積交通安全學習積分達到 300 分！"
  },
  {
    id: "badge_master_800",
    icon: "👑",
    title: "交通法規大師",
    desc: "累積交通安全學習積分達到 800 分以上！"
  }
];

/* ============================================================================
   二、localStorage 狀態管理
   ============================================================================ */

const STORAGE_KEY = "dont_forget_license_signs_cartoon_v3";

const DEFAULT_RECORDS = {
  totalScore: 0,
  completedQuizzes: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  bestAccuracy: 0,
  timedBestCorrect: 0,
  fixedWrongCount: 0,
  wrongQuestionIds: []
};

let userRecords = loadRecords();

function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_RECORDS));
    return { ...JSON.parse(JSON.stringify(DEFAULT_RECORDS)), ...JSON.parse(raw) };
  } catch (err) {
    console.warn("讀取 localStorage 失敗：", err);
    return JSON.parse(JSON.stringify(DEFAULT_RECORDS));
  }
}

function saveRecords() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userRecords));
  } catch (err) {
    console.warn("儲存 localStorage 失敗：", err);
  }
  syncAllDisplays();
}

function showToast(msg) {
  const el = document.getElementById("toastBox");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ============================================================================
   三、頁面導覽與全域同步
   ============================================================================ */

let signFilterCategory = "all";
let signSearchKeyword = "";
let markingFilterCategory = "all";

function navigateTo(pageId) {
  if (gameSession.timerId && pageId !== "game") {
    clearInterval(gameSession.timerId);
    gameSession.timerId = null;
  }

  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `page-${pageId}`);
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageId);
  });

  const navLinks = document.getElementById("navLinks");
  if (navLinks) navLinks.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
  syncAllDisplays();
}

function syncAllDisplays() {
  const navScore = document.getElementById("navScore");
  const gameBannerScore = document.getElementById("gameBannerScore");
  if (navScore) navScore.textContent = userRecords.totalScore;
  if (gameBannerScore) gameBannerScore.textContent = userRecords.totalScore;

  const homeTotalScore = document.getElementById("homeTotalScore");
  const homeQuizCount = document.getElementById("homeQuizCount");
  const homeAccuracy = document.getElementById("homeAccuracy");
  const homeWrongCount = document.getElementById("homeWrongCount");

  if (homeTotalScore) {
    homeTotalScore.textContent = `${userRecords.totalScore} 分`;
    homeQuizCount.textContent = `${userRecords.completedQuizzes} 次`;
    homeWrongCount.textContent = `${userRecords.wrongQuestionIds.length} 題`;
    if (userRecords.totalAnswered === 0) {
      homeAccuracy.textContent = "尚未作答";
    } else {
      const rate = Math.round((userRecords.totalCorrect / userRecords.totalAnswered) * 100);
      homeAccuracy.textContent = `${rate}%（${userRecords.totalCorrect}/${userRecords.totalAnswered}題）`;
    }
  }

  renderSignsCatalog();
  renderMarkingsCatalog();
  renderSignalsCatalog();
  renderRecordsPage();
}

/* ============================================================================
   四、三大圖鑑渲染（交通標誌、道路標線、交通號誌）
   ============================================================================ */

function renderSignsCatalog() {
  const grid = document.getElementById("signsCatalogGrid");
  const totalBadge = document.getElementById("totalSignsBadge");
  if (!grid) return;

  if (totalBadge) totalBadge.textContent = SIGNS_CATALOG.length;

  const kw = signSearchKeyword.trim().toLowerCase();
  const filtered = SIGNS_CATALOG.filter((item) => {
    const matchCat = signFilterCategory === "all" || item.category === signFilterCategory;
    const matchKw =
      !kw ||
      item.name.toLowerCase().includes(kw) ||
      item.meaning.toLowerCase().includes(kw) ||
      item.usage.toLowerCase().includes(kw) ||
      item.categoryName.toLowerCase().includes(kw);
    return matchCat && matchKw;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="card" style="grid-column:1/-1; text-align:center;">找不到符合「${signSearchKeyword}」的交通標誌，請嘗試其他關鍵字或切換分類。</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (sign) => `
      <article class="sign-item-card" data-detail-type="sign" data-item-id="${sign.id}" role="button" tabindex="0">
        <div class="sign-card-top">
          <span class="cat-badge cat-${sign.category}">${sign.categoryName}</span>
          <span class="muted-text" style="font-size:0.8rem; font-weight:800;">點擊看詳解 🔍</span>
        </div>
        <div class="sign-svg-box">${sign.svg}</div>
        <h3>${sign.name}</h3>
        <p class="sign-meaning-preview">${sign.meaning}</p>
        <div class="sign-usage-box">💡 用途：${sign.usage}</div>
      </article>
    `
    )
    .join("");

  grid.querySelectorAll(".sign-item-card").forEach((card) => {
    const openFn = () => openItemDetailModal("sign", card.dataset.itemId);
    card.addEventListener("click", openFn);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFn();
      }
    });
  });
}

function renderMarkingsCatalog() {
  const grid = document.getElementById("markingsGrid");
  const totalBadge = document.getElementById("totalMarkingsBadge");
  if (!grid) return;

  if (totalBadge) totalBadge.textContent = MARKINGS_CATALOG.length;

  const list =
    markingFilterCategory === "all"
      ? MARKINGS_CATALOG
      : MARKINGS_CATALOG.filter((m) => m.category === markingFilterCategory);

  grid.innerHTML = list
    .map(
      (m) => `
      <article class="marking-card">
        <div class="marking-visual">${m.svg}</div>
        <div class="marking-body">
          <h3>${m.name}</h3>
          <p class="muted-text">${m.meaning}</p>
          <div class="marking-rule-pill">📌 ${m.rule}（${m.lawRef}）</div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderSignalsCatalog() {
  const grid = document.getElementById("signalsGrid");
  if (!grid) return;

  grid.innerHTML = SIGNALS_CATALOG.map(
    (sig) => `
    <article class="card signal-card">
      <div class="signal-icon-box">${sig.svg}</div>
      <div class="signal-info">
        <h3>${sig.name}</h3>
        <p>${sig.meaning}</p>
        <div class="marking-rule-pill">⚠️ ${sig.rule}（${sig.lawRef}）</div>
      </div>
    </article>
  `
  ).join("");
}

function updateSignalSimulator(simKey) {
  const target = SIGNALS_CATALOG.find((s) => s.simKey === simKey) || SIGNALS_CATALOG[0];
  const nameEl = document.getElementById("simSignalName");
  const ruleEl = document.getElementById("simSignalRule");
  const lawEl = document.getElementById("simSignalLaw");
  const stageEl = document.getElementById("simVisualStage");
  if (!nameEl || !stageEl) return;

  nameEl.textContent = target.name;
  ruleEl.textContent = `${target.meaning} ${target.rule}`;
  lawEl.textContent = `法規依據：《道路交通標誌標線號誌設置規則》${target.lawRef}`;
  stageEl.innerHTML = `<div style="width:120px; height:175px;">${target.svg}</div>`;

  document.querySelectorAll("#simButtonGroup button").forEach((btn) => {
    const isSelected = btn.dataset.sim === simKey;
    btn.classList.toggle("btn-yellow", isSelected);
    btn.classList.toggle("btn-blue", !isSelected);
  });
}

function openItemDetailModal(type, id) {
  const item = SIGNS_CATALOG.find((s) => s.id === id);
  if (!item) return;

  const modal = document.getElementById("detailModal");
  const content = document.getElementById("detailModalContent");
  content.innerHTML = `
    <div class="modal-head">
      <div class="modal-svg-large">${item.svg}</div>
      <div>
        <span class="cat-badge cat-${item.category}">${item.categoryName}</span>
        <h3 id="modalItemTitle" style="font-size:1.38rem; font-weight:900; margin-top:6px;">${item.name}</h3>
        <span class="muted-text" style="font-size:0.86rem; font-weight:800;">交通部${item.lawRef}</span>
      </div>
    </div>
    <div class="modal-info-block">
      <h4>📖 標誌代表意思</h4>
      <p>${item.meaning}</p>
    </div>
    <div class="modal-info-block">
      <h4>🚗 實際用途與駕駛注意事項</h4>
      <p>${item.usage}</p>
    </div>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

/* ============================================================================
   五、互動闖關遊戲引擎（四大玩法：看圖猜意思 / 看意思找標誌 / 真假辨識 / 限時挑戰）
   ============================================================================ */

let gameSession = {
  mode: "pic_to_meaning",
  questions: [],
  index: 0,
  score: 0,
  correctCount: 0,
  answeredCount: 0,
  combo: 0,
  sessionWrongIds: [],
  locked: false,
  timerId: null,
  timeLeft: 60
};

function shuffleList(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGameMode(mode, customQuestionList = null) {
  if (gameSession.timerId) {
    clearInterval(gameSession.timerId);
    gameSession.timerId = null;
  }

  let pool = [];
  if (customQuestionList) {
    pool = [...customQuestionList];
  } else {
    const selectedTopic = document.getElementById("gameTopicSelect").value;
    pool =
      selectedTopic === "all"
        ? [...CHALLENGE_BANK]
        : CHALLENGE_BANK.filter((q) => q.topic === selectedTopic);
  }

  if (pool.length < 4 && !customQuestionList) {
    pool = [...CHALLENGE_BANK];
  }

  const questionList = mode === "timed" ? shuffleList([...pool, ...shuffleList(pool)]) : shuffleList(pool).slice(0, 8);

  gameSession = {
    mode,
    questions: questionList,
    index: 0,
    score: 0,
    correctCount: 0,
    answeredCount: 0,
    combo: 0,
    sessionWrongIds: [],
    locked: false,
    timerId: null,
    timeLeft: 60
  };

  const modeNames = {
    pic_to_meaning: "模式 A：看圖猜意思",
    meaning_to_pic: "模式 B：看意思找標誌",
    true_false: "模式 C：真假辨識挑戰",
    timed: "模式 D：60 秒限時挑戰",
    wrong_review: "📝 錯題專項重練"
  };

  document.getElementById("hudModeLabel").textContent = modeNames[mode] || "互動闖關";
  document.getElementById("hudSessionScore").textContent = "0";

  const timerBox = document.getElementById("hudTimerBox");
  if (mode === "timed") {
    timerBox.classList.remove("hidden");
    document.getElementById("hudTimeLeft").textContent = "60";
    gameSession.timerId = setInterval(() => {
      gameSession.timeLeft -= 1;
      document.getElementById("hudTimeLeft").textContent = String(gameSession.timeLeft);
      if (gameSession.timeLeft <= 0) {
        clearInterval(gameSession.timerId);
        gameSession.timerId = null;
        showToast("⏰ 時間到！正在結算你的限時挑戰成績...");
        finishGameSession();
      }
    }, 1000);
  } else {
    timerBox.classList.add("hidden");
  }

  document.getElementById("gameMenuArea").classList.add("hidden");
  document.getElementById("gameSummaryArea").classList.add("hidden");
  document.getElementById("gamePlayArea").classList.remove("hidden");

  renderCurrentGameQuestion();
}

function renderCurrentGameQuestion() {
  if (gameSession.index >= gameSession.questions.length) {
    if (gameSession.mode === "timed") {
      gameSession.questions.push(...shuffleList(CHALLENGE_BANK));
    } else {
      finishGameSession();
      return;
    }
  }

  gameSession.locked = false;
  const q = gameSession.questions[gameSession.index];
  const renderArea = document.getElementById("questionRenderArea");
  const fbArea = document.getElementById("answerFeedbackArea");
  fbArea.classList.add("hidden");
  fbArea.classList.remove("fb-pass", "fb-fail");

  if (gameSession.mode === "timed") {
    document.getElementById("hudProgressText").textContent = `已作答 ${gameSession.answeredCount} 題（連對 ${gameSession.combo} 題）`;
    document.getElementById("gameProgressBar").style.width = `${Math.max(0, (gameSession.timeLeft / 60) * 100)}%`;
  } else {
    const total = gameSession.questions.length;
    const current = gameSession.index + 1;
    document.getElementById("hudProgressText").textContent = `第 ${current} / ${total} 題`;
    document.getElementById("gameProgressBar").style.width = `${Math.round((current / total) * 100)}%`;
  }

  let effectiveType = gameSession.mode;
  if (effectiveType === "timed" || effectiveType === "wrong_review") {
    const types = ["pic_to_meaning", "meaning_to_pic", "true_false"];
    effectiveType = types[gameSession.index % types.length];
  }

  const visualClass =
    q.visualType === "marking" ? "q-visual-center is-marking" : q.visualType === "signal" ? "q-visual-center is-signal" : "q-visual-center";

  if (effectiveType === "pic_to_meaning") {
    const correctText = `【${q.title}】${q.promptMeaning}`;
    const choices = shuffleList([
      { text: correctText, isCorrect: true },
      ...q.wrongMeanings.map((wm) => ({ text: wm, isCorrect: false }))
    ]);
    const letters = ["A", "B", "C", "D"];

    renderArea.innerHTML = `
      <div class="${visualClass}">${q.svg}</div>
      <h3 class="q-prompt-title">請問上圖代表的正確交通名稱與含義為何？</h3>
      <div class="text-options-grid">
        ${choices
          .map(
            (c, i) => `
          <button class="opt-choice-btn" data-correct="${c.isCorrect}">
            <span class="opt-key">${letters[i]}</span>
            <span>${c.text}</span>
          </button>
        `
          )
          .join("")}
      </div>
    `;

    renderArea.querySelectorAll(".opt-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isCorrect = btn.dataset.correct === "true";
        renderArea.querySelectorAll(".opt-choice-btn").forEach((b) => {
          b.disabled = true;
          if (b.dataset.correct === "true") b.classList.add("is-correct");
          else if (b === btn && !isCorrect) b.classList.add("is-wrong");
        });
        submitGameAnswer(q, isCorrect);
      });
    });
  } else if (effectiveType === "meaning_to_pic") {
    const distractors = shuffleList(CHALLENGE_BANK.filter((item) => item.id !== q.id)).slice(0, 3);
    const picChoices = shuffleList([
      { item: q, isCorrect: true },
      ...distractors.map((d) => ({ item: d, isCorrect: false }))
    ]);

    renderArea.innerHTML = `
      <div class="tf-statement-box">
        <span class="muted-text" style="display:block; font-size:0.86rem; font-weight:800; margin-bottom:4px;">請根據下列規則找出對應的正確圖示：</span>
        「${q.promptMeaning}」
      </div>
      <div class="pic-options-grid">
        ${picChoices
          .map(
            (pc, idx) => `
          <button class="pic-choice-btn" data-correct="${pc.isCorrect}" aria-label="圖片選項 ${idx + 1}">
            <div class="pic-choice-svg">${pc.item.svg}</div>
            <span style="font-size:0.86rem; font-weight:900;">選項 ${idx + 1}</span>
          </button>
        `
          )
          .join("")}
      </div>
    `;

    renderArea.querySelectorAll(".pic-choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const isCorrect = btn.dataset.correct === "true";
        renderArea.querySelectorAll(".pic-choice-btn").forEach((b) => {
          b.disabled = true;
          if (b.dataset.correct === "true") b.classList.add("is-correct");
          else if (b === btn && !isCorrect) b.classList.add("is-wrong");
        });
        submitGameAnswer(q, isCorrect);
      });
    });
  } else {
    renderArea.innerHTML = `
      <div class="${visualClass}">${q.svg}</div>
      <div class="tf-statement-box">
        <span class="muted-text" style="display:block; font-size:0.86rem; font-weight:800; margin-bottom:4px;">請判斷圖片與下列說明是否相符：</span>
        「${q.tfStatement}」
      </div>
      <div class="tf-buttons-row">
        <button class="btn btn-yellow tf-btn" data-tf="true">⭕ 正確（完全相符）</button>
        <button class="btn btn-danger tf-btn" data-tf="false">❌ 錯誤（說明有誤）</button>
      </div>
    `;

    renderArea.querySelectorAll(".tf-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const userSaidTrue = btn.dataset.tf === "true";
        const isCorrect = userSaidTrue === q.tfIsTrue;
        renderArea.querySelectorAll(".tf-btn").forEach((b) => {
          b.disabled = true;
          const btnVal = b.dataset.tf === "true";
          if (btnVal === q.tfIsTrue) {
            b.style.background = "var(--grass-green)";
            b.style.color = "var(--ink)";
          } else if (b === btn && !isCorrect) {
            b.style.background = "var(--alert-red)";
            b.style.color = "#fff";
          }
        });
        submitGameAnswer(q, isCorrect);
      });
    });
  }
}

function submitGameAnswer(q, isCorrect) {
  if (gameSession.locked) return;
  gameSession.locked = true;
  gameSession.answeredCount += 1;

  const fbArea = document.getElementById("answerFeedbackArea");
  const headline = document.getElementById("fbResultHeadline");
  const deltaEl = document.getElementById("fbPointDelta");
  const expText = document.getElementById("fbExplanationText");
  const lawEl = document.getElementById("fbLawCitation");
  const nextBtn = document.getElementById("nextGameQuestionBtn");

  fbArea.classList.remove("hidden", "fb-pass", "fb-fail");

  if (isCorrect) {
    gameSession.correctCount += 1;
    gameSession.combo += 1;
    const bonus = gameSession.mode === "timed" && gameSession.combo >= 3 ? 5 : 0;
    const gained = 15 + bonus;
    gameSession.score += gained;

    if (userRecords.wrongQuestionIds.includes(q.id)) {
      userRecords.wrongQuestionIds = userRecords.wrongQuestionIds.filter((id) => id !== q.id);
      userRecords.fixedWrongCount += 1;
    }

    fbArea.classList.add("fb-pass");
    headline.textContent = bonus > 0 ? `🔥 Woo-hoo! 連續答對 ${gameSession.combo} 題！` : "✅ Woo-hoo! 答對了！辨識完全正確！";
    deltaEl.textContent = `+${gained} 分`;
  } else {
    gameSession.combo = 0;
    if (!gameSession.sessionWrongIds.includes(q.id)) {
      gameSession.sessionWrongIds.push(q.id);
    }
    if (!userRecords.wrongQuestionIds.includes(q.id)) {
      userRecords.wrongQuestionIds.push(q.id);
    }

    fbArea.classList.add("fb-fail");
    headline.textContent = `❌ D'oh! 答錯囉！正確答案是【${q.title}】`;
    deltaEl.textContent = "+0 分（已收錄至錯題本）";
  }

  document.getElementById("hudSessionScore").textContent = String(gameSession.score);
  expText.textContent = q.explanation;
  lawEl.textContent = q.lawRef;

  const isLastNormal = gameSession.mode !== "timed" && gameSession.index >= gameSession.questions.length - 1;
  nextBtn.textContent = isLastNormal ? "查看本局成績結算 🏆" : "下一題 →";

  fbArea.classList.remove("hidden");
  saveRecords();
}

function finishGameSession() {
  if (gameSession.timerId) {
    clearInterval(gameSession.timerId);
    gameSession.timerId = null;
  }

  const answered = gameSession.answeredCount;
  const correct = gameSession.correctCount;
  const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;

  if (answered > 0) {
    userRecords.completedQuizzes += 1;
    userRecords.totalAnswered += answered;
    userRecords.totalCorrect += correct;
    userRecords.totalScore += gameSession.score;
    if (accuracy > userRecords.bestAccuracy) {
      userRecords.bestAccuracy = accuracy;
    }
    if (gameSession.mode === "timed" && correct > userRecords.timedBestCorrect) {
      userRecords.timedBestCorrect = correct;
    }
  }
  saveRecords();

  document.getElementById("gamePlayArea").classList.add("hidden");
  document.getElementById("gameSummaryArea").classList.remove("hidden");

  document.getElementById("sumCorrect").textContent = `${correct} / ${answered} 題`;
  document.getElementById("sumAccuracy").textContent = `${accuracy}%`;
  document.getElementById("sumPoints").textContent = `+${gameSession.score} 分`;

  const emojiEl = document.getElementById("summaryEmoji");
  const titleEl = document.getElementById("summaryTitle");
  const subEl = document.getElementById("summarySubtitle");

  if (accuracy >= 85) {
    emojiEl.textContent = "🏆";
    titleEl.textContent = "Woo-hoo! 滿分級交通辨識達人！";
    subEl.textContent = "你對台灣交通標誌、標線與號誌的掌握度超強！";
  } else if (accuracy >= 60) {
    emojiEl.textContent = "🍩";
    titleEl.textContent = "表現不錯！獎勵一顆粉紅甜甜圈！";
    subEl.textContent = "答錯的題目已自動收錄至「錯題本」，隨時可以針對弱點複習。";
  } else {
    emojiEl.textContent = "📘";
    titleEl.textContent = "D'oh! 再多翻翻圖鑑複習一下吧！";
    subEl.textContent = "建議先逛逛「標誌圖鑑」與「道路標線」，再回來挑戰一次！";
  }

  const practiceWrongBtn = document.getElementById("practiceWrongNowBtn");
  if (gameSession.sessionWrongIds.length > 0) {
    practiceWrongBtn.classList.remove("hidden");
    practiceWrongBtn.textContent = `📝 立即重練本局錯題（${gameSession.sessionWrongIds.length} 題）`;
  } else {
    practiceWrongBtn.classList.add("hidden");
  }
}

/* ============================================================================
   六、學習紀錄與成就頁面渲染
   ============================================================================ */

function getUnlockedBadgesSet() {
  const set = new Set();
  if (userRecords.completedQuizzes >= 1) set.add("badge_first_try");
  if (userRecords.bestAccuracy >= 85) set.add("badge_sharp_eye");
  if (userRecords.timedBestCorrect >= 5) set.add("badge_speedster");
  if (userRecords.fixedWrongCount >= 1) set.add("badge_fixer");
  if (userRecords.totalScore >= 300) set.add("badge_points_300");
  if (userRecords.totalScore >= 800) set.add("badge_master_800");
  return set;
}

function renderRecordsPage() {
  const recScore = document.getElementById("recScore");
  if (!recScore) return;

  recScore.textContent = `${userRecords.totalScore} 分`;
  document.getElementById("recSessions").textContent = `${userRecords.completedQuizzes} 局`;
  const acc =
    userRecords.totalAnswered > 0
      ? Math.round((userRecords.totalCorrect / userRecords.totalAnswered) * 100)
      : 0;
  document.getElementById("recAccuracy").textContent =
    userRecords.totalAnswered > 0 ? `${acc}%` : "0%";
  document.getElementById("recWrongCount").textContent = `${userRecords.wrongQuestionIds.length} 題`;

  const unlocked = getUnlockedBadgesSet();
  const badgesWall = document.getElementById("badgesWall");
  badgesWall.innerHTML = BADGES_LIST.map((b) => {
    const isOpen = unlocked.has(b.id);
    return `
      <div class="badge-item ${isOpen ? "unlocked" : ""}">
        <div class="badge-circle">${isOpen ? b.icon : "🔒"}</div>
        <div>
          <h4 style="font-weight:900;">${b.title}</h4>
          <p class="muted-text" style="font-size:0.84rem;">${b.desc}</p>
          <span class="badge-tag">${isOpen ? "✨ 已解鎖成就" : "尚未獲得"}</span>
        </div>
      </div>
    `;
  }).join("");

  const wrongContainer = document.getElementById("wrongQuestionsContainer");
  const wrongItems = CHALLENGE_BANK.filter((q) => userRecords.wrongQuestionIds.includes(q.id));

  if (wrongItems.length === 0) {
    wrongContainer.innerHTML = `<div style="grid-column:1/-1; padding:18px; background:#FEF9C3; border:3px solid #111827; border-radius:14px; text-align:center; font-weight:800;">🎉 目前沒有待複習的錯題！繼續保持滿分紀錄吧！</div>`;
  } else {
    wrongContainer.innerHTML = wrongItems
      .map(
        (item) => `
        <div class="wrong-item-card">
          <div class="wrong-mini-svg">${item.svg}</div>
          <div style="flex:1;">
            <strong style="color:#DC2626; font-size:1.02rem; font-weight:900;">${item.title}</strong>
            <p class="muted-text" style="font-size:0.86rem; margin:4px 0 8px;">${item.explanation}</p>
            <button class="btn btn-sm btn-yellow" data-repractice-id="${item.id}">單題重新練習 →</button>
          </div>
        </div>
      `
      )
      .join("");

    wrongContainer.querySelectorAll("[data-repractice-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = CHALLENGE_BANK.find((q) => q.id === btn.dataset.repracticeId);
        if (target) {
          navigateTo("game");
          startGameMode("wrong_review", [target]);
        }
      });
    });
  }
}

/* ============================================================================
   七、初始化所有按鈕與事件監聽（支援任何載入時機）
   ============================================================================ */

function initApp() {
  if (window.__appInitialized) return;
  window.__appInitialized = true;

  document.querySelectorAll(".nav-btn, .brand").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (el.dataset.page) navigateTo(el.dataset.page);
    });
  });

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => navigateTo(btn.dataset.goto));
  });

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.getElementById("resetAllBtn")?.addEventListener("click", () => {
    if (confirm("確定要清除所有積分、測驗次數與錯題本紀錄嗎？")) {
      userRecords = JSON.parse(JSON.stringify(DEFAULT_RECORDS));
      saveRecords();
      showToast("🔄 已重置所有學習紀錄");
    }
  });

  document.querySelectorAll("#signCategoryPills .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#signCategoryPills .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      signFilterCategory = btn.dataset.cat;
      renderSignsCatalog();
    });
  });

  document.getElementById("signSearchInput")?.addEventListener("input", (e) => {
    signSearchKeyword = e.target.value;
    renderSignsCatalog();
  });

  document.querySelectorAll("#markingFilterPills .pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#markingFilterPills .pill-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      markingFilterCategory = btn.dataset.mcat;
      renderMarkingsCatalog();
    });
  });

  document.querySelectorAll("#simButtonGroup button").forEach((btn) => {
    btn.addEventListener("click", () => updateSignalSimulator(btn.dataset.sim));
  });
  updateSignalSimulator("green");

  const detailModal = document.getElementById("detailModal");
  document.getElementById("closeDetailModal")?.addEventListener("click", () => {
    detailModal.classList.remove("open");
    detailModal.setAttribute("aria-hidden", "true");
  });
  detailModal?.addEventListener("click", (e) => {
    if (e.target === detailModal) {
      detailModal.classList.remove("open");
      detailModal.setAttribute("aria-hidden", "true");
    }
  });

  document.querySelectorAll("[data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => startGameMode(btn.dataset.mode));
  });

  document.getElementById("nextGameQuestionBtn")?.addEventListener("click", () => {
    gameSession.index += 1;
    renderCurrentGameQuestion();
  });

  document.getElementById("quitGameBtn")?.addEventListener("click", () => {
    if (gameSession.timerId) {
      clearInterval(gameSession.timerId);
      gameSession.timerId = null;
    }
    document.getElementById("gamePlayArea").classList.add("hidden");
    document.getElementById("gameMenuArea").classList.remove("hidden");
  });

  document.getElementById("playAgainBtn")?.addEventListener("click", () => {
    startGameMode(gameSession.mode);
  });

  document.getElementById("practiceWrongNowBtn")?.addEventListener("click", () => {
    const list = CHALLENGE_BANK.filter((q) => gameSession.sessionWrongIds.includes(q.id));
    if (list.length > 0) startGameMode("wrong_review", list);
  });

  document.getElementById("backToModesBtn")?.addEventListener("click", () => {
    document.getElementById("gameSummaryArea").classList.add("hidden");
    document.getElementById("gameMenuArea").classList.remove("hidden");
  });

  document.getElementById("startWrongPracticeBtn")?.addEventListener("click", () => {
    const list = CHALLENGE_BANK.filter((q) => userRecords.wrongQuestionIds.includes(q.id));
    if (list.length === 0) {
      showToast("🎉 目前沒有任何答錯的題目需要重練！");
      return;
    }
    navigateTo("game");
    startGameMode("wrong_review", list);
  });

  document.getElementById("clearWrongListBtn")?.addEventListener("click", () => {
    if (userRecords.wrongQuestionIds.length === 0) return;
    if (confirm("確定要清空錯題本清單嗎？")) {
      userRecords.wrongQuestionIds = [];
      saveRecords();
      showToast("已清空錯題本");
    }
  });

  syncAllDisplays();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
