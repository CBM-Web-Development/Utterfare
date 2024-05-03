import { createAction, createActionGroup, props } from "@ngrx/store";
import { IAuthUser } from "../../interfaces/iauth-user";

export const setUserAuth = createAction('Set Auth', props<{payload: IAuthUser}>());
export const updateUserAuth = createAction('Update Auth', props<{payload: IAuthUser}>());
export const resetUserAuth = createAction('Reset Auth');
