import React, { ReactNode } from "react";
import { createJSStyles, JSStyles, Padding } from "./Palette";
import { BaseInput, BaseInputProps } from "./BaseInput";
import { IconType } from "./IconType";
import { Icon } from "./Icon";
import { Row } from "./Row";
import { Box } from "./Box";

export interface TextInputProps extends BaseInputProps {
  onValueChange: (value: string) => void;
  rootJSStyle?: JSStyles;
  icon?: IconType;
  addOn?: ReactNode;
  onChange?: undefined;
  indentation?: Padding;
}

const jsStyles = createJSStyles({
  root: {
    backgroundColor: "inherit",
  },
  input: {
    // padding: "var(--spacing-m)",
    flexGrow: 1,
    backgroundColor: "inherit",
    color: "var(--primary-text)",
    outline: "none",
    border: "none",
    fontSize: 20,
    lineHeight: 24 / 20,
    "::placeholder": {
      color: "var(--subtle-text);",
    },
    ":disabled": {
      color: "var(--subtle-text);",
    },
  },
});

export const TextInput = React.forwardRef(
  (
    {
      value,
      onValueChange,
      rootJSStyle,
      jsStyle,
      icon,
      addOn,
      indentation,
      ...inputProps
    }: TextInputProps,
    ref?: React.Ref<HTMLInputElement>
  ) => {
    return (
      <Row jsStyle={[jsStyles.root, rootJSStyle]} padding={indentation}>
        {icon && (
          <Box padding="medium">
            <Icon size="medium" color="secondary" icon={icon} />
          </Box>
        )}
        <BaseInput
          {...inputProps}
          ref={ref}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          jsStyle={[jsStyles.input, jsStyle]}
        />
        {addOn}
      </Row>
    );
  }
);