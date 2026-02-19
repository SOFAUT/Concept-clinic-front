import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { COLORS } from '../../assets/styles/colors';

/**
 * Componente para visualizar a paleta de cores
 * Útil para desenvolvimento e design
 */
export const ColorPalette: React.FC = () => {
  const colorSections = [
    {
      title: 'Cores Principais',
      colors: [
        { name: 'PRIMARY', value: COLORS.PRIMARY },
        { name: 'PRIMARY_LIGHT', value: COLORS.PRIMARY_LIGHT },
        { name: 'SECONDARY', value: COLORS.SECONDARY },
        { name: 'ACCENT', value: COLORS.ACCENT },
        { name: 'ACCENT_LIGHT', value: COLORS.ACCENT_LIGHT },
      ]
    },
    {
      title: 'Cores Funcionais',
      colors: [
        { name: 'SUCCESS', value: COLORS.SUCCESS },
        { name: 'ERROR', value: COLORS.ERROR },
        { name: 'WARNING', value: COLORS.WARNING },
        { name: 'INFO', value: COLORS.INFO },
      ]
    },
    {
      title: 'Cores Neutras',
      colors: [
        { name: 'WHITE', value: COLORS.WHITE },
        { name: 'GRAY', value: COLORS.GRAY },
        { name: 'DARK', value: COLORS.DARK.BACKGROUND.PRIMARY },
      ]
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Paleta de Cores do Projeto
      </Typography>
      
      {colorSections.map((section) => (
        <Box key={section.title} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {section.title}
          </Typography>
          
          <Grid container spacing={2}>
            {section.colors.map((color) => (
                            <Grid key={color.name} sx={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    border: `1px solid ${COLORS.CONTEXT.BORDER.LIGHT}`,
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 60,
                      backgroundColor: color.value,
                      mb: 1,
                      borderRadius: 1,
                      border: color.value === COLORS.WHITE ? `1px solid ${COLORS.GRAY}` : 'none',
                    }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {color.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {color.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default ColorPalette;


