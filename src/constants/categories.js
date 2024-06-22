import {Trans} from "@lingui/macro";

export const CategoriesIds = {
    Eating: 1,
    Delivery: 11,
    Groceries: 12,
    Dining: 13,
    Bars: 14,
    Travel: 2,
    Lime: 21,
    Bus: 22,
    KIA: 23,
    House: 3,
    Rent: 31,
    BuildingCommittee: 32,
    Electricity: 33,
    Water: 34,
    Rates: 36,
    Pets: 37,
    Internet: 39,
    Phone: 311,
    Decor: 312,
    Maintenance: 313,
    SelfCare: 4,
    Therapist: 41,
    Gym: 42,
    Barber: 43,
    Hobbies: 44,
    Games: 45,
    Clothes: 47,
    HealthBeauty: 48,
    Donations: 49,
    Education: 50,
    Electronics: 411,
    Books: 412,
    SelfCareOther: 46,
    Out: 5,
    Friends: 51,
    Family: 52,
    Dates: 53,
    Vacation: 54,
    AppsSub: 6,
    TV: 310,
    Authoring: 61,
    Design: 62,
    iOS: 63,
    Dev: 64,
    Fun: 65,
    Taxes: 7,
    Health: 71,
    Fees: 72,
    Income: 8,
    Salary: 81,
    Other: 82,
    IncomeRent: 83
}

