import Helmet from "../../layout/helmet";
import React, { useRef, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Column2D from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
ReactFC.fcRoot(FusionCharts, Column2D, FusionTheme);

const Stats = () => {
  const pdfRef = useRef();
  const downloadPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData, "PNG", imgX, imgY, pdfWidth, pdfHeight);
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const formattedToday =
        dd +
        "-" +
        mm +
        "-" +
        yyyy +
        "(" +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ")";
      pdf.save("DMI-Statistics - " + formattedToday + ".pdf");
    });
  };
  const [totalBlogs, setTotalBlogs] = useState();
  const [totalFaqs, setTotalFaqs] = useState();
  const [totalTestimonials, setTotalTestimonials] = useState();
  const [totalTeams, setTotalTeams] = useState();
  const [totalPortfolios, setTotalPortfolios] = useState();
  const [totalPackages, setTotalPackages] = useState();
  const [totalUsers, setTotalUsers] = useState();
  const [totalFormData, setTotalFormData] = useState();
  const [totalSubscribers, setTotalSubscribers] = useState();

  const fetchBlogData = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/blog/fetch-blog"
    );
    setTotalBlogs(data.length);
  };

  const fetchFaq = async () => {
    const { data } = await axios.get("http://localhost:4001/api/faq/fetch-faq");
    setTotalFaqs(data.length);
  };
  const fetchTestimonial = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/testimonial/fetch-testimonial"
    );
    setTotalTestimonials(data.length);
  };

  const fetchTeam = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/team/fetch-team"
    );
    setTotalTeams(data.length);
  };
  const fetchPortfolio = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/portfolio/fetch-portfolio"
    );
    setTotalPortfolios(data.length);
  };
  const fetchPricing = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/pricing/fetch-pricing"
    );
    setTotalPackages(data.length);
  };
  const fetchUser = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/users/fetch-users"
    );
    setTotalUsers(data.length);
  };
  const fetchFormData = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/contact-form/fetch-contact-form"
    );
    setTotalFormData(data.length);
  };
  const fetchSubscriber = async () => {
    const { data } = await axios.get(
      "http://localhost:4001/api/subscriber/fetch-subscriber"
    );
    setTotalSubscribers(data.length);
  };

  useEffect(() => {
    fetchBlogData();
    fetchFaq();
    fetchTestimonial();
    fetchTeam();
    fetchPortfolio();
    fetchPricing();
    fetchUser();
    fetchFormData();
    fetchSubscriber();
  }, []);

  const chartData = [
    {
      label: "Blogs",
      value: totalBlogs,
    },
    {
      label: "FAQ",
      value: totalFaqs,
    },
    {
      label: "Testimonial",
      value: totalTestimonials,
    },
    {
      label: "Team",
      value: totalTeams,
    },
    {
      label: "Portfolio",
      value: totalPortfolios,
    },
    {
      label: "Packages",
      value: totalPackages,
    },
    {
      label: "Users",
      value: totalUsers,
    },
    {
      label: "Form Data",
      value: totalFormData,
    },
    {
      label: "Subscribers",
      value: totalSubscribers,
    },
  ];
  const chartConfigs = {
    type: "column3d",
    width: "100%",
    height: "600",
    dataFormat: "json",
    dataSource: {
      chart: {
        xAxisName: "Components",
        yAxisName: "Total Number",
        theme: "fusion",
      },
      data: chartData,
    },
  };
  return (
    <>
      <Helmet title="Statistics">
        <div id="services" className="services mt-5" ref={pdfRef}>
          <div className="container">
            <div
              className="section-title aos-init aos-animate"
              data-aos="fade-down"
            >
              <span>DMI - Statistics</span>
              <h2>DMI - Statistics</h2>
            </div>
            <div className="section mb-5">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title mb-4">DMI - Status</h5>
                      <ReactFC {...chartConfigs} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-danger mt-4" onClick={downloadPDF}>
              Download Statistics Report
            </button>
          </div>
        </div>
      </Helmet>
    </>
  );
};

export default Stats;
