import { Trans } from "@lingui/macro";

export const Categories = [
  {
    id: 1,
    name: <Trans>🍔 Eating</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 11,
        name: <Trans>Delivery</Trans>,
        icon: "🛵",
      },
      {
        id: 12,
        name: <Trans>Groceries</Trans>,
        icon: "🛒",
      },
      {
        id: 13,
        name: <Trans>Dining</Trans>,
        icon: "☕️",
      },
      {
        id: 14,
        name: <Trans>Bars</Trans>,
        icon: "🥃",
      },
    ],
  },
  {
    id: 2,
    name: <Trans>🚌 Travel</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 21,
        name: <Trans>Lime</Trans>,
        icon: "🛴",
      },
      {
        id: 22,
        name: <Trans>Bus</Trans>,
        icon: "🚌",
      },
      {
        id: 23,
        name: <Trans>KIA</Trans>,
        icon: "🚙",
      },
    ],
  },
  {
    id: 3,
    name: <Trans>🏠 House</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 31,
        name: <Trans>Rent</Trans>,
        icon: "🏠",
      },
      {
        id: 32,
        name: <Trans>Building Committee</Trans>,
        icon: "💡",
      },
      {
        id: 33,
        name: <Trans>Electricity</Trans>,
        icon: "⚡️",
      },
      {
        id: 34,
        name: <Trans>Water</Trans>,
        icon: "💧",
      },
      {
        id: 36,
        name: <Trans>Rates</Trans>,
        icon: "🏚",
      },
      {
        id: 37,
        name: <Trans>Pets</Trans>,
        icon: "🐕🐈",
      },
      {
        id: 39,
        name: <Trans>Internet</Trans>,
        icon: "💻",
      },
      {
        id: 311,
        name: <Trans>Phone</Trans>,
        icon: "📞",
      },
      {
        id: 312,
        name: <Trans>Decor</Trans>,
        icon: "🪴",
      },
      {
        id: 313,
        name: <Trans>Maintenance</Trans>,
        icon: "🔧",
      }
    ],
  },
  {
    id: 4,
    name: <Trans>❤️ Self Care</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 41,
        name: <Trans>Therapist</Trans>,
        icon: "👨‍⚕️",
      },
      {
        id: 42,
        name: <Trans>Gym</Trans>,
        icon: "💪",
      },
      {
        id: 43,
        name: <Trans>Barber</Trans>,
        icon: "💈",
      },
      {
        id: 44,
        name: <Trans>Hobbies</Trans>,
        icon: "🔭🎭",
      },
      {
        id: 45,
        name: <Trans>Games</Trans>,
        icon: "👾",
      },
      {
        id: 47,
        name: <Trans>Clothes</Trans>,
        icon: "🎽",
      },
      {
        id: 48,
        name: <Trans>Health/Beauty</Trans>,
        icon: "🧼💊",
      },
      {
        id: 49,
        name: <Trans>Donations</Trans>,
        icon: "🎁",
      },
      {
        id: 50,
        name: <Trans>Education</Trans>,
        icon: "📚",
      },
      {
        id: 411,
        name: <Trans>Electronics</Trans>,
        icon: "💻",
      },
      {
        id: 412,
        name: <Trans>Books</Trans>,
        icon: "📖",
      },
      {
        // TODO: eliminate these categories. they hide a lot of things and
        // is a recipe for leaks/untracked expenses
        id: 46,
        name: <Trans>Other</Trans>,
        icon: "․․․",
      },
    ],
  },
  {
    id: 5,
    name: <Trans>🎁💃 Out</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 51,
        name: <Trans>Friends</Trans>,
        icon: "🍻",
      },
      {
        id: 52,
        name: <Trans>Family</Trans>,
        icon: "🎋",
      },
      {
        id: 53,
        name: <Trans>Dates</Trans>,
        icon: "❤️",
      },
      {
        id: 54,
        name: <Trans>Vacation</Trans>,
        icon: "🏝",
      },
    ],
  },
  {
    id: 6,
    name: <Trans>🛎️ Apps Sub</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 310,
        name: <Trans>TV</Trans>,
        icon: "📺",
      },
      {
        id: 61,
        name: <Trans>Authoring</Trans>,
        icon: "✍️",
      },
      {
        id: 62,
        name: <Trans>Design</Trans>,
        icon: "🦩",
      },
      {
        id: 63,
        name: <Trans>iOS</Trans>,
        icon: "📱",
      },
      {
        id: 64,
        name: <Trans>Dev</Trans>,
        icon: "👨‍💻",
      },
      {
        id: 65,
        name: <Trans>Fun</Trans>,
        icon: "🕺",
      },
    ],
  },

  {
    id: 7,
    name: <Trans>🧾 Taxes</Trans>,
    subCategories: [
      {
        id: 71,
        name: <Trans>Health</Trans>,
        icon: "✚",
      },
      {
        id: 72,
        name: <Trans>Fees</Trans>,
        icon: "📉",
      },
    ],
  },
  {
    id: 8,
    name: <Trans>💰 Income</Trans>,
    isIncome: true,
    budget: 0,
    subCategories: [
      {
        id: 81,
        name: <Trans>Salary</Trans>,
        icon: "💰",
        isIncome: true,
      },
      {
        // TODO: elliminate these categories. they hide a lot of things and
        // is a recipe for leaks/untracked expenses
        id: 82,
        name: <Trans>Other</Trans>,
        icon: "💵",
        isIncome: true,
      },
      {
        id: 83,
        name: <Trans>Rent</Trans>,
        icon: "🏠",
        isIncome: true,
      },
    ],
  },
];

export const getSubCategoryName = (id) => {
  const subCategory = Categories
    .flatMap((category) => category.subCategories)
    .find((subCategory) => subCategory.id === id);

  return subCategory ? `${subCategory.icon} ${subCategory.name}` : "Unknown";
}