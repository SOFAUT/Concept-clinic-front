import { createTheme, type PaletteMode } from "@mui/material";
import { COLORS } from "./colors";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#7B8EE4" : COLORS.PRIMARY,
        light: COLORS.PRIMARY_LIGHT,
        dark: mode === "dark" ? "#6B7DD4" : COLORS.PRIMARY,
        contrastText: COLORS.WHITE,
      },
      secondary: {
        main: mode === "dark" ? "#A3AED0" : COLORS.SECONDARY,
        light: COLORS.ACCENT_LIGHT,
        contrastText: COLORS.WHITE,
      },
      info: {
        main: COLORS.SECONDARY,
        contrastText: COLORS.WHITE,
      },
      success: {
        main: COLORS.SUCCESS,
        contrastText: COLORS.WHITE,
      },
      warning: {
        main: COLORS.WARNING,
        contrastText: COLORS.DARK.TEXT.PRIMARY,
      },
      error: {
        main: mode === "dark" ? "#FF7B7B" : COLORS.ERROR,
        contrastText: COLORS.WHITE,
      },
      grey: {
        50: COLORS.TRANSPARENT.WHITE_10,
        100: COLORS.TRANSPARENT.WHITE_20,
        200: COLORS.GRAY,
        300: COLORS.GRAY,
        400: COLORS.PRIMARY_LIGHT,
        500: COLORS.PRIMARY,
      },
      background: {
        default: mode === "dark" ? COLORS.DARK.BACKGROUND.PRIMARY : COLORS.CONTEXT.BACKGROUND.PRIMARY,
        paper: mode === "dark" ? COLORS.DARK.BACKGROUND.CARD : COLORS.CONTEXT.BACKGROUND.CARD,
      },
      text: {
        primary: mode === "dark" ? COLORS.DARK.TEXT.PRIMARY : COLORS.CONTEXT.TEXT.PRIMARY,
        secondary: mode === "dark" ? COLORS.DARK.TEXT.SECONDARY : COLORS.CONTEXT.TEXT.SECONDARY,
        disabled: mode === "dark" ? COLORS.DARK.TEXT.DISABLED : COLORS.CONTEXT.TEXT.DISABLED,
      },
      divider: mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.12)",
    },
    typography: {
      fontFamily: "Ubuntu, sans-serif",
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 500 },
      h4: { fontWeight: 500 },
      h5: { fontWeight: 400 },
      h6: { fontWeight: 400 },
      body1: { fontWeight: 300 },
      body2: { fontWeight: 300 },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              color: mode === "dark" ? COLORS.DARK.TEXT.PRIMARY : COLORS.CONTEXT.TEXT.PRIMARY,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            "&.MuiButton-textPrimary": {
              color: mode === "dark" ? "#94A3E1" : COLORS.PRIMARY,
              "&:hover": {
                backgroundColor: mode === "dark" ? "rgba(148, 163, 225, 0.08)" : undefined,
              },
            },
            "&.MuiButton-outlinedPrimary": {
              borderColor: mode === "dark" ? "#7B8EE4" : undefined,
              color: mode === "dark" ? "#7B8EE4" : undefined,
              "&:hover": {
                borderColor: mode === "dark" ? "#94A3E1" : undefined,
                backgroundColor: mode === "dark" ? "rgba(123, 142, 228, 0.08)" : undefined,
              },
            },
          },
        },
      },
    },
  });

export default getTheme;
