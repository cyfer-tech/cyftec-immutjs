import { areValuesEqual } from "./equal.ts";
import { newVal } from "./misc.ts";
import type {
  ArrItemOperation,
  IndexedArr,
  IndexedItem,
  ItemOperation,
  PartiallyIndexedItem,
} from "./types.ts";

/**
 * V1 - need to be deprecated when V2 is released
 * This method calculates and returns the mutations in an array if any
 * @param oldArray old value of array going to be mutated
 * @param newArray new mutated value of the old array
 * @returns the list mutations in the old array
 */

export const getArrUpdateOperations = (
  oldArray: IndexedArr<any>,
  newArray: IndexedArr<any>
): ArrItemOperation<any>[] => {
  const oldArr = newVal(oldArray);
  const newArr = newVal(newArray);
  const operations: ArrItemOperation<any>[] = [];

  newArr.forEach((newItem, newIndex) => {
    const newItemValue = { ...newItem, _index: undefined };
    const foundMatch = oldArr.some((oldItem, oldIndex) => {
      const oldItemValue = { ...oldItem, _index: undefined };
      if (newItem._index === oldItem._index) {
        if (areValuesEqual(oldItemValue, newItemValue)) {
          operations.push({
            type: "idle",
            value: { ...newItemValue, _index: newIndex },
            oldIndex: oldItem._index,
          });
        } else {
          operations.push({
            type: "update",
            value: { ...newItemValue, _index: newIndex },
            oldIndex: oldItem._index,
          });
        }
        oldArr.splice(oldIndex, 1);
        return true;
      }
      return false;
    });
    if (!foundMatch)
      operations.push({
        type: "add",
        value: { ...newItemValue, _index: newIndex },
      });
  });

  oldArr.forEach((oldItem, oldIndex) =>
    operations.push({
      type: "delete",
      value: { ...oldItem, _index: 0 - oldArr.length + oldIndex },
      oldIndex: oldItem._index,
    })
  );

  return operations.sort((a, b) => a.value._index - b.value._index);
};

/**
 * V2
 * This method calculates and returns the mutations in an array if any
 * @param oldArray old value of array going to be mutated
 * @param newArray new mutated value of the old array
 * @returns the list mutations in the old array
 */

export const getArrUpdateOps = <T>(
  oldArray: IndexedItem<T>[],
  newArray: PartiallyIndexedItem<T>[]
): ItemOperation<T>[] => {
  const oldArr = newVal(oldArray);
  const newArr = newVal(newArray);
  const operations: ItemOperation<T>[] = [];

  newArr.forEach((newItem, newIndex) => {
    const foundOldItem = oldArr.some((oldItem, oldIndex) => {
      if (newItem.index === oldItem.index) {
        operations.push({
          type: areValuesEqual(oldItem.value, newItem.value)
            ? "idle"
            : "update",
          value: { ...newItem, index: newIndex },
          oldIndex: oldItem.index,
        });
        oldArr.splice(oldIndex, 1);
        return true;
      }
      return false;
    });
    if (!foundOldItem)
      operations.push({
        type: "add",
        value: { ...newItem, index: newIndex },
      });
  });

  oldArr.forEach((oldItem, oldIndex) =>
    operations.push({
      type: "delete",
      value: { ...oldItem, index: 0 - oldArr.length + oldIndex },
      oldIndex: oldItem.index,
    })
  );

  return operations.sort((a, b) => a.value.index - b.value.index);
};
