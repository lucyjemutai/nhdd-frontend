import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const VerifyEmail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token } = router.query;

    // If token is present, send a request to backend API to verify the email
    if (token) {
      fetch(`/api/verify-email?token=${token}`)
        .then((response) => {
          if (response.ok) {
            router.push("/auth/login");
          } else {
            console.error("Verification failed");
          }
        })
        .catch((error) => {
          console.error("Error during verification:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      console.error("Verification token not found");
    }
  }, [router.query]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="50vh"
      >
        {loading ? (
          <div>Verification in progress...</div>
        ) : (
          <CircularProgress />
        )}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="50vh"
    >
      <CircularProgress />
    </Box>
  );
};

export default VerifyEmail;
