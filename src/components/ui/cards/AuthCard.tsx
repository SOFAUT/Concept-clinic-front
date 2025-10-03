import React from "react";
import { Card, CardContent, Box } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function AuthCard({ children }: Props) {
  return (
    <Box sx={{ width: { xs: "100%", sm: 400 }, maxWidth: "100%" }}>
      <Card elevation={6} sx={{ borderRadius: 4 }}>
        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
}
