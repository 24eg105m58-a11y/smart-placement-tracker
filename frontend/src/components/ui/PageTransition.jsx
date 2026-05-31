import { useLocation } from "react-router-dom";

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fade-in-up">
      {children}
    </div>
  );
};

export default PageTransition;
