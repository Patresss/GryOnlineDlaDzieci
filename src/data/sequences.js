const sequences = [
  // Easy - proste wzory AB
  {
    pattern: ["🔴", "🔵", "🔴", "🔵", "🔴"],
    answer: "🔵",
    options: ["🔴", "🔵", "🟢", "🟡"],
    difficulty: "easy",
  },
  {
    pattern: ["⭐", "🌙", "⭐", "🌙", "⭐"],
    answer: "🌙",
    options: ["⭐", "🌙", "☀️", "🌟"],
    difficulty: "easy",
  },
  {
    pattern: ["🍎", "🍌", "🍎", "🍌", "🍎"],
    answer: "🍌",
    options: ["🍎", "🍌", "🍇"],
    difficulty: "easy",
  },
  {
    pattern: ["🐱", "🐶", "🐱", "🐶", "🐱"],
    answer: "🐶",
    options: ["🐱", "🐶", "🐰"],
    difficulty: "easy",
  },
  {
    pattern: ["❤️", "💙", "❤️", "💙", "❤️"],
    answer: "💙",
    options: ["❤️", "💙", "💚", "💛"],
    difficulty: "easy",
  },
  {
    pattern: ["🌳", "🌻", "🌳", "🌻", "🌳"],
    answer: "🌻",
    options: ["🌳", "🌻", "🌵"],
    difficulty: "easy",
  },
  {
    pattern: ["🔺", "🔵", "🔺", "🔵", "🔺"],
    answer: "🔵",
    options: ["🔺", "🔵", "🟩"],
    difficulty: "easy",
  },

  // Medium - wzory ABB / AAB
  {
    pattern: ["🔴", "🔵", "🔵", "🔴", "🔵", "🔵", "🔴"],
    answer: "🔵",
    options: ["🔴", "🔵", "🟢", "🟡"],
    difficulty: "medium",
  },
  {
    pattern: ["🍎", "🍎", "🍌", "🍎", "🍎", "🍌", "🍎"],
    answer: "🍎",
    options: ["🍎", "🍌", "🍇"],
    difficulty: "medium",
  },
  {
    pattern: ["⭐", "⭐", "🌙", "⭐", "⭐", "🌙"],
    answer: "⭐",
    options: ["⭐", "🌙", "☀️"],
    difficulty: "medium",
  },
  {
    pattern: ["🐱", "🐶", "🐶", "🐱", "🐶", "🐶"],
    answer: "🐱",
    options: ["🐱", "🐶", "🐰", "🐭"],
    difficulty: "medium",
  },
  {
    pattern: ["🟢", "🟡", "🟡", "🟢", "🟡", "🟡", "🟢"],
    answer: "🟡",
    options: ["🟢", "🟡", "🔴"],
    difficulty: "medium",
  },
  {
    pattern: ["🌻", "🌻", "🌳", "🌻", "🌻", "🌳", "🌻"],
    answer: "🌻",
    options: ["🌻", "🌳", "🌵"],
    difficulty: "medium",
  },
  {
    pattern: ["❤️", "💙", "💙", "❤️", "💙", "💙", "❤️"],
    answer: "💙",
    options: ["❤️", "💙", "💚"],
    difficulty: "medium",
  },

  // Hard - wzory ABC
  {
    pattern: ["🔴", "🔵", "🟢", "🔴", "🔵", "🟢", "🔴"],
    answer: "🔵",
    options: ["🔴", "🔵", "🟢", "🟡"],
    difficulty: "hard",
  },
  {
    pattern: ["🍎", "🍌", "🍇", "🍎", "🍌", "🍇"],
    answer: "🍎",
    options: ["🍎", "🍌", "🍇", "🍊"],
    difficulty: "hard",
  },
  {
    pattern: ["⭐", "🌙", "☀️", "⭐", "🌙", "☀️", "⭐", "🌙"],
    answer: "☀️",
    options: ["⭐", "🌙", "☀️", "🌟"],
    difficulty: "hard",
  },
  {
    pattern: ["🐱", "🐶", "🐰", "🐱", "🐶", "🐰", "🐱"],
    answer: "🐶",
    options: ["🐱", "🐶", "🐰", "🐭"],
    difficulty: "hard",
  },
  {
    pattern: ["🟢", "🟡", "🔴", "🟢", "🟡", "🔴", "🟢", "🟡"],
    answer: "🔴",
    options: ["🟢", "🟡", "🔴", "🔵"],
    difficulty: "hard",
  },
  {
    pattern: ["🌻", "🌳", "🍄", "🌻", "🌳", "🍄", "🌻"],
    answer: "🌳",
    options: ["🌻", "🌳", "🍄", "🌵"],
    difficulty: "hard",
  },
];

export default sequences;
