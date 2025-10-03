import { useState, type MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const languages = [{ code: "pt-BR", label: "PT-BR" }];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // Busca o label do idioma atual, se não encontrar, mostra o código completo
  const currentLang =
    languages.find((l) => l.code === i18n.language)?.label ||
    i18n.language.toUpperCase();

  const handleOpen = (e: MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    handleClose();
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        startIcon={<LanguageIcon sx={{ color: "primary.main" }} />}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: "none",
          fontWeight: 500,
          color: "text.primary",
          px: 1.5,
          py: 0.5,
        }}
      >
        {currentLang}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: { minWidth: 100 },
          },
        }}
      >
        {languages.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={currentLang === label}
            onClick={() => handleChange(code)}
            sx={{
              minHeight: 48,
              px: 2,
              py: 1.5,
              fontSize: "0.95rem",
              fontWeight: currentLang === label ? 600 : 400,
              transition: "all 0.2s ease-in-out",
            }}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
