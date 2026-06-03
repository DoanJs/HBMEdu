import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch } from "../../constants/info";
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

  // const filteredReports = useMemo(() => {
  //   const search = keyword.trim().toLowerCase();

  //   return reportNews.filter((item: any) => {
  //     const teacherName = teacherMap[item.authorId] || "";

  //     const content =
  //       `${item.title ?? ""} ${item.id ?? ""} ${teacherName}`.toLowerCase();

  //     return !search || content.includes(search);
  //   });
  // }, [reportNews, keyword, teacherMap]);
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

  function ReportCard({ report }: any) {
    // return (
    //   <article className="plan-card report-card">
    //     <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
    //       <div className="d-flex gap-3 min-w-0">
    //         <div className={`approval-type-box report`}>
    //           <i className={`bi bi-file-earmark-text-fill`} />
    //         </div>
    //         <div className="min-w-0">
    //           <div className="d-flex flex-wrap gap-5 mb-2">
    //             <span className="plan-code">{report.id}</span>
    //             <span className="status-approved">
    //               <i className="bi bi-patch-check-fill me-1" />
    //               {report.status}
    //             </span>
    //           </div>
    //           <h3 className="plan-title">Báo cáo tháng {report.title}</h3>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="row g-2 mb-3">
    //       <div className="col-6">
    //         <div className="mini-info">
    //           <i className="bi bi-person-check-fill icon-red" />
    //           <span>
    //             <b>Giáo viên thực hiện</b>
    //             {
    //               teachers.find((_: UserModel) => _.id === report.authorId)
    //                 ?.fullName
    //             }
    //           </span>
    //         </div>
    //       </div>
    //       <div className="col-6">
    //         <div className="mini-info">
    //           <i className="bi bi-send-check-fill icon-yellow" />
    //           <span>
    //             <b>Ngày gửi</b>
    //             {typeof report?.createAt === "number"
    //               ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
    //               : moment(handleTimeStampFirestore(report?.createAt)).format(
    //                 "HH:mm:ss DD/MM/YYYY",
    //               )}
    //           </span>
    //         </div>
    //       </div>
    //       <div className="col-6">
    //         <div className="mini-info">
    //           <i className="bi bi-calendar-heart icon-red" />
    //           <span>
    //             <b>Ngày duyệt</b>
    //             {typeof report?.updateAt === "number"
    //               ? moment(report?.updateAt).format("HH:mm:ss DD/MM/YYYY")
    //               : moment(handleTimeStampFirestore(report?.updateAt)).format(
    //                 "HH:mm:ss DD/MM/YYYY",
    //               )}
    //           </span>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="d-flex gap-2 mt-3 pt-3"> {/*border-top-soft*/}
    //       <Link
    //         to={"../reportdetail"}
    //         onClick={() => setSelectNavbar("")}
    //         state={{
    //           // title: plan.title,
    //           // planId: plan.id,
    //           report,
    //         }}
    //         className="btn action-btn-soft flex-fill"
    //       >
    //         <i className="bi bi-eye-fill me-2" />
    //         Xem báo cáo
    //       </Link>
    //     </div>
    //   </article>
    // );
  const teacherName =
  teachers.find((_: UserModel) => _.id === report.authorId)?.fullName || "";

return (
  <article className="plan-card report-card">
    <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
      <div className="d-flex gap-3 min-w-0 w-100">
        <div className="approval-type-box report flex-shrink-0">
          <i className="bi bi-file-earmark-text-fill" />
        </div>

        <div className="min-w-0 w-100">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-1">
            <h3 className="plan-title mb-0">
              BC {report.title}
            </h3>

            <span className="status-approved flex-shrink-0">
              <i className="bi bi-patch-check-fill me-1" />
              {report.status}
            </span>
          </div>

          <div className="plan-teacher">
            <i className="bi bi-person-check-fill me-1 icon-red" />
            <b>Giáo viên: </b>
            {teacherName}
          </div>
        </div>
      </div>
    </div>

    <div className="row g-2 mb-3">
      <div className="col-6">
        <div className="mini-info">
          <i className="bi bi-send-check-fill icon-yellow" />
          <span>
            <b>Ngày gửi</b>
            {typeof report?.createAt === "number"
              ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(report?.createAt)).format(
                  "HH:mm:ss DD/MM/YYYY",
                )}
          </span>
        </div>
      </div>

      <div className="col-6">
        <div className="mini-info">
          <i className="bi bi-calendar-heart icon-red" />
          <span>
            <b>Ngày duyệt</b>
            {typeof report?.updateAt === "number"
              ? moment(report?.updateAt).format("HH:mm:ss DD/MM/YYYY")
              : moment(handleTimeStampFirestore(report?.updateAt)).format(
                  "HH:mm:ss DD/MM/YYYY",
                )}
          </span>
        </div>
      </div>
    </div>

    <div className="d-flex gap-2 mt-3 pt-3">
      <Link
        to="../reportdetail"
        onClick={() => setSelectNavbar("")}
        state={{ report }}
        className="btn action-btn-soft flex-fill"
      >
        <i className="bi bi-eye-fill me-2" />
        Xem báo cáo
      </Link>
    </div>
  </article>
);
  }

  function ReportRow({ report }: any) {
    return (
      <tr>
        <td>
          <span className="plan-code">
            {report.type} {report.title}
          </span>
          <div className="small text-green-muted mt-1">{report.id}</div>
        </td>
        <td className="text-green-dark fw-bold">
          {teachers.find((_: UserModel) => _.id === report.authorId)?.fullName}
        </td>
        <td className="text-green-dark fw-bold">
          {typeof report?.createAt === "number"
            ? moment(report?.createAt).format("HH:mm:ss DD/MM/YYYY")
            : moment(handleTimeStampFirestore(report?.createAt)).format(
              "HH:mm:ss DD/MM/YYYY",
            )}
        </td>
        <td className="text-green-dark fw-bold">
          {typeof report?.updateAt === "number"
            ? moment(report?.updateAt).format("HH:mm:ss DD/MM/YYYY")
            : moment(handleTimeStampFirestore(report?.updateAt)).format(
              "HH:mm:ss DD/MM/YYYY",
            )}
        </td>
        <td>
          <span className="status-approved">
            <i className="bi bi-patch-check-fill me-1" />
            {report.status}
          </span>
        </td>
        <td className="text-end">
          <Link
            to={"../reportdetail"}
            onClick={() => setSelectNavbar("")}
            state={{
              report,
            }}
            className="btn btn-sm action-btn-soft me-2"
          >
            Xem
          </Link>
        </td>
      </tr>
    );
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
            {/* <div className="col-12 col-lg-3 d-flex justify-content-lg-end gap-2">
              <button
                className={`btn view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <i className="bi bi-grid-3x3-gap-fill" />
              </button>
              <button
                className={`btn view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
              >
                <i className="bi bi-table" />
              </button>
            </div> */}
          </div>
        </div>

        {/* {viewMode === "grid" ? (
          <div className="row g-3 g-xl-4">
            {filteredReports.map((report) => (
              <div className="col-12 col-lg-6 col-xxl-4" key={report.id}>
                <ReportCard report={report} />
              </div>
            ))}
          </div>
        ) : (
          <div className="plans-table-panel p-3 p-md-4">
            <div className="table-responsive">
              <table className="table plans-table align-middle">
                <thead>
                  <tr>
                    <th>Báo cáo</th>
                    <th>Giáo viên thực hiện</th>
                    <th>Ngày gửi</th>
                    <th>Ngày duyệt</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <ReportRow key={report.id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {filteredReports.length === 0 ? (
          <div className="page-panel p-5 text-center text-green-muted">
            <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
            Không tìm thấy báo cáo phù hợp.
          </div>
        ) : <div className="row g-3 g-xl-4">
          {filteredReports.map((report) => (
            <div className="col-12 col-lg-6 col-xxl-4" key={report.id}>
              <ReportCard report={report} />
            </div>
          ))}
        </div>}
      </section>
    </>
  );
}
