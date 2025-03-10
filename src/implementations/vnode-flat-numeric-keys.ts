const propNameToId = new Map<string | symbol, NumericPropKey>();
const idToPropName: (string | symbol)[] = [];
export type NumericPropKey = number & { __brand__: 'NumericPropKey' };

export const NumericFlagsShift = 4;

export const getPropId = (name: string | symbol): NumericPropKey => {
  let id = propNameToId.get(name);
  if (id != null) {
    return id;
  }
  id = (idToPropName.length << NumericFlagsShift) as NumericPropKey;
  idToPropName.push(name);
  propNameToId.set(name, id);
  return id;
};

export const getPropName = <T extends string>(id: NumericPropKey): T => {
  return idToPropName[id >> NumericFlagsShift] as T;
};

export const mapApp_findIndx = <T>(
    array: (T | null)[],
    key: NumericPropKey,
    start: number = 0
): number => {
  let bottom = (start as number) >> 1;
  let top = (array.length - 2) >> 1;
  while (bottom <= top) {
    const mid = bottom + ((top - bottom) >> 1);
    const midKey = array[mid << 1] as NumericPropKey;
    if (midKey === key) {
      return mid << 1;
    }
    if (midKey < key) {
      bottom = mid + 1;
    } else {
      top = mid - 1;
    }
  }
  return (bottom << 1) ^ -1;
};

const vnode_getPropStartIndex = (vnode: VNode): number => {
  const type = vnode[VNodeProps.flags] & VNodeFlags.TYPE_MASK;
  if (type === VNodeFlags.Element) {
    return ElementVNodeProps.PROPS_OFFSET;
  } else if (type === VNodeFlags.Virtual) {
    return VirtualVNodeProps.PROPS_OFFSET;
  }
  throw new Error(`Invalid vnode type: ${type}`);
};

