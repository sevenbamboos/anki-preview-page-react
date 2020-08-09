import {NormalizedObjects} from './types';

type ObjToId<T> = (obj: T) => string;
type ObjMapper<In, Out> = (obj: In) => Out;
type ObjPostProcessor<T> = (obj: T) => T;

export function normalizedObjectsClear<T>(objects: NormalizedObjects<T>): NormalizedObjects<T> {
  objects.ids = [];
  objects.entities = {};
  return objects;
}

export function normalizedObjectsAdd<In, Out>(objects: NormalizedObjects<Out>, objMapper: ObjMapper<In, Out>, objToId: ObjToId<Out>, objPostProcessor: ObjPostProcessor<Out>, ...newObjects: In[]): NormalizedObjects<Out> {
  return normalizedObjectsAddAll(objects, objMapper, objToId, objPostProcessor, newObjects);
}

export function normalizedObjectsAddAll<In, Out>(objects: NormalizedObjects<Out>, objMapper: ObjMapper<In, Out>, objToId: ObjToId<Out>, objPostProcessor: ObjPostProcessor<Out>, newObjects: In[]): NormalizedObjects<Out> {
  if (!newObjects) return objects;
  newObjects.forEach( obj => {
    const outObj = objMapper(obj);
    const id = objToId(outObj);
    if (objects.ids.findIndex(x => x === id) === -1) {
      objects.ids.push(id);
      objects.entities[id] = objPostProcessor(outObj);
    }
  });
  return objects;
}

type ObjSorter<T> = (obj1: T, obj2: T) => number;

export function normalizedObjectsGetAll<T>(objects: NormalizedObjects<T>, sorter?: ObjSorter<T>): T[] {
  return normalizedObjectsFindAll(objects, (t: T) => true, sorter);
}

type Predicator<T> = (obj: T) => boolean;

export function normalizedObjectsFindAll<T>(objects: NormalizedObjects<T>, filter: Predicator<T>, sorter?: ObjSorter<T>): T[] {
  if (!objects) return [];
  const entries = Object.values(objects.entities);
  const filtered = entries.filter(filter);
  if (sorter) filtered.sort(sorter);
  return filtered;
}

export function normalizedObjectsContains<T>(objects: NormalizedObjects<T>, id: string): boolean {
  if (!objects || !objects.ids || !id) return false;
  return objects.ids.findIndex(x => x === id) !== -1;
}

export function normalizedObjectsGet<T>(objects: NormalizedObjects<T>, id: string): T {
  return objects.entities[id];
}