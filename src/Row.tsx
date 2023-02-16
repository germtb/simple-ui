import React from "react";
import { FlexLayout, FlexLayoutProps } from "./FlexLayout";

export interface RowProps extends FlexLayoutProps {
  direction?: "row";
}

export const Row = React.forwardRef(
  (
    { componentName = [], ...otherProps }: RowProps,
    ref?: React.Ref<HTMLElement>
  ) => {
    return (
      <FlexLayout
        ref={ref}
        componentName={componentName.concat("Row")}
        direction="row"
        {...otherProps}
      />
    );
  }
);