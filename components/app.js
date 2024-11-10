import { installRouter } from "router";

//export const ASSET_HOST = "http://localhost:4507";
export const ASSET_HOST = "https://important-deer-81.deno.dev";

const toTitleCase = function(s) {
  return s.replace(/-/g, ' ')[0].toUpperCase() +
    s.replace(/-/g, ' ').substr(1).toLowerCase();
}

const handle_nav = function(location) {
  const path = decodeURIComponent(location.pathname);
  const page = path === '/' ? 'index' : path.slice(1);
  
  // Fallback for browsers that don't support this API:
  if (!document.startViewTransition) {
    load_page(page);
    return;
  }

  // With a transition:
  document.startViewTransition(() => load_page(page));
};

const load_page = async function(page) {
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
      if (page.startsWith("post/")) {
        console.log("id", page.split('/')[1]);
        document.title = `${toTitleCase(page)} - Mostafa Elshamy`;
        document.querySelector("#main").innerHTML = `<wd-post id="${ page.split('/')[1] }"></wd-post>`;
      } else {
        const note = await import("/components/note.js");
        document.title = `${toTitleCase(page)} - Mostafa Elshamy`;
        document.querySelector("#main").innerHTML = `<wd-note id="${ page }"></wd-note>`;
      }
  }
}

installRouter((location) => handle_nav(location));

// 404
export const html_404 = (error) => `
  <h1>Uh oh</h1>
  <p>Page not found.</p>
  <p>Go back to the <a href="/">homepage</a>.</p>
`

export const html_404_no = (error) => `
  <h1>Øh, noe gikk galt</h1>
  <p>Siden ikke funnet.</p>
  <p>Gå tilbake til <a href="/">hjemmesiden</a>.</p>
`

export const html_404_ar = (error) => `
  <h1>حدث خطأ</h1>
  <p>لم يتم العثور على الصفحة.</p>
  <p>عد إلي <a href="/">الصفحة الرئيسية</a>.</p>
`

// utils
const NOW = 5
const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH_30 = DAY * 30
const MONTH = DAY * 30.41675 // This results in 365.001 days in a year, which is close enough for nearly all cases

export function ago(date) {
  let ts;
  if (typeof date === 'string') {
    ts = Number(new Date(date))
  } else if (date instanceof Date) {
    ts = Number(date)
  } else {
    ts = date
  }
  const diffSeconds = Math.floor((Date.now() - ts) / 1e3)
  if (diffSeconds < NOW) {
    return `now`
  } else if (diffSeconds < MINUTE) {
    return `${diffSeconds}s`
  } else if (diffSeconds < HOUR) {
    return `${Math.floor(diffSeconds / MINUTE)}m`
  } else if (diffSeconds < DAY) {
    return `${Math.floor(diffSeconds / HOUR)}h`
  } else if (diffSeconds < MONTH_30) {
    return `${Math.round(diffSeconds / DAY)}d`
  } else {
    let months = diffSeconds / MONTH
    if (months % 1 >= 0.9) {
      months = Math.ceil(months)
    } else {
      months = Math.floor(months)
    }

    if (months < 12) {
      return `${months}mo`
    } else {
      const datetime_format = new Intl.DateTimeFormat("en-US", {  year: "numeric", month: "short", day: "numeric" });
      const date = new Date(ts);
      return datetime_format.format(date);
    }
  }
}

export function format_date(datetime) {
  const d = new Date(datetime)
  return `${d.toLocaleDateString('en-us', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} at ${d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })}`
}

export function format_big_n(n) {
  return (new Intl.NumberFormat('en', { notation: 'compact' })
    .format(n)).toLowerCase();
}
