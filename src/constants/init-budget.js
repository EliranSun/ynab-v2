import {CategoriesIds} from "./categories";

export const InitBudget = {
    [CategoriesIds.Eating]: {
        [CategoriesIds.Delivery]: 500,
        [CategoriesIds.Groceries]: 1500,
        [CategoriesIds.Dining]: 500
    },
    2: {
        21: 50,
        23: 500
    },
    3: {
        31: 7500,
        32: 150,
        33: 250,
        34: 320,
        37: 300,
        39: 40,
        311: 40,
        312: 50,
        313: 100
    },
    4: {
        41: 400,
        42: 400,
        43: 120,
        44: 500,
        45: 0,
        46: 100,
        47: 100,
        48: 700,
        49: 30,
        50: 0,
        411: 1000,
        412: 50,
    },
    5: {
        51: 200,
        52: 200,
        53: 2000,
    },
    6: {
        61: 100,
        62: 150,
        63: 100,
        64: 150,
        310: 70,
    },
    7: {
        71: 300,
        72: 350,
    },
    8: {
        81: 18300,
        82: 200,
        83: 3750
    }
}

export const getSubcategoryBudget = (categoryId, subcategoryId) => {
    return InitBudget[categoryId][subcategoryId];
};