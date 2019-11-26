export interface IAdditionalInfo {
  title: string;
  generalInfo ?: string;
  blockInfo: IAdditionalBlockInfo[];
}

export interface IAdditionalBlockInfo {
  label: string;
  value: string;
}
