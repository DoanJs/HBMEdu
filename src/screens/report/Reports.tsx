import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch, getCardTheme } from "../../constants/info";
import { ReportModel, UserModel } from "../../models";
import {
  useReportStore,
  useSelectNavbarStore,
  useTeacherStore,
} from "../../zustand";
import "./report.css";

export default function ApprovedReportBootstrapGreen() {
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const { reports } = useReportStore();
  const [reportNews, setReportNews] = useState<ReportModel[]>([]);
  const { setSelectNavbar } = useSelectNavbarStore();
  const { teachers } = useTeacherStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [teachers]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "approved");
      setReportNews(items);
    }
  }, [reports]);

  const filteredReports = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return reportNews.filter((item: any) => {
      const teacherName = teacherMap[item.authorId] || "";

      const createdTime = formatDateSearch(item.createAt);
      const updatedTime = formatDateSearch(item.updateAt);

      const content = `
      ${item.title ?? ""}
      ${item.id ?? ""}
      ${teacherName}
      ${createdTime}
      ${updatedTime}
    `.toLowerCase();

      return !search || content.includes(search);
    });
  }, [reportNews, keyword, teacherMap]);
  function PlanCard({ plan }: any) {
    const teacherName =
      teachers.find((_: UserModel) => _.id === plan.authorId)?.fullName || "";
    const theme = getCardTheme(plan.id);
    return (
      <Link
        to="../plandetail"
        onClick={() => setSelectNavbar("")}
        state={{ plan }} className="container-fluid py-4 text-decoration-none cursor-pointer">
        <div className="row g-4">
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3 position-relative"
          >
            <div className="plan-kh-badge">
              <img
                src="/logo512.png"
                alt=""
                className="plan-kh-badge-img"
              />
            </div>
            <div
              className="plan-kh-card"
              style={{ background: theme.bg }}
            >


              <div className="plan-kh-glass" />
              <div className="d-flex justify-content-between align-items-start">
                <div
                  className="plan-kh-title"
                  style={{ color: theme.color }}
                >
                  {plan.type} {plan.title}
                </div>

                <span className="status-approved flex-shrink-0">
                  <i className="bi bi-patch-check-fill me-1" />
                  {plan.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                </span>
              </div>


              <div className="plan-kh-info">
                <i className="bi bi-send-check-fill icon-yellow" /> Ngày tạo:&ensp;
                {typeof plan?.createAt === "number"
                  ? moment(plan?.createAt).format("HH:mm:ss DD/MM/YYYY")
                  : moment(handleTimeStampFirestore(plan?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
              </div>

              <div className="plan-kh-info">
                <i className="bi bi-calendar-heart icon-red" /> Ngày duyệt:&ensp;
                {typeof plan?.updateAt === "number"
                  ? moment(plan?.updateAt).format("HH:mm:ss DD/MM/YYYY")
                  : moment(handleTimeStampFirestore(plan?.updateAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
              </div>

              <div className="plan-kh-info">
                <i className="bi bi-person-check-fill me-1 icon-red" /> Gv thực hiện :
              </div>

              <div className="plan-kh-footer">
                <div className="plan-teacher-box">
                  <img
                    className="plan-avatar"
                    src="https://i.pravatar.cc/40"
                    alt=""
                  />
                  <span>
                    {teacherName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  function ReportCard({ report }: any) {
    const teacherName =
      teachers.find((_: UserModel) => _.id === report.authorId)?.fullName || "";

    const theme = getCardTheme(report.id);

    return (
      <Link
        to="../reportdetail"
        onClick={() => setSelectNavbar("")}
        state={{ report }}
        className="container-fluid py-4 text-decoration-none cursor-pointer">
        <div className="row g-4">
          <div
            className="col-12 col-sm-6 col-lg-4 col-xl-3 position-relative"
          >
            <div className="report-kh-badge">
              <img
                src="/logo512.png"
                alt=""
                className="report-kh-badge-img"
              />
            </div>
            <div
              className="report-kh-card"
              style={{ background: theme.bg }}
            >


              <div className="report-kh-glass" />
              <div className="d-flex justify-content-between align-items-start">
                <div
                  className="report-kh-title"
                  style={{ color: theme.color }}
                >
                  {report.type} {report.title}
                </div>

                <span className="status-approved flex-shrink-0">
                  <i className="bi bi-patch-check-fill me-1" />
                  {report.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                </span>
              </div>


              <div className="report-kh-info">
                <i className="bi bi-send-check-fill icon-yellow" /> Ngày tạo:&ensp;
                {typeof report?.createAt === "number"
                  ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
                  : moment(handleTimeStampFirestore(report?.createAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
              </div>

              <div className="report-kh-info">
                <i className="bi bi-calendar-heart icon-red" /> Ngày duyệt:&ensp;
                {typeof report?.updateAt === "number"
                  ? moment(report?.updateAt).format("HH:mm:ss DD/MM/YYYY")
                  : moment(handleTimeStampFirestore(report?.updateAt)).format(
                    "HH:mm:ss DD/MM/YYYY",
                  )}
              </div>

              <div className="report-kh-info">
                <i className="bi bi-person-check-fill me-1 icon-red" /> Gv thực hiện :
              </div>

              <div className="report-kh-footer">
                <div className="report-teacher-box">
                  <img
                    className="report-avatar"
                    src="https://i.pravatar.cc/40"
                    alt=""
                  />
                  <span>
                    {teacherName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (!reports) return <SpinnerComponent />;
  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Báo cáo can thiệp
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Danh sách báo cáo theo tháng của trẻ đã được duyệt
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            <Link
              to={"../addreport"}
              onClick={() => setSelectNavbar("")}
              className="btn action-btn-primary"
            >
              <i className="bi bi-plus-circle-fill me-2" />
              Tạo báo cáo mới
            </Link>
          </div>
        </div>

        <div className="page-panel p-3 p-md-4 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-12">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm mã báo cáo, tên báo cáo"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="page-panel p-5 text-center text-green-muted">
            <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
            Không tìm thấy báo cáo phù hợp.
          </div>
        ) : <div className="row g-3 g-xl-4">
          {filteredReports.map((report) => (
              <ReportCard report={report} key={`report-${report.id}-index`}/>
          ))}
        </div>}
      </section>
    </>
  );
}
