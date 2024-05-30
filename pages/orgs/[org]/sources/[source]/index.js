import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Button,
  Checkbox,
  MenuItem,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import { getSourceConcepts } from "../../../../../pages/api/sources";
import Head from "next/head";
import { SearchRounded } from "@mui/icons-material";
import { formatdDate, doGetSession } from "@/utilities";

function SourceConcepts() {
  const router = useRouter();
  const { source, org } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [total_pages, setTotalPages] = useState(1);
  const [rows_per_page, setRowsPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState("csv");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };
  const handleDownload = () => {
    if (downloadFormat === "csv") {
      const selectedData = data.filter((row) => selectedRows.includes(row.id));

      const csvContent = [
        [
          "ID",
          "Display Name",
          "Concept Class",
          "Datatype",
          "Source",
          "Retired",
          "Version Created On",
          "Version Updated On",
        ],
        ...selectedData.map((entry) => [
          entry.id,
          entry.display_name,
          entry.concept_class,
          entry.datatype,
          entry.source,
          entry.retired,
          formatdDate(entry.version_created_on),
          formatdDate(entry.version_updated_on),
        ]),
      ]
        .map((e) => e.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "selected_rows.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (downloadFormat === "json") {
      const selectedData = data.filter((row) => selectedRows.includes(row.id));
      const jsonData = JSON.stringify(selectedData, null, 2);

      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "selected_rows.json");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadAll = async () => {
    try {
      if (downloadFormat === "csv") {
      } else if (downloadFormat === "json") {
        const allData = await fetchAllConcepts();
        const jsonData = JSON.stringify(allData, null, 2);

        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "all_concepts.json");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading all concepts:", error);
    }
  };

  const fetchAllConcepts = async () => {
    let allData = [];
    let currentPage = 1;
    let totalPages = 1;
    while (currentPage <= totalPages) {
      const response = await fetch(
        `${API_BASE_URL}/orgs/${org}/sources/${source}/concepts/?limit=${rows_per_page}&page=${currentPage}&verbose=false&includeRetired=false`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to download page ${currentPage}: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      allData.push(...data);
      totalPages = parseInt(response.headers.get("pages")) || 1; // Update total pages

      currentPage++;
    }

    return allData;
  };

  const columns = [
    { field: "select", headerName: "Select", width: 100 },
    { field: "id", headerName: "ID", width: 100 },
    { field: "display_name", headerName: "Display Name", width: 200 },
    { field: "concept_class", headerName: "Concept Class", width: 150 },
    { field: "datatype", headerName: "Datatype", width: 150 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "retired", headerName: "Retired", width: 100 },
    {
      field: "version_created_on",
      headerName: "Version Created On",
      width: 200,
    },
    {
      field: "version_updated_on",
      headerName: "Version Updated On",
      width: 200,
    },
  ];
  const handleClick = (params) => {
    const rowId = params.id;

    router.push(params.row.url);
    // router.push(`/orgs/${params?.row?.owner}/sources/${params?.row?.source}/concepts/${rowId}`);
  };
  const filterConcepts = (term) => {
    const search_url = `/search?q=${term}&owner=${org}&source=${source}`;
    router.push(search_url);
  };

  const fetchConcepts = () => {
    setIsLoading(true);
    let url = `${API_BASE_URL}/orgs/${org}/sources/${source}/concepts/?limit=${rows_per_page}&page=${page}&verbose=false&includeRetired=false`;
    fetch(url)
      .then((d) => {
        const conceptspagecount = d.headers.get("pages") ?? 1;
        const conceptspagesize = d.headers.get("num_returned") ?? 25;
        const conceptscurrentpage = d.headers.get("page_number") ?? 1;
        setTotalPages(conceptspagecount ?? 1);
        setRowsPerPage(conceptspagesize ?? 25);
        setPage(conceptscurrentpage ?? 1);

        // console.log('pages:', conceptspagecount, 'size:', conceptspagesize, 'current:', conceptscurrentpage);
        return d.json();
      })
      .then((data) => {
        if (data) {
          setData(data);
        }
      })
      .catch((err) => {
        setIsError(true);
        setError(err.message);
        console.error("error::", err);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const sessionData = await doGetSession();
      setIsLoggedIn(sessionData !== null);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchConcepts();
    }
    return () => {
      mounted = false;
    };
  }, [router.query, page]);

  return (
    <>
      <Head>
        <title>MOH KNHTS | Source - {source}</title>
        <meta name="description" content="MOH KNHTS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error ?? "Error fetching data, please retry."}
          </Alert>
        </Stack>
      ) : data ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: { xs: "100%", md: "99vw" },
          }}
        >
          <Box
            sx={{ width: "100%", py: { xs: 2, md: 2 }, px: { xs: 1, md: 2 } }}
          >
            <Box
              sx={{
                bgcolor: "white",
                width: "100%",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                style={{
                  background: "transparent",
                  width: "auto",
                  border: 0,
                  color: "#777",
                  padding: 0,
                }}
                onClick={(ev) => {
                  ev.preventDefault();
                  router.back();
                }}
              >
                &larr; Back
              </button>
              <Typography
                variant="h5"
                m={0}
                align="left"
                fontWeight={"bold"}
                color="text.primary"
                gutterBottom
              >
                Source: {source}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="outlined-basic"
                  label="Search source"
                  size="small"
                  variant="outlined"
                  sx={{ width: "100%", maxWidth: 500 }}
                  onChange={(e) => {
                    let term = e.target.value;
                    setSearchTerm(term);
                  }}
                />
                <Button
                  variant="outlined"
                  size="large"
                  color="inherit"
                  sx={{ ml: 1 }}
                  onClick={(ev) => {
                    filterConcepts(searchTerm);
                  }}
                >
                  {" "}
                  <SearchRounded />{" "}
                </Button>
              </Box>
            </Box>
            <hr />

            <Box
              sx={{ flexGrow: 1, backgroundColor: "white", padding: "16px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Concepts Table
                </Typography>
                {isLoggedIn && (
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Select
                      value={downloadFormat}
                      onChange={(e) => setDownloadFormat(e.target.value)}
                      displayEmpty
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="csv">CSV</MenuItem>
                      <MenuItem value="json">JSON</MenuItem>
                    </Select>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDownload}
                      disabled={selectedRows.length === 0}
                    >
                      Download Selected
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleDownloadAll}
                    >
                      Download All Concepts
                    </Button>
                  </Box>
                )}
              </Box>

              <div style={{ width: "100%" }}>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ backgroundColor: "#D1EEF3" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          #
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Select
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Display Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Concept Class
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Datatype
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Source
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Retired
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Version Created On
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            textTransform: "uppercase",
                          }}
                        >
                          Version Updated On
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow
                          key={row.id}
                          onClick={() => handleClick({ id: row.id, row: row })}
                          sx={{
                            backgroundColor:
                              index % 2 === 0 ? "rgba(0, 0, 0, 0.04)" : "white",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.1)",
                            },
                            ...(selectedRows.includes(row.id) && {
                              backgroundColor: "#ECF8F8",
                            }),
                          }}
                        >
                          <TableCell>
                            {page > 1
                              ? (page - 1) * rows_per_page + (index + 1)
                              : index + 1}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(row.id)}
                              onChange={() => handleSelect(row.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.display_name}</TableCell>
                          <TableCell>{row.concept_class}</TableCell>
                          <TableCell>{row.datatype}</TableCell>
                          <TableCell>{row.source}</TableCell>
                          <TableCell>{row.retired}</TableCell>
                          <TableCell>
                            {formatdDate(row.version_created_on)}
                          </TableCell>
                          <TableCell>
                            {formatdDate(row.version_updated_on)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination
                  count={parseInt(total_pages)}
                  page={parseInt(page)}
                  onChange={(event, value) => {
                    if (value === page) return;
                    setPage(value);
                    // fetchConcepts(pg);
                  }}
                />
              </div>
            </Box>
          </Box>
        </Box>
      ) : null}
    </>
  );
}

export default SourceConcepts;
