import supabase from '../config/supabaseClient.js';

export const createNewUser = async (user) => {
   const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select();
  if (error) throw new Error(error.message);
  return data;
};

export const findUser = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email);

  if (error) throw new Error(error.message);
  return data;
};

export const findUserByToken = async (token) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('token', token);

  if (error) throw new Error(error.message);
  return data;
}

export const updateUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .update(userData)
    .eq("id", userData.id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}
