import { Button, useTheme } from "@mui/material";
import { useNavigate } from "react-router";
type Props = {
  children: React.ReactNode;
  to: string;
  variant?: "text" | "contained" | "outlined";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export default function NavigateButton({
  children,
  to,
  variant,
  startIcon,
  endIcon,
}: Props) {
  const navigate = useNavigate();
  const { palette } = useTheme();
  return (
    <Button
      variant={variant}
      onClick={() => navigate(to)}
      sx={{
        borderRadius: 2,
        padding: 1,
        ...(variant === "contained" && {
          color: palette.common.white,
          backgroundColor: palette.primary.main,
        }),
        ...(variant === "outlined" && {
          color: palette.primary.main,
          border: `1px solid ${palette.primary.main}`,
        }),
      }}
    >
      {startIcon && <span>{startIcon}</span>}
      {children}
      {endIcon && <span>{endIcon}</span>}
    </Button>
  );
}
