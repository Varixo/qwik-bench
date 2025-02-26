import { vnode_newElement } from "./implementations/vnode";
import { ElementVNode } from "./implementations/vnode-object";
import { setFlagsFromString } from "v8";
setFlagsFromString("--expose_gc");

console.log(process.memoryUsage());

function memoryUsed() {
  global.gc?.();
  const mbUsed = process.memoryUsage().heapUsed;
  return mbUsed;
}

const SIZES = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

const memoryUsage = {};
const memoryUsage2 = {};
const obj = [];
const obj2 = [];

function fn() {
  SIZES.forEach((size) => {
    obj.length = 0;
    const before = memoryUsed();
    for (let i = 0; i < size; i++) {
      obj.push(vnode_newElement("div", 0));
    }
    const after = memoryUsed();
    const diff = after - before;
    (memoryUsage as any)[size] = diff;
  });
}

function fn2() {
  SIZES.forEach((size) => {
    obj2.length = 0;
    const before = memoryUsed();
    for (let i = 0; i < size; i++) {
      obj2.push(ElementVNode.create("div"));
    }
    const after = memoryUsed();
    const diff = after - before;
    (memoryUsage2 as any)[size] = diff;
  });
}

global.gc?.();
fn();
global.gc?.();
fn2();

console.log(memoryUsage);
console.log(memoryUsage2);
