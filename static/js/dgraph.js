// debounce limits the amount of function invocation by spacing out the calls
// by at least `wait` ms.

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

/********** Cookie helpers **/

function createCookie(name, val, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  document.cookie = name + "=" + val + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

/**
 * getCurrentVersion gets the current doc version from the URL path and returns it
 *
 * @params pathname {String} - current path in a format of '/current/path'.
 * @return {String} - e.g. 'main', 'v7.7.1', ''
 *                    empty string denotes the latest version
 */
function getCurrentVersion(pathname) {
  let candidate;

  if (location.pathname.startsWith("/docs")) {
    candidate = pathname.split("/")[2];
  } else {
    candidate = pathname.split("/")[1];
  }

  if (candidate === "main") {
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
  // clipboard
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

  // Sidebar
  // var h2s = document.querySelectorAll("h2");
  // var h3s = document.querySelectorAll("h3");
  // var isAfter = function(e1, e2) {
  //   return e1.compareDocumentPosition(e2) & Node.DOCUMENT_POSITION_FOLLOWING;
  // };
  // var activeLink = document.querySelector(".topic.active");
  // var allLinks = [];

  // var h2sWithH3s = [];
  // var j = 0;
  // for (var i = 0; i < h2s.length; i++) {
  //   var h2 = h2s[i];
  //   var nextH2 = h2s[i + 1];
  //   var ourH3s = [];
  //   while (
  //     h3s[j] &&
  //     isAfter(h2, h3s[j]) &&
  //     (!nextH2 || !isAfter(nextH2, h3s[j]))
  //   ) {
  //     ourH3s.push({ header: h3s[j] });
  //     j++;
  //   }

  //   h2sWithH3s.push({
  //     header: h2,
  //     subHeaders: ourH3s
  //   });
  // }

  // console.log(h2sWithH3s);

  // function createSubtopic(container, headers) {
  //   var subMenu = document.createElement("ul");
  //   subMenu.className = "sub-topics";
  //   container.appendChild(subMenu);

  //   Array.prototype.forEach.call(headers, function(h) {
  //     var li = createSubtopicItem(h.header);
  //     li.className = "topic sub-topic";
  //     subMenu.appendChild(li);

  //     if (h.subHeaders) {
  //       createSubtopic(subMenu, h.subHeaders);
  //     }
  //   });
  // }

  // function createSubtopicItem(h) {
  //   allLinks.push(h);

  //   var li = document.createElement("li");
  //   li.innerHTML =
  //     '<i class="fa fa-angle-right"></i> <a href="#' +
  //     h.id +
  //     '" data-scroll class="' +
  //     h.tagName +
  //     '">' +
  //     (h.title || h.textContent) +
  //     "</a>";
  //   return li;
  // }

  // setActiveSubTopic updates the active subtopic on the sidebar based on the
  // hash
  // @params hash [String] - hash including the hash sign at the beginning
  // function setActiveSubTopic(hash) {
  //   // Set inactive the previously active topic
  //   var prevActiveTopic = document.querySelector(".sub-topics .topic.active");
  //   var nextActiveTopic = document.querySelector(
  //     '.sub-topics a[href="' + hash + '"]'
  //   ).parentNode;

  //   if (prevActiveTopic !== nextActiveTopic) {
  //     nextActiveTopic.classList.add("active");

  //     if (prevActiveTopic) {
  //       prevActiveTopic.classList.remove("active");
  //     }
  //   }
  // }

  // updateSidebar updates the active menu in the sidebar
  // function updateSidebar() {
  //   var currentScrollY = document.body.scrollTop;
  //   var topSideOffset = 120;

  //   var activeHash;
  //   for (var i = 0; i < allLinks.length; i++) {
  //     var h = allLinks[i];
  //     var hash = h.getElementsByTagName("a")[0].hash;

  //     if (h.offsetTop - topSideOffset > currentScrollY) {
  //       if (!activeHash) {
  //         activeHash = hash;
  //         break;
  //       }
  //     } else {
  //       activeHash = hash;
  //     }
  //   }

  //   if (activeHash) {
  //     setActiveSubTopic(activeHash);
  //   }
  // }

  // if (h2sWithH3s.length > 0 && activeLink) {
  //   createSubtopic(activeLink, h2sWithH3s);
  // }

  var mainTopics = document.querySelectorAll(".children");
  for (var i = 0; i < mainTopics.length; i++) {
    var mainTopic = mainTopics[i];
    mainTopic.addEventListener("click", function (e) {
      var id = e.target.id || e.target.parentElement.id;
      e.stopPropagation();
      setActiveMainTopic(id);
    });
  }

  document.querySelectorAll(".topics .sub-topic").forEach(function(topic) {
    topic.addEventListener("click", function(e) {
      // If we have children, then toggle the menu. Else, follow the link
      if(e.currentTarget.querySelectorAll(".sub-topic").length) {
      //  e.preventDefault();
        e.currentTarget.classList.toggle("active");
        e.stopPropagation();
      } else {
        e.stopPropagation()
      }
    })
  })


  // setActiveMainTopic updates the active mainopic on the sidebar based on the
  // id
  // @params id [Node] - id of the clicked object
  function setActiveMainTopic(id) {
    // Set inactive the previously active topic
    var prevActiveTopic = document.querySelector("li.topic.main-topic.active");
    var nextActiveTopic = document.querySelector("#" + id);
    // console.log(prevActiveTopic);
    nextActiveTopic.classList.toggle("active");

    if (nextActiveTopic !== prevActiveTopic) {
      prevActiveTopic.classList.toggle("active");
    } else {
      e.preventDefault();
    }
    // if (prevActiveTopic !== nextActiveTopic) {
    //   nextActiveTopic.classList.add("active");

    //   if (prevActiveTopic) {
    //     prevActiveTopic.classList.remove("active");
    //   }
    // }
  }

  // var subTopics = document.querySelectorAll(".sub-topics .sub-topic");
  // for (var i = 0; i < subTopics.length; i++) {
  //   var subTopic = subTopics[i];
  //   subTopic.addEventListener("click", function(e) {
  //     var hash = e.target.hash;
  //     setActiveSubTopic(hash);
  //   });
  // }

  // Scrollspy for sidebar
  // window.addEventListener("scroll", debounce(updateSidebar, 15));

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
  function switchVersion(targetVersion) {
    // change the path only if it does not include the right version
    if (targetVersion != getCurrentVersion(location.pathname)) {
      targetPath = location.origin + "/docs/" + targetVersion;
      location.assign(targetPath);
    }
  }
  var currentVersion = getCurrentVersion(location.pathname);
  var latestVersion;

  const versionSelectors = document.getElementsByClassName("version-selector");
  if (versionSelectors.length) {

    versionSelectors[0].addEventListener("change", function (e) {
      // targetVersion: '', 'main', 'v0.7.7', 'v0.7.6', etc.
      var targetVersion = e.target.value;

      if (currentVersion !== targetVersion) {
        switchVersion(targetVersion);
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
    latestVersion = options[0].value;

  }

  // Add target = _blank to all external links.
  var links = document.links;

  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname != window.location.hostname) {
      links[i].target = "_blank";
    }
  }

  /********** On page load **/
  // updateSidebar();
  // var activeTopic = document.querySelector(".sub-topics .topic.active");

  // if (activeTopic) {
  //   activeTopic.scrollIntoView();
  // }
})();

function setAlgolia(latestVersion) {
  var branch = 'master'
  var version = getCurrentVersion(location.pathname)
  if ((version != '') && (vesrion != 'main')) {
     branch = "release/"+version
  }

  algoliasearchNetlify({
    appId: '2062O2HVZD',
    apiKey: '9ba06b8093ca2e1559d88a234a7fbc9e',
    siteId: 'db712a52-2779-4260-9ede-cc5c61bc2c20',
    branch: branch,
    selector: '#algolia-doc-search',
  });
}
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
