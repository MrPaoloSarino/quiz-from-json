import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line no-console
    if (process.env.NODE_ENV === 'development') console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="/icon (1).svg" alt="Cerebrum Logo" className="w-12 h-12" />
          <h1 className="text-4xl font-bold text-destructive">404</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-4">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-primary-foreground underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
