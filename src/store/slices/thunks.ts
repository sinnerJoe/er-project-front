import {createAsyncThunk} from '@reduxjs/toolkit';
import { fetchSessionUserData } from 'shared/endpoints';
import { User } from 'shared/interfaces/User';

export const fetchCurrentUser = createAsyncThunk(
    "users/fetchCurrentUser",
    () => fetchSessionUserData().then((response) => response.data) as Promise<User | null>
);