const recipes = [
  {
    name: "Kanapka z serem",
    emoji: "🥪",
    steps: [
      { instruction: "Weź kromkę chleba", ingredient: "🍞", label: "Chleb" },
      { instruction: "Posmaruj masłem", ingredient: "🧈", label: "Masło" },
      { instruction: "Połóż plasterek sera", ingredient: "🧀", label: "Ser" },
      { instruction: "Dodaj listek sałaty", ingredient: "🥬", label: "Sałata" },
      { instruction: "Przykryj drugą kromką", ingredient: "🥖", label: "Kromka" },
    ],
  },
  {
    name: "Sałatka owocowa",
    emoji: "🥗",
    steps: [
      { instruction: "Pokrój banana w plastry", ingredient: "🍌", label: "Banan" },
      { instruction: "Dodaj pokrojone jabłko", ingredient: "🍎", label: "Jabłko" },
      { instruction: "Wrzuć truskawki", ingredient: "🍓", label: "Truskawki" },
      { instruction: "Dodaj winogrona", ingredient: "🍇", label: "Winogrona" },
      { instruction: "Polej jogurtem", ingredient: "🥛", label: "Jogurt" },
    ],
  },
  {
    name: "Pizza",
    emoji: "🍕",
    steps: [
      { instruction: "Przygotuj ciasto na spodek", ingredient: "🫓", label: "Ciasto" },
      { instruction: "Posmaruj sosem pomidorowym", ingredient: "🍅", label: "Sos pomidorowy" },
      { instruction: "Posyp startym serem", ingredient: "🧀", label: "Ser" },
      { instruction: "Udekoruj plasterkami szynki", ingredient: "🥓", label: "Szynka" },
      { instruction: "Piecz w piekarniku", ingredient: "🔥", label: "Piekarnik" },
    ],
  },
  {
    name: "Koktajl owocowy",
    emoji: "🥤",
    steps: [
      { instruction: "Wlej mleko do blendera", ingredient: "🥛", label: "Mleko" },
      { instruction: "Dodaj banana", ingredient: "🍌", label: "Banan" },
      { instruction: "Wrzuć truskawki", ingredient: "🍓", label: "Truskawki" },
      { instruction: "Zmiksuj wszystko", ingredient: "🌀", label: "Blender" },
    ],
  },
  {
    name: "Naleśniki",
    emoji: "🥞",
    steps: [
      { instruction: "Wbij jajko do miski", ingredient: "🥚", label: "Jajko" },
      { instruction: "Dodaj mąkę i mleko", ingredient: "🥛", label: "Mleko i mąka" },
      { instruction: "Wymieszaj ciasto", ingredient: "🥄", label: "Łyżka" },
      { instruction: "Usmąż na patelni", ingredient: "🍳", label: "Patelnia" },
      { instruction: "Posmaruj dżemem", ingredient: "🫙", label: "Dżem" },
    ],
  },
  {
    name: "Lody w pucharku",
    emoji: "🍨",
    steps: [
      { instruction: "Weź pucharek", ingredient: "🥣", label: "Pucharek" },
      { instruction: "Nałóż gałkę lodów czekoladowych", ingredient: "🍫", label: "Lody czekoladowe" },
      { instruction: "Nałóż gałkę lodów waniliowych", ingredient: "🍦", label: "Lody waniliowe" },
      { instruction: "Posyp posypką", ingredient: "🌈", label: "Posypka" },
      { instruction: "Dodaj wiśnię na górze", ingredient: "🍒", label: "Wiśnia" },
    ],
  },
  {
    name: "Sok pomarańczowy",
    emoji: "🧃",
    steps: [
      { instruction: "Weź pomarańcze", ingredient: "🍊", label: "Pomarańcze" },
      { instruction: "Przekrój na połówki", ingredient: "🔪", label: "Nóż" },
      { instruction: "Wyciśnij sok", ingredient: "🍹", label: "Wyciskarka" },
      { instruction: "Przelej do szklanki", ingredient: "🥤", label: "Szklanka" },
    ],
  },
  {
    name: "Herbata",
    emoji: "🍵",
    steps: [
      { instruction: "Zagotuj wodę", ingredient: "💧", label: "Woda" },
      { instruction: "Włóż torebkę herbaty do kubka", ingredient: "🍵", label: "Herbata" },
      { instruction: "Zalej gorącą wodą", ingredient: "♨️", label: "Gorąca woda" },
      { instruction: "Dodaj łyżeczkę miodu", ingredient: "🍯", label: "Miód" },
    ],
  },
  {
    name: "Jajecznica",
    emoji: "🍳",
    steps: [
      { instruction: "Rozgrzej patelnię z masłem", ingredient: "🧈", label: "Masło" },
      { instruction: "Wbij jajka", ingredient: "🥚", label: "Jajka" },
      { instruction: "Mieszaj łyżką na patelni", ingredient: "🥄", label: "Łyżka" },
      { instruction: "Posyp szczypiorkiem", ingredient: "🌿", label: "Szczypiorek" },
    ],
  },
  {
    name: "Tosty",
    emoji: "🍞",
    steps: [
      { instruction: "Weź dwa plasterki chleba tostowego", ingredient: "🍞", label: "Chleb tostowy" },
      { instruction: "Połóż plasterek sera", ingredient: "🧀", label: "Ser" },
      { instruction: "Dodaj plasterek szynki", ingredient: "🥓", label: "Szynka" },
      { instruction: "Przykryj drugim plasterkiem", ingredient: "🥖", label: "Drugi plasterek" },
      { instruction: "Opiecz w tosterze", ingredient: "🔥", label: "Toster" },
    ],
  },
];

export default recipes;
