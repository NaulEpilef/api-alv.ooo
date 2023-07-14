import { IUserOnTargetListAll } from "./users";

export interface ITargetListAll {
  id: string;
  userId: string;
  title: string;
  isCompleted: boolean;
  isPrivate: boolean;
  user: IUserOnTargetListAll;
}