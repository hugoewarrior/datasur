import { createMuiTheme } from '@material-ui/core/styles';
import { blue, lightBlue } from '@material-ui/core/colors';

export const lightTheme = createMuiTheme({
    typography: {
        fontFamily: [
            "Roboto",
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Arial",
            "sans-serif"
        ].join(",")
    },
    palette: {
        primary: blue,
        secondary: lightBlue,
        type: 'light',
    },
});