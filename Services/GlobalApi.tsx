import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://192.168.8.130:1337/api',
  headers: {
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_STRAPI_API_KEY}`
  }
});

// Fix 1: Arrow function with correct syntax
const GetUserByEmail = (email: string) =>
  axiosClient.get(`/user-lists?filters[email][$eq]=${email}`);

// Fix 2: Arrow function with correct parameter definition
const CreateNewUser = (data: any) =>
  axiosClient.post('/user-lists', { data });

export default {
  GetUserByEmail,
  CreateNewUser
};
