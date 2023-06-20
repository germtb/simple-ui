import React, { useEffect } from "react";
import { DarkModeProvider } from "./DarkModeStore";
import { DialogProvider } from "./Dialog";
import { initializeIcons } from "./Icon";
import { darkTheme, lightTheme, PaletteProvider } from "./Palette";
import { useCookie } from "./useCookie";
export function Providers({ children, themes = { light: lightTheme, dark: darkTheme }, }) {
    const [darkModeEnabled, setDarkModeEnabled] = useCookie("dark-mode", {
        initialValue: false,
    });
    const toggleDarkMode = React.useCallback(() => setDarkModeEnabled((x) => !x), []);
    useEffect(() => {
        initializeIcons();
    }, []);
    return (<PaletteProvider themes={themes}>
      <DarkModeProvider enabled={darkModeEnabled} toggle={toggleDarkMode}>
        <DialogProvider>{children}</DialogProvider>
      </DarkModeProvider>
    </PaletteProvider>);
}
//# sourceMappingURL=Providers.jsx.map