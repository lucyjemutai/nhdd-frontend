import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const CollectionDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch collection details based on the ID
      fetch(`/api/collections/${id}`)
        .then((res) => res.json())
        .then((data) => setCollection(data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  if (!collection) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{collection.name}</Typography>
      <Typography variant="h6">Owner: {collection.owner}</Typography>
      <Typography variant="body1">Collection Type: {collection.collectionType}</Typography>
      <Typography variant="body2">Created At: {new Date(collection.createdAt).toLocaleString()}</Typography>
      <Typography variant="body2">Concepts: {collection.concepts.join(', ')}</Typography>
    </Box>
  );
};

export default CollectionDetails;
