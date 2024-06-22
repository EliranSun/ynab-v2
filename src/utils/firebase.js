import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    collection,
    connectFirestoreEmulator,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
    writeBatch
} from "firebase/firestore";
import {Expense} from "../models";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAB39A1eVvhFbTIqol1yB8sIrbv9Allqpg",
    projectId: "ynab-47641",
    authDomain: "ynab-47641.firebaseapp.com",
    storageBucket: "ynab-47641.appspot.com",
    messagingSenderId: "166507618318",
    appId: "1:166507618318:web:2586479d23433cfc855c5f",
    measurementId: "G-WL97FFD4EH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore();

export const emulateDB = () =>
    connectFirestoreEmulator(db, '127.0.0.1', 8080);

const EXPENSES_COLLECTION = "expenses";
const BUDGET_COLLECTION = "budget";

export const auth = getAuth();
const userBudgetPath = () => auth.currentUser ? `users/${auth.currentUser?.uid}/budget` : "";
const userExpensesPath = () => auth.currentUser ? `users/${auth.currentUser?.uid}/expenses` : "";


export const getExpenses = async () => {
    try {
        // if (process.env.NODE_ENV === "development") {
        //     return expensesMock.map((expense) => new Expense(expense));
        // }

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

export const createExpensesByDateCollection = async () => {
    const expenses = await getExpenses();
    const expensesByDateAndCategory = {};

    Object.values(expenses).forEach((expense) => {
        const yearMonthKey = new Date(expense.timestamp).toISOString().slice(0, 7);
        const categoryKey = String(expense.mainCategoryId);


        // Initialize the yearMonthKey object if it doesn't exist
        if (!expensesByDateAndCategory[yearMonthKey]) {
            expensesByDateAndCategory[yearMonthKey] = {};
        }

        // Initialize the categoryKey object if it doesn't exist
        if (!expensesByDateAndCategory[yearMonthKey][categoryKey]) {
            expensesByDateAndCategory[yearMonthKey][categoryKey] = {};
        }

        // Now that the structure is guaranteed to exist, add the expense.
        // Assuming `expense.id` is unique and you want to store the whole expense object under its ID
        expensesByDateAndCategory[yearMonthKey][categoryKey][expense.id] = {
            amount: Number(expense.amount),
            amountCurrency: expense.amountCurrency,
            categoryId: Number(expense.categoryId),
            date: expense.date,
            id: expense.id,
            isIncome: expense.isIncome,
            isOriginal: expense.isOriginal,
            isThirdParty: expense.isThirdParty,
            mainCategoryId: Number(expense.mainCategoryId),
            name: expense.name,
            note: expense.note,
            subcategoryId: Number(expense.subcategoryId),
            subcategoryLabel: expense.subcategoryLabel,
            timestamp: expense.timestamp,
        };
    });

    for (const [yearMonth, categories] of Object.entries(expensesByDateAndCategory)) {
        // Create or update a document for each yearMonth
        const yearMonthDocRef = doc(db, 'expensesByDateAndCategory', yearMonth);

        // Prepare the categories data
        // Note: This operation will overwrite the document's data. If you want to merge with existing data,
        // use setDoc with { merge: true } option.
        await setDoc(yearMonthDocRef, categories, {merge: true})
            .then(() => {
                console.info(`Successfully stored expenses for ${yearMonth}`);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
}

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

export const markExpensesAsOriginal = (duplicateIds = []) => {
    try {
        const batch = writeBatch(db);
        duplicateIds.forEach((id) => {
            const expenseRef = doc(db, EXPENSES_COLLECTION, id);
            batch.update(expenseRef, {isOriginal: true});
        });

        console.info("Marking expenses as original success", duplicateIds);
        return batch.commit();
    } catch (error) {
        console.error("Error marking expenses as original:", error);
        throw new Error(error);
    }
};

export const addExpenses = async (expenses) => {
    try {
        const batch = writeBatch(db);
        console.info("Adding expenses to DB", expenses);
        expenses.forEach((expense) => {
            const expenseRef = doc(db, EXPENSES_COLLECTION, expense.id);
            // must be a plain object
            batch.set(expenseRef, {
                amount: Number(expense.amount),
                amountCurrency: expense.amountCurrency,
                categoryId: Number(expense.categoryId),
                date: expense.date,
                id: expense.id,
                isIncome: expense.isIncome,
                isOriginal: expense.isOriginal,
                isThirdParty: expense.isThirdParty,
                mainCategoryId: Number(expense.mainCategoryId),
                name: expense.name,
                note: expense.note,
                subcategoryId: Number(expense.subcategoryId),
                subcategoryLabel: expense.subcategoryLabel,
                timestamp: expense.timestamp,
            });
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

export const addBudget = async ({dateKey, categoryId, subcategoryId, amount}) => {
    console.info("Adding budget to DB", {dateKey, categoryId, amount});
    const budget = await getBudget();
    const isExist = budget[dateKey];

    if (isExist) {
        const docRef = doc(db, BUDGET_COLLECTION, String(dateKey));
        return await updateDoc(docRef, {
            [String(categoryId)]: {
                ...budget[dateKey][categoryId],
                [String(subcategoryId)]: Number(amount)
            },
        });
    }

    const docRef = doc(db, BUDGET_COLLECTION, String(dateKey));
    return await setDoc(docRef, {
        [String(categoryId)]: {
            [String(subcategoryId)]: Number(amount)
        },
    });
};

export const updateBudget = async (budgetId, props) => {
    const budgetRef = doc(db, BUDGET_COLLECTION, budgetId);
    return await updateDoc(budgetRef, props);
};

export const updateCategory = async (expenseId, categoryId) => {
    try {
        return updateExpense(expenseId, {categoryId: Number(categoryId)});
    } catch (error) {
        console.error("Error updating category:", error);
        return {};
    }
}

export const addExpensesToUser = async (expenses = []) => {
    try {
        const batch = writeBatch(db);
        console.info("Adding expenses to user", expenses);
        expenses.forEach((expense) => {
            const expenseRef = doc(db, userExpensesPath(), expense.id);
            // must be a plain object
            batch.set(expenseRef, {
                amount: Number(expense.amount),
                amountCurrency: expense.amountCurrency,
                categoryId: Number(expense.categoryId),
                date: expense.date,
                id: expense.id,
                isIncome: expense.isIncome,
                isOriginal: expense.isOriginal,
                isThirdParty: expense.isThirdParty,
                mainCategoryId: Number(expense.mainCategoryId),
                name: expense.name,
                note: expense.note,
                subcategoryId: Number(expense.subcategoryId),
                subcategoryLabel: expense.subcategoryLabel,
                timestamp: expense.timestamp,
            });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error adding expenses to user:", error);
        throw new Error(error);
    }
};