import { Message } from "iconsax-react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch } from "../../constants/info";
import { PlanModel, ReportModel, UserModel } from "../../models";
import {
  usePlanStore,
  useReportStore,
  useSelectNavbarStore,
  useTeacherStore,
} from "../../zustand";
import "./pending.css";

export default function PendingApprovalBootstrapGreen() {
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const { plans } = usePlanStore();
  const { reports } = useReportStore();
  const [plansPending, setPlansPending] = useState<PlanModel[]>([]);
  const [reportsPending, setReportsPending] = useState<ReportModel[]>([]);
  const { teachers } = useTeacherStore();
  const { setSelectNavbar } = useSelectNavbarStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [teachers]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "pending");
      setPlansPending(items);
    }
  }, [plans]);

  useEffect(() => {
    if (reports) {
      const items = reports.filter((report) => report.status === "pending");
      setReportsPending(items);
    }
  }, [reports]);

  const filteredItems = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return plansPending.concat(reportsPending).filter((item: any) => {
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
  }, [plansPending, reportsPending, keyword, teacherMap]);

  function PendingCard({ item }: any) {
    const isReport = item.type === "BC";
    const teacherName =
      teachers.find((_: UserModel) => _.id === item.authorId)?.fullName || "";

    return (
      <div className="board-paper-card" style={{ background: 'pink' }} >
        <div className="pin" style={{ background: item.pin }} />

        <div className="board-card-header">
          <div className="board-main-icon" style={{ background: item.iconBg, color: item.color }}>
            📋
          </div>

          <div>
            <div className="board-card-type">{item.type}</div>
            <div className="board-card-code" style={{ color: item.color }}>
              {item.code}
            </div>
          </div>
        </div>

        <div className="board-info-row">
          <span className="board-info-icon">👥</span>
          <div>
            <div>Giáo viên thực hiện</div>
            <strong>{teacherName}</strong>
          </div>
        </div>

        <div className="board-info-row">
          <span className="board-info-icon">🗓️</span>
          <div>
            <div>Ngày gửi duyệt</div>
            <strong>{item.date}</strong>
          </div>
        </div>

        <div className="board-info-row">
          <span className="board-info-icon">🛒</span>
          <div>
            <div>Trạng thái</div>
            <span className="board-status">⏱ Chờ duyệt</span>
          </div>
        </div>

        <div className="board-actions">
          <button className="btn view">👁 Xem</button>
          <button className="btn approve">✓ Duyệt</button>
          <button className="btn reject">↩ Trả lại</button>
        </div>

        <div className={`board-decor ${item.decor}`}>
          {item.decor === "flower" ? "🌸" : "🌿"}
        </div>
      </div>
    )

    // const teacherName =
    //   teachers.find((_: UserModel) => _.id === item.authorId)?.fullName || "";

    // return (
    //   <article className="plan-card approval-card">
    //     <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
    //       <div className="d-flex gap-3 min-w-0 w-100">
    //         <div
    //           className={`approval-type-box ${isReport ? "report" : "plan"} flex-shrink-0`}
    //         >
    //           <i
    //             className={`bi ${isReport
    //                 ? "bi-file-earmark-text-fill"
    //                 : "bi-calendar2-week-fill"
    //               }`}
    //           />
    //         </div>

    //         <div className="min-w-0 w-100">
    //           <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-1">
    //             <h3 className="plan-title mb-0">
    //               {isReport ? "Báo cáo tháng" : item.type} {item.title}
    //             </h3>

    //             <span className="pending-badge flex-shrink-0">
    //               <i className="bi bi-hourglass-split me-1" />
    //               Chờ duyệt
    //             </span>
    //           </div>

    //           <div className="plan-teacher">
    //             <i className="bi bi-person-check-fill me-1 icon-red" />
    //             <b>Giáo viên: </b>
    //             {teacherName}
    //           </div>
    //         </div>
    //       </div>

    //       {item.comment && <Message color="red" size={26} variant="Bold" />}
    //     </div>

    //     <div className="row g-2 mb-3">
    //       <div className="col-12">
    //         <div className="mini-info">
    //           <i className="bi bi-send-check-fill icon-yellow" />
    //           <span>
    //             <b>Ngày gửi</b>
    //             {typeof item?.createAt === "number"
    //               ? moment(item?.createAt).format("HH:mm:ss DD/MM/YYYY")
    //               : moment(handleTimeStampFirestore(item?.createAt)).format(
    //                 "HH:mm:ss DD/MM/YYYY",
    //               )}
    //           </span>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="d-flex gap-2 mt-3 pt-3">
    //       <Link
    //         to={isReport ? "../reportdetail" : "../plandetail"}
    //         onClick={() => setSelectNavbar("")}
    //         state={isReport ? { report: item } : { plan: item }}
    //         className="btn action-btn-soft flex-fill"
    //       >
    //         <i className="bi bi-eye-fill me-2" />
    //         Xem chi tiết
    //       </Link>
    //     </div>
    //   </article>
    // );
  }


  if (!plans && !reports) return <SpinnerComponent />;
  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Chờ duyệt
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              Kế hoạch và báo cáo đang chờ admin kiểm tra, duyệt hoặc trả về
              chỉnh sửa.
            </p>
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
                  placeholder="Tìm mã/tên kế hoạch, báo cáo; giáo viên, thời gian thực hiện"
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
            {filteredItems.map((item) => (
              <div className="col-12 col-lg-6 col-xxl-4" key={item.id}>
                <PendingCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="plans-table-panel p-3 p-md-4">
            <div className="table-responsive">
              <table className="table plans-table align-middle">
                <thead>
                  <tr>
                    <th>Mã</th>
                    <th>Giáo viên thực hiện</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Góp ý</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <PendingRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {filteredItems.length === 0 ? (
          <div className="page-panel p-5 text-center text-green-muted">
            <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
            Không có mục nào đang chờ duyệt.
          </div>
        ) : (
          <div className="row g-3 g-xl-4">
            {filteredItems.map((item) => (
              <div className="col-12 col-lg-6 col-xxl-4" key={item.id}>
                <PendingCard item={item} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
