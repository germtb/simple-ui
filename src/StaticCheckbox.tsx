import React from "react";
import { BaseView } from "./BaseView";
import { Icon } from "./Icon";
import { JSStyle, Size, jss } from "./JSS";

// @ts-ignore
type TextInputProps = {
  checked: boolean;
  size: Size;
};

const jsStyles: { [key: string]: JSStyle } = {
  root: {
    position: "relative",
    backgroundColor: "var(--primary-background)",
    overflow: "hidden",
    padding: "var(--spacing-xs)",
  },
  border: {
    position: "absolute",
    top: "var(--spacing-xs)",
    bottom: "var(--spacing-xs)",
    left: "var(--spacing-xs)",
    right: "var(--spacing-xs)",
    border: "1px solid var(--divider)",
    borderRadius: "50%",
  },
  borderChecked: {
    border: "none",
    backgroundColor: "var(--highlight)",
  },
  icon: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "var(--spacing-xs)",
    bottom: "var(--spacing-xs)",
    left: "var(--spacing-xs)",
    right: "var(--spacing-xs)",
  },
  xsmall: {
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  small: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  medium: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
  large: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  xlarge: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
};

export function StaticCheckbox({ checked, size }: TextInputProps) {
  return (
    <label
      className={jss([
        jsStyles.root,
        size === "xsmall" && jsStyles.xsmall,
        size === "small" && jsStyles.small,
        size === "medium" && jsStyles.medium,
        size === "large" && jsStyles.large,
        size === "xlarge" && jsStyles.xlarge,
      ])}
    >
      <BaseView
        jsStyle={[jsStyles.border, checked && jsStyles.borderChecked]}
      />
      {checked && (
        <BaseView jsStyle={jsStyles.icon}>
          <Icon size={size} color="light" icon="fa-check" />
        </BaseView>
      )}
    </label>
  );
}
