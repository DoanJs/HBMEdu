// variables:
export const CENTER_NAME =
  "TRUNG TÂM CAN THIỆP SỚM HOA BAN MAI";
export const activeCategoryDefault = "3EUhuJoxzHauQpx1pPxq";//HoaBanMaiEdu-Mobile
export const indexedDBName = "QXEdu";
export const ADMINID = "QeCNbJPVLwVwy01S3hB3dgALsRm1";//HoaBanMaiEdu-Mobile
const planCardThemes = [
  {
    bg: "#fdecef",
    color: "#e84c7f",
  },
  {
    bg: "#fff8e5",
    color: "#d9a300",
  },
  {
    bg: "#eef8df",
    color: "#4caf50",
  },
  {
    bg: "#edf7ff",
    color: "#2196f3",
  },
  {
    bg: "#f5efff",
    color: "#9c27b0",
  },
  {
    bg: "#fff1ea",
    color: "#ff6f00",
  },
  {
    bg: "#ebfbf8",
    color: "#009688",
  },
  {
    bg: "#fdecef",
    color: "#e84c7f",
  },
];

// functions:
export const getCurrentMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  return `${month}/${year}`;
};
export const formatDateSearch = (time: any) => {
  if (!time) return "";

  const date = time.toDate ? time.toDate() : new Date(time);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${month}/${year} ${year}`;
};

export const handleCommentTotal = (array: any[]) => {
  // eslint-disable-next-line
  let isComment: boolean = false;
  array.map((_: any) => {
    if (_.comment && _.status === "pending") {
      isComment = true;
    }
  });

  return isComment;
};
export const parseVNDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day); // month - 1 vì JS đếm từ 0
};
export const calculateAgeDetail = (birthStr: string) => {
  const birth = parseVNDate(birthStr);
  const now = new Date();

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};
export const getCardTheme = (id: string) => {
  const hash = id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return planCardThemes[hash % planCardThemes.length];
};