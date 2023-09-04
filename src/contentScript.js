"use strict";

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

import { jsPDF } from "jsPDF";

var imgList = [];
var filename;
var description;
var downloadLink;
var target;
var doc;
const imagesWidth = [];
const imgDataList = [];
var img;
var ImageToLoad;

function createHtmlElement() {
  description = document.createElement("dt");
  description.innerText = "Download Link";

  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.innerText = filename;
  downloadLink.id = "extensionClick";

  target = document.querySelector("#xbox-inline > .mod_media-attachList");
  target.appendChild(description);
  target.appendChild(
    Object.assign(document.createElement("dd"), {
      innerHTML: downloadLink.outerHTML,
    })
  );
  console.log("download text created");
}
// ref: https://stackoverflow.com/questions/24912021/convert-a-image-url-to-pdf-using-jspdf
function getImageFromUrl(url, callback) {
  ImageToLoad.crossOrigin = "Anonymous";

  ImageToLoad.onError = function () {
    console.log('Cannot load image: "' + url + '"');
  };

  ImageToLoad.onload = function () {
    alert("image is loaded");
  };

  ImageToLoad.onload = function () {
    imagesWidth.push({
      width: ImageToLoad.width,
      height: ImageToLoad.height,
    });
    callback(ImageToLoad);
  };
  ImageToLoad.src = url;
  createPDF(ImageToLoad);
}

function createPDF(imgData) {
  imgDataList.push(imgData);
  var width = imgData.width; // Current image width
  var height = imgData.height; // Current image height
  doc.addImage({
    imageData: imgData,
    x: 0,
    y: 0,
    w: width,
    h: height,
  });
  if (imgDataList.length !== imgList.length) doc.addPage();
  if (imgDataList.length == imgList.length) doc.save(filename);
}

function jsPDFimages() {
  for (var i = 0; i < imgList.length; i++) {
    getImageFromUrl(imgList[i].currentSrc, createPDF);
  }
}

// --main--
imgList = document.querySelectorAll("#pptContainer > div > section > img");
if (imgList !== null && imgList.length !== 0) {
  console.log("Imgs detect");
  filename =
    document.title.split("|")[0].replaceAll(/\.|\//g, "_").trim() + ".pdf";
  createHtmlElement();

  doc = new jsPDF({
    orientation: "l",
    hotfixes: ["px_scaling"],
    unit: "px",
    format: [imgList[0].naturalWidth, imgList[0].naturalHeight],
  });
  img = new Image();
  ImageToLoad = new Image();

  document
    .getElementById("extensionClick")
    .addEventListener("click", jsPDFimages, false);
} else {
  console.log("imgList is null");
}
