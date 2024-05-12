import { createAction, createActionGroup, props } from "@ngrx/store";
import { IAuthUser } from "../../interfaces/iauth-user";
import { ILocation } from "../../interfaces/ilocation";

export const setLocation = createAction('Set Location', props<{payload: ILocation}>());
export const updateLocation = createAction('Update Location', props<{payload: ILocation}>());
export const clearLocation = createAction('Reset Location');
