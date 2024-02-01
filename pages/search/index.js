import { Box, TextField, Button, Skeleton, Stack, Alert, AlertTitle } from "@mui/material";
import Head from "next/head";
import React from "react";
import { useRouter } from "next/router";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useSearchParams } from "next/navigation";
import { searchConcepts } from "../api/search";
import { useState } from "react";
import { Search } from "@mui/icons-material";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, mutate } = searchConcepts(search);

  const handleSearch = (event) => {
    event.preventDefault();
    router.push(`/search/?q=${searchTerm}`);
    mutate();
  };

  const columns = [
    "id",
    "display_name",
    "concept_class",
    "datatype",
    "source",
    "retired",
    "version_created_on",
    "version_updated_on",
  ];

  if (isLoading) {
    return (
      <Box sx={{ pt: 0.5 }}>
        <Skeleton />
        <Skeleton width="60%" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Error fetching data, please retry.
        </Alert>
      </Stack>
    );
  }

  return (
    <>
      <Head>
        <title>MOH KNHTS | Search</title>
        <meta name="description" content="MOH KNHTS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box width={"100%"} sx={{ display: "flex" }}>
        <TextField
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1,
            backgroundColor: "#fcfcfc",
            borderRadius: "8px",
          }}
          id="searchTerm"
          name="searchTerm"
          label="Search any concept, institution, domain, sub-domain etc."
          variant="outlined"
          color={"info"}
        />
        <Button
          onClick={handleSearch}
          sx={{
            borderRadius: "8px",
            marginLeft: "10px",
            backgroundColor: "#fff",
            color: "#333",
          }}
          variant="contained"
          color="primary"
        >
          <Search />
        </Button>
      </Box>

      <Box my={2} sx={{ width: "100%" }}>
        <DataGrid
          rows={Object.values(data)}
          getRowId={(row) => row.uuid}
          columns={columns.map((key) => {
            return {
              field: key.toLowerCase(),
              headerName: key
                .replace(/_/g, " ") // Replace underscores with spaces
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
              width: 200,
              valueGetter: (params) => {
                // Format date if the key is 'version_created_on' or 'version_updated_on'
                if (
                  key === "version_created_on" ||
                  key === "version_updated_on"
                ) {
                  const rawDate = params.row[key];
                  return rawDate
                    ? new Date(rawDate).toISOString().split("T")[0]
                    : "";
                }

                return params.row[key];
              },
            };
          })}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[25, 50, 100, 250]}
          onRowClick={(row) => {
            // TODO: go to the resource's page
            router.push("/" + row.row.type + "/" + row.row.id);
          }}
        />
      </Box>
    </>
  );
}

export default SearchResults;
