import {createClient} from "@supabase/supabase-js";
import {getUserId} from "./firebase";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const getCategories = async (uid) => {
    const {data, error} = await supabase
        .from('categories')
        .select("*")
        .eq("user_id", uid);

    if (error) {
        throw error;
    }

    console.log({data});
    return data;
};

export const getSubcategories = async (id) => {
    const userId = getUserId();
    const {data, error} = await supabase
        .from('subcategories')
        .select("*")
        .eq("category_id", id)
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    console.log({data, userId});
    return data;
}

export const createCategory = async ({name, icon}) => {
    const {data, error} = await supabase
        .from("categories")
        .insert({
            name,
            icon,
            user_id: getUserId()
        });

    if (error) {
        throw error;
    }

    return data;
};

export const createSubcategory = async ({name, icon, categoryId}) => {
    const {data, error} = await supabase
        .from("subcategories")
        .insert({
            name,
            icon,
            category_id: categoryId,
            user_id: getUserId()
        });

    if (error) {
        throw error;
    }

    return data;
};

export const deleteCategory = async (id) => {
    const {data, error} = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .eq("user_id", getUserId());

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

export const updateCategory = async ({id, name, icon}) => {
    const {data, error} = await supabase
        .from("categories")
        .update({
            name,
            icon
        })
        .eq("id", id)
        .eq("user_id", getUserId());

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
        .eq("id", id)
        .eq("user_id", getUserId());

    if (error) {
        throw error;
    }

    return data;
}