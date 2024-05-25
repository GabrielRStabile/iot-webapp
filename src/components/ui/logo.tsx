export default function Logo({ reduced = false }) {
  return reduced ? <ReducedLogo /> : <FullLogo />
}

const ReducedLogo = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-current"
  >
    <path
      d="M26.25 20V10C26.2496 9.56159 26.1338 9.13101 25.9144 8.75145C25.695 8.37189 25.3797 8.0567 25 7.8375L16.25 2.8375C15.87 2.61808 15.4388 2.50256 15 2.50256C14.5612 2.50256 14.13 2.61808 13.75 2.8375L5 7.8375C4.62033 8.0567 4.30498 8.37189 4.08558 8.75145C3.86618 9.13101 3.75045 9.56159 3.75 10V20C3.75045 20.4384 3.86618 20.869 4.08558 21.2485C4.30498 21.6281 4.62033 21.9433 5 22.1625L13.75 27.1625C14.13 27.3819 14.5612 27.4974 15 27.4974C15.4388 27.4974 15.87 27.3819 16.25 27.1625L25 22.1625C25.3797 21.9433 25.695 21.6281 25.9144 21.2485C26.1338 20.869 26.2496 20.4384 26.25 20Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.375 5.2625L15 8.5125L20.625 5.2625"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.375 24.7375V18.25L3.75 15"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.25 15L20.625 18.25V24.7375"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.08752 8.7L15 15.0125L25.9125 8.7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 27.6V15"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FullLogo = () => (
  <svg
    width="83"
    height="36"
    viewBox="0 0 83 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-current"
  >
    <path
      d="M26.25 23V13C26.2496 12.5616 26.1338 12.131 25.9144 11.7515C25.695 11.3719 25.3797 11.0567 25 10.8375L16.25 5.8375C15.87 5.61808 15.4388 5.50256 15 5.50256C14.5612 5.50256 14.13 5.61808 13.75 5.8375L5 10.8375C4.62033 11.0567 4.30498 11.3719 4.08558 11.7515C3.86618 12.131 3.75045 12.5616 3.75 13V23C3.75045 23.4384 3.86618 23.869 4.08558 24.2485C4.30498 24.6281 4.62033 24.9433 5 25.1625L13.75 30.1625C14.13 30.3819 14.5612 30.4974 15 30.4974C15.4388 30.4974 15.87 30.3819 16.25 30.1625L25 25.1625C25.3797 24.9433 25.695 24.6281 25.9144 24.2485C26.1338 23.869 26.2496 23.4384 26.25 23Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.375 8.26251L15 11.5125L20.625 8.26251"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.375 27.7375V21.25L3.75 18"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M26.25 18L20.625 21.25V27.7375"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.08752 11.7L15 18.0125L25.9125 11.7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 30.6V18"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44.1044 7.18182V29H40.152V7.18182H44.1044ZM55.1267 29.3196C53.5287 29.3196 52.1438 28.968 50.9719 28.2649C49.8 27.5618 48.8909 26.5781 48.2446 25.3139C47.6054 24.0497 47.2858 22.5724 47.2858 20.8821C47.2858 19.1918 47.6054 17.7109 48.2446 16.4396C48.8909 15.1683 49.8 14.1811 50.9719 13.478C52.1438 12.7749 53.5287 12.4233 55.1267 12.4233C56.7248 12.4233 58.1097 12.7749 59.2816 13.478C60.4534 14.1811 61.359 15.1683 61.9982 16.4396C62.6445 17.7109 62.9676 19.1918 62.9676 20.8821C62.9676 22.5724 62.6445 24.0497 61.9982 25.3139C61.359 26.5781 60.4534 27.5618 59.2816 28.2649C58.1097 28.968 56.7248 29.3196 55.1267 29.3196ZM55.148 26.2301C56.0145 26.2301 56.739 25.9922 57.3213 25.5163C57.9037 25.0334 58.337 24.3871 58.6211 23.5774C58.9123 22.7678 59.0578 21.8658 59.0578 20.8714C59.0578 19.87 58.9123 18.9645 58.6211 18.1548C58.337 17.3381 57.9037 16.6882 57.3213 16.2053C56.739 15.7223 56.0145 15.4808 55.148 15.4808C54.2603 15.4808 53.5216 15.7223 52.9321 16.2053C52.3498 16.6882 51.913 17.3381 51.6218 18.1548C51.3377 18.9645 51.1956 19.87 51.1956 20.8714C51.1956 21.8658 51.3377 22.7678 51.6218 23.5774C51.913 24.3871 52.3498 25.0334 52.9321 25.5163C53.5216 25.9922 54.2603 26.2301 55.148 26.2301ZM64.0264 10.495V7.18182H81.4341V10.495H74.6904V29H70.77V10.495H64.0264Z"
      className="fill-current"
    />
  </svg>
)
