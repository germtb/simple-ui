import { JSStyle, Padding, TextColor, cssVar, getPadding } from "./jss";

export type InteractableColor =
  | "positive"
  | "primary"
  | "negative"
  | "dark"
  | "light";

const jsStyles = {
  root: {
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    transition: "opacity 0.1s ease-in",
    outlineColor: cssVar("--outline"),
    "[aria-disabled=true]": {
      color: cssVar("--secondary-text"),
      backgroundColor: cssVar("--background-button-secondary"),
    },
    ":focus-visible": {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineOffset: -2,
    },
  },
  dark: {
    backgroundColor: "black",
    "[aria-disabled=true]": {
      backgroundColor: cssVar("--background-button-disabled"),
    },
  },
  light: {
    backgroundColor: "white",
    "[aria-disabled=true]": {
      backgroundColor: cssVar("--background-button-disabled"),
    },
  },
  positive: {
    backgroundColor: cssVar("--background-button-positive"),
    "[aria-disabled=true]": {
      backgroundColor: cssVar("--background-button-disabled"),
    },
  },
  primary: {
    backgroundColor: cssVar("--background-button-secondary"),
    "[aria-disabled=true]": {
      backgroundColor: cssVar("--background-button-disabled"),
    },
  },
  negative: {
    backgroundColor: cssVar("--background-button-negative"),
    "[aria-disabled=true]": {
      backgroundColor: cssVar("--background-button-disabled"),
    },
  },
  disabled: {
    cursor: "default",
  },
  bare: {
    backgroundColor: "inherit",
    outlineColor: cssVar("--outline"),
    "[aria-disabled=true]": {
      backgroundColor: "inherit",
    },
    "[aria-disabled=true]:hover": {
      backgroundColor: "inherit",
    },
  },
  opacityHover: {
    ":hover": {
      opacity: 0.8,
    },
    "[aria-disabled=true]:hover": {
      opacity: 1,
    },
  },
  colorHover: {},
};

export function getInteractableJSStyles({
  color,
  bare,
  disabled,
  animateInteraction,
  padding,
  border,
}: {
  color: InteractableColor;
  bare: boolean;
  disabled: boolean;
  animateInteraction: boolean;
  padding: Padding;
  border: boolean;
}): Array<JSStyle> {
  return [
    jsStyles.root,
    color === "dark" && jsStyles.dark,
    color === "light" && jsStyles.light,
    color === "positive" && jsStyles.positive,
    color === "primary" && jsStyles.primary,
    color === "negative" && jsStyles.negative,
    border && {
      border: `1px solid ${getCSSColor(color, disabled, bare)}`,
    },
    bare && jsStyles.bare,
    disabled && jsStyles.disabled,
    !bare && jsStyles.opacityHover,
    animateInteraction &&
      !disabled && {
        position: "relative",
        ":active": {
          opacity: 0.95,
          top: 1,
        },
        "[aria-disabled=true]:active": {
          top: 0,
          opacity: 1,
        },
      },
    getPadding(padding),
  ];
}

export const getGlyphColor = (
  color: InteractableColor,
  disabled: boolean | undefined,
  bare: boolean | undefined,
): TextColor => {
  if (disabled) {
    return "subtle";
  }

  switch (color) {
    case "positive":
      return bare ? "highlight" : "light";
    case "negative":
      return bare ? "negative" : "light";
    case "primary":
      return bare ? "primary" : "secondary";
    case "dark":
      return bare ? "primary" : "light";
    case "light":
      return bare ? "light" : "primary";
  }
};

export const getCSSColor = (
  color: InteractableColor,
  disabled: boolean | undefined,
  bare: boolean | undefined,
): string => {
  if (disabled) {
    return cssVar("--subtle-text");
  }

  switch (color) {
    case "positive":
      return bare ? cssVar("--highlight") : cssVar("--light-text");
    case "negative":
      return bare ? cssVar("--negative-text") : cssVar("--light-text");
    case "primary":
      return bare ? cssVar("--primary-text") : cssVar("--secondary-text");
    case "dark":
      return bare ? cssVar("--primary-text") : cssVar("--light-text");
    case "light":
      return bare ? cssVar("--light-text") : cssVar("--primary-text");
  }
};

export const getInteractableListItemJSStyles = ({
  bare,
  selected,
}: {
  bare: boolean;
  selected: boolean;
}) => {
  return [
    {
      overflow: "hidden",
      flexGrow: 1,
      borderRadius: bare ? cssVar("--border-radius-m") : null,
      textDecoration: "none",
      ":hover": {
        backgroundColor: cssVar("--hovered-background"),
      },
      ":active:hover": {
        backgroundColor: cssVar("--pressed-background"),
      },
      "[aria-disabled=true]": {
        backgroundColor: cssVar("--primary-background"),
      },
      "[aria-disabled=true]:active:hover": {
        backgroundColor: cssVar("--primary-background"),
      },
    },
    selected && {
      backgroundColor: bare
        ? cssVar("--light-highlight")
        : cssVar("--selected-background"),
      boxShadow: bare ? "" : "inset 1px 1px 2px -1px #0000004a",
      ":hover": {
        backgroundColor: cssVar("--hovered-background"),
      },
      ":active:hover": {
        backgroundColor: cssVar("--pressed-background"),
      },
    },
  ];
};
