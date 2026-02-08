const recipes = [
  {
    name: "Kanapka z serem",
    emoji: "🥪",
    steps: [
      { instruction: "Wez kromke chleba", ingredient: "🍞", label: "Chleb" },
      { instruction: "Posmaruj maslem", ingredient: "🧈", label: "Maslo" },
      { instruction: "Poloz plasterek sera", ingredient: "🧀", label: "Ser" },
      { instruction: "Dodaj listek salaty", ingredient: "🥬", label: "Salata" },
      { instruction: "Przykryj druga kromka", ingredient: "🍞", label: "Chleb" },
    ],
  },
  {
    name: "Salatka owocowa",
    emoji: "🥗",
    steps: [
      { instruction: "Pokroj banana w plastry", ingredient: "🍌", label: "Banan" },
      { instruction: "Dodaj pokrojone jablko", ingredient: "🍎", label: "Jablko" },
      { instruction: "Wrzuc truskawki", ingredient: "🍓", label: "Truskawki" },
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
      { instruction: "Wrzuc truskawki", ingredient: "🍓", label: "Truskawki" },
      { instruction: "Zmiksuj wszystko", ingredient: "🌀", label: "Blender" },
    ],
  },
  {
    name: "Nalesniki",
    emoji: "🥞",
    steps: [
      { instruction: "Wbij jajko do miski", ingredient: "🥚", label: "Jajko" },
      { instruction: "Dodaj make i mleko", ingredient: "🥛", label: "Mleko i maka" },
      { instruction: "Wymieszaj ciasto", ingredient: "🥄", label: "Lyzka" },
      { instruction: "Usmaż na patelni", ingredient: "🍳", label: "Patelnia" },
      { instruction: "Posmaruj dzemem", ingredient: "🍓", label: "Dzem" },
    ],
  },
  {
    name: "Lody w pucharku",
    emoji: "🍨",
    steps: [
      { instruction: "Wez pucharek", ingredient: "🥣", label: "Pucharek" },
      { instruction: "Naloz galke lodow czekoladowych", ingredient: "🍫", label: "Lody czekoladowe" },
      { instruction: "Naloz galke lodow waniliowych", ingredient: "🍦", label: "Lody waniliowe" },
      { instruction: "Posyp posypka", ingredient: "🌈", label: "Posypka" },
      { instruction: "Dodaj wisienke na gorze", ingredient: "🍒", label: "Wisienka" },
    ],
  },
  {
    name: "Sok pomaranczowy",
    emoji: "🧃",
    steps: [
      { instruction: "Wez pomaranczе", ingredient: "🍊", label: "Pomarancze" },
      { instruction: "Przekroj na polowki", ingredient: "🔪", label: "Noz" },
      { instruction: "Wycisnij sok", ingredient: "🍊", label: "Wyciskarka" },
      { instruction: "Przelej do szklanki", ingredient: "🥤", label: "Szklanka" },
    ],
  },
  {
    name: "Herbata",
    emoji: "🍵",
    steps: [
      { instruction: "Zagotuj wode", ingredient: "💧", label: "Woda" },
      { instruction: "Wloz torebke herbaty do kubka", ingredient: "🍵", label: "Herbata" },
      { instruction: "Zalej goraca woda", ingredient: "♨️", label: "Goraca woda" },
      { instruction: "Dodaj lyzeczke miodu", ingredient: "🍯", label: "Miod" },
    ],
  },
  {
    name: "Jajecznica",
    emoji: "🍳",
    steps: [
      { instruction: "Rozgrzej patelnie z maslem", ingredient: "🧈", label: "Maslo" },
      { instruction: "Wbij jajka", ingredient: "🥚", label: "Jajka" },
      { instruction: "Mieszaj lyzka na patelni", ingredient: "🥄", label: "Lyzka" },
      { instruction: "Posyp szczypiorkiem", ingredient: "🌿", label: "Szczypiorek" },
    ],
  },
  {
    name: "Tosty",
    emoji: "🍞",
    steps: [
      { instruction: "Wez dwa plasterki chleba tostowego", ingredient: "🍞", label: "Chleb tostowy" },
      { instruction: "Poloz plasterek sera", ingredient: "🧀", label: "Ser" },
      { instruction: "Dodaj plasterek szynki", ingredient: "🥓", label: "Szynka" },
      { instruction: "Przykryj drugim plasterkiem", ingredient: "🍞", label: "Chleb tostowy" },
      { instruction: "Opiecz w tosterze", ingredient: "🔥", label: "Toster" },
    ],
  },
];

export default recipes;
