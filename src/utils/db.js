import {createClient} from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const login = async () => {
    const {user, session, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: "http://localhost:3006",
        }
    });

    return {user, session, error};
}

export const getCategories = async () => {
    const {data, error} = await supabase
        .from('categories')
        .select("*, subcategories:subcategories (id, name, icon)")
        .eq("subcategories.isActive", true)
        .eq("isActive", true);

    if (error) {
        throw error;
    }

    return data;
};

export const createCategory = async ({name, icon, isIncome}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const {data: userData} = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from("categories")
        .insert({
            name,
            icon,
            isIncome,
            user_id: userData.user.id
        });

    if (error) {
        throw error;
    }

    return data;
};

export const createSubcategory = async ({name, icon, categoryId}) => {
    if (!name || !icon || !categoryId) {
        throw new Error("Name, icon, and category ID are required");
    }

    const {data: userData} = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from("subcategories")
        .insert({
            name,
            icon,
            category_id: categoryId,
            user_id: userData.user.id
        });

    if (error) {
        throw error;
    }

    return data;
};

export const deleteCategory = async (categoryId) => {
    const {data, error} = await supabase
        .from("categories")
        .update({
            isActive: false,
        })
        .eq("id", categoryId);

    if (error) {
        throw error;
    }

    return data;
};

export const deleteSubcategory = async (subcategoryId) => {
    console.log("Delete subcategory", subcategoryId);
    const {data, error} = await supabase
        .from("subcategories")
        .update({
            isActive: false,
        })
        .eq("id", subcategoryId)

    if (error) {
        throw error;
    }

    return data;
};

export const updateCategory = async ({id, name, isIncome, icon}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const {data, error} = await supabase
        .from("categories")
        .update({
            name,
            icon,
            isIncome
        })
        .eq("id", id);

    if (error) {
        throw error;
    }

    return data;
}

export const updateSubcategory = async ({id, name, icon}) => {
    const {data, error} = await supabase
        .from("subcategories")
        .update({
            name,
            icon
        })
        .eq("id", id);

    if (error) {
        throw error;
    }

    return data;
};

export const getExpenses = async () => {
    const {data, error} = await supabase
        .from("expenses")
        .select("*");

    if (error) {
        throw error;
    }

    return data;
};

export const addExpense = async ({name, note, amount, subcategoryId, date}) => {
    if (!name || !amount || !subcategoryId || !date) {
        throw new Error("Name, amount, subcategory ID, and date are required");
    }

    const {data, error} = await supabase
        .from("expenses")
        .insert({
            name,
            note,
            amount,
            subcategoryId,
            date,
        });

    if (error) {
        throw error;
    }

    return data;
};

class Expense {
    constructor(expense) {
        this.name = expense.name;
        this.note = expense.note;
        this.amount = expense.amount;
        this.date = expense.date;
        this.subcategoryId = expense.subcategoryId;
    }
}

export const addExpenses = async (expenses = []) => {
    if (expenses.length === 0) {
        return [];
    }

    const {data, error} = await supabase
        .from("expenses")
        .insert(expenses.map(expense => new Expense(expense)));

    if (error) {
        throw error;
    }

    return data;
};

export const deleteExpense = async (expenseId) => {
    const {data, error} = await supabase
        .from("expenses")
        .delete()
        .eq("id", expenseId);

    if (error) {
        throw error;
    }

    return data;
}