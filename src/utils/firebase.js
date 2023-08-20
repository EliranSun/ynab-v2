import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc, writeBatch, } from "firebase/firestore";
import { Expense } from "../models";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAB39A1eVvhFbTIqol1yB8sIrbv9Allqpg",
    authDomain: "ynab-47641.firebaseapp.com",
    projectId: "ynab-47641",
    storageBucket: "ynab-47641.appspot.com",
    messagingSenderId: "166507618318",
    appId: "1:166507618318:web:2586479d23433cfc855c5f",
    measurementId: "G-WL97FFD4EH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();

const EXPENSES_COLLECTION = "expenses";
const BUDGET_COLLECTION = "budget";

export const getExpenses = async () => {
    try {
        const expenses = {};
        const querySnapshot = await getDocs(collection(db, EXPENSES_COLLECTION));
        querySnapshot.forEach((doc) => {
            const expense = doc.data();
            expenses[expense.id] = new Expense(expense);
        });

        return expenses;
    } catch (error) {
        console.error("Error getting document:", error);
        return [];
    }
};

export const updateExpense = async (expenseId, props) => {
    const expensesRef = doc(db, EXPENSES_COLLECTION, expenseId);
    return updateDoc(expensesRef, props);
};

export const deleteExpense = async (expenseId) => {
    const expensesRef = doc(db, EXPENSES_COLLECTION, expenseId);
    const result = await deleteDoc(expensesRef);
    console.info("Deleted expense", result, EXPENSES_COLLECTION, expenseId);
    return result;
};

export const addExpenses = async (expenses) => {
    try {
        const batch = writeBatch(db);
        console.info("Adding expenses to DB", expenses);
        expenses.forEach((expense) => {
            const expenseRef = doc(db, EXPENSES_COLLECTION, expense.id);
            batch.set(expenseRef, { ...expense }); // must be a plain object
        });

        await batch.commit();
    } catch (error) {
        throw new Error(error);
    }
};

export const getBudget = async () => {
    try {
        let budget = {};
        const querySnapshot = await getDocs(collection(db, BUDGET_COLLECTION));
        querySnapshot.forEach((doc) => {
            budget = {
                ...budget,
                [doc.id]: doc.data(),
            };
        });

        return budget;
    } catch (error) {
        console.error("Error getting document:", error);
        return [];
    }
};

export const addBudget = async ({ dateKey, categoryId, amount }) => {
    console.info("Adding budget to DB", { dateKey, categoryId, amount });
    const budget = await getBudget();
    const isExist = budget[dateKey];

    if (isExist) {
        const docRef = doc(db, BUDGET_COLLECTION, String(dateKey));
        return await updateDoc(docRef, {
            [String(categoryId)]: Number(amount),
        });
    }

    const docRef = doc(db, BUDGET_COLLECTION, String(dateKey));
    return await setDoc(docRef, {
        [String(categoryId)]: Number(amount),
    });
};

export const updateBudget = async (budgetId, props) => {
    const budgetRef = doc(db, BUDGET_COLLECTION, budgetId);
    return await updateDoc(budgetRef, props);
};

export const updateCategory = async (expenseId, categoryId) => {
    try {
        return updateExpense(expenseId, { categoryId: Number(categoryId) });
    } catch (error) {
        console.error("Error updating category:", error);
        return {};
    }
}