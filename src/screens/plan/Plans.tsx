import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SpinnerComponent } from "../../components";
import { handleTimeStampFirestore } from "../../constants/convertTimeStamp";
import { formatDateSearch, getCardTheme } from "../../constants/info";
import { PlanModel, UserModel } from "../../models";
import {
  usePlanStore,
  useSelectNavbarStore,
  useTeacherStore,
} from "../../zustand";
import "./plan.css";

export default function ApprovedPlansBootstrapGreen() {
  const [keyword, setKeyword] = useState("");
  const { setSelectNavbar } = useSelectNavbarStore();
  const { plans } = usePlanStore();
  const [planNews, setPlanNews] = useState<PlanModel[]>([]);
  const { teachers } = useTeacherStore();

  const teacherMap = useMemo(() => {
    const map: any = {};
    teachers.forEach((t) => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  useEffect(() => {
    if (plans) {
      const items = plans.filter((plan) => plan.status === "approved");
      setPlanNews(items);
    }
  }, [plans]);

  const filteredPlans = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return planNews.filter((item: any) => {
      const teacherName = teacherMap[item.authorId]?.fullName || "";

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
  }, [planNews, keyword, teacherMap]);

  function PlanCard({ plan }: any) {
    // const teacherName =
    //   teachers.find((_: UserModel) => _.id === plan.authorId)?.fullName || "";
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
                src={theme.icon}
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
                    src={teacherMap[plan.authorId]?.avatar}
                    alt=""
                  />
                  <span>
                    {teacherMap[plan.authorId]?.fullName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (!plans) return <SpinnerComponent />;

  return (
    <>
      <section className="container-fluid px-3 px-md-4 px-xl-4 py-4 py-xl-4">
        <div className="row align-items-start g-3 mb-3">
          <div className="col-12 col-lg">
            <h2 className="page-title fw-black text-green-dark mb-2">
              Kế hoạch can thiệp
            </h2>
            <p className="fs-6 text-green-muted mb-0">
              ( Dùng để trích xuất và làm báo cáo )
            </p>
          </div>
          <div className="col-12 col-lg-auto d-flex gap-2 flex-wrap">
            <Link
              to={"../cart"}
              onClick={() => setSelectNavbar("cart")}
              className="btn action-btn-primary"
            >
              <i className="bi bi-plus-circle-fill me-2" />
              Tạo kế hoạch mới
            </Link>

            <Link
              to={"../addreport"}
              onClick={() => setSelectNavbar("")}
              className="btn action-btn-primary flex-fill"
            >
              <i className="bi bi-pencil-square me-2" />
              Làm báo cáo
            </Link>
          </div>
        </div>

        <div className="page-panel p-3 p-md-4 mb-5">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg-12">
              <div className="search-box">
                <i className="bi bi-search" />
                <input
                  className="form-control search-input"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm mã/tên kế hoạch, giáo viên thực hiện"
                />
              </div>
            </div>
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="page-panel p-5 text-center text-green-muted">
            <i className="bi bi-search fs-1 d-block mb-3 icon-yellow" />
            Không tìm thấy kế hoạch phù hợp.
          </div>
        ) : (
          <div className="row g-3 g-xl-4">
            {filteredPlans.map((plan, index) => (
              <PlanCard plan={plan} key={`plan-${plan.id}-index`} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// Kế hoạch và báo cáo ở đây
// export default function KeHoachCards() {
// const data = [
//   {
//     title: "Tên KH : 05/2026",
//     createDate: "01/05/2026",
//     approveDate: "05/05/2026",
//     teacher: "Nguyễn Trường An",
//     bg: "#fdecef",
//     color: "#e84c7f",
//     pin: "#ff5b93",
//   },
//   {
//     title: "Tên KH : 04/2026",
//     createDate: "01/04/2026",
//     approveDate: "04/04/2026",
//     teacher: "Js Doan",
//     bg: "#fff8e5",
//     color: "#d9a300",
//     pin: "#ffc107",
//   },
//   {
//     title: "Tên KH : 03/2026",
//     createDate: "01/03/2026",
//     approveDate: "03/03/2026",
//     teacher: "Nguyễn Trường An",
//     bg: "#eef8df",
//     color: "#4caf50",
//     pin: "#8bc34a",
//   },
//   {
//     title: "Tên KH : 02/2026",
//     createDate: "01/02/2026",
//     approveDate: "05/02/2026",
//     teacher: "Js Doan",
//     bg: "#edf7ff",
//     color: "#2196f3",
//     pin: "#64b5f6",
//   },
//   {
//     title: "Tên KH : 01/2026",
//     createDate: "02/01/2026",
//     approveDate: "06/12/2026",
//     teacher: "Nguyễn Trường An",
//     bg: "#f5efff",
//     color: "#9c27b0",
//     pin: "#b388ff",
//   },
//   {
//     title: "Tên KH : 12/2025",
//     createDate: "01/12/2025",
//     approveDate: "05/12/2025",
//     teacher: "Js Doan",
//     bg: "#fff1ea",
//     color: "#ff6f00",
//     pin: "#ff9800",
//   },
//   {
//     title: "Tên KH : 11/2025",
//     createDate: "01/11/2025",
//     approveDate: "04/11/2025",
//     teacher: "Nguyễn Trường An",
//     bg: "#ebfbf8",
//     color: "#009688",
//     pin: "#4dd0e1",
//   },
//   {
//     title: "Tên KH : 10/2025",
//     createDate: "01/10/2025",
//     approveDate: "05/10/2025",
//     teacher: "Js Doan",
//     bg: "#fdecef",
//     color: "#e84c7f",
//     pin: "#ff5b93",
//   },
// ];

//   return (
//     <>
//       <style>
//         {`
//           .kh-card {
//   position: relative;
//   border-radius: 14px 14px 26px 14px;
//   padding: 34px 20px 20px;
//   min-height: 190px;
//   overflow: hidden;
//   transition: all 0.3s ease;

//   box-shadow:
//     0 3px 6px rgba(0, 0, 0, 0.06),
//     0 10px 20px rgba(0, 0, 0, 0.08),
//     0 18px 36px rgba(0, 0, 0, 0.06);

//   background-image:
//     linear-gradient(
//       135deg,
//       rgba(255,255,255,0.75) 0%,
//       rgba(255,255,255,0.3) 45%,
//       rgba(255,255,255,0.08) 100%
//     );
// }

// .kh-card:hover {
//   transform: translateY(-5px);
//   box-shadow:
//     0 6px 12px rgba(0, 0, 0, 0.08),
//     0 18px 36px rgba(0, 0, 0, 0.12);
// }

// /* bóng gấp giấy */
// .kh-card::before {
//   content: "";
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 46px;
//   height: 46px;
//   background: rgba(0, 0, 0, 0.08);
//   clip-path: polygon(100% 0, 0 100%, 100% 100%);
//   filter: blur(2px);
// }

// /* mặt giấy bị gấp */
// .kh-card::after {
//   content: "";
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 42px;
//   height: 42px;

//   background:
//     linear-gradient(
//       135deg,
//       rgba(255,255,255,0.95) 0%,
//       rgba(255,255,255,0.7) 45%,
//       rgba(0,0,0,0.08) 100%
//     );

//   clip-path: polygon(100% 0, 0 100%, 100% 100%);

//   box-shadow:
//     -4px -4px 8px rgba(0, 0, 0, 0.1),
//     inset 2px 2px 4px rgba(255, 255, 255, 0.9);
// }

// .kh-title {
//   font-size: 24px;
//   font-weight: 700;
//   margin-bottom: 18px;
//   position: relative;
//   z-index: 2;
// }

// .kh-info {
//   font-size: 14px;
//   margin-bottom: 10px;
//   position: relative;
//   z-index: 2;
// }

// .kh-footer {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-top: 15px;
//   position: relative;
//   z-index: 2;
// }

// .avatar {
//   width: 28px;
//   height: 28px;
//   border-radius: 50%;
//   object-fit: cover;
//   margin-right: 8px;
// }

// .teacher-box {
//   display: flex;
//   align-items: center;
//   font-size: 14px;
//   font-weight: 500;
// }

// .more-btn {
//   cursor: pointer;
//   font-size: 20px;
//   font-weight: bold;
// }

// @media (max-width: 768px) {
//   .kh-title {
//     font-size: 20px;
//   }
// }
//         `}
//       </style>

// <div className="container-fluid py-4">
//   <div className="row g-4">
//     {data.map((item, index) => (
//       <div
//         key={index}
//         className="col-12 col-sm-6 col-lg-4 col-xl-3"
//       >
//         <div
//           className="kh-card"
//           style={{ background: item.bg }}
//         >
//           <div
//             className="kh-title"
//             style={{ color: item.color }}
//           >
//             {item.title}
//           </div>

//           <div className="kh-info">
//             📅 Ngày tạo KH : {item.createDate}
//           </div>

//           <div className="kh-info">
//             ✔️ Ngày duyệt KH : {item.approveDate}
//           </div>

//           <div className="kh-info">
//             👤 Gv thực hiện :
//           </div>

//           <div className="kh-footer">
//             <div className="teacher-box">
//               <img
//                 className="avatar"
//                 src="https://i.pravatar.cc/40"
//                 alt=""
//               />
//               {item.teacher}
//             </div>

//             <span className="more-btn">...</span>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// </div>
//     </>
//   );
// }

// export default function ReportCards() {
//   const data = [
//     {
//       type: "BÁO CÁO CAN THIỆP",
//       code: "BC 05/2026",
//       teacher: "Mai Thị Phương",
//       date: "31/05/2026 16:45",
//       bg: "#fff1f3",
//       color: "#f06292",
//       iconBg: "#ffe0ea",
//       pin: "#f58aae",
//       decor: "flower",
//     },
//     {
//       type: "KẾ HOẠCH CAN THIỆP",
//       code: "KH 06/2026",
//       teacher: "Mai Thị Phương",
//       date: "01/06/2026 09:12",
//       bg: "#fff9dc",
//       color: "#f6a800",
//       iconBg: "#fff0b8",
//       pin: "#ffc928",
//       decor: "leaf",
//     },
//   ];

//   return (
//     <>
//     <style>{css}</style>
    // <div className="board">
    //   <div className="card-list">
    //     {data.map((item, index) => (
    //       <div className="paper-card" style={{ background: item.bg }} key={index}>
    //         <div className="pin" style={{ background: item.pin }} />

    //         <div className="card-header">
    //           <div className="main-icon" style={{ background: item.iconBg, color: item.color }}>
    //             📋
    //           </div>

    //           <div>
    //             <div className="card-type">{item.type}</div>
    //             <div className="card-code" style={{ color: item.color }}>
    //               {item.code}
    //             </div>
    //           </div>
    //         </div>

    //         <div className="info-row">
    //           <span className="info-icon">👥</span>
    //           <div>
    //             <div>Giáo viên thực hiện</div>
    //             <strong>{item.teacher}</strong>
    //           </div>
    //         </div>

    //         <div className="info-row">
    //           <span className="info-icon">🗓️</span>
    //           <div>
    //             <div>Ngày gửi duyệt</div>
    //             <strong>{item.date}</strong>
    //           </div>
    //         </div>

    //         <div className="info-row">
    //           <span className="info-icon">🛒</span>
    //           <div>
    //             <div>Trạng thái</div>
    //             <span className="status">⏱ Chờ duyệt</span>
    //           </div>
    //         </div>

    //         <div className="actions">
    //           <button className="btn view">👁 Xem</button>
    //           <button className="btn approve">✓ Duyệt</button>
    //           <button className="btn reject">↩ Trả lại</button>
    //         </div>

    //         <div className={`decor ${item.decor}`}>
    //           {item.decor === "flower" ? "🌸" : "🌿"}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
//     </>
//   );
// }

// const css = `
//   .board {
//   min-height: 100vh;
//   padding: 36px;
//   background:
//     radial-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
//     #c99b62;
//   background-size: 12px 12px;
// }

// .card-list {
//   display: flex;
//   gap: 70px;
//   justify-content: center;
//   flex-wrap: wrap;
// }

// .paper-card {
//   width: 270px;
//   min-height: 315px;
//   position: relative;
//   padding: 34px 26px 24px;
//   border-radius: 2px 2px 26px 2px;
//   overflow: hidden;

//   box-shadow:
//     0 8px 18px rgba(0,0,0,.14),
//     0 18px 38px rgba(0,0,0,.12);

//   background-image:
//     linear-gradient(
//       135deg,
//       rgba(255,255,255,.8),
//       rgba(255,255,255,.22)
//     );
// }

// .paper-card::before {
//   content: "";
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 46px;
//   height: 46px;
//   background: rgba(0,0,0,.12);
//   clip-path: polygon(100% 0, 0 100%, 100% 100%);
//   filter: blur(2px);
// }

// .paper-card::after {
//   content: "";
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   width: 42px;
//   height: 42px;
//   background: linear-gradient(
//     135deg,
//     rgba(255,255,255,.95),
//     rgba(255,255,255,.45),
//     rgba(0,0,0,.08)
//   );
//   clip-path: polygon(100% 0, 0 100%, 100% 100%);
//   box-shadow: -4px -4px 8px rgba(0,0,0,.1);
// }

// .pin {
//   width: 20px;
//   height: 20px;
//   border-radius: 50%;
//   position: absolute;
//   top: -9px;
//   left: 50%;
//   transform: translateX(-50%);
//   z-index: 4;
//   box-shadow:
//     inset -3px -3px 5px rgba(0,0,0,.18),
//     0 4px 7px rgba(0,0,0,.25);
// }

// .pin::before {
//   content: "";
//   width: 4px;
//   height: 28px;
//   background: #9b6b64;
//   position: absolute;
//   top: 15px;
//   left: 50%;
//   transform: translateX(-50%) rotate(18deg);
//   border-radius: 4px;
//   z-index: -1;
// }

// .card-header,
// .info-row,
// .actions {
//   position: relative;
//   z-index: 2;
// }

// .card-header {
//   display: flex;
//   align-items: center;
//   gap: 14px;
//   margin-bottom: 28px;
// }

// .main-icon {
//   width: 48px;
//   height: 48px;
//   border-radius: 50%;
//   display: grid;
//   place-items: center;
//   font-size: 24px;
// }

// .card-type {
//   font-size: 12px;
//   font-weight: 800;
//   color: #4b4b4b;
// }

// .card-code {
//   font-size: 24px;
//   font-weight: 900;
//   margin-top: 4px;
// }

// .info-row {
//   display: flex;
//   gap: 12px;
//   margin-bottom: 18px;
//   font-size: 13px;
//   color: #4b4038;
// }

// .info-icon {
//   width: 22px;
//   text-align: center;
// }

// .status {
//   display: inline-block;
//   margin-top: 6px;
//   padding: 6px 14px;
//   border-radius: 7px;
//   background: #ffe99b;
//   color: #9b6900;
//   font-weight: 700;
// }

// .actions {
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 10px;
// }

// .btn {
//   height: 30px;
//   border: 1px solid #e4e4e4;
//   border-radius: 6px;
//   background: white;
//   font-weight: 700;
//   cursor: pointer;
//   box-shadow: 0 2px 4px rgba(0,0,0,.06);
// }

// .reject {
//   grid-column: 1 / 3;
//   width: 120px;
//   justify-self: center;
//   color: #f04b2f;
// }

// .view,
// .approve {
//   color: #0b6b47;
// }

// .decor {
//   position: absolute;
//   right: 24px;
//   bottom: 70px;
//   font-size: 34px;
//   opacity: .65;
//   z-index: 1;
// }

// .leaf {
//   font-size: 42px;
//   right: 20px;
// }
// `