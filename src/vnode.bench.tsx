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

describe("vnode set props", () => {
  bench("vnode flat array", () => {
    const vnodeElement = vnode_newElementFlat("div");
    for (let i = 0; i < 10000; i++) {
      vnode_setPropFlat(vnodeElement, "id" + i, "foo" + i);
    }
  });
  bench("vnode array", () => {
    const vnodeElement = vnode_newElement("div", 0);
    for (let i = 0; i < 10000; i++) {
      vnode_setProp(vnodeElement, "id" + i, "foo" + i);
    }
  });
  bench("vnode arrray with Map as props", () => {
    const vnodeElement = vnode_newElementMapProps("div");
    for (let i = 0; i < 10000; i++) {
      vnode_setPropMapProps(vnodeElement, "id" + i, "foo" + i);
    }
  });
  bench("vnode object", () => {
    const vnodeElement = ElementVNode.create("div");
    for (let i = 0; i < 10000; i++) {
      vnodeElement.setProp("id" + i, "foo" + i);
    }
  });
});

describe("vnode get props", () => {
  // TODO: how to bench this without setting props first?
  bench("vnode flat array", () => {
    const vnodeElement = vnode_newElementFlat("div");
    for (let i = 0; i < 10000; i++) {
      vnode_setPropFlat(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < 10000; i++) {
      vnode_getPropFlat(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode array", () => {
    const vnodeElement = vnode_newElement("div", 0);
    for (let i = 0; i < 10000; i++) {
      vnode_setProp(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < 10000; i++) {
      vnode_getProp(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode arrray with Map as props", () => {
    const vnodeElement = vnode_newElementMapProps("div");
    for (let i = 0; i < 10000; i++) {
      vnode_setPropMapProps(vnodeElement, "id" + i, "foo" + i);
    }
    for (let i = 0; i < 10000; i++) {
      vnode_getPropMapProps(vnodeElement as any, "id" + i, null);
    }
  });
  bench("vnode object", () => {
    const vnodeElement = ElementVNode.create("div");
    for (let i = 0; i < 10000; i++) {
      vnodeElement.setProp("id" + i, "foo" + i);
    }
    for (let i = 0; i < 10000; i++) {
      vnodeElement.getProp("id" + i, null);
    }
  });
});
