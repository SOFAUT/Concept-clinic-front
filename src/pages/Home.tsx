import { Box, Button, Container, Typography, IconButton, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import getTheme from "../assets/styles/theme";

function LandingHeader() {
  const navigate = useNavigate();

  return (
    <Box
      component="header"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        py: 2,
        bgcolor: "background.paper",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Clinica Estética X
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="text" onClick={() => navigate("/choose-role")}>
            Comece Agora
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/choose-role")}
          >
            Entrar
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2,
        mt: 4,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Concept Clinic. Todos os direitos
          reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  const handleToggleTheme = () =>
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 16, right: 24, zIndex: 20 }}>
          <Tooltip
            title={themeMode === "dark" ? "Tema claro" : "Tema escuro"}
          >
            <IconButton color="primary" onClick={handleToggleTheme}>
              {themeMode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>
        </Box>

        <LandingHeader />

        <Box
          component="main"
          sx={{ flex: 1, display: "flex", alignItems: "stretch" }}
        >
          <Container
            maxWidth="lg"
            sx={{
              py: 6,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              gap: 4,
              minHeight: "70vh",
            }}
          >
            <Box sx={{ flex: 1, maxWidth: 520 }}>
              <Typography
                variant="h2"
                fontWeight={700}
                gutterBottom
                sx={{ fontSize: { xs: 32, md: 40 } }}
              >
                Cuide da sua clínica e dos seus pacientes em um só lugar.
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 3, fontSize: { xs: 18, md: 20 } }}
              >
                Agendamentos inteligentes, histórico dos pacientes e pagamentos
                organizados em uma plataforma única.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate("/choose-role")}
                >
                  Comece Agora
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/choose-role")}
                >
                  Conheça mais
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 320,
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: 4,
                backgroundImage:
                  "linear-gradient(135deg, rgba(59,130,246,0.7), rgba(236,72,153,0.7)), url('https://sercirurgiaplastica.com.br/uploads/images/2021/08/saiba-como-escolher-uma-clinica-de-cirurgia-plastica-em-sao-paulo-1629953750.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Container>
        </Box>

        <LandingFooter />
      </Box>
    </ThemeProvider>
  );
}

