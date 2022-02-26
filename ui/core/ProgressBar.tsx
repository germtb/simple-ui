import React from "react";
import { createJSStyles } from "./Palette";
import BaseView from "./BaseView";

const jsStyles = createJSStyles({
  root: {
    width: "100%",
    height: 4,
    display: "flex",
    position: "relative",
    backgroundColor: "var(--primary-background)",
    borderRadius: "var(--border-radius-s)",
    overflow: "hidden",
  },
  fill: {
    backgroundColor: "var(--highlight)",
    position: "absolute",
    transformOrigin: "center left",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  transition: {
    // transition: "transform 0.2s ease-in",
  },
});

function ProgressBar({ progress }: { progress: number }) {
  return (
    <BaseView jsStyle={jsStyles.root}>
      <BaseView
        jsStyle={jsStyles.fill}
        style={{
          transform: `scaleX(${progress})`,
        }}
      />
    </BaseView>
  );
}

export default ProgressBar;
