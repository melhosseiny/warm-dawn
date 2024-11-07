import { installRouter } from "router";

const toTitleCase = function(s) {
  return s.replace(/-/g, ' ')[0].toUpperCase() +
    s.replace(/-/g, ' ').substr(1).toLowerCase();
}

const handleNavigation = function(location) {
  const path = decodeURIComponent(location.pathname);
  const page = path === '/' ? 'index' : path.slice(1);
  
  // Fallback for browsers that don't support this API:
  if (!document.startViewTransition) {
    loadPage(page);
    return;
  }

  // With a transition:
  document.startViewTransition(() => loadPage(page));
};

const loadPage = async function(page) {
  switch(page) {
    case "index":
      document.title = "Mostafa Elshamy";
      document.querySelector("#main").innerHTML = `<wd-toc></wd-toc>`;
      break;
    case "feed":
      document.title = "Feed - Mostafa Elshamy";
      document.querySelector("#main").innerHTML = `<wd-feed></wd-feed>`;
      break;
    default:
      const note = await import("/components/note.js");
      document.title = `${toTitleCase(page)} - Mostafa Elshamy`;
      document.querySelector("#main").innerHTML = `<wd-note id="${ page }"></wd-note>`;
  }
}

installRouter((location) => handleNavigation(location));
