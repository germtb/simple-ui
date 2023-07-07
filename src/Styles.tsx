import CSS from "csstype";
import React, { ReactNode, useRef } from "react";

import { hash } from "./hash";
import { numberToBase } from "./numberToBase";

type StylesValueType = string | number | CSS.Properties<string | number>;

export type Size = "xsmall" | "small" | "medium" | "large" | "xlarge";

export type Spacing = "none" | Size;

export type Gap = Spacing;

export type Padding = Spacing | [Spacing, Spacing];

export type Margin = Spacing | [Spacing, Spacing];

export type Direction = "horizontal" | "vertical";

export type Position = "left" | "right";

export type Justify =
  | "none"
  | "center"
  | "flex-start"
  | "space-between"
  | "flex-end"
  | "stretch";

export type Align = "none" | "center" | "stretch" | "flex-start" | "flex-end";

export type FlexDirection = "row" | "column";

export type Color =
  | "none"
  | "negative"
  | "warning"
  | "highlight"
  | "primary-background"
  | "secondary-background"
  | "divider"
  | "inherit";

export type TextColor =
  | "primary"
  | "secondary"
  | "highlight"
  | "negative"
  | "subtle"
  | "light"
  | "inherit";

export type Styles = CSS.Properties<
  string | number | CSS.Properties<string | number>
>;

type Stylesheet = {
  [cssProp: string]: {
    [cssValue: string]:
      | {
          className: string;
          selector: string;
          type: "SIMPLE";
        }
      | {
          className: string;
          media: string;
          selector: string;
          type: "MEDIA";
          style: CSS.Properties<string | number>;
        }
      | {
          className: string;
          selector: string;
          type: "NESTED";
          style: CSS.Properties<string | number>;
        };
  };
};

export type JSStyle =
  | Styles
  | null
  | false
  | undefined
  | { [key: string]: Styles }
  | Array<JSStyle>;

export type FlatStyles = Styles & { other: { [key: string]: Styles } };

const stylesheet: Stylesheet = {};

const aliases: {
  [alias: string]: (value: StylesValueType) => [string, StylesValueType][];
} = {
  margin: (value) => {
    return [
      ["margin-top", value],
      ["margin-bottom", value],
      ["margin-left", value],
      ["margin-right", value],
    ];
  },
  padding: (value) => {
    return [
      ["padding-top", value],
      ["padding-bottom", value],
      ["padding-left", value],
      ["padding-right", value],
    ];
  },
  border: (value) => {
    if (value === "none") {
      return [
        ["border-width", 0],
        ["border-style", "none"],
        ["border-color", "currentcolor"],
      ];
    } else if (typeof value === "string") {
      const matches = Array.from(value.matchAll(/(.+) (.+) (.+)$/g))[0];
      return [
        ["border-width", matches[1]],
        ["border-style", matches[2]],
        ["border-color", matches[3]],
      ];
    } else {
      throw new Error("Cannot parse the value assigned to 'border'");
    }
  },
};

const identifiers = new Map<string, string>();

function identifier(
  string: string,
  { useIncrementalIdentifiers }: { useIncrementalIdentifiers: boolean }
): string {
  if (useIncrementalIdentifiers) {
    const hashed_string = hash(string);
    if (identifiers.has(hashed_string)) {
      return identifiers.get(hashed_string);
    } else {
      identifiers.set(hashed_string, numberToBase(identifiers.size));
      return identifiers.get(hashed_string);
    }
  } else {
    return `x${hash(string)}`;
  }
}

