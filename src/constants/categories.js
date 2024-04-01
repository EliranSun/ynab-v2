import { Trans } from "@lingui/macro";

export const Categories = [
  {
    id: 1,
    name: "🍔 Eating",
    label: <Trans>🍔 Eating</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 11,
        name: "Delivery",
        label: <Trans>Delivery</Trans>,
        icon: "🛵",
      },
      {
        id: 12,
        name: "Groceries",
        label: <Trans>Groceries</Trans>,
        icon: "🛒",
      },
      {
        id: 13,
        name: "Dining",
        label: <Trans>Dining</Trans>,
        icon: "☕️",
      },
      {
        id: 14,
        name: "Bars",
        label: <Trans>Bars</Trans>,
        icon: "🥃",
      },
    ],
  },
  {
    id: 2,
    name: "🚌 Travel",
    label: <Trans>🚌 Travel</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 21,
        name: "Lime",
        label: <Trans>Lime</Trans>,
        icon: "🛴",
      },
      {
        id: 22,
        name: "Bus",
        label: <Trans>Bus</Trans>,
        icon: "🚌",
      },
      {
        id: 23,
        name: "KIA",
        label: <Trans>KIA</Trans>,
        icon: "🚙",
      },
    ],
  },
  {
    id: 3,
    name: "🏠 House",
    label: <Trans>🏠 House</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 31,
        name: "Rent",
        label: <Trans>Rent</Trans>,
        icon: "🏠",
      },
      {
        id: 32,
        name: "Building Committee",
        label: <Trans>Building Committee</Trans>,
        icon: "💡",
      },
      {
        id: 33,
        name: "Electricity",
        label: <Trans>Electricity</Trans>,
        icon: "⚡️",
      },
      {
        id: 34,
        name: "Water",
        label: <Trans>Water</Trans>,
        icon: "💧",
      },
      {
        id: 36,
        name: "Rates",
        label: <Trans>Rates</Trans>,
        icon: "🏚",
      },
      {
        id: 37,
        name: "Pets",
        label: <Trans>Pets</Trans>,
        icon: "🐕🐈",
      },
      {
        id: 39,
        name: "Internet",
        label: <Trans>Internet</Trans>,
        icon: "💻",
      },
      {
        id: 311,
        name: "Phone",
        label: <Trans>Phone</Trans>,
        icon: "📞",
      },
      {
        id: 312,
        name: "Decor",
        label: <Trans>Decor</Trans>,
        icon: "🖼️"
      },
      {
        id: 313,
        name: "Maintenance",
        label: <Trans>Maintenance</Trans>,
        icon: "🔧",
      }
    ],
  },
  {
    id: 4,
    name: "❤️ Self Care",
    label: <Trans>❤️ Self Care</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 41,
        name: "Therapist",
        label: <Trans>Therapist</Trans>,
        icon: "👨‍⚕️",
      },
      {
        id: 42,
        name: "Gym",
        label: <Trans>Gym</Trans>,
        icon: "💪",
      },
      {
        id: 43,
        name: "Barber",
        label: <Trans>Barber</Trans>,
        icon: "💈",
      },
      {
        id: 44,
        name: "Hobbies",
        label: <Trans>Hobbies</Trans>,
        icon: "🔭🎭",
      },
      {
        id: 45,
        name: "Games",
        label: <Trans>Games</Trans>,
        icon: "👾",
      },
      {
        id: 47,
        name: "Clothes",
        label: <Trans>Clothes</Trans>,
        icon: "🎽",
      },
      {
        id: 48,
        name: "Health/Beauty",
        label: <Trans>Health/Beauty</Trans>,
        icon: "🧼💊",
      },
      {
        id: 49,
        name: "Donations",
        label: <Trans>Donations</Trans>,
        icon: "🎁",
      },
      {
        id: 50,
        name: "Education",
        label: <Trans>Education</Trans>,
        icon: "📚",
      },
      {
        id: 411,
        name: "Electronics",
        label: <Trans>Electronics</Trans>,
        icon: "💻",
      },
      {
        id: 412,
        name: "Books",
        label: <Trans>Books</Trans>,
        icon: "📖",
      },
      {
        // TODO: eliminate these categories. they hide a lot of things and
        // is a recipe for leaks/untracked expenses
        id: 46,
        name: "Other",
        label: <Trans>Other</Trans>,
        icon: "․․․",
      },
    ],
  },
  {
    id: 5,
    name: "🎁💃 Out",
    label: <Trans>🎁💃 Out</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 51,
        name: "Friends",
        label: <Trans>Friends</Trans>,
        icon: "🍻",
      },
      {
        id: 52,
        name: "Family",
        label: <Trans>Family</Trans>,
        icon: "🎋",
      },
      {
        id: 53,
        name: "Dates",
        label: <Trans>Dates</Trans>,
        icon: "❤️",
      },
      {
        id: 54,
        name: "Vacation",
        label: <Trans>Vacation</Trans>,
        icon: "🏝",
      },
    ],
  },
  {
    id: 6,
    name: "🛎️ Apps Sub",
    label: <Trans>🛎️ Apps Sub</Trans>,
    budget: 0,
    subCategories: [
      {
        id: 310,
        name: "TV",
        label: <Trans>TV</Trans>,
        icon: "📺",
      },
      {
        id: 61,
        name: "Authoring",
        label: <Trans>Authoring</Trans>,
        icon: "✍️",
      },
      {
        id: 62,
        name: "Design",
        label: <Trans>Design</Trans>,
        icon: "🦩",
      },
      {
        id: 63,
        name: "iOS",
        label: <Trans>iOS</Trans>,
        icon: "📱",
      },
      {
        id: 64,
        name: "Dev",
        label: <Trans>Dev</Trans>,
        icon: "👨‍💻",
      },
      {
        id: 65,
        name: "Fun",
        label: <Trans>Fun</Trans>,
        icon: "🕺",
      },
    ],
  },

  {
    id: 7,
    name: "🧾 Taxes",
    label: <Trans>🧾 Taxes</Trans>,
    subCategories: [
      {
        id: 71,
        name: "Health",
        label: <Trans>Health</Trans>,
        icon: "✚",
      },
      {
        id: 72,
        name: "Fees",
        label: <Trans>Fees</Trans>,
        icon: "📉",
      },
    ],
  },
  {
    id: 8,
    name: "💰 Income",
    label: <Trans>💰 Income</Trans>,
    isIncome: true,
    budget: 0,
    subCategories: [
      {
        id: 81,
        name: "Salary",
        label: <Trans>Salary</Trans>,
        icon: "💰",
        isIncome: true,
      },
      {
        // TODO: elliminate these categories. they hide a lot of things and
        // is a recipe for leaks/untracked expenses
        id: 82,
        name: "Other",
        label: <Trans>Other</Trans>,
        icon: "💵",
        isIncome: true,
      },
      {
        id: 83,
        name: "Rent",
        label: <Trans>Rent</Trans>,
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