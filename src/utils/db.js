import {createClient} from "@supabase/supabase-js";
import {getUserId} from "./firebase";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const login = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'google',

    });
}

export const getCategories = async () => {
    const userId = getUserId();

    const {data, error} = await supabase
        .from('categories')
        .select("*, subcategories:subcategories (id, name, icon)")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
};

export const getSubcategories = async (categoryId) => {
    const userId = getUserId();

    const {data, error} = await supabase
        .from('subcategories')
        .select("* ")
        .eq("category_id", categoryId)
        .eq("user_id", userId);


    if (error) {
        throw error;
    }

    return data;
}

export const createCategory = async ({name, icon, isIncome}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const userId = getUserId();
    const {data, error} = await supabase
        .from("categories")
        .insert({
            name,
            icon,
            isIncome,
            user_id: userId
        });

    console.info("create category", {name, icon, userId});

    if (error) {
        throw error;
    }

    return data;
};

export const createSubcategory = async ({name, icon, categoryId}) => {
    if (!name || !icon || !categoryId) {
        throw new Error("Name, icon, and category ID are required");
    }

    const userId = getUserId();
    console.log({name, icon, categoryId, userId});

    const {data, error} = await supabase
        .from("subcategories")
        .insert({
            name,
            icon,
            category_id: categoryId,
            user_id: userId
        });

    console.info("create subcategory", data, error);

    if (error) {
        throw error;
    }

    return data;
};

export const deleteCategory = async (categoryId) => {
    const userId = getUserId();

    const {data, error} = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
};

export const deleteSubcategory = async (subcategoryId) => {
    const userId = getUserId();

    const {data, error} = await supabase
        .from("subcategories")
        .delete()
        .eq("id", subcategoryId)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
};

export const updateCategory = async ({id, name, isIncome, icon}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const userId = getUserId();

    const {data, error} = await supabase
        .from("categories")
        .update({
            name,
            icon,
            isIncome
        })
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
}

export const updateSubcategory = async ({id, name, icon}) => {
    const userId = getUserId();

    const {data, error} = await supabase
        .from("subcategories")
        .update({
            name,
            icon
        })
        .eq("id", id)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
}