function addToStylesheet(
  styles: Styles,
  { useIncrementalIdentifiers }: { useIncrementalIdentifiers: boolean } = {
    useIncrementalIdentifiers: false,
  }
): Styles {
  const stylesStack = Object.entries(styles);

  while (stylesStack.length) {
    const [key, value] = stylesStack.pop();

    if (aliases[key]) {
      stylesStack.push(...aliases[key](value));
      continue;
    }

    if (stylesheet[key] == null) {
      stylesheet[key] = {};
    }

    if (typeof value === "number") {
      const id = identifier(`${key}${value}`, { useIncrementalIdentifiers });
      stylesheet[key][value] = {
        className: id,
        selector: `.${id}`,
        type: "SIMPLE",
      };
    } else if (typeof value === "string") {
      const id = identifier(`${key}${value}`, { useIncrementalIdentifiers });
      stylesheet[key][value] = {
        className: id,
        selector: `.${id}`,
        type: "SIMPLE",
      };
    } else if (typeof value === "object" && key.startsWith("@media")) {
      const hashedValue = hash(key + JSON.stringify(value, null, 2));
      const id = identifier(`${key}${hashedValue}`, {
        useIncrementalIdentifiers,
      });
      stylesheet[key][hashedValue] = {
        className: id,
        media: key,
        selector: `.${id}`,
        type: "MEDIA",
        style: value,
      };
    } else if (typeof value === "object") {
      const hashedValue = hash(JSON.stringify(value, null, 2));
      const id = identifier(`${key}${hashedValue}`, {
        useIncrementalIdentifiers,
      });
      stylesheet[key][hashedValue] = {
        className: id,
        selector: `.${id}${key}`,
        type: "NESTED",
        style: value,
      };
    } else {
      throw new Error("Invalid CSS value");
    }
  }

  return styles;
}

export const createJSStyle = <
  T extends {
    [key: string]: Styles | { [key: string]: Styles };
  }
>(
  styles: T,
  { useIncrementalIdentifiers }: { useIncrementalIdentifiers: boolean } = {
    useIncrementalIdentifiers: false,
  }
): T => {
  for (const style of Object.values(styles)) {
    addToStylesheet(style, { useIncrementalIdentifiers });
  }

  return styles;
};

const flattenJSStyle = (jsStyle: JSStyle): Styles => {
  if (!jsStyle) {
    return {};
  } else if (Array.isArray(jsStyle)) {
    // @ts-ignore
    return jsStyle.reduce((acc: Styles, jsStyle: JSStyle) => {
      return { ...acc, ...flattenJSStyle(jsStyle) };
    }, {});
  } else {
    return jsStyle;
  }
};

const aliasStyles = (styles: Styles): Styles => {
  const aliasedStyles: Styles = {};

  const stack = Object.entries(styles);

  while (stack.length) {
    const [key, value] = stack.pop();

    const alias = aliases[key];

    if (alias) {
      stack.push(...alias(value));
    } else {
      aliasedStyles[key] = value;
    }
  }

  return aliasedStyles;
};

export const createClassNames = (...styles: Array<JSStyle>): string => {
  if (styles.length === 0) {
    return "";
  }

  const flatStyles = flattenJSStyle(styles);
  const aliasedStyles: Styles = aliasStyles(flatStyles);
  const classNames: string[] = [];

  for (const [key, value] of Object.entries(aliasedStyles)) {
    if (typeof value === "string" || typeof value === "number") {
      const className = stylesheet[key][value].className;
      classNames.push(className);
    } else if (typeof value === "object" && key.startsWith("@media")) {
      const hashedValue = hash(key + JSON.stringify(value, null, 2));
      const className = stylesheet[key][hashedValue].className;
      classNames.push(className);
    } else if (typeof value === "object") {
      const hashedValue = hash(JSON.stringify(value, null, 2));
      const className = stylesheet[key][hashedValue].className;
      classNames.push(className);
    } else {
      throw new Error("Unknown style type");
    }
  }

  return classNames.join(" ");
};

const pixelStyles = new Set([
  "min-height",
  "height",
  "max-height",
  "min-width",
  "width",
  "max-width",
  "margin",
  "margin-top",
  "margin-bottom",
  "margin-left",
  "margin-right",
  "padding",
  "padding-top",
  "padding-bottom",
  "padding-left",
  "padding-right",
  "border-radius",
  "font-size",
  "top",
  "bottom",
  "left",
  "right",
  "outline-offset",
]);

const toPixelValue = (key, value) => {
  const sValue = value.toString();

  if (sValue.includes("%") || sValue.includes("v") || sValue.includes("px")) {
    return sValue;
  }

  return pixelStyles.has(key) && Number.isInteger(parseInt(value, 10))
    ? `${value}px`
    : value;
};

