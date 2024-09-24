import * as React from "react";
import Box from "@mui/material/Box";
import Link from "next/link";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fcfcfc",
        width: "100%",
        height: "80px",
        position: "fixed",
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Link
          style={{
            fontWeight: "500",
            textDecoration: "none",
            color: "#334",
            fontSize: "1.1em",
          }}
          href={"/about"}
        >
          About
        </Link>
        <Link
          style={{
            fontWeight: "500",
            textDecoration: "none",
            color: "#334",
            fontSize: "1.1em",
          }}
          href={"/resources"}
        >
          Resources
        </Link>
        <Link
          style={{
            fontWeight: "500",
            textDecoration: "none",
            color: "#334",
            fontSize: "1.1em",
          }}
          href={"/knowledgebase"}
        >
          Knowledge base
        </Link>
        <Link
          style={{
            fontWeight: "500",
            textDecoration: "none",
            color: "#334",
            fontSize: "1.1em",
          }}
          href="https://knhts-staging.health.go.ke/moh-healthdocs/books/kenya-national-health-terminology-service"
          target="_blank"
          rel="noopener noreferrer"
        >
          Help &amp; guides
        </Link>
      </Box>
    </Box>
  );
}