export const Categories = [
    {
        id: CategoriesIds.Eating,
        name: "🍔 Eating",
        label: <Trans>🍔 Eating</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Delivery,
                name: "Delivery",
                label: <Trans>Delivery</Trans>,
                icon: "🛵",
            },
            {
                id: CategoriesIds.Groceries,
                name: "Groceries",
                label: <Trans>Groceries</Trans>,
                icon: "🛒",
            },
            {
                id: CategoriesIds.Dining,
                name: "Dining",
                label: <Trans>Dining</Trans>,
                icon: "☕️",
            },
            {
                id: CategoriesIds.Bars,
                name: "Bars",
                label: <Trans>Bars</Trans>,
                icon: "🥃",
            },
        ],
    },
    {
        id: CategoriesIds.Travel,
        name: "🚌 Travel",
        label: <Trans>🚌 Travel</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Lime,
                name: "Lime",
                label: <Trans>Lime</Trans>,
                icon: "🛴",
            },
            {
                id: 22,
                name: CategoriesIds.Bus,
                label: <Trans>Bus</Trans>,
                icon: "🚌",
            },
            {
                id: 23,
                name: CategoriesIds.KIA,
                label: <Trans>KIA</Trans>,
                icon: "🚙",
            },
        ],
    },
    {
        id: CategoriesIds.House,
        name: "🏠 House",
        label: <Trans>🏠 House</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Rent,
                name: "Rent",
                label: <Trans>Rent</Trans>,
                icon: "🏠",
            },
            {
                id: CategoriesIds.BuildingCommittee,
                name: "Building Committee",
                label: <Trans>Building Committee</Trans>,
                icon: "💡",
            },
            {
                id: CategoriesIds.Electricity,
                name: "Electricity",
                label: <Trans>Electricity</Trans>,
                icon: "⚡️",
            },
            {
                id: CategoriesIds.Water,
                name: "Water",
                label: <Trans>Water</Trans>,
                icon: "💧",
            },
            {
                id: CategoriesIds.Rates,
                name: "Rates",
                label: <Trans>Rates</Trans>,
                icon: "🏚",
            },
            {
                id: CategoriesIds.Pets,
                name: "Pets",
                label: <Trans>Pets</Trans>,
                icon: "🐕🐈",
            },
            {
                id: CategoriesIds.Internet,
                name: "Internet",
                label: <Trans>Internet</Trans>,
                icon: "💻",
            },
            {
                id: CategoriesIds.Phone,
                name: "Phone",
                label: <Trans>Phone</Trans>,
                icon: "📞",
            },
            {
                id: CategoriesIds.Decor,
                name: "Decor",
                label: <Trans>Decor</Trans>,
                icon: "🖼️"
            },
            {
                id: CategoriesIds.Maintenance,
                name: "Maintenance",
                label: <Trans>Maintenance</Trans>,
                icon: "🔧",
            }
        ],
    },
    {
        id: CategoriesIds.SelfCare,
        name: "❤️ Self Care",
        label: <Trans>❤️ Self Care</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Therapist,
                name: "Therapist",
                label: <Trans>Therapist</Trans>,
                icon: "👨‍⚕️",
            },
            {
                id: CategoriesIds.Gym,
                name: "Gym",
                label: <Trans>Gym</Trans>,
                icon: "💪",
            },
            {
                id: CategoriesIds.Barber,
                name: "Barber",
                label: <Trans>Barber</Trans>,
                icon: "💈",
            },
            {
                id: CategoriesIds.Hobbies,
                name: "Hobbies",
                label: <Trans>Hobbies</Trans>,
                icon: "🔭🎭",
            },
            {
                id: CategoriesIds.Games,
                name: "Games",
                label: <Trans>Games</Trans>,
                icon: "👾",
            },
            {
                id: CategoriesIds.Clothes,
                name: "Clothes",
                label: <Trans>Clothes</Trans>,
                icon: "🎽",
            },
            {
                id: CategoriesIds.HealthBeauty,
                name: "Health/Beauty",
                label: <Trans>Health/Beauty</Trans>,
                icon: "🧼💊",
            },
            {
                id: CategoriesIds.Donations,
                name: "Donations",
                label: <Trans>Donations</Trans>,
                icon: "🎁",
            },
            {
                id: CategoriesIds.Education,
                name: "Education",
                label: <Trans>Education</Trans>,
                icon: "📚",
            },
            {
                id: CategoriesIds.Electronics,
                name: "Electronics",
                label: <Trans>Electronics</Trans>,
                icon: "💻",
            },
            {
                id: CategoriesIds.Books,
                name: "Books",
                label: <Trans>Books</Trans>,
                icon: "📖",
            },
            {
                // TODO: eliminate these categories. they hide a lot of things and
                // is a recipe for leaks/untracked expenses
                id: CategoriesIds.SelfCareOther,
                name: "Other",
                label: <Trans>Other</Trans>,
                icon: "․․․",
            },
        ],
    },
    {
        id: CategoriesIds.Out,
        name: "🎁💃 Out",
        label: <Trans>🎁💃 Out</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Friends,
                name: "Friends",
                label: <Trans>Friends</Trans>,
                icon: "🍻",
            },
            {
                id: CategoriesIds.Family,
                name: "Family",
                label: <Trans>Family</Trans>,
                icon: "🎋",
            },
            {
                id: CategoriesIds.Dates,
                name: "Dates",
                label: <Trans>Dates</Trans>,
                icon: "❤️",
            },
            {
                id: CategoriesIds.Vacation,
                name: "Vacation",
                label: <Trans>Vacation</Trans>,
                icon: "🏝",
            },
        ],
    },
    {
        id: CategoriesIds.AppsSub,
        name: "🛎️ Apps Sub",
        label: <Trans>🛎️ Apps Sub</Trans>,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.TV,
                name: "TV",
                label: <Trans>TV</Trans>,
                icon: "📺",
            },
            {
                id: CategoriesIds.Authoring,
                name: "Authoring",
                label: <Trans>Authoring</Trans>,
                icon: "✍️",
            },
            {
                id: CategoriesIds.Design,
                name: "Design",
                label: <Trans>Design</Trans>,
                icon: "🦩",
            },
            {
                id: CategoriesIds.iOS,
                name: "iOS",
                label: <Trans>iOS</Trans>,
                icon: "📱",
            },
            {
                id: CategoriesIds.Dev,
                name: "Dev",
                label: <Trans>Dev</Trans>,
                icon: "👨‍💻",
            },
            {
                id: CategoriesIds.Fun,
                name: "Fun",
                label: <Trans>Fun</Trans>,
                icon: "🕺",
            },
        ],
    },

    {
        id: CategoriesIds.Taxes,
        name: "🧾 Taxes",
        label: <Trans>🧾 Taxes</Trans>,
        subCategories: [
            {
                id: CategoriesIds.Health,
                name: "Health",
                label: <Trans>Health</Trans>,
                icon: "✚",
            },
            {
                id: CategoriesIds.Fees,
                name: "Fees",
                label: <Trans>Fees</Trans>,
                icon: "📉",
            },
        ],
    },
    {
        id: CategoriesIds.Income,
        name: "💰 Income",
        label: <Trans>💰 Income</Trans>,
        isIncome: true,
        budget: 0,
        subCategories: [
            {
                id: CategoriesIds.Salary,
                name: "Salary",
                label: <Trans>Salary</Trans>,
                icon: "💰",
                isIncome: true,
            },
            {
                // TODO: elliminate these categories. they hide a lot of things and
                // is a recipe for leaks/untracked expenses
                id: CategoriesIds.Other,
                name: "Other",
                label: <Trans>Other</Trans>,
                icon: "💵",
                isIncome: true,
            },
            {
                id: CategoriesIds.Rent,
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