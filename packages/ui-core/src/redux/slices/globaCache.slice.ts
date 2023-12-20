import { UserType } from "@monorepo/api-client/src/models/CreateUserResponseDto";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JWTUserClaims } from "../../helpers/token";
import { RootState } from "../../redux/store";
interface GlobalCacheInitialState {
  user: UserType | undefined | null;
  userId: string;
  accessToken: string;
  userExtension: string;
  userClaims: JWTUserClaims | undefined | null;
}

const initialState: GlobalCacheInitialState = {
  user: undefined,
  userId: "",
  accessToken: "",
  userExtension: "",
  userClaims: undefined,
};

const globalCacheSlice = createSlice({
  name: "globalCache",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserExtension: (state, action: PayloadAction<string>) => {
      state.userExtension = action.payload;
    },
  },
});

export const { setUser, setUserId, setAccessToken, setUserExtension } =
  globalCacheSlice.actions;

export const globalCacheStateSelector = (state: RootState) => state.globalCache;
export default globalCacheSlice.reducer;
