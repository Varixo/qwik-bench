import {
  vnode_newElement as vnode_newElementFlat,
  vnode_setProp as vnode_setPropFlat
} from "./implementations/vnode-flat";


const PROP_COUNT = 10;
const SET_COUNT = 100;


function test() {
  const vnodeElement = vnode_newElementFlat("div");
  for (let i = 0; i < PROP_COUNT; i++) {
    const key = "id" + i;
    const value = "foo" + i;
    for (let j = 0; j < SET_COUNT; j++) {
      vnode_setPropFlat(vnodeElement, key, value);
    }
  }
}

for (let i = 0; i < 1000000; i++) {
  test();
}