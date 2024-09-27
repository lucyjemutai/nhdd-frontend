import React, { useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, TextField, Typography } from "@mui/material";

const CollectionDetailPage = ({ collection }) => {
  const [newConcept, setNewConcept] = useState("");
  const [concepts, setConcepts] = useState(collection.concepts || []);

  const handleAddConcept = () => {
    if (newConcept) {
      setConcepts((prev) => [...prev, newConcept]);
      setNewConcept("");
    }
  };

  return (
    <Box>
      <Typography variant="h4">{collection.name}</Typography>
      <Typography variant="h6">Concepts:</Typography>
      
      {concepts.length > 0 ? (
        <ul>
          {concepts.map((concept, index) => (
            <li key={index}>{concept}</li>
          ))}
        </ul>
      ) : (
        <Typography>No concepts available.</Typography>
      )}

      <TextField
        label="Add New Concept"
        value={newConcept}
        onChange={(e) => setNewConcept(e.target.value)}
      />
      <Button onClick={handleAddConcept} variant="contained" color="primary">
        Add Concept
      </Button>
    </Box>
  );
};

export default CollectionDetailPage;