export const vnode_getProp = <T>(
    vnode: VNode,
    key: string,
    getObject: ((id: string) => any) | null
): T | null => {
  const type = vnode[VNodeProps.flags];
  if ((type & VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    const idx = mapApp_findIndx(vnode as any, getPropId(key), 0);
    if (idx >= 0) {
      let value = vnode[idx + 1] as any;
      if (typeof value === 'string' && getObject) {
        vnode[idx + 1] = value = getObject(value);
      }
      return value;
    }
  }
  return null;
};

export const vnode_setProp = (vnode: VirtualVNode | ElementVNode, key: string, value: unknown) => {
  const numericKey = getPropId(key);
  const idx = mapApp_findIndx(vnode as any, numericKey, vnode_getPropStartIndex(vnode));
  if (idx >= 0) {
    vnode[idx + 1] = value as any;
  } else if (value != null) {
    vnode.splice(idx ^ -1, 0, numericKey, value as any);
  }
};


const VNodeArray = class VNode {
  static createElement(
    flags: VNodeFlags,
    parent: VNode | null,
    previousSibling: VNode | null,
    nextSibling: VNode | null,
    firstChild: VNode | null | undefined,
    lastChild: VNode | null | undefined,
    element: Element,
    elementName: string | undefined
  ) {
    return [
      flags,
      parent,
      previousSibling,
      nextSibling,
      firstChild,
      lastChild,
      element,
      elementName
    ] as any;
  }

  static createText(
    flags: VNodeFlags,
    parent: VNode | null,
    previousSibling: VNode | null,
    nextSibling: VNode | null,
    textNode: Text | null,
    text: string | undefined
  ) {
    return [
      flags,
      parent,
      previousSibling,
      nextSibling,
      textNode,
      text
    ] as any;
  }

  static createVirtual(
    flags: VNodeFlags,
    parent: VNode | null,
    previousSibling: VNode | null,
    nextSibling: VNode | null,
    firstChild: VNode | null,
    lastChild: VNode | null
  ) {
    return [
      flags,
      parent,
      previousSibling,
      nextSibling,
      firstChild,
      lastChild
    ] as any;
  }

};

export const enum VNodeFlags {
  Element /* ****************** */ = 0b00_000001,
  Virtual /* ****************** */ = 0b00_000010,
  ELEMENT_OR_VIRTUAL_MASK /* ** */ = 0b00_000011,
  ELEMENT_OR_TEXT_MASK /* ***** */ = 0b00_000101,
  TYPE_MASK /* **************** */ = 0b00_000111,
  INFLATED_TYPE_MASK /* ******* */ = 0b00_001111,
  Text /* ********************* */ = 0b00_000100,
  /// Extra flag which marks if a node needs to be inflated.
  Inflated /* ***************** */ = 0b00_001000,
  /// Marks if the `ensureProjectionResolved` has been called on the node.
  Resolved /* ***************** */ = 0b00_010000,
  /// Marks if the vnode is deleted.
  Deleted /* ****************** */ = 0b00_100000,
  /// Flags for Namespace
  NAMESPACE_MASK /* *********** */ = 0b11_000000,
  NEGATED_NAMESPACE_MASK /* ** */ = ~0b11_000000,
  NS_html /* ****************** */ = 0b00_000000, // http://www.w3.org/1999/xhtml
  NS_svg /* ******************* */ = 0b01_000000, // http://www.w3.org/2000/svg
  NS_math /* ****************** */ = 0b10_000000, // http://www.w3.org/1998/Math/MathML
}

export const enum VNodeFlagsIndex {
  mask /* ************* */ = ~0b11_111111,
  negated_mask /* ****** */ = 0b11_111111,
  shift /* ************* */ = 8,
}

export const enum VNodeProps {
  flags = 0,
  parent = 1,
  previousSibling = 2,
  nextSibling = 3,
}

export const enum ElementVNodeProps {
  firstChild = 4,
  lastChild = 5,
  element = 6,
  elementName = 7,
  PROPS_OFFSET = 8,
}

/** @internal */
export type ElementVNode = [
  /// COMMON: VNodeProps
  VNodeFlags.Element, ////////////// 0 - Flags
  VNode | null, /////////////// 1 - Parent
  VNode | null, /////////////// 2 - Previous sibling
  VNode | null, /////////////// 3 - Next sibling
  /// SPECIFIC: ElementVNodeProps
  VNode | null | undefined, /// 4 - First child - undefined if children need to be materialize
  VNode | null | undefined, /// 5 - Last child - undefined if children need to be materialize
  Element, //////////////////// 6 - Element
  string | undefined, ///////// 7 - tag
  /// Props
  ...(string | null)[] /////// 8 - attrs
] & { __brand__: "ElementVNode" };

export const enum TextVNodeProps {
  node = 4,
  text = 5,
}

/** @internal */
export type TextVNode = [
  /// COMMON: VNodeProps
  VNodeFlags.Text | VNodeFlags.Inflated, // 0 - Flags
  VNode | null, ///////////////// 1 - Parent
  VNode | null, ///////////////// 2 - Previous sibling
  VNode | null, ///////////////// 3 - Next sibling
  /// SPECIFIC: TextVNodeProps
  Text | null | undefined, ////// 4 - TextNode or SharedTextNode if Flags.SharedText
  string /////////////////////// 5 - text content
] & { __brand__: "TextVNode" };

export const enum VirtualVNodeProps {
  firstChild = ElementVNodeProps.firstChild,
  lastChild = ElementVNodeProps.lastChild,
  PROPS_OFFSET = 6,
}

/** @internal */
export type VirtualVNode = [
  /// COMMON: VNodeProps
  VNodeFlags.Virtual, ///////////// 0 - Flags
  VNode | null, /////////////// 1 - Parent
  VNode | null, /////////////// 2 - Previous sibling
  VNode | null, /////////////// 3 - Next sibling
  /// SPECIFIC: VirtualVNodeProps
  VNode | null, /////////////// 4 - First child
  VNode | null, /////////////// 5 - Last child
  /// Props
  ...(string | null | boolean)[] /////// 6 - attrs
] & { __brand__: "FragmentNode" & "HostElement" };

/** @internal */
export type VNode = ElementVNode | TextVNode | VirtualVNode;

export const vnode_newElement = (elementName: string): ElementVNode => {
  const vnode: ElementVNode = VNodeArray.createElement(
    VNodeFlags.Element | VNodeFlags.Inflated | (-1 << VNodeFlagsIndex.shift), // Flag
    null,
    null,
    null,
    null,
    null,
    null as unknown as Element,
    elementName
  );
  return vnode;
};
