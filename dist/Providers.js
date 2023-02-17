import React from "react";
import { DarkModeProvider } from "./DarkModeStore";
import { DialogProvider } from "./Dialog";
import { darkTheme, lightTheme, PaletteProvider } from "./Palette";
import { useCookie } from "./useCookie";
export function Providers({ children }) {
    const [darkModeEnabled, setDarkModeEnabled] = useCookie("dark-mode", { initialValue: true });
    const toggleDarkMode = React.useCallback(() => setDarkModeEnabled(x => !x), []);
    return React.createElement(PaletteProvider, { themes: { light: lightTheme, dark: darkTheme } },
        React.createElement(DarkModeProvider, { enabled: darkModeEnabled, toggle: toggleDarkMode },
            React.createElement(DialogProvider, null, children)));
}
//# sourceMappingURL=Providers.js.map