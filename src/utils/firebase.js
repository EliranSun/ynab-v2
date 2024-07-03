import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    setDoc,
    updateDoc,
    writeBatch,
    connectFirestoreEmulator,
    getDoc
} from "firebase/firestore";
import {Expense} from "../models";
import {getAuth} from "firebase/auth";
import {format} from "date-fns";

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
export const auth = getAuth(app);

export const emulateDB = () => connectFirestoreEmulator(db, '127.0.0.1', 8080);

const budgetPath = () => auth.currentUser ? `users/${auth.currentUser?.uid}/budget` : "";
const expensesPath = () => auth.currentUser ? `users/${auth.currentUser?.uid}/expenses` : "";

export const setUserDoc = async (user) => {
    const userRef = doc(db, `users/${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        await setDoc(userRef, {
            email: user.email,
            name: user.displayName,
            photoUrl: user.photoURL,
            uid: user.uid,
        });
    }
};

export const getExpenses = async () => {
    try {
        const expenses = {};
        if (!auth.currentUser) {
            return [];
        }

        console.info(`Fetching from ${expensesPath()}`);
        const querySnapshot = await getDocs(collection(db, expensesPath()));
        querySnapshot.forEach((doc) => {
            const expense = doc.data();
            expenses[expense.id] = new Expense(expense);
        });

        console.info("Expenses fetched", Object.keys(expenses).length);
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
            id: expense.id,
            date: expense.date,
            name: expense.name,
            note: expense.note,
            amountCurrency: expense.amountCurrency,
            isIncome: expense.isIncome,
            isOriginal: expense.isOriginal,
            isThirdParty: expense.isThirdParty,
            timestamp: expense.timestamp,
            amount: Number(expense.amount),
            categoryId: Number(expense.categoryId),
            mainCategoryId: Number(expense.mainCategoryId),
            subcategoryId: Number(expense.subcategoryId),
            subcategoryLabel: expense.subcategoryLabel,
        };
    });

    const path = `users/${auth.currentUser.uid}/expensesByDateAndCategory`;
    // Create or update a document for each yearMonth
    for (const [yearMonth, categories] of Object.entries(expensesByDateAndCategory)) {
        const yearMonthDocRef = doc(db, path, yearMonth);

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
    const expensesRef = doc(db, expensesPath(), expenseId);
    return updateDoc(expensesRef, props);
};


export const deleteExpense = async (expenseId) => {
    const expensesRef = doc(db, expensesPath(), expenseId);
    const result = await deleteDoc(expensesRef);
    console.info("Deleted expense", result, expensesPath(), expenseId);
    return result;
};

export const markExpensesAsOriginal = (duplicateIds = []) => {
    try {
        const batch = writeBatch(db);
        duplicateIds.forEach((id) => {
            const expenseRef = doc(db, expensesPath(), id);
            batch.update(expenseRef, {isOriginal: true});
        });

        console.info("Marking expenses as original success", duplicateIds);
        return batch.commit();
    } catch (error) {
        console.error("Error marking expenses as original:", error);
        throw new Error(error);
    }
};

export const addExpenses = async (expenses = []) => {
    try {
        const batch = writeBatch(db);
        console.info("Adding expenses to DB", expenses);
        expenses.forEach((expense) => {
            const expenseRef = doc(db, expensesPath(), expense.id);
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
        if (!auth.currentUser) {
            return [];
        }

        const querySnapshot = await getDocs(collection(db, budgetPath()));
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

export const addBudget = async ({categoryId, subcategoryId, amount}) => {
    console.info("Adding budget to DB", {categoryId, amount});
    const budget = await getBudget();

    if (budget) {
        const docRef = doc(db, budgetPath());
        return await updateDoc(docRef, {
            [String(categoryId)]: {
                ...budget[categoryId],
                [String(subcategoryId)]: Number(amount)
            },
        });
    }

    const docRef = doc(db, budgetPath());
    return await setDoc(docRef, {
        [String(categoryId)]: {
            [String(subcategoryId)]: Number(amount)
        },
    });
};

export const getBudgetKey = () => format(new Date(), "yyyy.MM");

export const updateBudget = async (props) => {
    const budgetRef = doc(db, budgetPath(), getBudgetKey());
    return await setDoc(budgetRef, props);
};

export const updateCategory = async (expenseId, categoryId) => {
    try {
        return updateExpense(expenseId, {categoryId: Number(categoryId)});
    } catch (error) {
        console.error("Error updating category:", error);
        return {};
    }
};