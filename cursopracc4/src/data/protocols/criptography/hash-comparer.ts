export interface HashComparerModel {
  value: string
  hashToCompare: string
}

export interface HashComparer {
  compare(data: HashComparerModel): Promise<boolean>
}
