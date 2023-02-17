import React from "react";
import { DarkModeProvider } from "./DarkModeStore";
import { DialogProvider } from "./Dialog";
import { PaletteProvider } from "./Palette";
import { useCookie } from "./useCookie";


export function Providers({ children }) {
    const [darkModeEnabled, setDarkModeEnabled] = useCookie("dark-mode", { initialValue: true });
    const toggleDarkMode = React.useCallback(() => setDarkModeEnabled(x => !x), []);

    return <PaletteProvider>
        <DarkModeProvider enabled={darkModeEnabled} toggle={toggleDarkMode}>
            <DialogProvider>
                {children}
            </DialogProvider>
        </DarkModeProvider>
    </PaletteProvider>
}