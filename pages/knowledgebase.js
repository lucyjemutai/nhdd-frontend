import React, { useState, useEffect, useRef } from "react";
import Footer from "@/components/footer";
import Head from "next/head";

const faqs = [
  {
    question: "1. Who is the target audience for KNHTS?",
    answer:
      "Developers and Data Scientists.<br />- Software developers who are building health-related applications.<br />- Data scientists who analyze health data for insights and research purposes.",
  },
  {
    question: "2. Who owns KNHTS?",
    answer:
      "The KNHTS is owned by the Ministry of Health under the Directorate of Policy, Digital Health and Informatics.",
  },
  {
    question: "3. How is the KNHTS organized/structured?",
    answer:
      "This brings you to the landing page/home page. On this page, there is a search button that allows one to search for concepts from any of the domains.",
  },
  {
    question: "4. How do I sign up/create an account?",
    answer:
      "To login to the system, one needs to have an account. For anybody who needs an account, you need to fill out a form with all the required details.",
  },
  {
    question: "5. How do I search for a concept?",
    answer:
      "On the home page there is a search button which allows you to search for a concept.",
  },
  {
    question:
      "6. Are there any training resources available for understanding and navigating KNHTS?",
    answer:
      "On the home page there is a Resources button which holds all the relevant policy documents and a user guide. To access the documents click on the Resources button.",
  },
  {
    question:
      "7. What is the Kenya National Health Terminology Services (KNHTS) and its purpose?",
    answer:
      "The Kenya National Terminology Service is a registry that provides a standardized and consistent set of health terms, <br />definitions, and concepts that all stakeholders can use to enable the realization of health information exchange and promote efficiency<br /> across systems to communicate effectively, accurately, and unambiguously.<br /><br />Purpose:<br />- This will provide for the collaborative management, publication, versioning, and distribution of standardized data dictionaries and other relevant content.<br />- The National Terminology Services will be implemented across the health sector and accessed by both state and non-state actors.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "left",
          color: "#1651B6",
        }}
        onClick={onClick}
      >
        <div
          style={{
            width: "calc(100% - 30px)",
            marginRight: "10px",
            backgroundColor: "#f2f2f2",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <strong style={{ fontSize: "12px" }}>{faq.question}</strong>
        </div>
        <div>{isOpen ? "▼" : "►"}</div>
      </div>
      {isOpen && (
        <div
          style={{ marginTop: "10px", fontSize: "12px" }}
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        ></div>
      )}
    </div>
  );
};

function KnowledgeBase() {
  const [isFAQVisible, setFAQVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const faqRef = useRef(null);
  const [showMessage, setShowMessage] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleClickOutside = (event) => {
    if (faqRef.current && !faqRef.current.contains(event.target)) {
      setFAQVisible(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isFAQVisible ? "hidden" : "auto";

    if (isFAQVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFAQVisible]);

  const handleComingSoonClick = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <>
      <Head>
        <title>Knowledge Base</title>
        <meta name="description" content="Knowledge Base" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <div style={{ padding: "40px", flex: 1 }}>
          <h1 style={{ color: "#1651B6" }}>Knowledge Base</h1>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "8px",
                width: "30%",
                minHeight: "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h4
                style={{
                  color: "#1651B6",
                  fontStyle: "italic",
                  marginBottom: "20px",
                  fontSize: "1.2em",
                }}
              >
                Current Published Version
              </h4>

              <p style={{ margin: "10px 0", lineHeight: "1.5" }}>
                Version 1.0 is the first published, downloadable iteration of
                the Kenya National Health Terminology Services (KNHTS) data
                dictionary.
                <p></p>
                <br />
                The current version is under review by the Terminology Service
                Committee and the Chief Terminologist to ensure accuracy,
                relevance, and alignment with the latest health policies and
                practices.
                <br />
                <p></p>
                <strong>Contact Information:</strong> For inquiries or feedback
                regarding the data dictionary, please contact the KNHTS support
                team at{" "}
                <a href="mailto:abc@example.com" style={{ color: "#1651B6" }}>
                  abc@example.com
                </a>
                .
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#e8f0fe",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                <h4
                  style={{
                    color: "#1651B6",
                    fontStyle: "italic",
                    margin: "0",
                    flex: "1",
                    fontSize: "1.1em",
                  }}
                >
                  Version 1.0
                </h4>
                <button
                  style={{
                    padding: "8px 15px",
                    fontSize: "0.9em",
                    backgroundColor: "#1651B6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => {
                    alert("Downloading Version 1.0...");
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0e4da4")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1651B6")
                  }
                >
                  Download
                </button>
              </div>
            </div>

            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                width: "30%",
              }}
            >
              <button
                onClick={handleComingSoonClick}
                style={{
                  padding: "10px 15px",
                  fontSize: "1em",
                  backgroundColor: "#1651B6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                {showMessage ? "Drug Interactions" : "Drug Interactions"}
              </button>

              {showMessage && (
                <div style={{ marginTop: "10px", color: "#1651B6" }}>
                  Coming Soon
                </div>
              )}
              <img
                src="/assets/images/tabs.png"
                alt="FAQs"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "5px",
                }}
              />
            </div>
            <div
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
                width: "30%",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => setFAQVisible(!isFAQVisible)}
                style={{
                  padding: "10px 15px",
                  fontSize: "1em",
                  backgroundColor: "#1651B6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: "10px",
                }}
              >
                {isFAQVisible ? "Hide FAQs" : "Show FAQs"}
              </button>
              <img
                src="/assets/images/faq.png"
                alt="FAQs"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        </div>

        {isFAQVisible && (
          <div
            ref={faqRef}
            style={{
              position: "fixed",
              bottom: "50px",
              right: "10px",
              width: "30%",
              backgroundColor: "#f9f9f9",
              padding: "10px",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.1)",
              zIndex: 1000,
              maxHeight: "55%",
              overflowY: "auto",
            }}
          >
            <h4>FAQs</h4>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default KnowledgeBase;
