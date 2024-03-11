import React, { PropsWithChildren } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#8C1515"
        },
        secondary: {
            main: "#FFFFFF"
        },
        text: {
            primary: "#000000"
        }
    }
});

export function MuiThemeProvider({children}: PropsWithChildren) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
