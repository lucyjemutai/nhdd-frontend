import React, { useEffect, useState } from "react";
import { getResource } from "@/utilities";
import {
  Box,
  Drawer,
  Typography,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button,
  Search,
  Menu,
  TableContainer,
  TableHead,
  TableBody,
  Table,
  TableRow,
  TableCell,
} from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { ArrowRight, ArrowRightAlt, SearchRounded } from "@mui/icons-material";

function OrgDomainsList() {
  const router = useRouter();
  const { org, domain } = router.query;
  const [domainData, setDomainData] = useState([]);
  const [subDomainData, setSubDomainData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConcepts, setIsLoadingConcepts] = useState(true);
  const [concepts, setConcepts] = useState([]);
  const [currentConcepts, setCurrentConcepts] = useState([]);
  const [selectedSubdomain, setSelectedSubdomain] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [total_pages, setTotalPages] = useState(1);
  const indexOfLastConcept = page * rowsPerPage;
  const indexOfFirstConcept = indexOfLastConcept - rowsPerPage;
  const [searchTerm, setSearchTerm] = useState("");
  const [source, setSource] = useState("");

  const [subdomainMenuAnchor, setSubdomainMenuAnchor] = useState(null);
  const subdomainMenuOpen = Boolean(subdomainMenuAnchor);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchConcepts = (subdomain) => {
    setIsLoadingConcepts(true);
    setIsLoading(true);
    //let url = "/api/concepts/?q="; //    ?domain=' + domain;
    let url = "/api/concepts/"; //    ?domain=' + domain;
    if (subdomain) url = url + "?subdomainurl=" + subdomain + "&page=" + page;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          let filteredConcepts = data?.concepts?.filter(
            (concept) => concept.type === "Concept"
          );
          setConcepts(filteredConcepts);
          setCurrentConcepts(filteredConcepts);

          setTotalPages(data?.data?.conceptsMeta?.pagecount ?? 1);
          setRowsPerPage(data?.data?.conceptsMeta?.pagesize ?? 20);
          setPage(data?.data?.conceptsMeta?.currentpage ?? 1);
        }
      })
      .catch((err) => {
        console.error("error::", err);
      })
      .finally(() => {
        setIsLoadingConcepts(false);
        setIsLoading(false);
      });
  };
  const onSubdomainClick = (subdomain) => {
    setPage(1);
    setRowsPerPage(20);
    setTotalPages(1);
    setSelectedSubdomain(subdomain.url);
    fetchConcepts(subdomain.url, 1);
  };

  const handlePerPageChange = (event) => {
    const perPageValue = parseInt(event.target.value, 10);
    setRowsPerPage(perPageValue);
    setPage(1);
  };

  const filterConcepts = (term) => {
    // go to /search?q=searchTerm&owner=org
    const search_url = `/search?q=${term}&owner=${domainData?.data?.owner}&source=${domainData?.data?.id}`;
    router.push(search_url);
  };

  const fetchDomainData = (page = 1) => {
    // Check if the domain ID is `hpt-non-pharmaceuticals` or `hpt-pharmaceuticals`
    let cascadeUrl = null;

    if (domain === "hpt-non-pharmaceuticals") {
      // Use cascade query URL for HPT-non-pharmaceuticals
      cascadeUrl = `${API_BASE_URL}/orgs/MOH-KENYA/sources/PPB/concepts/10-00000-02/$cascade/?cascadeLevels=1&method=sourceToConcepts&view=hierarchy&reverse=true&includeRetired=false`;
    } else if (domain === "hpt-pharmaceuticals") {
      // Use cascade query URL for HPT-pharmaceuticals
      cascadeUrl = `${API_BASE_URL}/orgs/MOH-KENYA/sources/PPB/concepts/10-00000-01/$cascade/?cascadeLevels=1&method=sourceToConcepts&view=hierarchy&reverse=true&includeRetired=false`;
    }

    if (cascadeUrl) {
      fetch(cascadeUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data && data.entry) {
            // Set subdomains from API response
            const dynamicSubdomains = data.entry.entries.map((entry) => ({
              id: entry.id,
              display_name: entry.display_name,
              url: entry.url,
            }));

            setSubDomainData(dynamicSubdomains);

            if (dynamicSubdomains.length > 0) {
              setSelectedSubdomain(dynamicSubdomains[0].url);
              fetchConcepts(dynamicSubdomains[0].url);
            }
            const filteredConcepts = data?.entry?.entries?.filter(
              (concept) => concept.type === "Concept"
            );
            setConcepts(filteredConcepts);
            setCurrentConcepts(filteredConcepts);
            setIsLoadingConcepts(false);
          } else {
            setSubDomainData([]);
          }
        })
        .catch((err) => {
          console.error("error::", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Default data fetching for other domains
      fetch("/api/domains/" + domain + "?includeConcepts=true&page=" + page)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            setDomainData(data);
            setSubDomainData(data.data?.subdomains); // Set default subdomains
            let filteredConcepts = data?.data?.concepts?.filter(
              (concept) => concept.type === "Concept"
            );
            if (data?.data?.subdomains && data?.data?.subdomains.length > 0) {
              setSelectedSubdomain(data?.data?.subdomains[0]?.url);
              fetchConcepts(data?.data?.subdomains[0]?.url);
            } else {
              setConcepts(filteredConcepts);
              setCurrentConcepts(filteredConcepts);
              setIsLoadingConcepts(false);
            }
            setTotalPages(data?.data?.conceptsMeta?.pagecount ?? 1);
            setRowsPerPage(data?.data?.conceptsMeta?.pagesize ?? 20);
            setPage(data?.data?.conceptsMeta?.currentpage ?? 1);
          }
        })
        .catch((err) => {
          console.error("error::", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    let mounted = true;

    if (mounted && domain) {
      fetchDomainData(1);
    }

    return () => (mounted = false);
  }, [router.query]);
  return (
    <>
      <Head>
        <title>MOH KNHTS | Domain - {domain}</title>
        <meta name="description" content="MOH KNHTS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {isLoading ? (
        <Box
          sx={{
            width: "100%",
            height: "96vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: { xs: "100%", md: "98vw" },
          }}
        >
          <Box sx={{ width: "100%", py: 1, px: { xs: 1, md: 2 } }}>
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
                variant="h4"
                m={0}
                align="left"
                fontWeight={"bold"}
                color="text.primary"
                gutterBottom
                marginRight={4}
              >
                {domainData?.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  id="outlined-basic"
                  label="Search domain"
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
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 2fr",
                  md: "1fr 3fr",
                },
                gap: 2,
                width: "100%",
                py: 1,
              }}
            >
              {/* Desktop (sidebar) */}
              {subDomainData?.length > 0 ? (
                <Box>
                  <Box
                    sx={{
                      p: "8px 2px",
                      borderRadius: "5px",
                      display: { xs: "none", sm: "block" },
                    }}
                    className="bg-stone-100"
                  >
                    <Typography
                      variant="h5"
                      sx={{ m: "8px 5px", fontWeight: "bold" }}
                    >
                      Subdomains:{" "}
                    </Typography>
                    <Divider />
                    <List
                      sx={{
                        maxHeight: { xs: "auto", md: "70vh" },
                        overflowY: "auto",
                      }}
                    >
                      {subDomainData?.map((subdomain) => (
                        <ListItem key={subdomain.id} disablePadding>
                          <ListItemButton
                            onClick={() => onSubdomainClick(subdomain)}
                            selected={selectedSubdomain == subdomain.url}
                            sx={{
                              border:
                                selectedSubdomain == subdomain.url
                                  ? "2px solid skyblue"
                                  : "2px solid transparent",
                            }}
                          >
                            <ListItemText
                              sx={{
                                fontSize: "0.75em",
                                color: "text.primary",
                                ":hover": { color: "#1651B6" },
                                fontWeight:
                                  selectedSubdomain == subdomain.url
                                    ? "bold"
                                    : "500",
                              }}
                              primary={subdomain.display_name}
                            />
                            {selectedSubdomain == subdomain.url && (
                              <ArrowRightAlt />
                            )}
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                    <Divider />
                  </Box>
                  {/* Mobile (dropdown) */}
                  <Box
                    sx={{
                      display: { xs: "block", sm: "none" },
                      p: "10px 2px",
                      borderRadius: "5px",
                      width: "100%",
                    }}
                    className="bg-stone-100"
                  >
                    <Typography
                      variant="h6"
                      sx={{ m: "4px 3px", fontWeight: "bold" }}
                    >
                      Subdomains:{" "}
                    </Typography>
                    <List
                      component="nav"
                      aria-label="Subdomains"
                      sx={{ bgcolor: "background.paper" }}
                    >
                      <ListItemButton
                        id="lock-button"
                        aria-haspopup="listbox"
                        aria-controls="subdomains-menu"
                        aria-label="when device is locked"
                        aria-expanded={subdomainMenuOpen ? "true" : undefined}
                        onClick={(ev) => {
                          setSubdomainMenuAnchor(ev.currentTarget);
                        }}
                      >
                        <ListItemText
                          primary="Select a subdomain:"
                          secondary={
                            subDomainData?.find(
                              (sd) => sd.url === selectedSubdomain
                            )?.display_name || ""
                          }
                        />
                      </ListItemButton>
                    </List>
                    <Menu
                      id="subdomains-menu"
                      subdomainMenuAnchor={subdomainMenuAnchor}
                      open={subdomainMenuOpen}
                      onClose={(ev) => {
                        setSubdomainMenuAnchor(null);
                      }}
                      MenuListProps={{
                        "aria-labelledby": "lock-button",
                        role: "listbox",
                      }}
                    >
                      {subDomainData?.map((subdomain) => (
                        <MenuItem
                          key={subdomain.id}
                          selected={selectedSubdomain == subdomain.id}
                          onClick={() => {
                            onSubdomainClick(subdomain);
                            setSubdomainMenuAnchor(null);
                          }}
                        >
                          {" "}
                          {subdomain.display_name}{" "}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: "10px 2px",
                    borderRadius: "5px",
                    display: { xs: "none", sm: "block" },
                  }}
                  className="bg-stone-100"
                ></Box>
              )}

              <Box
                sx={{
                  padding: "16px",
                  maxHeight: { xs: "auto", md: "75vh" },
                  overflowY: "auto",
                }}
              >
                {isLoadingConcepts ? (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    {currentConcepts && currentConcepts.length > 0 ? (
                      <Box>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{ m: "8px 5px", fontWeight: "bold" }}
                          >
                            {(selectedSubdomain &&
                              subDomainData?.find((sd) => {
                                return sd && sd.id == selectedSubdomain;
                              })?.display_name) ||
                              ""}{" "}
                            Concepts:
                          </Typography>
                        </div>{" "}
                        <Divider />
                        <Box
                          sx={{
                            maxHeight: { xs: "auto", md: "70vh" },
                            overflowY: "auto",
                          }}
                        >
                          <TableContainer>
                            <Table sx={{ fontFamily: "Arial, sans-serif" }}>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#D1EEF3" }}>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    #
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    ID
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    Display Name
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    Concept Class
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    Version
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                      padding: "12px",
                                    }}
                                  >
                                    UUID
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {currentConcepts
                                  ?.filter((c) => c.type === "Concept")
                                  ?.map((concept, index) => (
                                    <TableRow
                                      key={concept.id}
                                      sx={{
                                        ":hover": {
                                          backgroundColor: "#f5f5f5",
                                          cursor: "pointer",
                                        },
                                        transition:
                                          "background-color 0.3s ease",
                                      }}
                                      onClick={() => {
                                        router.push(concept.url);
                                      }}
                                    >
                                      <TableCell
                                        sx={{
                                          padding: "12px",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {/* Added conditional numbering */}
                                        {page > 1
                                          ? (page - 1) * rowsPerPage +
                                            (index + 1)
                                          : index + 1}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          padding: "12px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {concept.id}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          padding: "12px",
                                          fontSize: "1rem",
                                        }}
                                      >
                                        {concept.display_name}
                                      </TableCell>
                                      <TableCell sx={{ padding: "12px" }}>
                                        {concept.concept_class}
                                      </TableCell>
                                      <TableCell sx={{ padding: "12px" }}>
                                        {concept.version}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          padding: "12px",
                                          fontFamily: "monospace",
                                        }}
                                      >
                                        {concept.uuid}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Pagination
                              count={parseInt(total_pages)}
                              page={parseInt(page)}
                              onChange={(event, value) => {
                                // setPage(value)
                                fetchDomainData(value);
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ m: "8px 5px", fontWeight: "semibold" }}
                        >
                          No concepts found
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}

export default OrgDomainsList;
