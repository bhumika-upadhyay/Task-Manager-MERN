import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import bgPattern from "../assets/bg-pattern.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        background: `
          radial-gradient(circle at top left, rgba(47,73,245,0.16), transparent 32%),
          radial-gradient(circle at top right, rgba(0,188,212,0.14), transparent 28%),
          radial-gradient(circle at bottom left, rgba(126,87,194,0.12), transparent 30%),
          linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%)
        `,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: -40, md: -60 },
          left: { xs: -30, md: -50 },
          width: { xs: 140, sm: 180, md: 240 },
          height: { xs: 140, sm: 180, md: 240 },
          borderRadius: "50%",
          background: "rgba(47,73,245,0.16)",
          filter: "blur(45px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: { xs: 120, sm: 140, md: 100 },
          right: { xs: -40, md: -60 },
          width: { xs: 160, sm: 220, md: 280 },
          height: { xs: 160, sm: 220, md: 280 },
          borderRadius: "50%",
          background: "rgba(0,188,212,0.14)",
          filter: "blur(55px)",
          zIndex: 0,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: { xs: 40, md: 0 },
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: 180, sm: 240, md: 320 },
          height: { xs: 180, sm: 240, md: 320 },
          borderRadius: "50%",
          background: "rgba(126,87,194,0.10)",
          filter: "blur(65px)",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            mt: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            flexWrap: "wrap",
            backgroundColor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: 3,
            boxShadow: "0 4px 18px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 42, sm: 50 },
                height: { xs: 42, sm: 50 },
                borderRadius: 2,
                bgcolor: "#2f49f5",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.15rem" },
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                src="./logo.png"
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#0b1f3a",
                fontSize: { xs: "1.2rem", sm: "1.7rem" },
                whiteSpace: "nowrap",
              }}
            >
              TaskFlow
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              flexShrink: 0,
            }}
          >
            <Button
              variant="text"
              onClick={() => navigate("/signin")}
              sx={{
                minWidth: "auto",
                px: { xs: 1, sm: 2 },
                py: { xs: 0.7, sm: 1 },
                color: "#2f49f5",
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              Sign In
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/signup")}
              sx={{
                minWidth: "auto",
                px: { xs: 1.8, sm: 3 },
                py: { xs: 0.9, sm: 1.2 },
                borderRadius: 3,
                bgcolor: "#2f49f5",
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "1rem" },
                textTransform: "none",
                boxShadow: "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "#243df0",
                  boxShadow: "none",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

        {!show ? (
          <Box
            sx={{
              minHeight: { xs: "78vh", md: "80vh" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography
              fontWeight="bold"
              sx={{
                color: "#0b1f3a",
                fontSize: {
                  xs: "2.1rem",
                  sm: "2.8rem",
                  md: "3.4rem",
                  lg: "4rem",
                },
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              TaskFlow
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            alignItems="center"
            spacing={{ xs: 3, sm: 4, md: 2 }}
            sx={{
              minHeight: { xs: "calc(100vh - 110px)", md: "80vh" },
              py: { xs: 4, sm: 5, md: 2 },
              mt: { xs: 1, sm: 1.5, md: 0 },
            }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  maxWidth: { xs: "100%", sm: "600px" },
                  mx: { xs: "auto", md: 0 },
                  textAlign: { xs: "center", md: "left" },
                  pt: { xs: 6, sm: 5, md: 0 },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 3, sm: 4 },
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  gutterBottom
                  sx={{
                    color: "#0b1f3a",
                    fontWeight: 700,
                    fontSize: {
                      xs: "2rem",
                      sm: "2.5rem",
                      md: "3rem",
                    },
                    lineHeight: 1.2,
                  }}
                >
                  Manage Your Tasks Smartly
                </Typography>

                <Typography
                  sx={{
                    mb: 4,
                    color: "#345",
                    fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                    lineHeight: 1.8,
                    px: { xs: 0.5, sm: 0 },
                  }}
                >
                  Organize your daily work, boost productivity, and never miss
                  deadlines.
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: { xs: "center", md: "flex-start" },
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/signup")}
                    sx={{
                      bgcolor: "#1e40ff",
                      px: { xs: 4, sm: 4.5 },
                      py: 1.4,
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: { xs: "100%", sm: "180px" },
                      maxWidth: { xs: "280px", sm: "fit-content" },
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#1736d6",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid
              size={{ xs: 12, md: 6 }}
              sx={{
                display: { xs: "none", md: "block" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mt: { xs: 1, md: 0 },
                }}
              >
                <Box
                  component="img"
                  src={bgPattern}
                  alt="Task manager illustration"
                  sx={{
                    width: {
                      md: "85%",
                      lg: "90%",
                    },
                    maxWidth: {
                      md: "420px",
                      lg: "500px",
                    },
                    height: "auto",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default LandingPage;