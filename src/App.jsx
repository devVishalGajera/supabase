import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "./App.css";

const supabase = createClient(
  "https://nesgyxrnwjlpcruwblqf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lc2d5eHJud2pscGNydXdibHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjM3NDAsImV4cCI6MjA2MjA5OTc0MH0.qQWI2rb_jxUn4h68bP4NkyxO7nzQUZq10ALIM8ltfUI"
);

function App() {
  const [emails, setEmails] = useState([]);
  const [page, setPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const pageSize = 10;

  useEffect(() => {
    const fetchEmails = async () => {
      const { data, error } = await supabase.rpc("get_grouped_emails_paginated", {
        page_number: page,
        page_size: pageSize,
      });

      if (error) {
        console.error(error);
        setErrorMessage("Failed to fetch emails.");
      } else {
        setEmails(data || []);
        if ((data || []).length === 0 && page > 1) {
          setErrorMessage("No more records available.");
        } else {
          setErrorMessage("");
        }
      }
    };

    fetchEmails();
  }, [page]);

  const handleNextPage = () => {
    if (emails.length === 0) {
      setErrorMessage("No more records to show.");
    } else {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container">
      <div className="email-viewer">
        <h1 className="title">Email Viewer</h1>
        <ul className="email-list">
          {emails.map((group) => (
            <li
              key={group.thread_id}
              className="email-thread"
            >
              <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  768: { slidesPerView: 1 },
                  1024: { slidesPerView: 1 },
                }}
              >
                {group.emails.map((entry, index) => (
                  <SwiperSlide key={index}>
                    <div className="email-card">
                      <p>
                        <span className="label">Account:</span> {entry.eaccount}
                      </p>
                      <p>
                        <span className="label">From:</span> {entry.from_address_email}
                      </p>
                      <p>
                        <span className="label">Lead:</span> {entry.lead}
                      </p>
                      <p>
                        <span className="label">To:</span> {entry.to_address_email_list}
                      </p>
                      <p>
                        <span className="label">Subject:</span> {entry.subject}
                      </p>
                      <div className="email-body">
                        <span className="label">Body:</span>
                        <div
                          dangerouslySetInnerHTML={{ __html: entry.body_html }}
                          className="body-content"
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* </div> */}
            </li>
          ))}
        </ul>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="pagination">
          <button
            className="pagination-button"
            onClick={handlePreviousPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-number">Page {page}</span>
          <button
            className="pagination-button"
            onClick={handleNextPage}
            disabled={emails.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
