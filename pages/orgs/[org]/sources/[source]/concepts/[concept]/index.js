import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Button,
  Chip,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  TablePagination,
  Paper,
} from "@mui/material";
import Link from "next/link";
import {
  getConceptDetail,
  getConceptVersions,
  getConceptRelated,
} from "../../../../../../api/conceptDetail";

function ConceptDetail() {
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { org, source, concept } = router.query;
  const {
    data: conceptDetail,
    isError,
    isLoading,
  } = getConceptDetail(org, source, concept);
  const {
    data: conceptVersions,
    isError: versionfetchError,
    isLoading: versionfetchLoading,
  } = getConceptVersions(org, source, concept); // TODONE: get concept versions
  const {
    data: conceptRelated,
    isError: relatedfetchError,
    isLoading: relatedfetchLoading,
  } = getConceptRelated(org, source, concept); // TODONE: get concept relatives

  const childConcepts = []; // TODO: get child concepts
  const parentConcepts = []; // TODO: get parent concepts

  const [synonymsDialogOpen, setSynonymsDialogOpen] = React.useState(false);
  const [descriptionsDialogOpen, setDescriptionsDialogOpen] =
    React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - conceptDetail.mappings.length)
      : 0;
  const attributesCount = conceptDetail?.extras
    ? Object.keys(conceptDetail.extras).length
    : 0;

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
        <title>
          MOH KNHTS | {org}/{source}/{concept}
        </title>
        <meta name="description" content="MOH KNHTS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2,
        }}
      >
        {/* --------- <Main ---------- */}
        <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
          <Box maxWidth={1280} sx={{ width: "100%" }}>
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
              {" "}
              &larr; Back{" "}
            </button>
          </Box>
          <Box
            className="breadcrumb-container"
            sx={{
              my: { xs: 1, md: 2 },
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
              color: "#3d6393",
              fontSize: "0.9em",
            }}
          >
            {" "}
            {/* breadcrumb: org > source > domain > subdomain > concept */}
            <Link
              href={`/orgs/${org}/sources/`}
              style={{ textDecoration: "none", color: "#1651B6" }}
              title="Org"
              className="breadcrumb-item"
            >
              {" "}
              {org}{" "}
            </Link>
            <Link
              href={`/orgs/${org}/sources/${source}`}
              style={{ textDecoration: "none", color: "#1651B6" }}
              title="Source"
              className="breadcrumb-item"
            >
              {" "}
              {source}{" "}
            </Link>
            <span
              title="Concept ID"
              className="breadcrumb-item"
              style={{ textDecoration: "none", color: "#777" }}
            >
              {" "}
              {conceptDetail.id} | {conceptDetail.concept_class} |{" "}
              {conceptDetail.datatype}
            </span>
          </Box>

          {/* Names */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, my: 2 }}>
            <Typography
              variant="h5"
              m={0}
              align="left"
              fontWeight={"bold"}
              color="text.primary"
              gutterBottom
            >
              <span style={{ color: "#3d6393" }}>{conceptDetail.id}</span>{" "}
              {conceptDetail.display_name}{" "}
            </Typography>
            <div>
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  setSynonymsDialogOpen(true);
                }}
                style={{
                  background: "transparent",
                  width: "auto",
                  border: 0,
                  color: "#1651B6",
                  padding: 0,
                }}
              >
                View other names / synonyms
              </button>
              <Dialog
                onClose={() => setSynonymsDialogOpen(false)}
                open={synonymsDialogOpen}
              >
                <div style={{ padding: 10 }}>
                  <h4>Synonyms</h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      my: 2,
                    }}
                  >
                    {conceptDetail?.names?.map((name, index) => {
                      return (
                        <p key={index} style={{ margin: 0 }}>
                          {" "}
                          <em style={{ color: "#777", margin: "0 5px 0 0" }}>
                            [{name.index}]
                          </em>{" "}
                          <b>{name.uuid}</b> {name.name}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </Dialog>
            </div>
          </Box>

          {/* Descriptions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, my: 3 }}>
            <Typography
              variant="h6"
              m={0}
              align="left"
              fontWeight={"bold"}
              color="text.primary"
              gutterBottom
            >
              Description
            </Typography>
            {conceptDetail?.descriptions &&
            conceptDetail?.descriptions?.length > 0 ? (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 0, my: 3 }}
              >
                {(
                  [
                    conceptDetail.descriptions.filter(
                      (c) => c?.locale == conceptDetail.display_locale
                    )[0],
                  ] || [conceptDetail.descriptions[0]]
                )?.map((description, index) => {
                  return (
                    <p key={index} style={{ margin: 0 }}>
                      {" "}
                      <em style={{ color: "#777", margin: "0 5px 0 0" }}>
                        [{description.locale}]
                      </em>{" "}
                      {description.description}
                    </p>
                  );
                })}
                <div style={{ marginTop: "4px" }}>
                  <button
                    onClick={(ev) => {
                      ev.preventDefault();
                      setDescriptionsDialogOpen(true);
                    }}
                    style={{
                      background: "transparent",
                      width: "auto",
                      border: 0,
                      color: "#1651B6",
                      padding: 0,
                    }}
                  >
                    View other descriptions
                  </button>
                  <Dialog
                    onClose={() => setDescriptionsDialogOpen(false)}
                    open={descriptionsDialogOpen}
                  >
                    <div style={{ padding: 10 }}>
                      <h4>Descriptions</h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0,
                          my: 2,
                        }}
                      >
                        {conceptDetail?.descriptions?.map(
                          (description, index) => {
                            return (
                              <p key={index} style={{ margin: "10px 0" }}>
                                {" "}
                                <em
                                  style={{ color: "#777", margin: "0 5px 0 0" }}
                                >
                                  {" "}
                                  [{description.locale}]{" "}
                                </em>{" "}
                                <b>{description.uuid}</b>{" "}
                                {description.description}
                              </p>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </Dialog>
                </div>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  px: 1,
                  color: "#777",
                }}
              >
                <p style={{ margin: "5px 0" }}> None </p>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, my: 3 }}>
            <Typography
              variant="h6"
              m={0}
              align="left"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
            >
              Attributes ({attributesCount})
            </Typography>
            {attributesCount > 0 ? (
              <TableContainer component={Paper} sx={{ my: 2, maxWidth: 600 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <Typography fontWeight="bold" color="primary">
                          Attribute
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color="primary">
                          Value
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(conceptDetail?.extras).map((key, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: "500",
                            color: "text.secondary",
                          }}
                        >
                          {key.split("_").join(" ")}
                        </TableCell>
                        <TableCell>
                          {typeof conceptDetail?.extras[key] === "string" ||
                          typeof conceptDetail?.extras[key] === "number" ||
                          typeof conceptDetail?.extras[key] === "boolean" ? (
                              typeof conceptDetail?.extras[key] === "string"
                                && conceptDetail?.extras[key]?.startsWith("http") ? (
                              <a
                                href={conceptDetail?.extras[key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  textDecoration: "none",
                                  color: "#1651B6",
                                }}
                              >
                                {conceptDetail?.extras[key]}
                              </a>
                            ) : (
                              <Typography color="textPrimary">
                                {conceptDetail?.extras[key]}
                              </Typography>
                            )
                          ) : (
                            <Box
                              component="code"
                              sx={{
                                fontSize: "0.8em",
                                whiteSpace: "break-spaces",
                                display: "block",
                                backgroundColor: "#f2efe9",
                                padding: "0.5em",
                                borderRadius: "5px",
                                margin: "0.5em 0",
                              }}
                            >
                              {JSON.stringify(
                                conceptDetail?.extras[key],
                                null,
                                2
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  px: 1,
                  color: "#777",
                }}
              >
                <p style={{ margin: "5px 0" }}>None</p>
              </Box>
            )}
          </Box>

          {/* Relationships */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                m={0}
                align="left"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                Relationships / Associated
              </Typography>
            </Box>
            {conceptDetail?.mappings && conceptDetail?.mappings.length > 0 ? (
              <>
                <TableContainer>
                  <Table size="small" sx={{ border: "1px solid #D1EEF3" }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#D1EEF3" }}>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "PrimaryText" }}
                        >
                          Relationship
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "PrimaryText" }}
                        >
                          Code
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "PrimaryText" }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: "bold", color: "PrimaryText" }}
                        >
                          Source
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {conceptDetail.mappings
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((entry, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}
                          >
                            <TableCell>{entry.map_type}</TableCell>
                            <TableCell
                              onClick={(ev) => {
                                ev.preventDefault();
                                router.push(
                                  `/orgs/${org}/sources/${source}/concepts/${entry.to_concept_code}`
                                );
                              }}
                              sx={{ color: "#1651B6", cursor: "pointer" }}
                            >
                              {entry.to_concept_code}
                            </TableCell>
                            <TableCell
                              onClick={(ev) => {
                                ev.preventDefault();
                                router.push(
                                  `/orgs/${org}/sources/${source}/concepts/${entry.to_concept_code}`
                                );
                              }}
                              sx={{ color: "#1651B6", cursor: "pointer" }}
                            >
                              {entry.to_concept_name}
                            </TableCell>
                            <TableCell
                              onClick={(ev) => {
                                ev.preventDefault();
                                router.push(`/orgs/${org}/sources/${source}`);
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              {entry.to_source_name}
                            </TableCell>
                          </TableRow>
                        ))}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={conceptDetail.mappings.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  px: 1,
                  color: "#777",
                }}
              >
                <Typography variant="body1">None</Typography>
              </Box>
            )}
          </Box>

          {/* Memberships */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, my: 3 }}>
            <Typography
              variant="h6"
              m={0}
              align="left"
              fontWeight={"bold"}
              color="text.primary"
              gutterBottom
            >
              {" "}
              Memberships{" "}
            </Typography>
            {/* TODO */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                px: 1,
                color: "#777",
              }}
            >
              <p style={{ margin: "5px 0" }}> None </p>
            </Box>
          </Box>

          {/* Versions */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0, my: 3 }}>
            <Typography
              variant="h6"
              m={0}
              align="left"
              fontWeight={"bold"}
              color="text.primary"
              gutterBottom
            >
              {" "}
              Concept versions{" "}
            </Typography>
            {conceptVersions?.length > 0 ? (
              conceptVersions?.map((version, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      margin: "7px 0",
                    }}
                  >
                    {index + 1}.{" "}
                    <Chip
                      size="small"
                      variant="filled"
                      color="primary"
                      label={version?.uuid}
                      onClick={(ev) => {
                        ev.preventDefault();
                        // router.push(
                        //     `/orgs/${org}/sources/${source}/concepts/${concept}/${version?.uuid}`
                        // );
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  px: 1,
                  color: "#777",
                }}
              >
                <p style={{ margin: "5px 0" }}> None </p>
              </Box>
            )}
          </Box>
        </Box>
        {/* --------- Main/> --------- */}

        {/* --------- <Sidebar ---------- */}
        <Box
          sx={{
            py: { xs: 2, md: 4 },
            px: { xs: 1, md: 2 },
            mt: { xs: 1, md: 3 },
            borderTop: { xs: "1px solid #ccc", md: "none" },
            borderLeft: { xs: "none", md: "1px solid #AF3CAD" },
          }}
        >
          <Typography
            variant="h6"
            m={0}
            align="left"
            fontWeight={"bold"}
            color="text.primary"
            gutterBottom
          >
            Related concepts
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    Code
                  </TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    Concept
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conceptRelated?.entry?.entries
                  ?.filter((c) => c?.type?.toLocaleLowerCase() == "concept")
                  ?.map((concept, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{concept.id}</TableCell>
                        <TableCell>
                          <Link
                            href={`/orgs/${org}/sources/${source}/concepts/${concept.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            {concept.display_name ||
                              concept.cascade_target_concept_name}
                          </Link>
                          {concept?.entries?.length > 0 && (
                            <details>
                              <summary>Children</summary>
                              {concept?.entries?.map((child, index2) => {
                                return (
                                  <Box key={"c-" + index2} sx={{ ml: 2 }}>
                                    {index2 + 1}.{" "}
                                    <Link
                                      className="text-sky-700"
                                      href={`/orgs/${org}/sources/${source}/concepts/${child.id}`}
                                      style={{ textDecoration: "none" }}
                                    >
                                      {child?.id}{" "}
                                      {child.display_name ||
                                        child.cascade_target_concept_name}
                                    </Link>
                                  </Box>
                                );
                              })}
                            </details>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {/* --------- Sidebar/> ---------- */}
      </Box>
    </>
  );
}

export default ConceptDetail;