const getCSS = (key, value) => {
  const cssProp = key.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  const cssValue = toPixelValue(cssProp, value);
  return [cssProp, cssValue];
};

export const generateStylesheet = ({
  light,
  dark,
}: {
  light: Theme;
  dark: Theme;
}) => {
  const css: string[] = [];

  css.push(baseStyles);

  css.push(`body {
    color-scheme: light;
    ${Object.entries(light)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n   ")}
  }`);

  css.push(`body.dark-mode {
    color-scheme: dark;
    ${Object.entries(dark)
      .map(([key, value]) => `${key}: ${value};`)
      .join("\n    ")}
  }`);

  for (const key of Object.keys(stylesheet)) {
    for (const value of Object.keys(stylesheet[key])) {
      const style = stylesheet[key][value];
      const selector = style.selector;

      if (style.type === "SIMPLE") {
        const [cssProp, cssValue] = getCSS(key, value);
        css.push(`${selector} { ${cssProp}: ${cssValue}; }`);
      } else if (style.type === "MEDIA") {
        const media = style.media;
        const cssValue = Object.entries(style.style)
          .map(([key, value]) => {
            const [cssProp, cssValue] = getCSS(key, value);
            return `${cssProp}: ${cssValue}; `;
          })
          .join(" ");
        css.push(`${media} { ${selector} { ${cssValue} } }`);
      } else if (style.type === "NESTED") {
        const cssValue = Object.entries(style.style)
          .map(([key, value]) => {
            const [cssProp, cssValue] = getCSS(key, value);
            return `${cssProp}: ${cssValue}; `;
          })
          .join(" ");

        css.push(`${selector} { ${cssValue} }`);
      }
    }
  }

  return css.join("\n\n");
};

export type Theme = {
  /* Background */
  ["--primary-background"]: string;
  ["--secondary-background"]: string;
  ["--divider"]: string;
  ["--strong-divider"]: string;
  ["--pressed-background"]: string;
  ["--hovered-background"]: string;
  ["--selected-background"]: string;
  ["--nav-bar"]: string;
  /* Effects */
  ["--warning"]: string;
  ["--highlight"]: string;
  ["--outline"]: string;
  ["--light-highlight"]: string;
  /* Text */
  ["--primary-text"]: string;
  ["--secondary-text"]: string;
  ["--subtle-text"]: string;
  ["--highlight-text"]: string;
  ["--negative-text"]: string;
  ["--light-text"]: string;
  /* Buttons */
  ["--background-button-positive"]: string;
  ["--background-button-secondary"]: string;
  ["--background-button-negative"]: string;
  ["--background-button-disabled"]: string;
  /* Spacing */
  ["--spacing-xs"]: string;
  ["--spacing-s"]: string;
  ["--spacing-m"]: string;
  ["--spacing-l"]: string;
  ["--spacing-xl"]: string;
  ["--spacing-xxl"]: string;
  ["--spacing-xxxl"]: string;
  ["--border-radius-s"]: string;
  ["--border-radius-m"]: string;
  ["--border-radius-l"]: string;
  ["--nav-bar-height"]: string;
};

