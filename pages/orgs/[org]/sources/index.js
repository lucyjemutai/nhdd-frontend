import React from "react";
import { Box, TextField, Button, Skeleton, Stack, Alert, AlertTitle } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { getSources } from "@/pages/api/sources";
import { Search } from "@mui/icons-material";

function SourceList(props) {
  const router = useRouter();
  const { data, isLoading, isError, mutate } = getSources(router.query.org);
  const columns = ["id", "name", "type", "url"];
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = (event) => {
    event.preventDefault();
    mutate();
  };
  const handleClick = (params) =>{
    const rowId = params.id;
    router.push(`/orgs/${params?.row?.owner}/sources/${rowId}`);
  }
  const filteredData = Object.values(data).filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <Head>
        <title>MOH KNHTS | Sources</title>
        <meta name="description" content="MOH KNHTS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box width={"100%"} sx={{ display: "flex" }}>
        <TextField onChange={(e) => setSearchTerm(e.target.value)}sx={{  flexGrow: 1,  backgroundColor: "#fcfcfc",  borderRadius: "8px",}}id="searchTerm"name="searchTerm"label="Search Sources"variant="outlined"color={"info"}/>
        <Button  onClick={handleSearch}  sx={{    borderRadius: "8px",    marginLeft: "10px",    backgroundColor: "#fff",    color: "#333",  }}  variant="contained"  color="primary">
          <Search />
        </Button>
      </Box>
      <Box my={2} sx={{ width: "100%" }}>
        <DataGrid  rows={filteredData}  getRowId={(row) => row.id}  columns={columns.map((key) => {    return {      field: key.toLowerCase(),      headerName: key.toUpperCase(),      width: 200,    };  })}  onRowClick={handleClick}  initialState={{    pagination: { paginationModel: { pageSize: 25 } },  }}  pageSizeOptions={[25, 50, 100]}/>
      </Box>
    </>
  );
}

export default SourceList;
