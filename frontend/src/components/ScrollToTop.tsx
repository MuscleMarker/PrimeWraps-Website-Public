import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A component that scrolls the window to the top whenever the route changes.
 * This is useful for ensuring that the user sees the top of the page when navigating to a new page.
 */
function ScrollToTop() {
  // Get the current pathname from the URL
  const { pathname } = useLocation();

  // Use the useEffect hook to scroll to the top when the pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component does not render anything
  return null;
}

export default ScrollToTop;
