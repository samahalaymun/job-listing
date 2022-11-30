"use strict";
import jobs from "./data.json" assert { type: "json" };

const wrapper = document.querySelector(".list-wrapper");
const filterWrapper = document.querySelector(".filter-word");
const filterKeysContainer = document.querySelector(".filter-keys-container");
const clearFilters = document.querySelector(".clear-btn");
let btns;
let filterList = [];
let allJobs = jobs;
const init = async () => {
  let filteredJobs = allJobs || [];
  displayJobs(filteredJobs);
  btns = document.querySelectorAll(".btn");
  onBtnClick(wrapper, (event) => {
    if (event.target.nodeName == "BUTTON") {
      let btn = event.target;
      indicateFilterWrapper(btn.innerText);
      filteredJobs = applyFilter(filterList, filteredJobs);
      displayJobs(filteredJobs);
    }
  });
  clearFilters.addEventListener("click", (event) => {
    filterList = [];
    filterKeysContainer.innerHTML = "";
    filterWrapper.classList.add("hidden");
    filteredJobs = allJobs;
    displayJobs(filteredJobs);
  });
  onFilterWrapperClick(filterKeysContainer, (event) => {
    if (event.target.nodeName == "BUTTON") {
      let btn = event.target;
      let filterValue = btn.parentElement.getAttribute("name");
      filterKeysContainer.removeChild(btn.parentElement);
      filterList.splice(filterList.indexOf(filterValue), 1);
      if (!filterList.length) {
        filterKeysContainer.innerHTML = "";
        filterWrapper.classList.add("hidden");
      }
      filteredJobs = applyFilter(filterList, jobs);
      displayJobs(filteredJobs);
    }
  });
};

init();

function applyFilter(filterList, filteredJobs) {
  let filtered = [];
  if (!filterList.length) {
    return jobs;
  }
  filterList.forEach((filter) => {
    filtered = filteredJobs.filter((job) => {
      return (
        Object.values(job).includes(filter) ||
        job.languages?.includes(filter) ||
        job.tools?.includes(filter)
      );
    });
  });
  return filtered;
}

function indicateFilterWrapper(filterValue) {
  if (!filterList.includes(filterValue)) {
    const node = document.createElement("div");
    node.classList.add("filter-keys");
    node.setAttribute("name", filterValue);
    node.innerHTML = `<span class="key">${filterValue}</span> <button class="close-btn">&times;</button>`;
    filterKeysContainer.append(node);
    filterList.push(filterValue);
  }

  filterWrapper.classList.remove("hidden");
}
function onBtnClick(wrapper, callback) {
  wrapper.addEventListener("click", (event) => {
    callback(event);
  });
}
function onFilterWrapperClick(filterKeysContainer, callback) {
  filterKeysContainer.addEventListener("click", (event) => {
    callback(event);
  });
}
function displayJobs(jobs) {
  let html = "";
  wrapper.innerHTML = "";
  html = jobs
    .map((job) => {
      return `
        <div class="list-item ${job.featured && "border-color"}">
          <div class="job">
            <div class="company-image">
              <img src="${job.logo}" alt="" />
            </div>
            <div class="job-details">
              <span class="company-name">${job.company}</span>
              <span class="new ${!job.new && "hidden"}">New!</span>
              <span class="featured  ${
                !job.featured && "hidden"
              }">featured</span>
              <span class="job-title">${job.position}</span>
              <div class="job-time">
                <span class="posted-at">${job.postedAt} &nbsp; . &nbsp; </span>
                <span class="contract">${job.contract} &nbsp; . &nbsp; </span>
                <span class="location">${job.location}</span>
              </div>
            </div>
          </div>
          <div class="categories">
            <button class="btn role">${job.role}</button>
            <button class="btn level">${job.level}</button>
            ${
              job.languages &&
              job.languages
                .map((language) => {
                  return `<button class="btn language">${language}</button>`;
                })
                .join("")
            }
            ${
              job.tools &&
              job.tools
                .map((tool) => {
                  return `<button class="btn tool">${tool}</button>`;
                })
                .join("")
            }
          </div>
        </div>
      
      `;
    })
    .join("");
  wrapper.innerHTML = html;
}
