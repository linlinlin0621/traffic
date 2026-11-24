/**
 * ============================================================================
 * 《駕照別忘光！》核心資料與互動邏輯 (script.js)
 * 說明：
 *   1. 所有題庫、交通標誌、知識單元、情境關卡均以獨立陣列／物件儲存於檔案上半部，
 *      初學者只需依照格式新增物件，即可輕鬆擴充題目與關卡！
 *   2. 學習紀錄與積分全面整合 localStorage，重新整理網頁後依然完整保留。
 *   3. 所有交通規則均依據台灣現行法規（道路交通安全規則、處罰條例、標誌標線號誌設置規則）。
 * ============================================================================
 */

/* ============================================================================
   一、獨立資料結構區（方便日後維護與擴充題庫）
   ============================================================================ */

/**
 * 1. 台灣常見交通標誌資料庫 (TRAFFIC_SIGNS_DATA)
 * 類別 category：'warning'(警告標誌) | 'prohibit'(禁制標誌) | 'guide'(指示標誌)
 */
const TRAFFIC_SIGNS_DATA = [
  {
    id: "sign_stop",
    name: "停車再開標誌",
    category: "prohibit",
    categoryLabel: "禁制標誌（遵行）",
    meaning: "表示車輛行至交岔路口前，必須完全停止（車輪完全靜止），確認幹線道無來車且安全後，方得再開。",
    precaution: "常見於支線道與幹線道交會處。未完全停車即滑行通過屬於違規行為；若與閃光紅燈併設，同樣必須先停車再行駛。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" fill="#DC2626" stroke="#FFFFFF" stroke-width="3"/>
      <text x="50" y="58" text-anchor="middle" fill="#FFFFFF" font-size="30" font-weight="900">停</text>
    </svg>`
  },
  {
    id: "sign_yield",
    name: "讓路標誌",
    category: "prohibit",
    categoryLabel: "禁制標誌（遵行）",
    meaning: "表示支線道車輛應減速慢行，禮讓幹線道車輛優先通行。",
    precaution: "白底紅邊倒三角形是全台唯一倒三角形標誌！看到此標誌代表你位於支線道，務必減速觀察左右幹線道來車。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="8,14 92,14 50,88" fill="#FFFFFF" stroke="#DC2626" stroke-width="9" stroke-linejoin="round"/>
      <text x="50" y="45" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">讓</text>
    </svg>`
  },
  {
    id: "sign_no_entry",
    name: "禁止進入標誌",
    category: "prohibit",
    categoryLabel: "禁制標誌（禁止）",
    meaning: "告示任何車輛（含汽車、機車、自行車）均禁止進入該路段。",
    precaution: "常見於單行道出口或管制區域入口，誤闖將構成逆向行駛，極易發生對撞事故。",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#DC2626"/>
      <rect x="18" y="42" width="64" height="16" rx="3" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: "sign_two_stage",
    name: "機慢車兩段左轉標誌",
    category: "prohibit",
    categoryLabel: "禁制標誌（遵行）",
    meaning: "告示普通重型機車、輕型機車及慢車行經該路口左轉時，應遵照兩段式左轉規定行駛。",
    precaution: "看到此藍底圓形標誌，或內側車道劃有「禁行機車」標字時，應先靠右行駛至右側待轉區停等，待橫向綠燈亮起後再直行通過。",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#0284C7" stroke="#FFFFFF" stroke-width="3"/>
      <path d="M62 72 L62 35 L32 35" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="32,25 18,35 32,45" fill="#FFFFFF"/>
      <circle cx="62" cy="56" r="6" fill="#FACC15"/>
    </svg>`
  },
  {
    id: "sign_no_right_turn",
    name: "禁止右轉標誌",
    category: "prohibit",
    categoryLabel: "禁制標誌（禁止）",
    meaning: "告示車輛行至該路口時禁止向右轉彎。",
    precaution: "部分路口僅於特定時段（如尖峰時間）禁止右轉，請留意標誌下方是否附掛時段說明牌。",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" stroke-width="9"/>
      <path d="M40 72 L40 44 Q40 34 50 34 L64 34" fill="none" stroke="#0F172A" stroke-width="7" stroke-linecap="round"/>
      <polygon points="62,25 75,34 62,43" fill="#0F172A"/>
      <line x1="22" y1="22" x2="78" y2="78" stroke="#DC2626" stroke-width="8"/>
    </svg>`
  },
  {
    id: "sign_pedestrian_warn",
    name: "當心行人標誌",
    category: "warning",
    categoryLabel: "警告標誌",
    meaning: "警告駕駛人前方有行人穿越道或行人頻繁活動路段，應減速慢行並隨時準備停讓。",
    precaution: "三角形紅邊為警告標誌，提醒駕駛人提前降速、擴大視線掃描道路兩側行人動向。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="50" cy="40" r="6" fill="#0F172A"/>
      <path d="M50 47 L50 64 M39 54 L61 54 M50 64 L41 77 M50 64 L59 77" stroke="#0F172A" stroke-width="4.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_children_warn",
    name: "當心兒童標誌",
    category: "warning",
    categoryLabel: "警告標誌",
    meaning: "用以促使車輛駕駛人減速慢行，注意學童及兒童安全。",
    precaution: "多設於國小、幼兒園或公園周邊道路。兒童身高較矮容易進入車輛視線死角，且可能突然衝出，務必放慢車速。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <circle cx="42" cy="44" r="5" fill="#0F172A"/>
      <circle cx="58" cy="48" r="4.5" fill="#0F172A"/>
      <path d="M42 50 L42 66 M35 56 L58 58 M42 66 L36 77 M42 66 L48 77 M58 53 L58 67 M58 67 L53 77 M58 67 L63 77" stroke="#0F172A" stroke-width="3.8" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_winding_road",
    name: "連續彎路標誌",
    category: "warning",
    categoryLabel: "警告標誌",
    meaning: "警告車輛駕駛人前方有連續彎道，應減速慢行並靠右行駛。",
    precaution: "進入彎道前應先完成減速（切勿在彎中急煞），並嚴禁跨越雙黃線超車。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <path d="M54 76 L54 64 L42 55 L58 45 L46 34" fill="none" stroke="#0F172A" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="46,24 38,37 54,37" fill="#0F172A"/>
    </svg>`
  },
  {
    id: "sign_slippery",
    name: "路面顛簸／易滑警示",
    category: "warning",
    categoryLabel: "警告標誌",
    meaning: "警告前方路面不平或易滑，車輛應減速慢行，避免急轉向或急煞車。",
    precaution: "雨天行經山區、橋面或施工路段時，胎紋不足極易打滑失控，務必拉長與前車距離。",
    svg: `<svg viewBox="0 0 100 100">
      <polygon points="50,10 92,85 8,85" fill="#FFFFFF" stroke="#DC2626" stroke-width="8" stroke-linejoin="round"/>
      <path d="M22 72 L36 72 Q43 58 50 72 Q57 58 64 72 L78 72" fill="none" stroke="#0F172A" stroke-width="5.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_crosswalk_guide",
    name: "行人穿越道指示標誌",
    category: "guide",
    categoryLabel: "指示標誌",
    meaning: "指示前方設有行人穿越道（斑馬線），提醒駕駛人與行人注意穿越位置。",
    precaution: "藍底方形為一般道路指示標誌。只要斑馬線上有行人正在穿越，車輛就必須暫停禮讓。",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="12" y="12" width="76" height="76" rx="10" fill="#0284C7"/>
      <polygon points="50,20 82,76 18,76" fill="#FFFFFF"/>
      <circle cx="50" cy="40" r="4.5" fill="#0F172A"/>
      <path d="M50 45 L50 58 M42 50 L58 50 M50 58 L44 68 M50 58 L56 68" stroke="#0F172A" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: "sign_one_way",
    name: "單行道指示標誌",
    category: "guide",
    categoryLabel: "指示標誌",
    meaning: "指示該道路僅准車輛依箭頭所指方向單向行駛。",
    precaution: "駛出單行道準備轉彎時，應依規定靠向欲轉彎側車道（左轉靠左、右轉靠右），避免與同向車輛交織碰撞。",
    svg: `<svg viewBox="0 0 100 100">
      <rect x="14" y="14" width="72" height="72" rx="10" fill="#0284C7"/>
      <path d="M50 74 L50 32" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>
      <polygon points="50,20 34,38 66,38" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: "sign_speed_limit",
    name: "最高速限標誌（50）",
    category: "prohibit",
    categoryLabel: "禁制標誌（限制）",
    meaning: "告示車輛行車時速不得超過標誌所示數字（本圖為每小時 50 公里）。",
    precaution: "市區道路若無特別標誌，一般最高速限通常為 50 公里（未劃分車道或慢車道另有規定）；超速不僅危險亦會受罰。",
    svg: `<svg viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#DC2626" stroke-width="9"/>
      <text x="50" y="61" text-anchor="middle" fill="#0F172A" font-size="32" font-weight="900">50</text>
    </svg>`
  }
];

/**
 * 2. 交通知識五大單元資料庫 (KNOWLEDGE_UNITS)
 */
const KNOWLEDGE_UNITS = [
  {
    id: "unit_signs",
    title: "🚦 交通標誌認識",
    subtitle: "用「形狀與顏色」一秒辨識警告、禁制與指示標誌！",
    isSignUnit: true,
    summary: "台灣交通標誌主要分為三大類：【三角形紅邊】代表警告前方危險；【圓形／八角形／倒三角】代表禁制與遵行義務；【方形藍底／綠底】代表路線與設施指示。點擊下方任一標誌卡片，查看詳細意義與注意事項！",
    points: []
  },
  {
    id: "unit_rules",
    title: "⚖️ 道路交通規則",
    subtitle: "掌握路權優先順序與號誌規範，不再在路口猶豫！",
    isSignUnit: false,
    summary: "多數路口事故源自「不清楚誰該讓誰」。記住支線讓幹線、少線讓多線、轉彎讓直行、左方讓右方四大路權口訣。",
    points: [
      {
        title: "無號誌路口路權順序",
        desc: "1. 支線道車讓幹線道車（看「停」「讓」標誌標線）。2. 未分干支線時，少線道讓多線道。3. 車道數相同時，轉彎車讓直行車。4. 同為直行或轉彎時，左方車讓右方車。",
        tip: "法規依據：《道路交通安全規則》第 102 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><rect x="30" y="5" width="20" height="70" fill="#475569"/><rect x="5" y="30" width="70" height="20" fill="#475569"/><path d="M40 65 L40 22" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/><polygon points="40,14 34,24 46,24" fill="#22C55E"/><path d="M62 40 L26 40" stroke="#FACC15" stroke-width="3" stroke-dasharray="4 3"/></svg>`
      },
      {
        title: "閃光紅燈 vs 閃光黃燈",
        desc: "閃光紅燈＝「停車再開」，車輛必須在停止線前完全停下確認安全再通過；閃光黃燈＝「警告」，車輛應減速接近，小心通過。",
        tip: "法規依據：《道路交通標誌標線號誌設置規則》第 211 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#1E293B"/><circle cx="26" cy="40" r="14" fill="#EF4444"/><circle cx="54" cy="40" r="14" fill="#FACC15"/></svg>`
      },
      {
        title: "聽見緊急車輛警號立即避讓",
        desc: "聞有消防車、救護車、警備車、工程救險車警號時，不論來自何方均應立即避讓，不得在後尾隨急駛或併行競速。",
        tip: "未立即避讓處 3,600 元罰鍰並吊銷駕照（道交條例第 45 條）",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#FEE2E2"/><rect x="16" y="28" width="48" height="28" rx="6" fill="#FFFFFF" stroke="#DC2626" stroke-width="3"/><rect x="34" y="20" width="12" height="8" rx="2" fill="#DC2626"/><path d="M35 42 H45 M40 37 V47" stroke="#DC2626" stroke-width="4"/></svg>`
      },
      {
        title: "轉彎前 30 公尺提前打方向燈",
        desc: "車輛右轉應於路口前 30 公尺顯示方向燈並換入外側車道；左轉應於路口前 30 公尺顯示方向燈並換入內側車道，切勿臨時跨車道急轉。",
        tip: "法規依據：《道路交通安全規則》第 102 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#FEF9C3"/><path d="M28 64 L28 36 Q28 24 40 24 L58 24" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/><polygon points="56,15 68,24 56,33" fill="#0284C7"/></svg>`
      }
    ]
  },
  {
    id: "unit_car",
    title: "🚗 汽車行車安全",
    subtitle: "消除視野死角、落實停讓行人與安全跟車距離",
    isSignUnit: false,
    summary: "汽車車體較大，存在 A 柱死角與內輪差風險。養成「轉彎擺頭確認」與「路口停讓行人」習慣，是保護自己與他人的關鍵。",
    points: [
      {
        title: "路口停讓行人「3 公尺基準」",
        desc: "汽車行近行人穿越道有行人穿越時，無論有無號誌均應暫停讓行人先行。車頭距離行人行進方向 3 公尺（約 3 條枕木紋或一個車道寬）以內未停讓即屬違規。",
        tip: "未停讓行人最高可罰 6,000 元、記 3 點並須上道安講習",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><rect x="14" y="48" width="52" height="10" fill="#FFFFFF"/><circle cx="40" cy="24" r="6" fill="#0F172A"/><path d="M40 31 V44 M33 36 H47" stroke="#0F172A" stroke-width="4" stroke-linecap="round"/></svg>`
      },
      {
        title: "警惕 A 柱死角與轉彎擺頭",
        desc: "汽車前擋風玻璃兩側的 A 柱在轉彎時容易遮擋行人或機車。轉彎前除了看後視鏡，應身體微幅前傾擺頭確認 A 柱後方盲區。",
        tip: "安全口訣：慢、看、停，轉彎必擺頭",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#F1F5F9"/><path d="M20 58 L30 24 L50 24 L60 58 Z" fill="#38BDF8"/><line x1="20" y1="58" x2="30" y2="24" stroke="#DC2626" stroke-width="5"/></svg>`
      },
      {
        title: "保持安全跟車距離",
        desc: "在高速或快速公路行駛時，小型車與前車應保持「速度除以 2（公尺）」以上距離（例如時速 100 公里應保持至少 50 公尺）；雨天或夜間應再加倍。",
        tip: "法規依據：《高速公路及快速公路交通管制規則》第 6 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><rect x="10" y="32" width="22" height="16" rx="4" fill="#0284C7"/><line x1="35" y1="40" x2="46" y2="40" stroke="#DC2626" stroke-width="3" stroke-dasharray="3 2"/><rect x="49" y="32" width="22" height="16" rx="4" fill="#F59E0B"/></svg>`
      },
      {
        title: "兩段式開門法（荷蘭式開門）",
        desc: "路邊停車後開車門前，先確認後視鏡與轉頭查看後方來車，先將車門微開約 10～15 公分確認無機車或自行車接近，再完全推開下車。",
        tip: "不當開車門肇事，駕駛人須負民刑事責任及罰鍰",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#FEF9C3"/><rect x="24" y="20" width="26" height="42" rx="6" fill="#0284C7"/><line x1="50" y1="34" x2="64" y2="24" stroke="#DC2626" stroke-width="4" stroke-linecap="round"/></svg>`
      }
    ]
  },
  {
    id: "unit_scooter",
    title: "🛵 機車行車安全",
    subtitle: "防禦性駕駛、遠離大型車內輪差與正確變換車道",
    isSignUnit: false,
    summary: "機車機動性高但缺乏車體保護，切勿鑽車縫、切勿緊貼大型車側邊，變換車道務必提前打方向燈並轉頭確認死角。",
    points: [
      {
        title: "遠離大型車「內輪差」與視野死角",
        desc: "遊覽車、砂石車與貨車轉彎時，後輪會向內偏移形成「內輪差」，且車頭前、兩側及正後方均有巨大盲區。遇大型車準備轉彎時，寧可退後等待，絕不從內側超車。",
        tip: "防禦駕駛原則：不併行、不搶快、保持距離",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#FEE2E2"/><rect x="18" y="16" width="26" height="48" rx="4" fill="#475569"/><path d="M44 36 Q62 44 44 64 Z" fill="#EF4444" opacity="0.45"/></svg>`
      },
      {
        title: "變換車道三步驟：燈、鏡、頭",
        desc: "欲向左或向右變換車道（例如繞過臨停車輛）時，應先開啟方向燈、查看後視鏡，並快速轉頭確認側後方視線死角無直行車，確認安全再切出。",
        tip: "直行車擁有優先路權，變換車道不得迫使直行車急煞",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><line x1="40" y1="10" x2="40" y2="70" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 5"/><path d="M54 62 C54 44, 26 42, 26 22" fill="none" stroke="#0284C7" stroke-width="5" stroke-linecap="round"/><polygon points="26,14 20,24 32,24" fill="#0284C7"/></svg>`
      },
      {
        title: "兩段式左轉判定原則",
        desc: "1. 路口設有「機慢車兩段左轉標誌」或地上繪有待轉區。2. 內側車道繪有「禁行機車」標字。3. 三快車道以上單行道行駛於右側車道時，均須依兩段式左轉。",
        tip: "待轉時應將車輛完整停入待轉區格線內，避免車尾超出影響橫向車流",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><rect x="44" y="18" width="22" height="16" fill="none" stroke="#0284C7" stroke-width="3"/><path d="M55 64 L55 26 L22 26" fill="none" stroke="#F59E0B" stroke-width="4" stroke-linecap="round"/></svg>`
      },
      {
        title: "雨天避開標線與人孔蓋急煞",
        desc: "白色／黃色道路標線、金屬人孔蓋及積水處在雨天摩擦係數極低。雨天騎車應降低車速、前後煞車同時漸進點煞，避免單獨急按前煞鎖死打滑。",
        tip: "安全帽扣帶務必扣緊，雨衣下擺避免過長捲入車輪",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#DBEAFE"/><path d="M26 22 L22 32 M42 18 L38 28 M58 22 L54 32" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/><rect x="16" y="50" width="48" height="10" rx="4" fill="#FFFFFF"/></svg>`
      }
    ]
  },
  {
    id: "unit_pedestrian",
    title: "🚶 行人安全",
    subtitle: "走行人穿越道、秒數不足不搶快、提高夜間能見度",
    isSignUnit: false,
    summary: "「行人優先」是法律保障，但建立「防禦性步行」意識、與轉彎車輛保持安全目光接觸，能讓每一次過馬路都更安心。",
    points: [
      {
        title: "100 公尺內有斑馬線不得任意穿越",
        desc: "在設有行人穿越道、人行天橋或人行地下道之處，100 公尺範圍內行人必須經由該設施穿越道路，不得跨越護欄或直接橫越馬路。",
        tip: "法規依據：《道路交通安全規則》第 134 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#E0F2FE"/><rect x="16" y="26" width="48" height="8" fill="#FFFFFF"/><rect x="16" y="40" width="48" height="8" fill="#FFFFFF"/><rect x="16" y="54" width="48" height="8" fill="#FFFFFF"/></svg>`
      },
      {
        title: "綠燈秒數不足時，寧等下一輪",
        desc: "行人專用號誌綠燈閃爍時，表示警告行人尚未進入道路者禁止跨入；已進入道路者應快速通過。切勿在最後幾秒衝刺過馬路。",
        tip: "法規依據：《道路交通標誌標線號誌設置規則》第 207 條",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#1E293B"/><text x="40" y="48" text-anchor="middle" fill="#22C55E" font-size="26" font-weight="900">05</text></svg>`
      },
      {
        title: "過馬路不滑手機、留意轉彎車",
        desc: "即使行人號誌為綠燈，仍可能有未注意視線死角的右轉或左轉車輛。通行時應收起手機、左右擺頭觀察來車動向。",
        tip: "與駕駛人進行眼神確認，確保對方已減速停讓再通過",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#FEF9C3"/><circle cx="40" cy="40" r="22" fill="none" stroke="#DC2626" stroke-width="5"/><rect x="33" y="28" width="14" height="24" rx="2" fill="#334155"/><line x1="25" y1="25" x2="55" y2="55" stroke="#DC2626" stroke-width="5"/></svg>`
      },
      {
        title: "清晨與夜間穿著亮色或反光衣物",
        desc: "天色昏暗或雨霧天氣時，深色衣物在車燈下極難被察覺。夜間外出散步或運動時，建議穿著淺色、亮色衣物或配戴反光飾品。",
        tip: "反光材質可讓駕駛人在百公尺外提前發現行人",
        svg: `<svg viewBox="0 0 80 80"><rect width="80" height="80" rx="12" fill="#1E293B"/><circle cx="40" cy="24" r="7" fill="#FACC15"/><rect x="31" y="34" width="18" height="26" rx="6" fill="#FACC15"/></svg>`
      }
    ]
  }
];

