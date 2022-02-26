import React, { Suspense } from "react";

import RouterState from "./RouterState";
import { StackContextProvider } from "./StackContext";
import { createJSStyles } from "./Palette";
import Column from "./Column";
import ListDivider from "./ListDivider";
import BaseView from "./BaseView";

const jsStyles = createJSStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
    flexShrink: 1,
    flexBasis: "0%",
    position: "relative",
  },
  route: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: 0,
    flexShrink: 1,
    flexBasis: "0%",
    // position: "absolute",
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    // animation: "0.15s ease-out 0s 1 slideIn",
  },
  hidden: {
    display: "none",
  },
});

export default function Router() {
  const {
    context: { navigationStack },
  } = RouterState.useRouterState();

  return (
    <BaseView jsStyle={jsStyles.root}>
      {navigationStack.map(({ route, routeProps }, index, list) => {
        const isTopOfStack = index === list.length - 1;

        return (
          <StackContextProvider
            key={route.title(routeProps)}
            isTopOfStack={isTopOfStack}
          >
            <Column
              jsStyle={[jsStyles.route, !isTopOfStack && jsStyles.hidden]}
              aria-hidden={!isTopOfStack}
            >
              <ListDivider />
              <Suspense fallback={null}>
                <route.root {...routeProps} />
              </Suspense>
            </Column>
          </StackContextProvider>
        );
      })}
    </BaseView>
  );
}