export const lightTheme: Theme = {
  /* Background */
  ["--primary-background"]: "rgb(239, 239, 244)",
  ["--secondary-background"]: "rgb(232, 232, 234)",
  ["--divider"]: "rgb(200, 200, 200)",
  ["--strong-divider"]: "rgb(100, 100, 100)",
  ["--pressed-background"]: "rgb(220, 222, 224)",
  ["--hovered-background"]: "rgb(237, 240, 242)",
  ["--selected-background"]: "rgb(237, 240, 242)",
  ["--nav-bar"]: "rgb(232, 232, 234)",
  /* Effects */
  ["--warning"]: "rgb(255, 204, 0)",
  ["--highlight"]: "rgb(0, 122, 255)",
  ["--outline"]: "rgb(103, 176, 255)",
  ["--light-highlight"]: "rgb(220, 232, 245)",
  /* Text */
  ["--primary-text"]: "rgb(0, 0, 0)",
  ["--secondary-text"]: "rgb(100, 100, 100)",
  ["--subtle-text"]: "rgb(180, 180, 180)",
  ["--highlight-text"]: "rgb(0, 122, 255)",
  ["--negative-text"]: "rgb(255, 59, 48)",
  ["--light-text"]: "rgb(255, 255, 255)",
  /* Buttons */
  ["--background-button-positive"]: "rgb(0, 122, 255)",
  ["--background-button-secondary"]: "rgb(218, 218, 223)",
  ["--background-button-negative"]: "rgb(255, 59, 48)",
  ["--background-button-disabled"]: "rgb(218, 218, 223)",
  /* Spacing */
  ["--spacing-xs"]: "0.125rem",
  ["--spacing-s"]: "0.25rem",
  ["--spacing-m"]: "0.5rem",
  ["--spacing-l"]: "0.75px",
  ["--spacing-xl"]: "1rem",
  ["--spacing-xxl"]: "1.5px",
  ["--spacing-xxxl"]: "2rem",
  ["--border-radius-s"]: "0.125rem",
  ["--border-radius-m"]: "0.25rem",
  ["--border-radius-l"]: "0.5rem",
  ["--nav-bar-height"]: "50px",
};

export const darkTheme: Theme = {
  /* Background */
  ["--primary-background"]: "rgb(42, 43, 46)",
  ["--secondary-background"]: "rgb(65, 66, 67)",
  ["--divider"]: "rgb(70, 72, 73)",
  ["--strong-divider"]: "rgb(100, 100, 100)",
  ["--pressed-background"]: "rgb(90, 92, 93)",
  ["--hovered-background"]: "rgb(50, 53, 54)",
  ["--selected-background"]: "rgb(65, 68, 69)",
  ["--nav-bar"]: "rgb(34, 35, 36)",
  /* Effects */
  ["--warning"]: "rgb(255, 204, 0)",
  ["--highlight"]: "rgb(50, 140, 220)",
  ["--outline"]: "rgb(91, 170, 255)",
  ["--light-highlight"]: "rgb(220, 232, 245)",
  /* Text */
  ["--primary-text"]: "rgb(255, 255, 255)",
  ["--secondary-text"]: "rgb(200, 200, 200)",
  ["--subtle-text"]: "rgb(140, 140, 140)",
  ["--highlight-text"]: "#4ca7f8",
  ["--negative-text"]: "rgb(255, 59, 48)",
  ["--light-text"]: "rgb(255, 255, 255)",
  /* Buttons */
  ["--background-button-positive"]: "rgb(50, 140, 220)",
  ["--background-button-secondary"]: "rgb(82, 83, 86)",
  ["--background-button-negative"]: "rgb(255, 59, 48)",
  ["--background-button-disabled"]: "rgb(70, 72, 73)",
  /* Spacing */
  ["--spacing-xs"]: "2px",
  ["--spacing-s"]: "4px",
  ["--spacing-m"]: "8px",
  ["--spacing-l"]: "12px",
  ["--spacing-xl"]: "16px",
  ["--spacing-xxl"]: "24px",
  ["--spacing-xxxl"]: "32px",
  ["--border-radius-s"]: "2px",
  ["--border-radius-m"]: "4px",
  ["--border-radius-l"]: "8px",
  ["--nav-bar-height"]: "50px",
};

const baseStyles = `
* {
  box-sizing: border-box;
  padding: 0;
  border: none;
  touch-action: manipulation;
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

ul {
  margin: 0;
}

*:focus {
  outline-color: var(--highlight);
}

html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--primary-background);
}

ul,
ol,
li {
  list-style: none;
}

`;

export const StylesProvider = ({
  children,
  themes,
}: {
  children: ReactNode;
  themes: { light: Theme; dark: Theme };
}): JSX.Element => {
  const stylesheetRef = useRef(null);

  if (stylesheetRef.current == null) {
    stylesheetRef.current = generateStylesheet(themes);
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: stylesheetRef.current }}
      ></style>
      {children}
    </>
  );
};

