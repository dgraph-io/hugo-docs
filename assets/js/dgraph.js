// TODO: split this file up into separate fiel peices for smaller scopes and then bundle in pipeline

// debounce limits the amount of function invocation by spacing out the calls
// by at least `wait` ms.
// TODO: find usage or remove this debounce function
function debounce(func, wait, immediate) {
  var timeout;

  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * getCurrentVersion gets the current doc version from the URL path and returns it
 *
 * @params pathname {String} - current path in a format of '/current/path'.
 * @return {String} - e.g. 'master', 'v7.7.1', ''
 *                    empty string denotes the latest version
 */
function getCurrentVersion(pathname) {
  let candidate;

  if (location.pathname.startsWith("/docs")) {
    candidate = pathname.split("/")[2];
  } else {
    candidate = pathname.split("/")[1];
  }

  if (candidate === "master") {
    return candidate;
  }

  if (/v\d+\.\d+/.test(candidate)) {
    return candidate;
  }

  if (/v\d+\.\d+\.\d+/.test(candidate)) {
    return candidate;
  }

  return "";
}

// getPathBeforeVersionName gets the current URL path before the version prefix
function getPathBeforeVersionName(location, versionName) {
  if (location.pathname.startsWith("/docs")) {
    return "/docs/";
  }
  return "/";
}

// getPathAfterVersionName gets the current URL path after the version prefix
function getPathAfterVersionName(location, versionName) {
  let path;
  if (location.pathname.startsWith("/docs")) {
    if (versionName === "") {
      path = location.pathname
        .split("/")
        .slice(2)
        .join("/");
    } else {
      path = location.pathname
        .split("/")
        .slice(3)
        .join("/");
    }
    return path + location.hash;
  }

  if (versionName === "") {
    path = location.pathname
      .split("/")
      .slice(1)
      .join("/");
  } else {
    path = location.pathname
      .split("/")
      .slice(2)
      .join("/");
  }

  return path + location.hash;
}

(function () {
  // copy to clipboard button and action. Depends upon clipboard.js
  var clipInit = false;
  $("pre code:not(.no-copy)").each(function () {
    var code = $(this),
      text = code.text();

    if (text.length > 5) {
      if (!clipInit) {
        var text;
        var clip = new Clipboard(".copy-btn", {
          text: function (trigger) {
            text = $(trigger)
              .prev("code")
              .text();
            return text.replace(/^\$\s/gm, "");
          }
        });

        clip.on("success", function (e) {
          e.clearSelection();
          $(e.trigger)
            .text("Copied to clipboard!")
            .addClass("copied");

          window.setTimeout(function () {
            $(e.trigger)
              .text("Copy")
              .removeClass("copied");
          }, 2000);
        });

        clip.on("error", function (e) {
          e.clearSelection();
          $(e.trigger).text("Error copying");

          window.setTimeout(function () {
            $(e.trigger).text("Copy");
          }, 2000);
        });

        clipInit = true;
      }

      code.after('<span class="copy-btn">Copy</span>');
    }
  });

  var mainTopics = document.querySelectorAll(".children");
  for (var i = 0; i < mainTopics.length; i++) {
    var mainTopic = mainTopics[i];
    mainTopic.addEventListener("click", function (e) {
      var id = e.target.id;
      setActiveMainTopic(id);
    });
  }

  // sidebar expand vs. follow logic onClick
  document.querySelectorAll(".topics .sub-topic").forEach(function(topic) {
    topic.addEventListener("click", function(e) {
      // If we have children, then toggle the menu. Else, follow the link
      if(e.currentTarget.querySelectorAll(".sub-topic").length) {
        e.preventDefault();
        e.currentTarget.classList.toggle("active");
      } else {
        e.stopPropagation()
      }
    })
  })


  // setActiveMainTopic updates the active main topic on the sidebar based on the
  // id
  // @params id [Node] - id of the clicked object
  function setActiveMainTopic(id) {
    // Set inactive the previously active topic
    var prevActiveTopic = document.querySelector("li.topic.main-topic.active");
    var nextActiveTopic = document.querySelector("#" + id).parentNode;
    // console.log(prevActiveTopic);
    nextActiveTopic.classList.toggle("active");
    prevActiveTopic.classList.toggle("active");
    if (nextActiveTopic === prevActiveTopic) {
      nextActiveTopic.classList.toggle("active");
    }
  }

  // Sidebar toggle
  document
    .getElementById("sidebar-toggle")
    .addEventListener("click", function (e) {
      e.preventDefault();
      var klass = document.body.className;
      if (klass === "sidebar-visible") {
        document.body.className = "";
      } else {
        document.body.className = "sidebar-visible";
      }
    });

  // Anchor tags for headings
  function appendAnchor(heading) {
    var id = heading.id;
    var anchorOffset = document.createElement("div");
    anchorOffset.className = "anchor-offset";
    anchorOffset.id = id;

    var anchor = document.createElement("a");
    anchor.href = "#" + id;
    anchor.className = "anchor";
    // anchor.innerHTML = 'link'
    anchor.innerHTML = '<i class="fa fa-link"></i>';
    heading.insertBefore(anchor, heading.firstChild);
    heading.insertBefore(anchorOffset, heading.firstChild);

    // Remove the id from heading
    // Instead we will assign the id to the .anchor-offset element to account
    // for the fixed header height
    heading.removeAttribute("id");
  }
  var h2s = document.querySelectorAll(
    ".content-wrapper h2, .content-wrapper h3"
  );
  for (var i = 0; i < h2s.length; i++) {
    appendAnchor(h2s[i]);
  }

  // version selector
  var currentVersion = getCurrentVersion(location.pathname);
  const versionSelectors = document.getElementsByClassName("version-selector");
  if (versionSelectors.length) {
    versionSelectors[0].addEventListener("change", function (e) {
      // targetVersion: '', 'master', 'v0.7.7', 'v0.7.6', etc.
      var targetVersion = e.target.value;

      if (currentVersion !== targetVersion) {
        var basePath = getPathBeforeVersionName(location, currentVersion);
        // Getting everything after targetVersion and concatenating it with the hash part.
        var currentPath = getPathAfterVersionName(location, currentVersion);

        var targetPath;
        if (targetVersion === "") {
          targetPath = basePath + currentPath;
        } else {
          targetPath = basePath + targetVersion + "/" + currentPath;
        }
        location.assign(targetPath);
      }
    });

    var versionSelector = versionSelectors[0],
      options = versionSelector.options;

    for (var i = 0; i < options.length; i++) {
      if (options[i].value.indexOf("latest") != -1) {
        options[i].value = options[i].value.replace(/\s\(latest\)/, "");
      }
    }

    for (var i = 0; i < options.length; i++) {
      if (options[i].value === currentVersion) {
        options[i].selected = true;
        break;
      }
    }
    (" ");
  }

  // Add target = _blank to all external links.
  var links = document.links;

  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname != window.location.hostname) {
      links[i].target = "_blank";
    }
  }
})();

$(document).ready(function () {
  $(".tab-content")
    .find(".tab-pane")
    .each(function (idx, item) {
      const navTabs = $(this).closest(".tabs").find(".nav-tabs");
      const title = $(this).attr("title");
      navTabs.append(`<li><a href="#">${title}</a></li>`);
    });

  $(".tabs ul.nav-tabs").each(function () {
    $(this).find("li:first").addClass("active");
  });

  $(".tabs .tab-content").each(function () {
    $(this).find("div:first").addClass("active");
  });

  $(".nav-tabs a").click(function (e) {
    e.preventDefault();
    const tab = $(this).parent();
    const tabIndex = tab.index();
    const tabPanel = $(this).closest(".tabs");
    const tabPane = tabPanel.find(".tab-pane").eq(tabIndex);
    tabPanel.find(".active").removeClass("active");
    tab.addClass("active");
    tabPane.addClass("active");
  });
});
