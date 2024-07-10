import {createClient} from "@supabase/supabase-js";

// const supabase = createClient(
//     process.env.REACT_APP_SUPABASE_URL,
//     process.env.REACT_APP_SUPABASE_ANON_KEY
// );
//
// export const signIn = async () => {
//     const {data, error} = await supabase.auth.signInWithOtp({
//         email: 'piro27@gmail.com',
//         options: {
//             emailRedirectTo: 'https://example.com/welcome'
//         }
//     });
//
//     if (error) {
//         throw error;
//     }
//
//     return data;
// }
//
// signIn();
//
// // const USER_ID = "b72a7e24-54a4-4e6d-b85b-e07f827c9af0";
//
// export const getCategories = async () => {
//     const {data, error} = await supabase
//         .from("categories")
//         .select("*")
//         .eq("user_id", supabase.auth.user()?.id);
//
//     if (error) {
//         throw error;
//     }
//
//     console.log({data});
//     return data;
// };
//
// export const createCategory = async ({name, icon}) => {
//     const {data, error} = await supabase
//         .from("categories")
//         .insert({
//             name,
//             icon,
//         })
//         .eq("user_id", supabase.auth.user()?.id);
//
//     if (error) {
//         throw error;
//     }
//
//     return data;
// }