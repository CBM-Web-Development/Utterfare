import { createAction, createActionGroup, props } from "@ngrx/store";
import { IAuthUser } from "../../interfaces/iauth-user";
import { IProfile } from "../../interfaces/iprofile";

export const setUserAuth = createAction('Set Auth', props<{payload: IAuthUser}>());
export const updateUserAuth = createAction('Update Auth', props<{payload: IAuthUser}>());
export const updateUserAuthProfile = createAction('Update Profile', props<{profile: IProfile}>());
export const resetUserAuth = createAction('Reset Auth');
