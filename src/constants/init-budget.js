import {CategoriesIds} from "./categories";

export const InitBudget = {
    [CategoriesIds.Eating]: {
        [CategoriesIds.Delivery]: 500,
        [CategoriesIds.Groceries]: 1500,
        [CategoriesIds.Dining]: 500
    },
    [CategoriesIds.Travel]: {
        [CategoriesIds.Lime]: 50,
        [CategoriesIds.Bus]: 0,
        [CategoriesIds.KIA]: 500
    },
    [CategoriesIds.House]: {
        [CategoriesIds.Rent]: 7500,
        [CategoriesIds.BuildingCommittee]: 150,
        [CategoriesIds.Electricity]: 250,
        [CategoriesIds.Water]: 320,
        [CategoriesIds.Rates]: 300,
        [CategoriesIds.Pets]: 40,
        [CategoriesIds.Internet]: 40,
        [CategoriesIds.Phone]: 50,
        [CategoriesIds.Decor]: 100
    },
    [CategoriesIds.SelfCare]: {
        [CategoriesIds.Therapist]: 400,
        [CategoriesIds.Gym]: 400,
        [CategoriesIds.Barber]: 120,
        [CategoriesIds.Hobbies]: 500,
        [CategoriesIds.Games]: 0,
        [CategoriesIds.Clothes]: 100,
        [CategoriesIds.HealthBeauty]: 100,
        [CategoriesIds.Donations]: 700,
        [CategoriesIds.Education]: 30,
        [CategoriesIds.Electronics]: 0,
        [CategoriesIds.Books]: 1000,
        [CategoriesIds.SelfCareOther]: 50,
    },
    [CategoriesIds.Out]: {
        [CategoriesIds.Friends]: 200,
        [CategoriesIds.Family]: 200,
        [CategoriesIds.Dates]: 2000,
        [CategoriesIds.Vacation]: 0,
    },
    [CategoriesIds.AppsSub]: {
        [CategoriesIds.Friends]: 100,
        [CategoriesIds.Family]: 150,
        [CategoriesIds.Dates]: 100,
        [CategoriesIds.Vacation]: 150,
        [CategoriesIds.AppsSub]: 70,
    },
    [CategoriesIds.Taxes]: {
        [CategoriesIds.Health]: 300,
        [CategoriesIds.Fees]: 350,
    },
    [CategoriesIds.Income]: {
        [CategoriesIds.Salary]: 18300,
        [CategoriesIds.Other]: 200,
        [CategoriesIds.IncomeRent]: 3750
    }
}

export const getSubcategoryBudget = (categoryId, subcategoryId) => {
    return InitBudget[categoryId][subcategoryId];
};