const backgroundStyles = createJSStyle({
  highlight: {
    backgroundColor: "var(--highlight)",
  },
  warning: {
    backgroundColor: "var(--warning)",
  },
  "primary-background": {
    backgroundColor: "var(--primary-background)",
  },
  negative: {
    backgroundColor: "var(--negative-text)",
  },
  "secondary-background": {
    backgroundColor: "var(--secondary-background)",
  },
  divider: {
    backgroundColor: "var(--divider)",
  },
  inherit: {
    backgroundColor: "inherit",
  },
});

export const getBackground = (color: Color) => {
  return backgroundStyles[color];
};

const justifyStyles = createJSStyle({
  ["space-between"]: {
    justifyContent: "space-between",
  },
  ["center"]: {
    justifyContent: "center",
  },
  ["flex-end"]: {
    justifyContent: "flex-end",
  },
  ["stretch"]: {
    justifyContent: "stretch",
  },
  ["flex-start"]: {
    justifyContent: "flex-start",
  },
});

export const getJustify = (prop: Justify) => {
  return justifyStyles[prop];
};

const alignStyles = createJSStyle({
  ["stretch"]: {
    alignItems: "stretch",
  },
  ["center"]: {
    alignItems: "center",
  },
  ["flex-start"]: {
    alignItems: "flex-start",
  },
  ["flex-end"]: {
    alignItems: "flex-end",
  },
});

export const getAlign = (prop: Align) => {
  return alignStyles[prop];
};

const gapStyles = createJSStyle({
  xsmall: {
    gap: "var(--spacing-xs)",
  },
  small: {
    gap: "var(--spacing-s)",
  },
  medium: {
    gap: "var(--spacing-m)",
  },
  large: {
    gap: "var(--spacing-l)",
  },
  xlarge: {
    gap: "var(--spacing-xl)",
  },
});

export const getGap = (gap: Gap) => {
  return gapStyles[`${gap}`];
};

export const paddingStyles = createJSStyle({
  xsmall: {
    padding: "var(--spacing-xs)",
  },
  small: {
    padding: "var(--spacing-s)",
  },
  medium: {
    padding: "var(--spacing-m)",
  },
  large: {
    padding: "var(--spacing-l)",
  },
  xlarge: {
    padding: "var(--spacing-xl)",
  },
  ["xsmall-row"]: {
    paddingLeft: "var(--spacing-xs)",
    paddingRight: "var(--spacing-xs)",
  },
  ["small-row"]: {
    paddingLeft: "var(--spacing-s)",
    paddingRight: "var(--spacing-s)",
  },
  ["medium-row"]: {
    paddingLeft: "var(--spacing-m)",
    paddingRight: "var(--spacing-m)",
  },
  ["large-row"]: {
    paddingLeft: "var(--spacing-l)",
    paddingRight: "var(--spacing-l)",
  },
  ["xlarge-row"]: {
    paddingLeft: "var(--spacing-xl)",
    paddingRight: "var(--spacing-xl)",
  },
  ["xsmall-column"]: {
    paddingTop: "var(--spacing-xs)",
    paddingBottom: "var(--spacing-xs)",
  },
  ["small-column"]: {
    paddingTop: "var(--spacing-s)",
    paddingBottom: "var(--spacing-s)",
  },
  ["medium-column"]: {
    paddingTop: "var(--spacing-m)",
    paddingBottom: "var(--spacing-m)",
  },
  ["large-column"]: {
    paddingTop: "var(--spacing-l)",
    paddingBottom: "var(--spacing-l)",
  },
  ["xlarge-column"]: {
    paddingTop: "var(--spacing-xl)",
    paddingBottom: "var(--spacing-xl)",
  },
});

