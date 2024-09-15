export type IndexedArrObjItem<T extends object> = { _index: number } & T;
export type IndexedArrItem<T extends object> = IndexedArrObjItem<T>;
export type IndexedArrItemWoIndex<T extends object> = T & { _index: undefined };
export type IndexedArr<T extends object> = IndexedArrItem<T>[];

export type ArrItemOperation<T extends object> = {
  type: "add" | "update" | "delete" | "idle";
  value: IndexedArrObjItem<T>;
  oldIndex?: number;
};
