import {NormalizedObjects} from './types';

type ObjToId<T> = (obj: T) => string;
type ObjMapper<In, Out> = (obj: In) => Out;

export function normalizedObjectsClear<T>(objects: NormalizedObjects<T>): NormalizedObjects<T> {
  objects.ids = [];
  objects.entities = {};
  return objects;
}

export function normalizedObjectsAdd<In, Out>(objects: NormalizedObjects<Out>, objMapper: ObjMapper<In, Out>, objToId: ObjToId<Out>, ...newObjects: In[]): NormalizedObjects<Out> {
  return normalizedObjectsAddAll(objects, objMapper, objToId, newObjects);
}

export function normalizedObjectsAddAll<In, Out>(objects: NormalizedObjects<Out>, objMapper: ObjMapper<In, Out>, objToId: ObjToId<Out>, newObjects: In[]): NormalizedObjects<Out> {
  if (!newObjects) return objects;
  newObjects.forEach( obj => {
    const outObj = objMapper(obj);
    const id = objToId(outObj);
    if (objects.ids.findIndex(x => x === id) === -1) {
      objects.ids.push(id);
      objects.entities[id] = outObj;
    }
  });
  return objects;
}

type ObjSorter<T> = (obj1: T, obj2: T) => number;

export function normalizedObjectsGetAll<T>(objects: NormalizedObjects<T>, sorter?: ObjSorter<T>): T[] {
  if (!objects) return [];
  const entries = Object.values(objects.entities);
  if (sorter) entries.sort(sorter);
  return entries;
}