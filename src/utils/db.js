import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export const supabaseSignInWithOtp = async (email = "") => {
    if (!email) {
        return;
    }

    const {data, error} = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            emailRedirectTo: 'https://unab.vercel.app/',
        }
    });

    if (error) {
        throw error;
    }

    return data;
}

export const getCategories = async () => {
    const {data, error} = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", supabase.auth.user()?.id);

    if (error) {
        throw error;
    }

    console.log({data});
    return data;
};

export const createCategory = async ({name, icon}) => {
    const {data, error} = await supabase
        .from("categories")
        .insert({
            name,
            icon,
        })
        .eq("user_id", supabase.auth.user()?.id);

    if (error) {
        throw error;
    }

    return data;
}