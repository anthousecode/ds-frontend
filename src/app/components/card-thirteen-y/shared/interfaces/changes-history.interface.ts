export interface IChangesHistory {
  infoHistory: IInfoHistory[];
  statusHistory: string[];
}

export interface IInfoHistory {
  title: string;
  changes: string[];
}
