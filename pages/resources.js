import React, { useState, useEffect } from "react";
import Footer from "@/components/footer";
import Head from "next/head";
import Link from "next/link";

function ResourcesKnhts() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    // Initialize IndexedDB database
    const request = indexedDB.open("uploadedFilesDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("uploadedFiles", {
        keyPath: "name",
      });
      objectStore.createIndex("name", "name", { unique: true });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("uploadedFiles", "readonly");
      const objectStore = transaction.objectStore("uploadedFiles");
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        setUploadedFiles(event.target.result);
      };
    };
  }, []);

  const handleFileSelect = (event) => {
    const filesArray = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...filesArray]);
  };

  const handleFileUpload = () => {
    if (selectedFiles.length === 0) {
      console.error("No files selected");
      return;
    }

    const request = indexedDB.open("uploadedFilesDB", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("uploadedFiles", "readwrite");
      const objectStore = transaction.objectStore("uploadedFiles");

      selectedFiles.forEach((file) => {
        // Check if file with the same name already exists
        const existingFile = uploadedFiles.find((f) => f.name === file.name);
        if (existingFile) {
          alert(
            `File '${file.name}' already exists. Please choose a different name.`
          );
        } else {
          objectStore.add(file);
        }
      });

      transaction.oncomplete = () => {
        setUploadedFiles([...uploadedFiles, ...selectedFiles]);
        setSelectedFiles([]);
        setUploadSuccess(true);

        setTimeout(() => {
          setUploadSuccess(false);
        }, 3000); // Reset upload success message after 3 seconds
      };
    };
  };

  const handleDeleteFile = (fileName) => {
    const confirmation = window.confirm(
      "Confirm deletion of this file? You won't be able to undo this action."
    );
    if (confirmation) {
      const request = indexedDB.open("uploadedFilesDB", 1);

      request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("uploadedFiles", "readwrite");
        const objectStore = transaction.objectStore("uploadedFiles");

        objectStore.delete(fileName);

        transaction.oncomplete = () => {
          const updatedFiles = uploadedFiles.filter(
            (file) => file.name !== fileName
          );
          setUploadedFiles(updatedFiles);
        };
      };
    }
  };

  return (
    <>
      <Head>
        <title>Resources</title>
        <meta name="description" content="Resources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "80px",
          marginBottom: "80px",
        }}
      >
        <div style={{ textAlign: "left", maxWidth: "1000px" }}>
          <h1 style={{ color: "#1651B6", textAlign: "center" }}>
            The Kenya National Health Terminology Service Resources
          </h1>
          <p style={{ fontSize: "1.2em", lineHeight: "1.5" }}>
            These are a list of resources. Click on each to download or upload a
            new resource:
          </p>
          <ul
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              listStyle: "circle",
              paddingLeft: "30px",
              textAlign: "left",
            }}
          >
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=kenya-national-ehealth-policy-2016-2030.pdf"
                download
              >
                Kenya National eHealth Policy 2016-2030{" "}
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=Kenya Health Sector Strategic Plan 2018-23.pdf"
                download
              >
                Kenya Health Sector Strategic Plan 2018-23{" "}
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=Digital Health Act 15 of 2023.pdf"
                download
              >
                Digital Health Act 15 of 2023{" "}
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=DRAFT KE-NHDD Governance Framework - Dec 5 2023.pdf"
                download
              >
                DRAFT KE-NHDD Governance Framework - Dec 5 2023{" "}
              </Link>
            </li>
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=DRAFT Kenya HIS Certification Framework - Draft 06FEB2017_KJO-edits_clean (3).pdf"
                download
              >
                DRAFT Kenya HIS Certification Framework - Draft
                06FEB2017_KJO-edits_clean{" "}
              </Link>
            </li>
          </ul>
          {uploadError && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              {uploadError}
            </div>
          )}
          <ul
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              listStyle: "circle",
              paddingLeft: "30px",
              textAlign: "left",
            }}
          >
            <li style={{ marginBottom: "20px" }}>
              <Link
                href="/api/file-download/?filename=kenya-national-ehealth-policy-2016-2030.pdf"
                download
              >
                Kenya National eHealth Policy 2016-2030{" "}
              </Link>
            </li>
          </ul>
          <ul
            style={{
              fontSize: "1.2em",
              lineHeight: "1.5",
              listStyle: "circle",
              paddingLeft: "30px",
              textAlign: "left",
            }}
          >
            {uploadedFiles.map((file, index) => (
              <li key={index} style={{ marginBottom: "20px" }}>
                <a href={URL.createObjectURL(file)} download>
                  {file.name}
                </a>
                <button onClick={() => handleDeleteFile(file.name)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {uploadSuccess && (
            <div style={{ color: "green", marginTop: "10px" }}>
              Files uploaded successfully!
            </div>
          )}
          <br />
          <p style={{ fontSize: "1.0em", color: "#777", marginTop: "5px" }}>
            You can also add resources by uploading files.
          </p>

          <input type="file" onChange={handleFileSelect} multiple />
          <button
            onClick={handleFileUpload}
            disabled={selectedFiles.length === 0}
          >
            Upload
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResourcesKnhts;