export const marginStyles = createJSStyle({
  xsmall: {
    margin: "var(--spacing-xs)",
  },
  small: {
    margin: "var(--spacing-s)",
  },
  medium: {
    margin: "var(--spacing-m)",
  },
  xlarge: {
    margin: "var(--spacing-xl)",
  },
  large: {
    margin: "var(--spacing-l)",
  },
  ["xsmall-row"]: {
    marginLeft: "var(--spacing-xs)",
    marginRight: "var(--spacing-xs)",
  },
  ["small-row"]: {
    marginLeft: "var(--spacing-s)",
    marginRight: "var(--spacing-s)",
  },
  ["medium-row"]: {
    marginLeft: "var(--spacing-m)",
    marginRight: "var(--spacing-m)",
  },
  ["large-row"]: {
    marginLeft: "var(--spacing-l)",
    marginRight: "var(--spacing-l)",
  },
  ["xlarge-row"]: {
    marginLeft: "var(--spacing-xl)",
    marginRight: "var(--spacing-xl)",
  },
  ["xsmall-column"]: {
    marginTop: "var(--spacing-xs)",
    marginBottom: "var(--spacing-xs)",
  },
  ["small-column"]: {
    marginTop: "var(--spacing-s)",
    marginBottom: "var(--spacing-s)",
  },
  ["medium-column"]: {
    marginTop: "var(--spacing-m)",
    marginBottom: "var(--spacing-m)",
  },
  ["large-column"]: {
    marginTop: "var(--spacing-l)",
    marginBottom: "var(--spacing-l)",
  },
  ["xlarge-column"]: {
    marginTop: "var(--spacing-xl)",
    marginBottom: "var(--spacing-xl)",
  },
});

export const getPadding = (padding: Padding) => {
  if (Array.isArray(padding)) {
    const [h, v] = padding;
    return [paddingStyles[`${v}-row`], paddingStyles[`${h}-column`]];
  } else {
    return paddingStyles[padding];
  }
};

export const getMargin = (margin: Margin) => {
  if (Array.isArray(margin)) {
    const [h, v] = margin;
    return [marginStyles[`${v}-row`], marginStyles[`${h}-column`]];
  } else {
    return marginStyles[margin];
  }
};

export const grow = createJSStyle({ grow: { flexGrow: 1 } }).grow;

export const shrink = createJSStyle({ shrink: { flexShrink: 1 } });

const flexStyles = createJSStyle({
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
});

export const getFlex = (direction: FlexDirection) => {
  return flexStyles[direction];
};

const borderStyles = createJSStyle({
  top: {
    borderTop: "1px solid var(--divider)",
  },
  bottom: {
    borderBottom: "1px solid var(--divider)",
  },
  right: {
    borderRight: "1px solid var(--divider)",
  },
  left: {
    borderLeft: "1px solid var(--divider)",
  },
  all: {
    border: "1px solid var(--divider)",
  },
});

export const getBorder = (direction?: "top" | "bottom" | "left" | "right") => {
  if (!direction) {
    return borderStyles.all;
  }

  return borderStyles[direction];
};

export const MOBILE = 750;
export const TABLET = 1000;
export const LAPTOP = 1200;

export const withMedia = (styles: {
  phone?: Styles;
  tablet?: Styles;
  laptop?: Styles;
  desktop?: Styles;
}) => {
  const phone = styles.phone
    ? {
        [`@media (min-width: 0px) and (max-width: ${MOBILE}px)`]: styles.phone,
      }
    : {};
  const tablet = styles.tablet
    ? {
        [`@media (min-width: ${MOBILE}px) and (max-width: ${TABLET}px)`]:
          styles.tablet,
      }
    : {};
  const laptop = styles.laptop
    ? {
        [`@media (min-width: ${TABLET}px) and (max-width: ${LAPTOP}px)`]:
          styles.laptop,
      }
    : {};
  const desktop = styles.desktop
    ? { [`@media (min-width: ${LAPTOP}px)`]: styles.desktop }
    : {};

  return {
    ...phone,
    ...tablet,
    ...laptop,
    ...desktop,
  };
};

const textColorStyles = createJSStyle({
  primary: {
    color: "var(--primary-text)",
  },
  secondary: {
    color: "var(--secondary-text)",
  },
  highlight: {
    color: "var(--highlight-text)",
  },
  negative: {
    color: "var(--negative-text)",
  },
  subtle: {
    color: "var(--subtle-text)",
  },
  light: {
    color: "var(--light-text)",
  },
  inherit: {
    color: "inherit",
  },
});

export const getTextColor = (color: TextColor) => {
  return textColorStyles[color];
};
