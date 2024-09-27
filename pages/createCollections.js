import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const CreateCollectionModal = ({ onCollectionCreated }) => {
  const [open, setOpen] = useState(false);
  const [collectionDetails, setCollectionDetails] = useState({
    id: "",
    short_code: "",
    short_name: "",
    full_name: "",
    owner: "",
    description: "",
    collection_type: "",
    custom_validation_schema: "",
    canonical_url: "",
  });

  const handleOpen = () => {
    setCollectionDetails({
      id: "",
      short_code: "",
      short_name: "",
      full_name: "",
      owner: "",
      description: "",
      collection_type: "",
      custom_validation_schema: "",
      canonical_url: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!collectionDetails.short_code || !collectionDetails.full_name || !collectionDetails.owner) {
      alert("Short Code, Full Name, and Owner are required!");
      return;
    }

    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(collectionDetails),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const createdCollection = await response.json();
      onCollectionCreated(createdCollection);
      handleClose();
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection.");
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Create Collection
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Collection</DialogTitle>
        <DialogContent>
          <Typography variant="h6">Name and Description</Typography>
          <TextField
            label="ID"
            fullWidth
            margin="dense"
            value={collectionDetails.id}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, id: e.target.value })}
            required
          />
          <TextField
            label="Short Code"
            fullWidth
            margin="dense"
            value={collectionDetails.short_code}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, short_code: e.target.value })}
            required
          />
          <TextField
            label="Short Name"
            fullWidth
            margin="dense"
            value={collectionDetails.short_name}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, short_name: e.target.value })}
          />
          <TextField
            label="Full Name"
            fullWidth
            margin="dense"
            value={collectionDetails.full_name}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, full_name: e.target.value })}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={collectionDetails.description}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, description: e.target.value })}
          />
          <TextField
            label="Owner"
            fullWidth
            margin="dense"
            value={collectionDetails.owner}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, owner: e.target.value })}
            required
          />

          <Typography variant="h6" mt={2}>Configuration</Typography>
          <TextField
            label="Collection Type"
            fullWidth
            margin="dense"
            value={collectionDetails.collection_type}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, collection_type: e.target.value })}
            required
          />
          <TextField
            label="Custom Validation Schema"
            fullWidth
            margin="dense"
            value={collectionDetails.custom_validation_schema}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, custom_validation_schema: e.target.value })}
          />
          <TextField
            label="Canonical URL"
            fullWidth
            margin="dense"
            value={collectionDetails.canonical_url}
            onChange={(e) => setCollectionDetails({ ...collectionDetails, canonical_url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateCollectionModal;
