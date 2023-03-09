import React, { ReactNode } from "react";
import {
  Color,
  createJSStyles,
  Position,
  Size,
  Spacing,
  TextColor,
} from "./Palette";
import { BaseButton, ButtonColor } from "./BaseButton";
import { TextPairing } from "./TextPairing";
import { BaseListRow, BaseListRowProps } from "./BaseListRow";
import { ListCell } from "./ListCell";

const jsStyles = createJSStyles({
  root: {
    position: "relative",
  },
  gridcell: {
    display: "flex",
    flexGrow: 1,
  },
  button: {
    flexGrow: 1,
    backgroundColor: "var(--primary-background)",
    "[aria-selected=true]": {
      backgroundColor: "var(--selected-background)",
    },
    ":hover": {
      backgroundColor: "var(--hovered-background)",
    },
    "[aria-selected=true]:hover": {
      backgroundColor: "var(--hovered-background)",
    },
    ":active:hover": {
      backgroundColor: "var(--pressed-background)",
    },
    "[aria-selected=true]:active:hover": {
      backgroundColor: "var(--pressed-background)",
    },
    "[aria-disabled=true]": {
      backgroundColor: "var(--primary-background)",
    },
    "[aria-disabled=true]:active:hover": {
      backgroundColor: "var(--primary-background)",
    },
  },
  addOn: {
    flexGrow: 0,
    flexShrink: 0,
  },
  outerAddOn: {
    display: "flex",
    flexGrow: 0,
    flexShrink: 0,
  },
  interactiveAddOn: {
    flexGrow: 0,
    flexShrink: 0,
  },
});

interface ListPressableRow extends BaseListRowProps {
  onPress: () => void;
  headline: string;
  headlineSize?: Size;
  headlineColor?: TextColor;
  headlineAddOn?: ReactNode;
  body?: string;
  bodySize?: Size;
  bodyColor?: TextColor;
  addOn?: ReactNode;
  addOnPosition?: Position;
  outerAddOn?: ReactNode;
  color?: ButtonColor;
  disabled?: boolean;
  role?: undefined;
  backgroundColor?: Color;
  gap?: Spacing;
  selected?: boolean;
}

export const ListPressableRow = React.forwardRef(
  (
    {
      onPress,
      headline,
      headlineSize = "medium",
      headlineColor = "primary",
      headlineAddOn,
      body,
      bodySize = "small",
      bodyColor = "secondary",
      addOn,
      addOnPosition,
      outerAddOn,
      color = "secondary",
      disabled = false,
      padding = "medium",
      jsStyle,
      gap,
      selected,
      ...otherProps
    }: ListPressableRow,
    ref?: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <BaseListRow
        {...otherProps}
        componentName={(otherProps.componentName ?? []).concat(
          "ListPressableRow"
        )}
        gap={gap}
        jsStyle={[jsStyles.root, jsStyle]}
      >
        <ListCell jsStyle={jsStyles.gridcell}>
          <BaseButton
            aria-selected={selected}
            disabled={disabled}
            animateClick={false}
            bare={true}
            color={color}
            ref={ref}
            jsStyle={jsStyles.button}
            aria-label={headline}
            onPress={onPress}
            padding={padding}
          >
            <TextPairing
              addOn={addOn}
              addOnPosition={addOnPosition}
              headline={headline}
              headlineSize={headlineSize}
              headlineColor={disabled ? "subtle" : headlineColor}
              headlineAddOn={headlineAddOn}
              body={body}
              bodySize={bodySize}
              bodyColor={disabled ? "subtle" : bodyColor}
              grow={true}
              shrink={false}
            />
          </BaseButton>
        </ListCell>
        {outerAddOn && <ListCell>{outerAddOn}</ListCell>}
      </BaseListRow>
    );
  }
);