/**
 * 3. 駕照筆試測驗題庫 (QUIZ_BANK)
 * category：'car'(汽車題庫) | 'scooter'(機車題庫)
 * answer：正確選項索引 (0, 1, 2, 3)
 */
const QUIZ_BANK = [
  {
    id: "q_01",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    question: "汽車行近行人穿越道，遇有行人穿越時，下列何者為正確駕駛行為？",
    options: [
      "鳴按喇叭提醒行人快速通過後加速駛離",
      "無論有無交通指揮人員指揮或號誌指示，均應暫停讓行人先行通過",
      "只要車輛未直接撞到行人，即可從行人身旁 1 公尺內繞過",
      "只有行人號誌為綠燈時才需要禮讓行人"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 103 條，汽車行近行人穿越道，遇有行人穿越時，無論有無交通指揮人員指揮或號誌指示，均應暫停讓行人先行通過（現行執法基準為距離行人行進方向 3 公尺以內即應停讓）。"
  },
  {
    id: "q_02",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    question: "汽車行駛至交岔路口準備右轉彎時，應於距交岔路口多少公尺前顯示方向燈，並換入外側車道或右轉車道？",
    options: [
      "10 公尺前",
      "20 公尺前",
      "30 公尺前",
      "抵達停止線前再打方向燈即可"
    ],
    answer: 2,
    explanation: "依據《道路交通安全規則》第 102 條第 1 項第 4 款，汽車右轉彎時，應距交岔路口 30 公尺前顯示方向燈或手勢，換入外側車道、右轉車道或慢車道，駛至路口後再行右轉。"
  },
  {
    id: "q_03",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    question: "在未劃分干、支線道，且車道數相同的無號誌交岔路口，兩輛同為直行車交會時，路權優先順序為何？",
    options: [
      "左方車應暫停讓右方車先行",
      "右方車應暫停讓左方車先行",
      "車速較快的一方優先通行",
      "車身較大的汽車優先通行"
    ],
    answer: 0,
    explanation: "依據《道路交通安全規則》第 102 條第 1 項第 2 款，未設標誌、標線或號誌劃分干、支線道者，少線道車讓多線道車；車道數相同時，轉彎車讓直行車；同為直行車或轉彎車者，「左方車應暫停讓右方車先行」。"
  },
  {
    id: "q_04",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    signId: "sign_stop",
    question: "駕駛汽車行經設有如圖所示「八角形紅底白字『停』」標誌之交岔路口時，應該怎麼做？",
    options: [
      "只要左右看沒車，減速至時速 20 公里滑行通過即可",
      "必須在交岔路口前完全停止，確認幹線道無來車安全後，方得再開",
      "鳴按兩聲喇叭後直接通過",
      "僅在白天車多時需要停車"
    ],
    answer: 1,
    explanation: "此標誌為「停車再開標誌」（禁制標誌），表示支線道車輛行至交岔路口前必須「完全停止」（車輪靜止），確認幹線道無來車且安全後，方得再開。"
  },
  {
    id: "q_05",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    question: "夜間駕駛汽車在市區道路行駛，前方 100 公尺內有同向車輛行駛或對向有來車會車時，應如何正確使用燈光？",
    options: [
      "持續開啟遠光燈以保持最大視野",
      "應使用近光燈，避免強光造成前車與對向駕駛眩光",
      "將頭燈全部關閉僅開小燈",
      "不斷閃爍遠光燈要求前車讓道"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 109 條，夜間會車或前方 100 公尺內有車輛行駛時，應使用近光燈，以免遠光燈直射造成其他駕駛人視線眩盲發生危險。"
  },
  {
    id: "q_06",
    category: "car",
    categoryLabel: "🚗 汽車筆試題庫",
    question: "駕駛人路邊停車後準備開啟左側車門下車時，最安全的做法為何？",
    options: [
      "直接一次將車門推到最開，讓後方車輛看見",
      "先看後視鏡並轉頭確認後方無來車，採用「兩段式開門法」微開車門確認安全後再推開",
      "按下雙黃警示燈後就可以直接開門",
      "請車上乘客幫忙看前方路況即可"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 112 條，停車後開啟或關閉車門時，應注意行人、其他車輛，並讓其先行。「兩段式開門法」先微開約 10～15 公分再次確認後方無機車或自行車接近，可大幅降低開門肇事風險。"
  },
  {
    id: "q_07",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    signId: "sign_two_stage",
    question: "騎乘普通重型機車行經設有如圖標誌，或內側車道劃有「禁行機車」標字之路口欲左轉時，應如何行駛？",
    options: [
      "直接切入最內側快車道跟隨汽車一起左轉",
      "應依兩段式左轉規定，先靠右行駛至右側機慢車左轉待轉區停等",
      "在斑馬線上直接推行左轉",
      "在路口中心直接迴轉"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 99 條，內側車道設有禁行機車標誌或標線，或路口設有「機慢車兩段左轉標誌」時，普通重型機車應依兩段方式進行左轉，不得由內側車道直接左轉。"
  },
  {
    id: "q_08",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    question: "騎乘機車在道路上欲向左變換車道繞過前方路邊臨停車輛時，下列何者正確？",
    options: [
      "直接加速向左切出，後方車輛自然會閃避",
      "先顯示左方向燈，查看後視鏡並轉頭確認左側後方盲點無直行來車後再變換車道",
      "舉起左手示意即可，不需要打方向燈",
      "等切入左側車道後再補打方向燈"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 98 條及第 102 條，變換車道時應先顯示方向燈（全程顯示至完成變換），並注意安全距離與後視鏡盲點，讓直行車先行，確認安全後始得變換。"
  },
  {
    id: "q_09",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    question: "騎乘機車遇見大型貨車或公車在前方準備右轉彎時，最安全的應對方式為何？",
    options: [
      "趁大型車還沒完全轉過去，趕快從大型車右側縫隙加速超車",
      "減速退後並與大型車保持安全距離，切勿進入大型車右側「內輪差」與視線死角",
      "緊貼在大型車右後輪旁並鳴按喇叭",
      "與大型車併排同時右轉"
    ],
    answer: 1,
    explanation: "大型車轉彎時前後輪行進軌跡不同會產生「內輪差」，且右側為駕駛人嚴重視野死角。機車若搶快鑽入大型車右側極易被捲入車底，務必減速退讓保持距離。"
  },
  {
    id: "q_10",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    question: "騎乘機車行經「閃光紅燈」號誌路口時，應遵守何種規定？",
    options: [
      "減速慢行直接通過即可",
      "與一般綠燈相同，可依原速通過",
      "應減速接近，先停止於交岔路口前，讓幹線道車優先通行後認為安全時，方得續行",
      "只需注意左方有無來車"
    ],
    answer: 2,
    explanation: "依據《道路交通標誌標線號誌設置規則》第 211 條，閃光紅燈表示「停車再開」，車輛應先停止於交岔路口前，禮讓幹線道車優先通行並確認安全後才可繼續行駛。"
  },
  {
    id: "q_11",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    question: "行車途中聽見後方傳來救護車的警笛聲時，駕駛人（含汽機車）應如何處置？",
    options: [
      "加速行駛在救護車前方替它開道",
      "立即向道路兩側減速避讓，讓救護車優先通行，且不得在後尾隨急駛",
      "停在路中央原地不動讓救護車自己繞過去",
      "只有看到救護車閃紅燈才要讓，只聽見聲音不用讓"
    ],
    answer: 1,
    explanation: "依據《道路交通安全規則》第 101 條第 3 項，聞有消防車、救護車、警備車等警號時，不論來自何方均應立即避讓，並不得在後尾隨急駛。"
  },
  {
    id: "q_12",
    category: "scooter",
    categoryLabel: "🛵 機車筆試題庫",
    signId: "sign_yield",
    question: "騎車在巷道出口看到如圖所示「白底紅邊倒三角形」標誌時，代表什麼意思？",
    options: [
      "前方有連續下坡",
      "讓路標誌：你所在的是支線道，應減速禮讓幹線道車輛優先通行",
      "前方禁止機車通行",
      "前方設有測速照相"
    ],
    answer: 1,
    explanation: "白底紅邊倒三角形為「讓路標誌」（禁制標誌），告示支線道車輛應減速慢行，禮讓幹線道車輛優先通行。"
  }
];

/**
 * 4. 道路情境闖關關卡資料 (SCENARIO_LEVELS)
 * 共 7 大真實台灣道路情境關卡，涵蓋所有指定題型
 */
const SCENARIO_LEVELS = [
  {
    id: 1,
    shortTitle: "十字路口通行",
    title: "第 1 關｜十字路口綠燈直行，遇對向車搶快左轉",
    reward: 50,
    description: "你駕駛藍色汽車沿市區雙向道路直行，前方號誌剛轉為綠燈，你正準備通過十字路口。此時對向車道一輛橘色轎車卻打著左轉燈，看似想搶在直行車流啟動前直接左轉切過你的車頭！",
    lawBasis: "依據：《道路交通安全規則》第 102 條（轉彎車應讓直行車先行；防衛駕駛原則）",
    options: [
      {
        text: "A. 我是直行車擁有絕對路權，踩油門加速衝過去逼對方停下來",
        correct: false,
        feedback: "❌ 危險發生碰撞！雖然法規上「轉彎車應讓直行車先行」，但路權不能拿來硬碰硬。對向車已搶快切出時若硬加速，極易在路口中央發生高速側撞。"
      },
      {
        text: "B. 立即鬆開油門、腳備煞車減速並閃燈／短鳴喇叭警示，確認對方停讓後再安全通過",
        correct: true,
        feedback: "✅ 完美防禦駕駛！雖然直行車享有優先路權，但行經路口隨時「減速備煞、確認橫向與對向轉彎車動態」才能避免三寶搶快造成事故，既合法又安全！"
      },
      {
        text: "C. 在路口中央直接緊急打方向盤切入對向車道閃避",
        correct: false,
        feedback: "❌ 非常危險！在路口隨意跨越雙黃線切入對向車道，極可能與對向後方直行車輛發生正面對撞。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#86EFAC"/>
      <!-- 十字馬路 -->
      <rect x="145" y="0" width="130" height="280" fill="#334155"/>
      <rect x="0" y="85" width="420" height="110" fill="#334155"/>
      <!-- 雙黃線 -->
      <line x1="208" y1="0" x2="208" y2="85" stroke="#FACC15" stroke-width="3"/>
      <line x1="212" y1="0" x2="212" y2="85" stroke="#FACC15" stroke-width="3"/>
      <line x1="208" y1="195" x2="208" y2="280" stroke="#FACC15" stroke-width="3"/>
      <line x1="212" y1="195" x2="212" y2="280" stroke="#FACC15" stroke-width="3"/>
      <!-- 停止線 -->
      <line x1="212" y1="195" x2="275" y2="195" stroke="#FFFFFF" stroke-width="4"/>
      <line x1="145" y1="85" x2="208" y2="85" stroke="#FFFFFF" stroke-width="4"/>
      <!-- 綠燈號誌 -->
      <rect x="285" y="168" width="24" height="52" rx="6" fill="#0F172A"/>
      <circle cx="297" cy="180" r="5" fill="#475569"/>
      <circle cx="297" cy="194" r="5" fill="#475569"/>
      <circle cx="297" cy="208" r="6" fill="#22C55E"/>
      <!-- 你的藍車（直行向上） -->
      <rect x="230" y="210" width="28" height="48" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="244" y="239" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      <path d="M244 204 L244 155" stroke="#38BDF8" stroke-width="4" stroke-dasharray="6 4"/>
      <polygon points="244,145 237,158 251,158" fill="#38BDF8"/>
      <!-- 對向橘車（搶快左轉） -->
      <rect x="164" y="38" width="28" height="46" rx="7" fill="#F97316" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M178 88 Q182 135 255 138" fill="none" stroke="#FB923C" stroke-width="4" stroke-dasharray="6 4"/>
      <polygon points="265,138 252,131 252,145" fill="#FB923C"/>
    </svg>`
  },
  {
    id: 2,
    shortTitle: "右轉遇行人",
    title: "第 2 關｜汽車綠燈右轉，斑馬線上有行人正要通過",
    reward: 50,
    description: "你駕駛藍色汽車在路口外側車道準備右轉，前方同向為綠燈。當你打右轉燈轉入橫向道路時，發現斑馬線上有一位背著書包的學生正踏上行人穿越道準備過馬路，距離你的車頭約 2.5 公尺。",
    lawBasis: "依據：《道路交通安全規則》第 103 條＆《道交條例》第 44 條（距離行人 3 公尺內應暫停讓行）",
    options: [
      {
        text: "A. 趁學生還沒走到路中央，趕快踩油門從他前面切過去",
        correct: false,
        feedback: "❌ 嚴重違規且極度危險！車輛距離行人行進方向 3 公尺以內搶先通過，不僅違反「停讓行人」規定（最高罰 6,000 元並記 3 點），搶快極易撞傷行人。"
      },
      {
        text: "B. 踩煞車將車輛完全暫停在斑馬線前，耐心禮讓學生完全通過後再右轉起步",
        correct: true,
        feedback: "✅ 完全正確！行近行人穿越道有行人穿越時，無論有無號誌均應「暫停讓行人先行通過」，保持 3 公尺以上安全距離，做個有禮貌的優良駕駛！"
      },
      {
        text: "C. 長按喇叭催促學生用跑的過馬路",
        correct: false,
        feedback: "❌ 不適當且違法！在行人穿越道前鳴按喇叭逼迫行人，可能驚嚇行人導致跌倒，且車輛仍未履行「暫停讓行」的法定義務。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#86EFAC"/>
      <rect x="90" y="0" width="130" height="280" fill="#334155"/>
      <rect x="90" y="80" width="330" height="120" fill="#334155"/>
      <!-- 右側斑馬線 -->
      <g fill="#F8FAFC">
        <rect x="232" y="92" width="12" height="96" rx="2"/>
        <rect x="252" y="92" width="12" height="96" rx="2"/>
        <rect x="272" y="92" width="12" height="96" rx="2"/>
      </g>
      <!-- 行人 -->
      <circle cx="258" cy="115" r="9" fill="#FACC15" stroke="#0F172A" stroke-width="2"/>
      <text x="276" y="119" fill="#FEF08A" font-size="12" font-weight="bold">行人</text>
      <path d="M258 126 L258 168" stroke="#FACC15" stroke-width="3" stroke-dasharray="4 3"/>
      <!-- 你的藍車（準備右轉） -->
      <g transform="translate(185, 195) rotate(25)">
        <rect x="-14" y="-22" width="28" height="46" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
        <text x="0" y="5" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      </g>
      <path d="M192 175 Q202 142 226 142" fill="none" stroke="#38BDF8" stroke-width="4" stroke-dasharray="5 4"/>
    </svg>`
  },
  {
    id: 3,
    shortTitle: "機車變換車道",
    title: "第 3 關｜機車行駛外側車道，前方公車突然靠站停靠",
    reward: 50,
    description: "你騎乘藍色機車行駛在市區雙車道的外側車道，前方一輛公車開啟右轉方向燈正減速靠右停靠公車站。你想向左切入內側車道繞過公車，但從後視鏡隱約看到左後方似乎有汽車正在接近。",
    lawBasis: "依據：《道路交通安全規則》第 98 條（變換車道應顯示方向燈、讓直行車先行並注意安全距離）",
    options: [
      {
        text: "A. 立刻向左急轉切出，因為公車擋在前面，後方汽車應該要讓我",
        correct: false,
        feedback: "❌ 非常危險！變換車道車輛必須禮讓「直行車先行」。未打方向燈且未確認左後方來車距離就突然切出，是機車側撞事故最常見原因。"
      },
      {
        text: "B. 先減速並開啟左方向燈，查看後視鏡並快速轉頭確認左後方盲點，等左側直行車通過後再平順切出",
        correct: true,
        feedback: "✅ 非常標準的防禦騎乘！落實「減速 → 打左方向燈 → 看後視鏡＋擺頭確認死角 → 禮讓直行車通過 → 平順變換車道」，安全百分百！"
      },
      {
        text: "C. 從公車右側與人行道之間的狹小縫隙加速鑽過去",
        correct: false,
        feedback: "❌ 極度危險！公車靠站時會有乘客上下車，從右側門邊硬鑽極易撞上剛下車的乘客或被夾在公車與路緣之間。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#CBD5E1"/>
      <!-- 雙車道馬路 -->
      <rect x="95" y="0" width="230" height="280" fill="#334155"/>
      <line x1="210" y1="0" x2="210" y2="280" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="14 12"/>
      <!-- 前方靠站公車 -->
      <rect x="262" y="45" width="46" height="92" rx="8" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2"/>
      <text x="285" y="95" text-anchor="middle" fill="#0F172A" font-size="12" font-weight="bold">靠站公車</text>
      <!-- 你的藍色機車 -->
      <rect x="268" y="185" width="18" height="34" rx="6" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="277" y="206" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">你</text>
      <path d="M277 180 C277 152, 165 148, 165 110" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-dasharray="5 4"/>
      <!-- 左後方接近的直行車 -->
      <rect x="148" y="205" width="32" height="52" rx="7" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
      <text x="164" y="235" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">直行車</text>
      <path d="M164 200 L164 155" stroke="#FCA5A5" stroke-width="3.5"/>
    </svg>`
  },
  {
    id: 4,
    shortTitle: "閃光號誌路口",
    title: "第 4 關｜深夜行經「閃光紅燈」路口，橫向為閃光黃燈幹道",
    reward: 50,
    description: "深夜 11 點，你駕駛藍色汽車行經一處無一般三色號誌的路口，你前方的號誌正閃爍著「閃光紅燈」，而橫向幹道的號誌則閃爍著「閃光黃燈」，遠處似乎有一輛白色休旅車正沿橫向道路駛來。",
    lawBasis: "依據：《道路交通標誌標線號誌設置規則》第 211 條（閃光紅燈＝停車再開；閃光黃燈＝警告減速）",
    options: [
      {
        text: "A. 深夜路上沒什麼車，只要稍微放慢油門、不需停車就直接滑過路口",
        correct: false,
        feedback: "❌ 違規且危險！「閃光紅燈」等同於「停車再開標誌」，無論白天或深夜都必須將車輛完全停下確認安全後才可起步。"
      },
      {
        text: "B. 在停止線前將車輛完全停下（車輪靜止），左右擺頭確認橫向幹道來車動態安全後，再起步通過",
        correct: true,
        feedback: "✅ 正確無誤！閃光紅燈代表支線道「停車再開」，必須完全停止並禮讓閃光黃燈（幹線道）車輛優先通行，確認無安全疑慮再通過！"
      },
      {
        text: "C. 閃光紅燈跟閃光黃燈代表號誌故障，誰先衝進路口誰就贏",
        correct: false,
        feedback: "❌ 觀念錯誤！閃光紅燈與閃光黃燈是正規的夜間／離峰時段交通管制號誌，並非故障，清楚區分了支線道與幹線道的路權義務。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#1E293B"/>
      <rect x="145" y="0" width="130" height="280" fill="#475569"/>
      <rect x="0" y="85" width="420" height="110" fill="#475569"/>
      <line x1="212" y1="195" x2="275" y2="195" stroke="#FFFFFF" stroke-width="4"/>
      <!-- 閃光紅燈（你的方向） -->
      <rect x="284" y="175" width="26" height="26" rx="6" fill="#0F172A"/>
      <circle cx="297" cy="188" r="8" fill="#EF4444" class="anim-blink-red"/>
      <text x="316" y="192" fill="#FCA5A5" font-size="11" font-weight="bold">閃光紅燈</text>
      <!-- 閃光黃燈（橫向） -->
      <rect x="108" y="52" width="26" height="26" rx="6" fill="#0F172A"/>
      <circle cx="121" cy="65" r="8" fill="#FACC15" class="anim-blink-yellow"/>
      <text x="45" y="69" fill="#FEF08A" font-size="11" font-weight="bold">閃光黃燈</text>
      <!-- 你的藍車 -->
      <rect x="230" y="210" width="28" height="46" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="244" y="237" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      <!-- 橫向白車 -->
      <rect x="42" y="148" width="46" height="28" rx="7" fill="#F8FAFC" stroke="#0F172A" stroke-width="2"/>
      <path d="M94 162 L155 162" stroke="#FACC15" stroke-width="3" stroke-dasharray="5 4"/>
    </svg>`
  },
  {
    id: 5,
    shortTitle: "無號誌路口",
    title: "第 5 關｜無號誌且無「停／讓」標誌的同寬十字路口會車",
    reward: 60,
    description: "你駕駛藍色汽車行駛在一條雙向單車道住宅區道路上，前方是一個完全沒有紅綠燈，地上也沒有畫「停」或「讓」標線的十字路口。你打算直行通過，此時你的「右手邊」橫向道路也有一輛橘色汽車正準備直行通過路口。",
    lawBasis: "依據：《道路交通安全規則》第 102 條第 1 項第 2 款（車道數相同且同為直行車，左方車讓右方車）",
    options: [
      {
        text: "A. 兩條路一樣寬，我應該減速並暫停禮讓右手邊的橘色汽車先行通過",
        correct: true,
        feedback: "✅ 法規記憶滿分！在未劃分干、支線道且車道數相同的路口，同為直行車時「左方車應暫停讓右方車先行」（口訣：左讓右）。橘色車在你的右方，由你禮讓它先行最正確！"
      },
      {
        text: "B. 我是南北向道路比較重要，右邊的車應該要讓我先過",
        correct: false,
        feedback: "❌ 錯誤！道路方位（東西向或南北向）並非路權依據。未設標誌標線劃分干支線且車道數相同時，應依「左方車讓右方車」原則通行。"
      },
      {
        text: "C. 加速搶在右方車輛抵達路口中心前衝過去",
        correct: false,
        feedback: "❌ 非常危險！無號誌路口搶快是最容易發生側面碰撞的肇因，減速並依「左讓右」規則禮讓才能確保安全。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#BBF7D0"/>
      <!-- 同寬無號誌十字路口 -->
      <rect x="155" y="0" width="110" height="280" fill="#475569"/>
      <rect x="0" y="90" width="420" height="100" fill="#475569"/>
      <!-- 你的藍車（左方車） -->
      <rect x="224" y="205" width="28" height="46" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="238" y="232" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      <!-- 右方橘車（擁有優先路權） -->
      <rect x="305" y="106" width="46" height="28" rx="7" fill="#F97316" stroke="#FFFFFF" stroke-width="2"/>
      <text x="328" y="124" text-anchor="middle" fill="#FFF" font-size="10" font-weight="bold">右方車</text>
      <path d="M298 120 L235 120" stroke="#FACC15" stroke-width="4" stroke-dasharray="6 4"/>
      <polygon points="225,120 238,113 238,127" fill="#FACC15"/>
    </svg>`
  },
  {
    id: 6,
    shortTitle: "避讓緊急車輛",
    title: "第 6 關｜雙向單線道行駛中，後方傳來救護車鳴笛聲",
    reward: 60,
    description: "你正駕駛藍色汽車行駛在雙向各一車道的市區道路上，車流速度不快。突然從後視鏡看到一輛閃著紅燈、鳴響警笛的救護車正從正後方快速接近！",
    lawBasis: "依據：《道路交通安全規則》第 101 條第 3 項＆《道交條例》第 45 條（聞緊急車輛警號應立即避讓）",
    options: [
      {
        text: "A. 踩油門加速往前衝，試圖開在救護車前面幫它帶路",
        correct: false,
        feedback: "❌ 錯誤且違法！在救護車前方加速疾駛不僅危險，更容易阻擋救護車變換車道或轉彎路線。"
      },
      {
        text: "B. 開啟右轉方向燈，確認右側安全後盡量向道路右側靠邊減速（或暫停），讓出中央通道供救護車超越",
        correct: true,
        feedback: "✅ 教科書等級的正確避讓！在雙向單車道遇後方救護車時，應開啟方向燈向右側靠邊避讓，讓出中間通道讓緊急車輛順暢通過，且不可在後尾隨急駛！"
      },
      {
        text: "C. 因為前面還有紅燈，先繼續開到停止線再看情況",
        correct: false,
        feedback: "❌ 延誤救援！聞有緊急車輛警號時「不論來自何方，均應立即避讓」，即便前方有紅燈，在確保安全的前提下也應向兩側靠邊讓出通道（避讓緊急車輛而越線不受處罰）。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#CBD5E1"/>
      <rect x="115" y="0" width="190" height="280" fill="#334155"/>
      <line x1="210" y1="0" x2="210" y2="280" stroke="#FACC15" stroke-width="3"/>
      <!-- 你的藍車（在前） -->
      <rect x="242" y="95" width="30" height="48" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="257" y="123" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      <!-- 靠右避讓示意箭頭 -->
      <path d="M257 90 Q278 70 284 48" fill="none" stroke="#38BDF8" stroke-width="3.5" stroke-dasharray="5 4"/>
      <!-- 後方救護車 -->
      <rect x="234" y="195" width="34" height="58" rx="7" fill="#FFFFFF" stroke="#EF4444" stroke-width="3"/>
      <path d="M245 224 H257 M251 218 V230" stroke="#EF4444" stroke-width="4"/>
      <circle cx="251" cy="204" r="5" fill="#EF4444" class="anim-blink-red"/>
      <text x="251" y="246" text-anchor="middle" fill="#DC2626" font-size="9" font-weight="bold">救護車</text>
    </svg>`
  },
  {
    id: 7,
    shortTitle: "夜間雨天行車",
    title: "第 7 關｜傍晚下起滂沱大雨，天色昏暗且路面出現積水",
    reward: 80,
    description: "傍晚下班尖峰時段突然下起大雷雨，視線變得十分模糊，擋風玻璃雨刷開到最大，前方汽車濺起陣陣水花，且路面出現明顯積水反光。",
    lawBasis: "依據：《道路交通安全規則》第 93 條＆第 109 條（遇雨霧應開亮頭燈、減速慢行並保持安全距離）",
    options: [
      {
        text: "A. 立刻開啟「頭燈（近光燈）」，降低車速並將與前車的安全跟車距離拉長至平時的 2 倍以上，避免急踩煞車",
        correct: true,
        feedback: "✅ 恭喜通關！遇雨、霧天色昏暗時依法必須「開亮頭燈」（僅開日行燈或小燈尾燈不會亮，後方車輛會看不見你！），同時降速、拉長跟車距離以防「水漂效應」打滑，你已具備滿分安全駕駛素養！"
      },
      {
        text: "B. 開啟遠光燈照亮雨幕，並緊跟前車尾燈高速行駛比較不會迷路",
        correct: false,
        feedback: "❌ 非常危險！大雨中開遠光燈會被雨滴反射產生一片白霧反光，反而完全看不清路況；緊跟前車則會在前車急煞時因濕滑煞不住而追撞。"
      },
      {
        text: "C. 只開雙黃警示燈（故障燈）一路直行，不需要開大燈",
        correct: false,
        feedback: "❌ 錯誤觀念！行進中開啟雙黃警示燈會讓後方車輛無法判別你要變換車道或轉彎，且法規規定遇雨霧應開亮頭燈。"
      }
    ],
    svg: `<svg viewBox="0 0 420 280">
      <rect width="420" height="280" fill="#0F172A"/>
      <rect x="115" y="0" width="190" height="280" fill="#1E293B"/>
      <line x1="210" y1="0" x2="210" y2="280" stroke="#FACC15" stroke-width="3" stroke-dasharray="12 10"/>
      <!-- 雨絲效果 -->
      <g stroke="#38BDF8" stroke-width="2" opacity="0.6">
        <line x1="60" y1="30" x2="52" y2="55"/>
        <line x1="150" y1="40" x2="142" y2="65"/>
        <line x1="280" y1="25" x2="272" y2="50"/>
        <line x1="350" y1="60" x2="342" y2="85"/>
        <line x1="90" y1="160" x2="82" y2="185"/>
        <line x1="330" y1="180" x2="322" y2="205"/>
      </g>
      <!-- 積水區域 -->
      <ellipse cx="252" cy="145" rx="34" ry="16" fill="#0284C7" opacity="0.45"/>
      <!-- 你的藍車＋近光燈光束 -->
      <polygon points="236,195 222,135 282,135 268,195" fill="#FEF08A" opacity="0.32"/>
      <rect x="236" y="195" width="32" height="52" rx="7" fill="#0284C7" stroke="#FFFFFF" stroke-width="2"/>
      <text x="252" y="225" text-anchor="middle" fill="#FFF" font-size="11" font-weight="bold">你</text>
      <!-- 前方車輛 -->
      <rect x="236" y="42" width="32" height="50" rx="7" fill="#94A3B8" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="242" cy="91" r="3" fill="#EF4444"/>
      <circle cx="262" cy="91" r="3" fill="#EF4444"/>
    </svg>`
  }
];

/**
 * 5. 成就徽章定義 (ACHIEVEMENTS_CONFIG)
 */
const ACHIEVEMENTS_CONFIG = [
  {
    id: "badge_newbie",
    icon: "🌱",
    title: "交通新手",
    desc: "踏出安全駕駛第一步！完成任 1 個知識單元或答對任 1 題測驗。"
  },
  {
    id: "badge_signs",
    icon: "🚸",
    title: "標誌達人",
    desc: "點擊檢視至少 8 個交通標誌，並完成「交通標誌認識」單元。"
  },
  {
    id: "badge_quiz_master",
    icon: "🎓",
    title: "筆試高手",
    desc: "在單次駕照筆試測驗中獲得 80%（含）以上的高正確率。"
  },
  {
    id: "badge_safe_driver",
    icon: "🛡️",
    title: "安全駕駛員",
    desc: "成功通過全部 7 個真實道路情境闖關挑戰！"
  },
  {
    id: "badge_reviewer",
    icon: "⭐",
    title: "錯題剋星",
    desc: "善用錯題收藏本功能，收藏易錯題目反覆溫習。"
  },
  {
    id: "badge_legend",
    icon: "👑",
    title: "滿分車神",
    desc: "累積交通安全學習積分達到 500 分以上！"
  }
];

/* ============================================================================
   二、狀態管理與 localStorage 持久化
   ============================================================================ */

const STORAGE_KEY = "dont_forget_license_state_v1";

const DEFAULT_STATE = {
  totalPoints: 0,
  completedUnits: [],        // 已標記完成的知識單元 ID 陣列
  viewedSigns: [],           // 已點擊查看過的交通標誌 ID 陣列
  quizHistory: {
    sessionsCount: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    bestAccuracy: 0
  },
  bookmarkedQuestions: [],   // 收藏的題目 ID 陣列
  unlockedLevel: 1,          // 目前正常闖關解鎖到的最高關卡 (1~7)
  completedLevels: [],       // 已成功通關的關卡 ID 陣列
  unlockAllMode: false       // 是否開啟自由體驗模式
};

let appState = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
    const parsed = JSON.parse(raw);
    return {
      ...JSON.parse(JSON.stringify(DEFAULT_STATE)),
      ...parsed,
      quizHistory: {
        ...DEFAULT_STATE.quizHistory,
        ...(parsed.quizHistory || {})
      }
    };
  } catch (e) {
    console.warn("讀取 localStorage 失敗，使用預設狀態：", e);
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.warn("儲存 localStorage 失敗：", e);
  }
  refreshAllUI();
}

function addPoints(points, reasonText) {
  if (points <= 0) return;
  appState.totalPoints += points;
  saveState();
  if (reasonText) {
    showToast(`🎉 ${reasonText}（+${points} 積分）`);
  }
}

function showToast(message) {
  const toastEl = document.getElementById("toastNotification");
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2800);
}

/* ============================================================================
   三、頁面導覽與全域畫面同步
   ============================================================================ */

let currentPage = "home";
let currentUnitId = KNOWLEDGE_UNITS[0].id;
let currentSignFilter = "all";
let currentScenarioId = 1;

function switchPage(pageName) {
  currentPage = pageName;

  // 切換 section 顯示
  document.querySelectorAll(".page-section").forEach((sec) => {
    sec.classList.toggle("active", sec.id === `page-${pageName}`);
  });

  // 更新導覽按鈕 active 樣式
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === pageName);
  });

  // 手機版自動收合選單
  const navLinks = document.getElementById("navLinks");
  if (navLinks) navLinks.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshAllUI();
}

function refreshAllUI() {
  // 頂部積分顯示
  const navPts = document.getElementById("navTotalPoints");
  if (navPts) navPts.textContent = appState.totalPoints;

  renderHomeProgress();
  renderLearnPage();
  renderScenarioMap();
  renderProgressPage();

  const bmBadge = document.getElementById("bookmarkCountBadge");
  if (bmBadge) bmBadge.textContent = appState.bookmarkedQuestions.length;
}

/* ============================================================================
   四、首頁進度儀表板渲染
   ============================================================================ */

function renderHomeProgress() {
  const ptsEl = document.getElementById("homePoints");
  const unitsEl = document.getElementById("homeUnits");
  const unitsBar = document.getElementById("homeUnitsBar");
  const scenEl = document.getElementById("homeScenarios");
  const scenBar = document.getElementById("homeScenariosBar");
  const accEl = document.getElementById("homeAccuracy");

  if (!ptsEl) return;

  ptsEl.textContent = `${appState.totalPoints} 分`;

  const uDone = appState.completedUnits.length;
  const uTotal = KNOWLEDGE_UNITS.length;
  unitsEl.textContent = `${uDone} / ${uTotal} 單元`;
  unitsBar.style.width = `${Math.round((uDone / uTotal) * 100)}%`;

  const sDone = appState.completedLevels.length;
  const sTotal = SCENARIO_LEVELS.length;
  scenEl.textContent = `${sDone} / ${sTotal} 關`;
  scenBar.style.width = `${Math.round((sDone / sTotal) * 100)}%`;

  const { totalAnswered, totalCorrect } = appState.quizHistory;
  if (totalAnswered === 0) {
    accEl.textContent = "尚未測驗";
  } else {
    const rate = Math.round((totalCorrect / totalAnswered) * 100);
    accEl.textContent = `${rate}%（${totalCorrect}/${totalAnswered}題）`;
  }
}

/* ============================================================================
   五、交通知識複習頁面邏輯
   ============================================================================ */

function renderLearnPage() {
  const countEl = document.getElementById("learnCompletedCount");
  if (countEl) countEl.textContent = appState.completedUnits.length;

  const tabsContainer = document.getElementById("unitTabs");
  const contentArea = document.getElementById("unitContentArea");
  if (!tabsContainer || !contentArea) return;

  // 渲染 5 個單元切換按鈕
  tabsContainer.innerHTML = KNOWLEDGE_UNITS.map((unit) => {
    const isActive = unit.id === currentUnitId;
    const isDone = appState.completedUnits.includes(unit.id);
    return `
      <button class="unit-tab-btn ${isActive ? "active" : ""}" data-unit-id="${unit.id}">
        ${unit.title}
        ${isDone ? '<span class="done-dot" title="已完成複習">✓</span>' : ""}
      </button>
    `;
  }).join("");

  // 綁定分頁點擊事件
  tabsContainer.querySelectorAll(".unit-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentUnitId = btn.dataset.unitId;
      renderLearnPage();
    });
  });

  // 取得目前單元資料
  const unit = KNOWLEDGE_UNITS.find((u) => u.id === currentUnitId) || KNOWLEDGE_UNITS[0];
  const isCompleted = appState.completedUnits.includes(unit.id);

  let bodyHTML = `
    <div class="card unit-header-card">
      <div>
        <h2>${unit.title}</h2>
        <p class="text-blue" style="font-weight:700; margin: 4px 0 8px;">${unit.subtitle}</p>
        <p class="muted-text">${unit.summary}</p>
      </div>
      <div>
        <button class="btn ${isCompleted ? "btn-secondary" : "btn-primary"}" id="markUnitDoneBtn">
          ${isCompleted ? "✅ 已完成本單元複習" : "📌 標記本單元已複習（+20分）"}
        </button>
      </div>
    </div>
  `;

  if (unit.isSignUnit) {
    // 交通標誌互動圖鑑
    const filteredSigns =
      currentSignFilter === "all"
        ? TRAFFIC_SIGNS_DATA
        : TRAFFIC_SIGNS_DATA.filter((s) => s.category === currentSignFilter);

    bodyHTML += `
      <div class="signs-filter-bar">
        <button class="sign-filter-chip ${currentSignFilter === "all" ? "active" : ""}" data-sign-cat="all">全部標誌（${TRAFFIC_SIGNS_DATA.length}）</button>
        <button class="sign-filter-chip ${currentSignFilter === "warning" ? "active" : ""}" data-sign-cat="warning">🔺 警告標誌</button>
        <button class="sign-filter-chip ${currentSignFilter === "prohibit" ? "active" : ""}" data-sign-cat="prohibit">🛑 禁制／遵行標誌</button>
        <button class="sign-filter-chip ${currentSignFilter === "guide" ? "active" : ""}" data-sign-cat="guide">🟦 指示標誌</button>
      </div>
      <div class="signs-grid">
        ${filteredSigns
          .map((sign) => {
            const viewed = appState.viewedSigns.includes(sign.id);
            return `
              <div class="sign-card ${viewed ? "viewed" : ""}" data-sign-id="${sign.id}" role="button" tabindex="0">
                ${viewed ? '<span class="sign-viewed-badge">已閱讀</span>' : ""}
                <div class="sign-svg-wrap">${sign.svg}</div>
                <h4>${sign.name}</h4>
                <span class="sign-cat-label">${sign.categoryLabel}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  } else {
    // 一般知識重點卡片
    bodyHTML += `
      <div class="key-points-grid">
        ${unit.points
          .map(
            (pt) => `
          <article class="card knowledge-item-card">
            <div class="knowledge-item-svg">${pt.svg}</div>
            <div class="knowledge-item-body">
              <h3>${pt.title}</h3>
              <p>${pt.desc}</p>
              <div class="rule-tip">💡 ${pt.tip}</div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    `;
  }

  contentArea.innerHTML = bodyHTML;

  // 綁定標記完成按鈕
  const doneBtn = document.getElementById("markUnitDoneBtn");
  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      if (!appState.completedUnits.includes(unit.id)) {
        appState.completedUnits.push(unit.id);
        addPoints(20, `完成「${unit.title}」複習`);
      } else {
        showToast("你已經完成過這個單元的複習囉！");
      }
    });
  }

  // 綁定標誌分類篩選與點擊檢視
  contentArea.querySelectorAll(".sign-filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      currentSignFilter = chip.dataset.signCat;
      renderLearnPage();
    });
  });

  contentArea.querySelectorAll(".sign-card").forEach((card) => {
    const openDetail = () => openSignModal(card.dataset.signId);
    card.addEventListener("click", openDetail);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail();
      }
    });
  });
}

function openSignModal(signId) {
  const sign = TRAFFIC_SIGNS_DATA.find((s) => s.id === signId);
  if (!sign) return;

  // 記錄已檢視標誌
  if (!appState.viewedSigns.includes(sign.id)) {
    appState.viewedSigns.push(sign.id);
    saveState();
  }

  const modal = document.getElementById("signModal");
  const modalBody = document.getElementById("signModalBody");
  modalBody.innerHTML = `
    <div class="sign-modal-top">
      <div class="sign-modal-svg">${sign.svg}</div>
      <div>
        <span class="sign-cat-label">${sign.categoryLabel}</span>
        <h3 id="signModalTitle" style="font-size:1.35rem; margin-top:6px;">${sign.name}</h3>
      </div>
    </div>
    <div class="sign-modal-section">
      <h4>📖 代表意思</h4>
      <p>${sign.meaning}</p>
    </div>
    <div class="sign-modal-section">
      <h4>⚠️ 相關注意事項與法規重點</h4>
      <p>${sign.precaution}</p>
    </div>
  `;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

/* ============================================================================
   六、駕照筆試測驗邏輯
   ============================================================================ */

let quizSession = {
  questions: [],
  currentIndex: 0,
  score: 0,
  correctCount: 0,
  answeredCurrent: false
};

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startQuiz() {
  const cat = document.getElementById("quizCategorySelect").value;
  const count = parseInt(document.getElementById("quizCountSelect").value, 10);

  let pool = [];
  if (cat === "all") {
    pool = [...QUIZ_BANK];
  } else if (cat === "bookmarks") {
    pool = QUIZ_BANK.filter((q) => appState.bookmarkedQuestions.includes(q.id));
    if (pool.length === 0) {
      showToast("⚠️ 你的錯題收藏本目前是空的！先去做幾題測驗並收藏吧！");
      return;
    }
  } else {
    pool = QUIZ_BANK.filter((q) => q.category === cat);
  }

  const selected = shuffleArray(pool).slice(0, Math.min(count, pool.length));

  quizSession = {
    questions: selected,
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    answeredCurrent: false
  };

  document.getElementById("quizSetupCard").classList.add("hidden");
  document.getElementById("quizResultCard").classList.add("hidden");
  document.getElementById("quizActiveCard").classList.remove("hidden");

  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const q = quizSession.questions[quizSession.currentIndex];
  const total = quizSession.questions.length;
  const num = quizSession.currentIndex + 1;

  quizSession.answeredCurrent = false;

  document.getElementById("quizProgressText").textContent = `第 ${num} / ${total} 題`;
  document.getElementById("quizCurrentTag").textContent = q.categoryLabel;
  document.getElementById("quizLiveScore").textContent = quizSession.score;
  document.getElementById("quizProgressBar").style.width = `${Math.round((num / total) * 100)}%`;
  document.getElementById("quizQuestionText").textContent = q.question;

  // 若題目附有交通標誌 SVG 則顯示
  const visualBox = document.getElementById("quizVisualBox");
  if (q.signId) {
    const sign = TRAFFIC_SIGNS_DATA.find((s) => s.id === q.signId);
    if (sign) {
      visualBox.innerHTML = sign.svg;
      visualBox.classList.remove("hidden");
    } else {
      visualBox.classList.add("hidden");
    }
  } else {
    visualBox.classList.add("hidden");
  }

  // 渲染選項按鈕
  const letters = ["A", "B", "C", "D"];
  const optionsList = document.getElementById("quizOptionsList");
  optionsList.innerHTML = q.options
    .map(
      (optText, idx) => `
      <button class="quiz-option-btn" data-opt-index="${idx}">
        <span class="option-letter">${letters[idx]}</span>
        <span>${optText}</span>
      </button>
    `
    )
    .join("");

  optionsList.querySelectorAll(".quiz-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => handleQuizAnswer(parseInt(btn.dataset.optIndex, 10)));
  });

  // 隱藏解析框
  document.getElementById("quizFeedbackBox").classList.add("hidden");
}

function handleQuizAnswer(selectedIndex) {
  if (quizSession.answeredCurrent) return;
  quizSession.answeredCurrent = true;

  const q = quizSession.questions[quizSession.currentIndex];
  const isCorrect = selectedIndex === q.answer;
  const optionBtns = document.querySelectorAll("#quizOptionsList .quiz-option-btn");

  optionBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.answer) {
      btn.classList.add("correct");
    } else if (idx === selectedIndex && !isCorrect) {
      btn.classList.add("wrong");
    }
  });

  const statusEl = document.getElementById("feedbackStatus");
  if (isCorrect) {
    quizSession.correctCount += 1;
    quizSession.score += 10;
    statusEl.textContent = "✅ 答對了！觀念非常清楚！";
    statusEl.style.color = "var(--success)";
  } else {
    statusEl.textContent = `❌ 答錯囉！正確答案是（${["A", "B", "C", "D"][q.answer]}）`;
    statusEl.style.color = "var(--danger)";
  }

  document.getElementById("quizLiveScore").textContent = quizSession.score;
  document.getElementById("feedbackExplanation").textContent = q.explanation;

  // 更新收藏按鈕狀態
  updateBookmarkButtonUI(q.id);

  const nextBtn = document.getElementById("nextQuestionBtn");
  nextBtn.textContent =
    quizSession.currentIndex === quizSession.questions.length - 1 ? "查看測驗結果 🏆" : "下一題 →";

  document.getElementById("quizFeedbackBox").classList.remove("hidden");
}

function updateBookmarkButtonUI(questionId) {
  const btn = document.getElementById("toggleBookmarkBtn");
  const isSaved = appState.bookmarkedQuestions.includes(questionId);
  btn.textContent = isSaved ? "★ 已收藏至錯題本" : "⭐ 收藏此題";
  btn.classList.toggle("saved", isSaved);
}

function toggleCurrentQuestionBookmark() {
  const q = quizSession.questions[quizSession.currentIndex];
  if (!q) return;
  const idx = appState.bookmarkedQuestions.indexOf(q.id);
  if (idx === -1) {
    appState.bookmarkedQuestions.push(q.id);
    showToast("⭐ 已將此題加入錯題收藏本！");
  } else {
    appState.bookmarkedQuestions.splice(idx, 1);
    showToast("已從錯題收藏本移除");
  }
  saveState();
  updateBookmarkButtonUI(q.id);
}

function goToNextQuestion() {
  if (quizSession.currentIndex < quizSession.questions.length - 1) {
    quizSession.currentIndex += 1;
    renderCurrentQuestion();
  } else {
    finishQuizSession();
  }
}

function finishQuizSession() {
  const total = quizSession.questions.length;
  const correct = quizSession.correctCount;
  const accuracy = Math.round((correct / total) * 100);
  const earnedPoints = correct * 10;

  // 更新全局紀錄
  appState.quizHistory.sessionsCount += 1;
  appState.quizHistory.totalAnswered += total;
  appState.quizHistory.totalCorrect += correct;
  if (accuracy > appState.quizHistory.bestAccuracy) {
    appState.quizHistory.bestAccuracy = accuracy;
  }
  addPoints(earnedPoints);

  document.getElementById("quizActiveCard").classList.add("hidden");
  document.getElementById("quizResultCard").classList.remove("hidden");

  document.getElementById("resCorrectCount").textContent = `${correct} / ${total} 題`;
  document.getElementById("resAccuracy").textContent = `${accuracy}%`;
  document.getElementById("resEarnedPoints").textContent = `+${earnedPoints} 分`;

  const iconEl = document.getElementById("resultIcon");
  const commentEl = document.getElementById("resComment");
  if (accuracy === 100) {
    iconEl.textContent = "🏆";
    commentEl.textContent = "太強了！全數答對，你的交通法規觀念堪比駕訓班教練！";
  } else if (accuracy >= 80) {
    iconEl.textContent = "🎉";
    commentEl.textContent = "表現優秀！已經達到高標水準，把錯題收藏起來就更無敵了！";
  } else if (accuracy >= 60) {
    iconEl.textContent = "👍";
    commentEl.textContent = "還不錯喔！建議把答錯的題目加入收藏，再去知識複習區溫習一下。";
  } else {
    iconEl.textContent = "📘";
    commentEl.textContent = "有些規則稍微生疏囉！快點選收藏錯題並前往「交通知識複習」重新充電吧！";
  }
}

/* ============================================================================
   七、道路情境闖關邏輯（核心特色）
   ============================================================================ */

function renderScenarioMap() {
  const mapGrid = document.getElementById("scenarioMapGrid");
  const toggleEl = document.getElementById("unlockAllToggle");
  if (!mapGrid) return;

  if (toggleEl) {
    toggleEl.checked = appState.unlockAllMode;
  }

  mapGrid.innerHTML = SCENARIO_LEVELS.map((lvl) => {
    const isCompleted = appState.completedLevels.includes(lvl.id);
    const isUnlocked = appState.unlockAllMode || lvl.id <= appState.unlockedLevel;
    const isActive = lvl.id === currentScenarioId;

    let statusIcon = "🔒";
    if (isCompleted) statusIcon = "✅";
    else if (isUnlocked) statusIcon = "🚦";

    return `
      <button
        class="level-node ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""} ${!isUnlocked ? "locked" : ""}"
        data-level-id="${lvl.id}"
        ${!isUnlocked ? 'disabled title="請先通過前一關以解鎖此關卡"' : ""}
      >
        <span class="level-num">${statusIcon} 第 ${lvl.id} 關</span>
        <span class="level-short-name">${lvl.shortTitle}</span>
      </button>
    `;
  }).join("");

  mapGrid.querySelectorAll(".level-node").forEach((node) => {
    node.addEventListener("click", () => {
      const id = parseInt(node.dataset.levelId, 10);
      loadScenarioStage(id);
    });
  });

  loadScenarioStage(currentScenarioId);
}

function loadScenarioStage(levelId) {
  const lvl = SCENARIO_LEVELS.find((item) => item.id === levelId) || SCENARIO_LEVELS[0];
  currentScenarioId = lvl.id;

  // 更新地圖節點高亮
  document.querySelectorAll(".level-node").forEach((node) => {
    node.classList.toggle("active", parseInt(node.dataset.levelId, 10) === lvl.id);
  });

  document.getElementById("stageLevelPill").textContent = `第 ${lvl.id} 關 / 共 ${SCENARIO_LEVELS.length} 關`;
  document.getElementById("stageTitle").textContent = lvl.title;
  document.getElementById("stageReward").textContent = `+${lvl.reward} 積分`;
  document.getElementById("stageSvgContainer").innerHTML = lvl.svg;
  document.getElementById("stageDescription").textContent = lvl.description;

  const optionsContainer = document.getElementById("scenarioOptions");
  optionsContainer.innerHTML = lvl.options
    .map(
      (opt, idx) => `
      <button class="scenario-opt-btn" data-opt-idx="${idx}">
        ${opt.text}
      </button>
    `
    )
    .join("");

  optionsContainer.querySelectorAll(".scenario-opt-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      handleScenarioChoice(lvl, parseInt(btn.dataset.optIdx, 10));
    });
  });

  // 隱藏上一題的結果卡
  const resBox = document.getElementById("scenarioResultBox");
  resBox.classList.add("hidden");
  resBox.classList.remove("pass", "fail");
}

function handleScenarioChoice(lvl, chosenIdx) {
  const chosenOpt = lvl.options[chosenIdx];
  const optBtns = document.querySelectorAll("#scenarioOptions .scenario-opt-btn");

  optBtns.forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === chosenIdx) {
      btn.classList.add(chosenOpt.correct ? "selected-correct" : "selected-wrong");
    }
  });

  const resBox = document.getElementById("scenarioResultBox");
  const resTitle = document.getElementById("scenarioResultTitle");
  const resDetail = document.getElementById("scenarioResultDetail");
  const lawBasis = document.getElementById("scenarioLawBasis");
  const retryBtn = document.getElementById("retryScenarioBtn");
  const nextBtn = document.getElementById("nextScenarioBtn");

  resBox.classList.remove("hidden", "pass", "fail");
  lawBasis.textContent = lvl.lawBasis;

  if (chosenOpt.correct) {
    resBox.classList.add("pass");
    resTitle.textContent = "🎉 判斷正確！安全通過本關路況！";
    resTitle.style.color = "var(--success)";
    resDetail.textContent = chosenOpt.feedback;
    retryBtn.classList.add("hidden");

    // 首次通關給予積分並解鎖下一關
    const firstTimePass = !appState.completedLevels.includes(lvl.id);
    if (firstTimePass) {
      appState.completedLevels.push(lvl.id);
      if (lvl.id + 1 > appState.unlockedLevel && lvl.id < SCENARIO_LEVELS.length) {
        appState.unlockedLevel = lvl.id + 1;
      }
      addPoints(lvl.reward, `通過「${lvl.shortTitle}」情境關卡`);
    } else {
      showToast("✅ 再次通過本關複習！");
    }

    if (lvl.id < SCENARIO_LEVELS.length) {
      nextBtn.classList.remove("hidden");
      nextBtn.textContent = `➡️ 解鎖並挑戰第 ${lvl.id + 1} 關`;
    } else {
      nextBtn.classList.remove("hidden");
      nextBtn.textContent = "🏆 恭喜全數通關！查看成就徽章";
    }
  } else {
    resBox.classList.add("fail");
    resTitle.textContent = "⚠️ 判斷失誤！可能引發交通事故或違規";
    resTitle.style.color = "var(--danger)";
    resDetail.textContent = chosenOpt.feedback;
    retryBtn.classList.remove("hidden");
    nextBtn.classList.add("hidden");
  }
}

/* ============================================================================
   八、學習紀錄與成就頁面渲染
   ============================================================================ */

function checkUnlockedBadges() {
  const unlocked = new Set();

  // 1. 交通新手
  if (appState.completedUnits.length >= 1 || appState.quizHistory.totalCorrect >= 1) {
    unlocked.add("badge_newbie");
  }
  // 2. 標誌達人
  if (appState.viewedSigns.length >= 8 && appState.completedUnits.includes("unit_signs")) {
    unlocked.add("badge_signs");
  }
  // 3. 筆試高手
  if (appState.quizHistory.bestAccuracy >= 80) {
    unlocked.add("badge_quiz_master");
  }
  // 4. 安全駕駛員
  if (appState.completedLevels.length >= SCENARIO_LEVELS.length) {
    unlocked.add("badge_safe_driver");
  }
  // 5. 錯題剋星
  if (appState.bookmarkedQuestions.length >= 1) {
    unlocked.add("badge_reviewer");
  }
  // 6. 滿分車神
  if (appState.totalPoints >= 500) {
    unlocked.add("badge_legend");
  }

  return unlocked;
}

function renderProgressPage() {
  const ptsEl = document.getElementById("progressPagePoints");
  if (!ptsEl) return;

  ptsEl.textContent = appState.totalPoints;
  document.getElementById("recTotalPoints").textContent = `${appState.totalPoints} 分`;

  const { sessionsCount, totalAnswered, totalCorrect } = appState.quizHistory;
  document.getElementById("recQuizCount").textContent = `${sessionsCount} 次（${totalAnswered} 題）`;
  const acc = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  document.getElementById("recQuizAccuracy").textContent = totalAnswered > 0 ? `${acc}%` : "尚未測驗";
  document.getElementById("recScenarioCount").textContent = `${appState.completedLevels.length} / ${SCENARIO_LEVELS.length} 關`;

  // 渲染成就徽章
  const unlockedSet = checkUnlockedBadges();
  const badgesGrid = document.getElementById("badgesGrid");
  badgesGrid.innerHTML = ACHIEVEMENTS_CONFIG.map((b) => {
    const isUnlocked = unlockedSet.has(b.id);
    return `
      <div class="badge-card ${isUnlocked ? "unlocked" : ""}">
        <div class="badge-emblem">${isUnlocked ? b.icon : "🔒"}</div>
        <div>
          <h4>${b.title}</h4>
          <p class="muted-text" style="font-size:0.85rem;">${b.desc}</p>
          <span class="badge-status-pill">${isUnlocked ? "✨ 已獲得徽章" : "尚未解鎖"}</span>
        </div>
      </div>
    `;
  }).join("");

  // 渲染尚未完成的關卡
  const pendingList = document.getElementById("uncompletedScenariosList");
  const uncompleted = SCENARIO_LEVELS.filter((l) => !appState.completedLevels.includes(l.id));
  if (uncompleted.length === 0) {
    pendingList.innerHTML = `<div class="pending-item"><span>🎉 太棒了！你已經通過所有道路情境關卡！</span></div>`;
  } else {
    pendingList.innerHTML = uncompleted
      .map(
        (l) => `
        <div class="pending-item">
          <div>
            <strong>第 ${l.id} 關：${l.shortTitle}</strong>
            <div class="muted-text" style="font-size:0.82rem;">獎勵 +${l.reward} 積分</div>
          </div>
          <button class="btn btn-sm btn-primary" data-jump-scenario="${l.id}">前往挑戰 →</button>
        </div>
      `
      )
      .join("");

    pendingList.querySelectorAll("[data-jump-scenario]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = parseInt(btn.dataset.jumpScenario, 10);
        if (!appState.unlockAllMode && targetId > appState.unlockedLevel) {
          currentScenarioId = appState.unlockedLevel;
          showToast(`請先依序通過第 ${appState.unlockedLevel} 關以解鎖後續關卡！`);
        } else {
          currentScenarioId = targetId;
        }
        switchPage("scenarios");
      });
    });
  }

  // 渲染收藏的錯題清單
  document.getElementById("recBookmarkCount").textContent = appState.bookmarkedQuestions.length;
  const bmList = document.getElementById("bookmarkedQuestionsList");
  const savedQuestions = QUIZ_BANK.filter((q) => appState.bookmarkedQuestions.includes(q.id));

  if (savedQuestions.length === 0) {
    bmList.innerHTML = `<div class="pending-item"><span class="muted-text">目前尚無收藏題目，在「駕照筆試測驗」作答後可點選收藏！</span></div>`;
  } else {
    bmList.innerHTML = savedQuestions
      .map(
        (q) => `
        <div class="bookmark-item">
          <div class="bookmark-item-head">
            <strong style="font-size:0.95rem;">${q.question}</strong>
            <button class="btn btn-sm btn-outline-danger" data-remove-bm="${q.id}">移除</button>
          </div>
          <div style="font-size:0.86rem; color:var(--success); font-weight:700;">
            ✔ 正解：${q.options[q.answer]}
          </div>
          <div class="muted-text" style="font-size:0.83rem; margin-top:4px;">${q.explanation}</div>
        </div>
      `
      )
      .join("");

    bmList.querySelectorAll("[data-remove-bm]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qId = btn.dataset.removeBm;
        appState.bookmarkedQuestions = appState.bookmarkedQuestions.filter((id) => id !== qId);
        saveState();
        showToast("已移除該收藏題目");
      });
    });
  }
}

/* ============================================================================
   九、事件初始化綁定
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // 頂部導覽按鈕
  document.querySelectorAll(".nav-btn, .brand").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const targetPage = el.dataset.page;
      if (targetPage) switchPage(targetPage);
    });
  });

  // 頁面內跳轉按鈕 ([data-goto])
  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchPage(btn.dataset.goto);
    });
  });

  // 手機版漢堡選單
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 重置學習紀錄
  const resetBtn = document.getElementById("resetProgressBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("確定要清除所有積分、筆試紀錄與情境闖關進度嗎？此動作無法復原。")) {
        appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        currentScenarioId = 1;
        saveState();
        showToast("🔄 已重置所有學習紀錄");
      }
    });
  }

  // 交通標誌彈窗關閉事件
  const signModal = document.getElementById("signModal");
  const closeSignModal = document.getElementById("closeSignModal");
  if (closeSignModal && signModal) {
    closeSignModal.addEventListener("click", () => {
      signModal.classList.remove("open");
      signModal.setAttribute("aria-hidden", "true");
    });
    signModal.addEventListener("click", (e) => {
      if (e.target === signModal) {
        signModal.classList.remove("open");
        signModal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // 筆試測驗按鈕綁定
  document.getElementById("startQuizBtn")?.addEventListener("click", startQuiz);
  document.getElementById("toggleBookmarkBtn")?.addEventListener("click", toggleCurrentQuestionBookmark);
  document.getElementById("nextQuestionBtn")?.addEventListener("click", goToNextQuestion);
  document.getElementById("restartQuizBtn")?.addEventListener("click", () => {
    document.getElementById("quizResultCard").classList.add("hidden");
    document.getElementById("quizSetupCard").classList.remove("hidden");
  });
  document.getElementById("reviewBookmarksBtn")?.addEventListener("click", () => {
    if (appState.bookmarkedQuestions.length === 0) {
      showToast("目前尚未收藏任何錯題喔！");
      return;
    }
    document.getElementById("quizCategorySelect").value = "bookmarks";
    startQuiz();
  });

  // 情境闖關控制項綁定
  document.getElementById("unlockAllToggle")?.addEventListener("change", (e) => {
    appState.unlockAllMode = e.target.checked;
    saveState();
    showToast(e.target.checked ? "🔓 已開啟自由體驗模式（全關卡可選）" : "🔒 已切換回標準闖關進度模式");
  });

  document.getElementById("retryScenarioBtn")?.addEventListener("click", () => {
    loadScenarioStage(currentScenarioId);
  });

  document.getElementById("nextScenarioBtn")?.addEventListener("click", () => {
    if (currentScenarioId < SCENARIO_LEVELS.length) {
      loadScenarioStage(currentScenarioId + 1);
    } else {
      switchPage("progress");
    }
  });

  // 首次渲染全站 UI
  refreshAllUI();
});
