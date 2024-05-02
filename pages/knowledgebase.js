import React, { useState } from 'react';
import Footer from '@/components/footer';
import Head from 'next/head';

const faqs = [
    {
        question: "1. What is the Kenya National Health Terminology Services (KNHTS) and its purpose?",
        answer: "The Kenya National Terminology Service is a registry that provides a standardized and consistent set of health terms, <br />definitions, and concepts that all stakeholders can use to enable the realization of health information exchange and promote efficiency<br /> across systems to communicate effectively, accurately, and unambiguously.<br /><br />Purpose:<br />- This will provide for the collaborative management, publication, versioning, and distribution of standardized data dictionaries and other relevant content.<br />- The National Terminology Services will be implemented across the health sector and accessed by both state and non-state actors."
    },
    {
        question: "2. Who is the target audience for KNHTS?",
        answer: "Developers and Data Scientists.<br />- Software developers who are building health-related applications.<br />- Data scientists who analyze health data for insights and research purposes."
    },
    {
        question: "3. Who owns KNHTS?",
        answer: "The KNHTS is owned by the Ministry of Health under the Directorate of Policy, Digital Health and Informatics."
    },
    {
        question: "4. How is the KNHTS organized/structured?",
        answer: "This brings you to the landing page/home page. On this page, there is a search button that allows one to search for concepts from any of the domains."
    },
    {
        question: "5. How do I sign up/create an account?",
        answer: "To login to the system, one needs to have an account. For anybody who needs an account, you need to fill out a form with all the required details."
    },
    {
        question: "6. How do I search for a concept?",
        answer: "On the home page there is a search button which allows you to search for a  concept."
    },
    {
        question: "7. Are there any training resources available for understanding and navigating KNHTS?",
        answer: "On the home page there is a Resources button which holds all the relevant policy documents and a user guide. To access the documents click on the Resources button."
    },
];

const FAQItem = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
            <div
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'left',
                    color: '#1651B6'
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{
                    width: 'calc(80% - 30px)',
                    marginRight: '10px',
                    backgroundColor: '#f2f2f2',
                    padding: '15px',
                    borderRadius: '5px'
                }}>
                    <strong style={{ fontSize: '18px' }}>{faq.question}</strong>
                </div>
                <div>{isOpen ? '▼' : '►'}</div>
            </div>
            {isOpen && <div style={{ marginTop: '10px' }} dangerouslySetInnerHTML={{ __html: faq.answer }}></div>}
        </div>
    );
};

function KnowledgeBase() {
    return (
        <>
            <Head>
                <title>Knowledge Base</title>
                <meta name="description" content="Knowledge Base" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ padding: '40px', borderRadius: '80px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
                        <div>
                            <h1 style={{ color: '#1651B6' }}>Knowledge Base</h1>

                            <p style={{ fontSize: '1.2em', lineHeight: '1.5', textAlign: 'left' }}> Click on each question to view response                               <img
                                src="/assets/images/faq.png"
                                alt="F.A.Q Icon"
                                style={{ width: '80px', height: '60px', marginBottom: '2px' }}
                            /></p>
                            <div style={{ textAlign: 'left' }}>
                                {faqs.map((faq, index) => (
                                    <FAQItem key={index} faq={faq} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </>
    );
}
export default KnowledgeBase;
