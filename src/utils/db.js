import {createClient} from "@supabase/supabase-js";
import {getUserId} from "./firebase";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const getCategories = async (uid) => {
    const {data, error} = await supabase
        .from('categories')
        .select("*, subcategories ( id, name, icon )")
        .eq("user_id", uid);

    if (error) {
        throw error;
    }

    return data;
};

export const getSubcategories = async (id) => {
    const userId = getUserId();
    const {data, error} = await supabase
        .from('subcategories')
        .select("* ")
        .eq("category_id", id)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return data;
}

export const createCategory = async ({name, icon, uid}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const {data, error} = await supabase
        .from("categories")
        .insert({
            name,
            icon,
            user_id: uid
        });

    console.info("create category", {name, icon}, data, error);

    if (error) {
        throw error;
    }

    return data;
};

export const createSubcategory = async ({name, icon, categoryId, uid}) => {
    if (!name || !icon || !categoryId) {
        throw new Error("Name, icon, and category ID are required");
    }

    const {data, error} = await supabase
        .from("subcategories")
        .insert({
            name,
            icon,
            category_id: categoryId,
            user_id: uid
        });

    console.info("create subcategory", data, error);

    if (error) {
        throw error;
    }

    return data;
};

export const deleteCategory = async (id, uid) => {
    const {data, error} = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", uid);

    if (error) {
        throw error;
    }

    return data;
};

export const deleteSubcategory = async (id) => {
    const {data, error} = await supabase
        .from("subcategories")
        .delete()
        .eq("id", id)
        .eq("user_id", getUserId());

    if (error) {
        throw error;
    }

    return data;
};

export const updateCategory = async ({id, name, icon, uid}) => {
    if (!name || !icon) {
        throw new Error("Name and icon are required");
    }

    const {data, error} = await supabase
        .from("categories")
        .update({
            name,
            icon
        })
        .eq("id", id)
        .eq("user_id", uid);

    if (error) {
        throw error;
    }

    return data;
}

export const updateSubcategory = async ({id, name, icon, uid}) => {
    const {data, error} = await supabase
        .from("subcategories")
        .update({
            name,
            icon
        })
        .eq("id", id)
        .eq("user_id", uid);

    if (error) {
        throw error;
    }

    return data;
}