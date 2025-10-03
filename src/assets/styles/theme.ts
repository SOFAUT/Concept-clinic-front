import { createTheme, type PaletteMode } from "@mui/material";
import { COLORS } from "./colors";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: COLORS.PRIMARY,
        light: COLORS.PRIMARY_LIGHT,
        contrastText: COLORS.WHITE,
      },
      secondary: {
        main: COLORS.SECONDARY,
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
        contrastText: COLORS.DARK,
      },
      error: {
        main: COLORS.ERROR,
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
  });

export default getTheme;
