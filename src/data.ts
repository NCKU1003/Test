/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ItineraryDay, WeatherDay, GuideCategory } from './types';

export const ITINERARY_DATA: ItineraryDay[] = [
  {
    dayNumber: 1,
    dateStr: "Day 1 ｜ 經典北環島景觀線",
    title: "跨海奇景與古厝情懷",
    clothingSuggestion: "輕便排汗短袖、防曬針織薄外套、遮陽漁夫帽、好走路的慢跑鞋、太陽眼鏡。",
    seaCondition: {
      waveHeight: "0.5m - 0.8m（平浪）",
      uvIndex: "11+（危險級，需密集防曬）",
      seaSuitability: "極適合遊玩（北海風浪小，適宜本島陸路環島）",
      warningNote: "白沙至西嶼沿途遮蔽物較少，下午在外垵風力稍強，小心中暑與帽子被風吹落！"
    },
    spots: [
      {
        id: "d1-s1",
        time: "09:30",
        name: "澎湖跨海大橋",
        description: "澎湖最具代表性的地標，橫跨吼門水道連接白沙與西嶼。藍天下的紅白相間大橋配上海浪，是此生必打卡的澎湖經典地標！",
        type: "attraction",
        highlights: ["必拍", "經典地標"],
        gmapUrl: "https://maps.google.com/?q=澎湖跨海大橋",
        parkingAndGasInfo: {
          parking: "「通梁端」與「西嶼端」兩側皆設有寬敞免費公有停車場，方便停放汽機車。",
          gas: "中油通梁加油站（白沙鄉通梁村），營業至下午 17:00，建議過橋前先加滿機車！"
        },
        photoTip: "在大橋「西嶼端」拱門旁，可以抓綠化草皮與拱門合影；或者過橋後約50公尺處迴轉，可以拍出無限延伸的海天一線大橋視角！",
        photoPlaceholder: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d1-s2",
        time: "11:00",
        name: "易家仙人掌冰",
        description: "鄰近跨海大橋白沙端，是澎湖仙人掌冰的創始鼻祖！自製純天然紫紅色冰淇淋，口感微酸微甜爽口，是澎湖烈日下的極致消暑聖品。",
        type: "food",
        highlights: ["必吃", "在地創始"],
        gmapUrl: "https://maps.google.com/?q=易家仙人掌冰",
        parkingAndGasInfo: {
          parking: "店面門口路寬可以臨停機車，開車前往可停在跨海大橋旁停車場再步行過來。",
          gas: "中油通梁站就在對面，補充能量非常便利。"
        },
        photoTip: "把紫紅色的仙人掌冰淇淋高高舉起，以藍天大橋或店家海洋風的亮黃色二樓建築為背景拍照，色彩超級飽和可愛！",
        photoPlaceholder: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d1-s3",
        time: "13:30",
        name: "二崁聚落保存區",
        description: "全國第一個傳統聚落保存區。由百年前咾咕石、玄武岩築成的閩南式四合院，漫步在鋪滿貝殼碎屑的巷弄中，彷彿時空凝結。",
        type: "attraction",
        highlights: ["必拍", "咾咕石古厝"],
        gmapUrl: "https://maps.google.com/?q=二崁聚落保存區",
        parkingAndGasInfo: {
          parking: "古厝聚落外圍（入口處）設有大型免費公有汽機車停車場，落入口禁止汽機車駛入。",
          gas: "中油西嶼加油站（西嶼鄉池東村），車程約 5 分鐘，便利無虞。"
        },
        photoTip: "巷弄兩側掛滿了曬香陶瓷盤，或是古色古香的杏仁茶茶缸，以舊式咾咕石牆壁為背景，利用景深拍出懷舊文青風！",
        photoPlaceholder: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d1-s4",
        time: "14:15",
        name: "二崁杏仁茶",
        description: "藏身在二崁民宅古厝內，以巨大的陶缸煮著古早手工無毒杏仁茶。口感極為濃郁柔順，毫無一般化學杏仁刺鼻味，搭配海風十分愜意。",
        type: "food",
        highlights: ["必吃", "香醇古早"],
        gmapUrl: "https://maps.google.com/?q=二崁杏仁茶",
        parkingAndGasInfo: {
          parking: "位於聚落巷弄深處，請將汽機車停在二崁外圍大停車場，再步行約 3 分鐘抵達。",
          gas: "同中油西嶼加油站。"
        },
        photoTip: "古厝門口掛著一個可愛手工彩繪的「杏仁茶陶罐」招牌，拿著印有手寫字體的杏仁茶小瓷杯跟大陶缸合照，復古味十足！",
        photoPlaceholder: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d1-s5",
        time: "15:30",
        name: "池東大菓葉柱狀玄武岩",
        description: "日治時期為了挖土建港而意外發掘的壯麗柱狀玄武岩。黃褐色的火山熔岩冷卻收縮而成的石柱高聳挺立，是澎湖最具震撼性的世界級地質奇景。",
        type: "attraction",
        highlights: ["必拍", "地理課本神景"],
        gmapUrl: "https://maps.google.com/?q=池東大菓葉玄武岩",
        parkingAndGasInfo: {
          parking: "玄武岩前方廣場設有大片專屬免費機車、汽車格，路況好極易停放。",
          gas: "中油西嶼加油站，車程約 3 分鐘，就在主幹道轉彎處旁邊。"
        },
        photoTip: "絕招大公開！若前一天或上午有下點雨，玄武岩正前方的凹地會形成積水窪。蹲低以手機貼近水面，就能利用倒影拍出震撼人心的天空之鏡「玄武岩對稱大片」！",
        photoPlaceholder: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d1-s6",
        time: "17:30",
        name: "外垵漁港觀景台",
        description: "外垵是全澎湖最富裕的純樸漁村，依山而建的白色民宅逐級層遞。傍晚時分登上山頭觀景台，俯瞰彎月形的漁港亮起點點漁火，宛如「台版聖托里尼」。",
        type: "attraction",
        highlights: ["必打卡", "菊島聖托里尼"],
        gmapUrl: "https://maps.google.com/?q=外垵漁港觀景台",
        parkingAndGasInfo: {
          parking: "外垵高地位於三仙塔附近，空地極大，汽機車直接停在草地或空地上即可。",
          gas: "中油外垵加油站（西嶼鄉外垵村），營業至下午 17:00，就在漁港外圍主路上。"
        },
        photoTip: "推薦傍晚 18:00 到 18:30 的「藍色時刻 (Blue Hour)」前來，帶腳架，利用廣角鏡頭俯拍，能同時收進亮著鵝黃燈光的點點白色房屋與蔚藍的海灣夜幕，浪漫爆表！",
        photoPlaceholder: "https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    dayNumber: 2,
    dateStr: "Day 2 ｜ 藍海離島跳島經典線",
    title: "望安人文綠蠵龜與七美浪漫石滬",
    clothingSuggestion: "速乾涼爽抗UV衣物、涼鞋或涉水鞋（便於踏浪）、大遮陽帽、太陽眼鏡、防水背包、暈船藥（出發前30分鐘服用）。",
    seaCondition: {
      waveHeight: "0.8m - 1.2m（輕浪到中浪，南海航程約80分鐘）",
      uvIndex: "12（極強烈級，防曬油要定時補擦！）",
      seaSuitability: "適合隨船出行（風浪和緩，出海安全）",
      warningNote: "跳島行程在船上的時間較長。抵達離島後是以機車代步，防曬務必做全面（後頸、雙手），以免晒傷！"
    },
    spots: [
      {
        id: "d2-s1",
        time: "07:30",
        name: "南海遊客中心",
        description: "位於馬公市區，是前往七美、望安、虎井等南方離島的樞紐大門。今日帶著雀躍的心情提早抵達碼頭，至快艇櫃檯取票並準備登船！",
        type: "transport",
        highlights: ["登船報到", "跳島起點"],
        gmapUrl: "https://maps.google.com/?q=南海遊客中心",
        parkingAndGasInfo: {
          parking: "遊客中心正門設有收費汽車格，周邊亦有寬廣免費的南海港機車停放專區。",
          gas: "中油前寮加油站，車程約 4 分鐘；市區內便利，出發前不須擔心。"
        },
        photoTip: "站在寫著「南海碼頭」的拱門或藍白色遊艇前，頂著早晨晶瑩的陽光，拿著你的船票拍一張海島出發特寫！",
        photoPlaceholder: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d2-s2",
        time: "09:30",
        name: "望安網垵口沙灘",
        description: "望安島上最著名的弧形海灣沙灘。細緻的黃金白碎貝殼砂迎著湛藍漸層海水，據說也是綠蠵龜每年夏季深夜悄悄登陸產卵的純淨之地。",
        type: "attraction",
        highlights: ["必拍", "療癒漸層藍"],
        gmapUrl: "https://maps.google.com/?q=望安網垵口沙灘",
        parkingAndGasInfo: {
          parking: "沙灘路口設有簡易涼亭與免費空地可停靠租借的離島機車。",
          gas: "中油望安加油站（望安鄉東安村），為離島唯一加油站，加滿即可放心環行。"
        },
        photoTip: "這裡有著特殊的水泥拱形防波牆。可以坐在水泥拱洞中，以對稱構圖背對鏡頭，框出前方的金色沙灘與雙色海面，畫面超級夢幻！",
        photoPlaceholder: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d2-s3",
        time: "13:30",
        name: "七美雙心石滬",
        description: "七美島最璀璨的寶石。利用玄武岩砌成的雙心形捕魚石滬，原本是古人的捕魚陷阱，在湛藍無比的海水中靜靜躺了數十載，成為愛情最美的象徵。",
        type: "attraction",
        highlights: ["必打卡", "傳奇雙心"],
        gmapUrl: "https://maps.google.com/?q=雙心石滬",
        parkingAndGasInfo: {
          parking: "上方路邊規劃了整齊的整排免費機車格，並設置有休憩觀景台及洗手間。",
          gas: "中油七美加油站（七美鄉南港村），是七美島上唯一加油站，離島騎機車必經之地。"
        },
        photoTip: "站在上方的最高觀景台扶手邊。可以利用「雙心石滬」放在畫面右上角，人站在左下角，呈現出明信片般的乾淨空靈構圖！",
        photoPlaceholder: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d2-s4",
        time: "14:45",
        name: "七美小台灣",
        description: "得天獨厚的海蝕奇景！一整片平坦的火山玄武岩海蝕平台，在常年累月潮起潮落、浪濤沖刷下，形塑出一個維妙維肖、有如縮小版台灣地圖的奇岩結構。",
        type: "attraction",
        highlights: ["必拍", "天工開物"],
        gmapUrl: "https://maps.google.com/?q=七美小台灣",
        parkingAndGasInfo: {
          parking: "路邊寬敞，設有木製看景露台及大片免費停機車的碎石地空地。",
          gas: "離島補水與基本物資可以在觀景台旁的阿婆小攤購買，有冰椰子汁和冷飲！"
        },
        photoTip: "這理也叫「台灣之頂」。站或坐在觀景台安全緣，俯拍石海波濤與「小台灣」完美契合。退潮時輪廓最為清晰！",
        photoPlaceholder: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d2-s5",
        time: "15:30",
        name: "芳子阿婆肉餅",
        description: "位於七美南港碼頭附近的排隊老字號。阿婆純手工捏製的炸肉餅，外包高麗菜、多汁鮮肉餡與大量青蔥，外皮炸得金黃焦脆，香噴噴让人直吞口水！",
        type: "food",
        highlights: ["必吃", "在地小吃"],
        gmapUrl: "https://maps.google.com/?q=芳子阿婆肉餅",
        parkingAndGasInfo: {
          parking: "靠近七美碼頭中心，機車隨手停在路邊，不阻礙碼頭交通即可。",
          gas: "中油七美加油站就在下坡轉彎處 1 分鐘內車程，回船前順路加滿！"
        },
        photoTip: "熱騰騰出鍋的手捏肉餅，在純樸的藍色招牌前拿著，拍下阿婆親切現捏肉餅的溫馨手作身影。",
        photoPlaceholder: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    dayNumber: 3,
    dateStr: "Day 3 ｜ 古蹟市區與南環漫步線",
    title: "古街媽祖香火與蒔裡夕陽踏浪",
    clothingSuggestion: "涼爽文青襯衫或長洋裝（老街拍照非常好看）、防蚊液（古蹟老巷備用）、夾腳拖鞋（下午莳裡玩水必備）、保濕噴霧。",
    seaCondition: {
      waveHeight: "0.4m（風平浪靜）",
      uvIndex: "10+（極強）",
      seaSuitability: "極其安全（本島陸路行程，可全天輕鬆玩）",
      warningNote: "本日以本島老街、文創村、南部蒔裡沙灘漫行爲主，下午15點後最推薦踩水，不冷不熱好愜意！"
    },
    spots: [
      {
        id: "d3-s1",
        time: "10:00",
        name: "天后宮與中央老街",
        description: "澎湖天后宮是全台灣歷史最悠久的媽祖廟（一級古蹟）。順著天后宮旁進入中央街，漫步幽靜老街巷弄，觸摸歷史痕跡、著名的萬軍井與四眼井。",
        type: "attraction",
        highlights: ["必訪", "開台古老"],
        gmapUrl: "https://maps.google.com/?q=澎湖天后宮",
        parkingAndGasInfo: {
          parking: "老街內禁止汽機車通，可停在宮前「中山路」或「中正路」收費汽機車格與空地。",
          gas: "中油馬公加油站（市區民生路），車程 3 分鐘，為澎湖本島市區旗艦主站。"
        },
        photoTip: "老街巷道是以古老的紅磚搭配咾咕石、紅木門窗。站在四眼井前，或是提著紅色燈笼的古茶鋪屋檐下避暑，古色古香的意境極具韻味！",
        photoPlaceholder: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d3-s2",
        time: "11:00",
        name: "乾益堂藥膳蛋",
        description: "位於老街四眼井前，是一棟巴洛克與閩南混合風格的百年中藥行老屋。店內秘製滷包漢方滷出來的「藥膳茶葉蛋」與「藥膳豆干」，藥香回甘、湯汁入骨！",
        type: "food",
        highlights: ["必吃", "百年古香"],
        gmapUrl: "https://maps.google.com/?q=乾益堂藥膳蛋",
        parkingAndGasInfo: {
          parking: "位於中央街老街正中心，請由中山路或天后宮旁步行入老街，步行約 2 分鐘。",
          gas: "同馬公市區中油加油站。"
        },
        photoTip: "買好中藥味十足的黑嚕嚕藥膳蛋，以乾益堂華美懷舊的中藥櫃台木門或四眼井石板為背景，熱氣裊裊，看了就令人食指大動！",
        photoPlaceholder: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d3-s3",
        time: "13:30",
        name: "篤行十村文化園區",
        description: "全台最老古眷村，曾是音樂才子張雨生與『外婆的澎湖灣』潘安邦的家鄉。如今改造為文創園區，充滿童趣復古的標語、黑胶唱片，文青風拉滿！",
        type: "attraction",
        highlights: ["必訪", "眷村文創"],
        gmapUrl: "https://maps.google.com/?q=篤行十村",
        parkingAndGasInfo: {
          parking: "園區門口設有大片專屬免費機車格與汽車路邊位，停放非常方便。",
          gas: "市區加油站林立，中油明德路站或中山路加油都很便當。"
        },
        photoTip: "那面高大的「毋忘在莒」標語牆，或者是潘安邦外婆雕像背後的湛藍海洋，都是熱門大位。另外，老眷村客廳、懷舊紅白電視也是網美必拍一角！",
        photoPlaceholder: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d3-s4",
        time: "15:30",
        name: "蒔裡沙灘與貝殼咖啡",
        description: "澎湖最悠閒低調的細白珊瑚沙灘，沙質細潔柔綿。相較於人潮擁擠的山水，蒔裡平靜如一條白絲帶。躺在遮陽傘下聽浪看海，點一杯冰拿鐵，極致治癒。",
        type: "attraction",
        highlights: ["必拍", "極致寧靜"],
        gmapUrl: "https://maps.google.com/?q=蒔裡沙灘",
        parkingAndGasInfo: {
          parking: "蒔裡沙灘入口處與「蒔裡貝殼貝殼館」前皆設有大片免費空地可安心停泊。",
          gas: "中油鎖港加油站（馬公市鎖港里），車程約 4 分鐘，是南環線最重要的中繼站。"
        },
        photoTip: "在沙灘入口的白色拱形造景處拍一組框景片。或是利用午後烈日退去、海水宛如一池透明水晶的時刻，涉水拍下白沫與赤足的夏祭氛圍照！",
        photoPlaceholder: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d3-s5",
        time: "18:00",
        name: "澎湖觀音亭西瀛虹橋",
        description: "全台最著名的防波堤與虹橋。也是澎湖夏季最震撼「澎湖國際海上花火節」的發射主場！傍晚時分，長長的拱形彩虹橋亮起迷幻霓虹，映在海濱夕陽。",
        type: "attraction",
        highlights: ["必拍", "日落霓虹"],
        gmapUrl: "https://maps.google.com/?q=觀音亭西瀛虹橋",
        parkingAndGasInfo: {
          parking: "觀音亭休閒園區內設有大型免費公有停車場。但在花火節煙火施放日進行交通管制，需步行前往。",
          gas: "中油馬公加油站，就在市區外圍大路上，便利非凡。"
        },
        photoTip: "一定要在夕陽完全西落後的黃昏 20 分鐘（Magic Hour）內拍攝，天光呈絳紫色，西瀛虹橋的七彩霓虹色剛好完全亮起，波光粼粼的七彩倒影簡直是神級浪漫！",
        photoPlaceholder: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  {
    dayNumber: 4,
    dateStr: "Day 4 ｜ 東海潮間帶生態與島航",
    title: "東海抱墩抓魚與奎壁山分海奇蹟",
    clothingSuggestion: "防水休閒短褲、涼拖鞋、可弄濕的防滑厚底鞋、備用乾衣物一套（放置在機車置物箱中）。",
    seaCondition: {
      waveHeight: "0.4m - 0.6m（極平穩）",
      uvIndex: "11（危險級，潮間帶陽光劇烈）",
      seaSuitability: "極其合宜（東海潮間帶與近海巡航無風無浪）",
      warningNote: "本日有潮間帶踩水、報墩抓小魚以及海蝕平台步道散步。請備齊防水手機殼，防止手機入水受損！"
    },
    spots: [
      {
        id: "d4-s1",
        time: "08:30",
        name: "歧頭遊客中心",
        description: "位於白沙鄉，是澎湖東海（員貝嶼、鳥嶼、大倉嶼）海上生態旅遊的大本營。要在這裡辦理登船手續，並換裝膠鞋，準備開展潮間帶生態抓螃蟹、看珊瑚之旅！",
        type: "transport",
        highlights: ["報到換裝", "生態冒險"],
        gmapUrl: "https://maps.google.com/?q=歧頭遊客中心",
        parkingAndGasInfo: {
          parking: "遊客中心前方與兩側道路劃有大片寬敞的免費公有機車與汽車格，安心停車。",
          gas: "油站請至白沙鄉市區中油加油站，大約 6 分鐘車程內鄰近主幹道。"
        },
        photoTip: "在遊客中心彩繪著各種可愛海洋魚類的牆面前，穿上專業的海灘涉水鞋，拍下一組充滿冒險決心的全副武裝照！",
        photoPlaceholder: "https://images.unsplash.com/photo-1538964173425-93884d739596?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d4-s2",
        time: "10:00",
        name: "東海員貝嶼巡航",
        description: "乘船巡遊東海最奇妙的玄武岩小島。在海上觀賞大自然鬼斧神工的名作，這座岩島一側的玄武岩經千錘百鍊，呈完美的皺褶狀，神似一面「百褶裙仙女岩壁」。",
        type: "attraction",
        highlights: ["必拍", "世界奇岩"],
        gmapUrl: "https://maps.google.com/?q=員貝嶼",
        parkingAndGasInfo: {
          parking: "此為乘船巡航景點（不登島），機車停放歧頭遊客中心，放鬆坐在船上吹風看海景即可。",
          gas: "船上備有乾淨飲水，可自備零食與保溫水杯。"
        },
        photoTip: "當遊艇繞至百褶裙岩石正面時，走到二樓露天甲板，微蹲下、以蔚藍船舷海浪與巨大玄武岩長景為背景。迎著海風，咔嚓最瀟灑的海中特寫！",
        photoPlaceholder: "https://images.unsplash.com/photo-1452796907770-ad6cd374b41e?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d4-s3",
        time: "12:00",
        name: "東海漁村小卷風味餐",
        description: "東海小島上最具澎湖情懷的午宴！大口品嚐漁家清晨剛撈起的「野生小卷麵線」，小卷爽脆彈牙、湯頭鮮美，再配上一盤在地甘甜的澎湖角瓜（絲瓜），香氣四溢。",
        type: "food",
        highlights: ["必吃", "海島海鮮"],
        gmapUrl: "https://maps.google.com/?q=鳥嶼小卷麵線",
        parkingAndGasInfo: {
          parking: "離島島上街道狹窄，多數為步行漫遊或跟著導遊前往，無需開車。",
          gas: "餐廳皆能提供充足飲用水，回航前不妨在此洗手休整。"
        },
        photoTip: "那一碗蓋滿了橘紅條紋爽脆小卷的湯麵線！一定要用筷子夾起一隻肥美小卷，對準背景老漁村小碼頭對焦，光看著就美味滿點！",
        photoPlaceholder: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d4-s4",
        time: "14:30",
        name: "奎壁山地質公園摩西分海",
        description: "澎湖最富盛名的潮汐奇觀！退潮時海水一分為二，會神奇地露出一條由玄武岩卵石、貝殼碎屑碎石鋪成的Ｓ型礫石神秘步道。踏在神蹟步道漫游，一路走到赤嶼！",
        type: "attraction",
        highlights: ["必拍", "神蹟分海"],
        gmapUrl: "https://maps.google.com/?q=奎壁山摩西分海",
        parkingAndGasInfo: {
          parking: "公園內建有極為完善且大型的免費機車格、大客車位與公有遮蔭停車場。",
          gas: "中油湖西加油站，開車大約 5 分鐘，位於湖西鄉市中心主要轉角。"
        },
        photoTip: "一定要比「分海預告時間」提早 20 分鐘抵達。站在小高坡上的木棧平台俯拍，就能一覽海水從兩側退開、露出黑色步道宛如摩西分海的緩慢神聖全程！",
        photoPlaceholder: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "d4-s5",
        time: "16:30",
        name: "澎坊 PIER3 三號港免稅商店",
        description: "澎湖最大、最華麗的大型免稅精緻商場。在回台前做最後的採購，匯集各類高檔名牌、化妝品以及最齊全的澎湖黑糖糕、花生酥、鹹餅伴手禮，一站購齊！",
        type: "shopping",
        highlights: ["必買", "免稅大採購"],
        gmapUrl: "https://maps.google.com/?q=三號港免稅商店",
        parkingAndGasInfo: {
          parking: "設置有大型地下收費汽車停車場，周邊有寬廣的人行道及機車免費停靠格。",
          gas: "位於馬公第三漁港馬公市區，鄰近市區中油加油站，車程 1 分鐘極其便利。"
        },
        photoTip: "商場一樓有極具現代感巨大的澎湖海龜與海洋彩繪 3D 地景牆；或者在購買滿滿一整袋伴手禮後，在亮麗的免稅拱門前來個滿載而歸的開心拍！",
        photoPlaceholder: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
];

export const WEATHER_FORECAST: WeatherDay[] = [
  {
    date: "06/06",
    dayName: "今日",
    temp: "27°C - 32°C",
    windSpeed: "南風 2 級 (微風)",
    tideTimeText: "乾潮 10:45｜滿潮 16:30 (大潮)",
    uvLevel: "12 (極危險，10分鐘晒傷)",
    conditionText: "晴空萬里",
    emoji: "☀️"
  },
  {
    date: "06/07",
    dayName: "週日",
    temp: "26°C - 31°C",
    windSpeed: "南風 2 級 (微風)",
    tideTimeText: "乾潮 11:30｜滿潮 17:15",
    uvLevel: "11 (危險，做好全物理防曬)",
    conditionText: "萬里晴空",
    emoji: "☀️"
  },
  {
    date: "06/08",
    dayName: "週一",
    temp: "27°C - 32°C",
    windSpeed: "偏南風 3 級 (和風)",
    tideTimeText: "乾潮 12:15｜滿潮 18:00",
    uvLevel: "12 (極高，中午避免戶外曝曬)",
    conditionText: "海藍晴朗",
    emoji: "🌤️"
  },
  {
    date: "06/09",
    dayName: "週二",
    temp: "26°C - 31°C",
    windSpeed: "西南風 4 級 (清勁風)",
    tideTimeText: "乾潮 13:00｜滿潮 18:45",
    uvLevel: "10 (極強，多喝水防熱衰竭)",
    conditionText: "晴朗多雲",
    emoji: "⛅"
  }
];

export const GUIDE_CATEGORIES: GuideCategory[] = [
  {
    id: "essential",
    iconName: "Briefcase",
    title: "島上必備裝備",
    items: [
      { name: "針織或抗UV防曬外套", desc: "澎湖烈日當頭，機車代步時物理防曬是靈魂所在！", checked: true, tag: "最重要" },
      { name: "廣角鏡頭與手機防水袋", desc: "拍出大菓葉玄武岩美景、奎壁山分海必備防護。", checked: true, tag: "拍照必備" },
      { name: "防暈船藥", desc: "前往跳島（七美望安南海線）必備！請於開船前30分鐘服用。", checked: false, tag: "醫藥" },
      { name: "保固遮陽漁夫帽/太陽鏡", desc: "風大時寬簷草帽易飛走，推薦有抽繩固定防風的漁夫帽。", checked: false, tag: "穿搭" },
      { name: "環保保溫瓶", desc: "澎湖各處遊客中心皆提供冷熱飲水，多喝水補充流失汗水分別重要！", checked: false, tag: "環保" }
    ]
  },
  {
    id: "gourmet",
    iconName: "UtensilsCrossed",
    title: "打卡菊島美食推薦",
    items: [
      { name: "黑糖糕、花生酥、鹹餅", desc: "源利軒、春仁黑糖糕，以及御品家，送禮體面，回台必敗！", checked: false, tag: "特產伴手禮" },
      { name: "野生小卷麵線 🧅", desc: "小卷鮮脆冰鎮或滾湯皆甜美，推薦鳥嶼、歧頭或馬公市區阿虹。", checked: false, tag: "必吃主食" },
      { name: "鮮食堂海鮮蒸鍋 🦪", desc: "滿滿一鍋鮮美小卷、高麗菜、巨蛤、在地牡蠣慢火蒸煮，鮮美無比。", checked: false, tag: "夜市極品" },
      { name: "澎湖花枝丸與仙人掌奇緣", desc: "大粒看得見花枝塊的現炸炸丸子，再配微酸的粉紅仙人掌冰淇淋！", checked: false, tag: "排隊小吃" }
    ]
  },
  {
    id: "safety",
    iconName: "ShieldAlert",
    title: "菊島安心玩機車須知",
    items: [
      { name: "小心「黑沙、強風與碎石」", desc: "離島玄武岩碎石坡路與沙灘入口易滑胎，騎乘請控制在40km內。", checked: true, tag: "騎乘安全" },
      { name: "隨時檢查「中油加油站」位置", desc: "本島大主幹道、跳島各島僅有一間，下午17點多數打烊，務必提早加滿！", checked: true, tag: "加油站提醒" },
      { name: "澎湖特有「閃紅/閃黃黃昏路口」", desc: "本島環島主線車速快，進入鄉道盲區路口務必「慢、看、停」再通過！", checked: false, tag: "法規防範" }
    ]
  }
];
