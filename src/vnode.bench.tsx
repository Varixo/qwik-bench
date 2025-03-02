import { bench, describe } from "vitest";
import {
  vnode_newElement,
  vnode_setProp,
  vnode_getProp,
} from "./implementations/vnode";
import {
  vnode_newElement as vnode_newElementFlat,
  vnode_setProp as vnode_setPropFlat,
  vnode_getProp as vnode_getPropFlat,
} from "./implementations/vnode-flat";
import { ElementVNode } from "./implementations/vnode-object";
import {
  vnode_newElement as vnode_newElementMapProps,
  vnode_setProp as vnode_setPropMapProps,
  vnode_getProp as vnode_getPropMapProps,
} from "./implementations/vnode-map-props";

const PROP_COUNT = 10;
const SET_COUNT = 100;
let once = true;

describe("vnode set props", () => {
  bench("vnode flat array", () => {
    const vnodeElement = vnode_newElementFlat("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      const key = "id" + i;
      const value = "foo" + i;
      for (let j = 0; j < SET_COUNT; j++) {
        vnode_setPropFlat(vnodeElement, key, value);
      }
    }
  });
  bench("vnode array", () => {
    const vnodeElement = vnode_newElement("div", 0);
    for (let i = 0; i < PROP_COUNT; i++) {
      const key = "id" + i;
      const value = "foo" + i;
      for (let j = 0; j < SET_COUNT; j++) {
        vnode_setProp(vnodeElement, key, value);
      }
    }
  });
  bench("vnode arrray with Map as props", () => {
    const vnodeElement = vnode_newElementMapProps("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      const key = "id" + i;
      const value = "foo" + i;
      for (let j = 0; j < SET_COUNT; j++) {
        vnode_setPropMapProps(vnodeElement, key, value);
      }
    }
  });
  bench("vnode object", () => {
    const vnodeElement = ElementVNode.create("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      const key = "id" + i;
      const value = "foo" + i;
      for (let j = 0; j < SET_COUNT; j++) {
        vnodeElement.setProp(key, value);
      }
    }
  });
});

describe.skip("vnode get props", () => {
  // TODO: how to bench this without setting props first?
  bench("vnode flat array", () => {
    const vnodeElement = vnode_newElementFlat("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_setPropFlat(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_getPropFlat(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode array", () => {
    const vnodeElement = vnode_newElement("div", 0);
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_setProp(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_getProp(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode arrray with Map as props", () => {
    const vnodeElement = vnode_newElementMapProps("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_setPropMapProps(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < PROP_COUNT; i++) {
      vnode_getPropMapProps(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode object", () => {
    const vnodeElement = ElementVNode.create("div");
    for (let i = 0; i < PROP_COUNT; i++) {
      vnodeElement.setProp("id" + i, "foo" + i);
    }
    for (let i = 0; i < PROP_COUNT; i++) {
      vnodeElement.getProp("id" + i, null);
    }
  });
});
