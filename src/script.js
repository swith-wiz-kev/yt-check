import "./style.css";
import filelist from "./filelist.txt";

//const filelistURL =
//  "https://raw.githubusercontent.com/swith-wiz-kev/git_test/main/filelist2.txt";
let myArray = [];

function File(fileName, folderName, youtubeUrl) {
  this.fileName = fileName;
  this.folderName = folderName;
  this.youtubeUrl = youtubeUrl;
}

/* async function readFile() {
  const response = await fetch(filelistURL);
  const result = await response.text();
  return result;
} */

/* function removeNonStayc(fullText) {
  return fullText.slice(2683206 + 44, 3014287 - 3);
} */

function readLines(fullText) {
  return fullText.split("\n");
}

function getFolderName(deeperSplitArray) {
  let folderName = "";
  for (let index = 1; index < deeperSplitArray.length - 1; index++) {
    folderName = folderName + deeperSplitArray[index] + "/";
  }
  return folderName;
}

function getYoutubeUrl(fileName) {
  const closeBracketIndex = fileName.lastIndexOf("]");
  const openBracketIndex = fileName.lastIndexOf("[");
  if (fileName.lastIndexOf(".vtt") > 1) {
    return "";
  } else if (closeBracketIndex - openBracketIndex == 12) {
    const youtubeVideoCode = fileName.slice(
      openBracketIndex + 1,
      closeBracketIndex
    );
    return "https://www.youtube.com/watch?v=" + youtubeVideoCode;
  } else return "";
}

function processText(fullText) {
  const splitTextArray = readLines(fullText);
  for (let index = 0; index < splitTextArray.length - 1; index++) {
    const splitText = splitTextArray[index];
    const deeperSplitArray = splitText.split("\\");
    const fileName = deeperSplitArray[deeperSplitArray.length - 1];
    const folderName = getFolderName(deeperSplitArray);
    const youtubeUrl = getYoutubeUrl(fileName);
    const newFile = new File(fileName, folderName, youtubeUrl);
    myArray.push(newFile);
  }
}

function encodeString(string) {
  let encodedString = "";
  for (let index = 0; index < string.length; index++) {
    const charCode = string.charCodeAt(index).toString();
    encodedString = encodedString + charCode + "-";
  }
  return encodedString;
}

function decodeString(string) {
  let decodedString = "";
  const charArray = string.split("-");
  for (let index = 0; index < charArray.length - 1; index++) {
    decodedString += String.fromCharCode(parseInt(charArray[index]));
  }
  return decodedString;
}

function createDiv(divClass, folderName) {
  const mainDiv = document.querySelector(".maingrid");
  const div = document.createElement("div");
  div.classList.add("c" + divClass);
  div.classList.add("foldernames");
  div.textContent = folderName;
  const downloadCodeDiv = document.createElement("p");
  downloadCodeDiv.classList.add("downloadcodes");
  downloadCodeDiv.textContent =
    '-o "' + folderName + '%(title)s [%(id)s].%(ext)s" ';
  div.appendChild(downloadCodeDiv);
  mainDiv.appendChild(div);
}

function createFolder(folderName) {
  const folderNameEncoded = encodeString(folderName);
  const isCreated = document.querySelector(".c" + folderNameEncoded);
  if (isCreated === null) {
    createDiv(folderNameEncoded, folderName);
  }
}

function addFile(fileName, folderName, youtubeUrl) {
  const folderNameEncoded = encodeString(folderName);
  const targetSubFolder = document.querySelector(".c" + folderNameEncoded);
  if (youtubeUrl == "") {
    const textOnly = document.createElement("li");
    textOnly.textContent = fileName;
    targetSubFolder.appendChild(textOnly);
  } else {
    const link = document.createElement("a");
    link.textContent = fileName;
    link.href = youtubeUrl;
    targetSubFolder.appendChild(link);
  }
}

function addDownloadCode(youtubeUrl, folderName) {
  if (youtubeUrl == "") {
  } else {
    const folderNameEncoded = encodeString(folderName);
    const targetTextArea = document.querySelector(
      ".c" + folderNameEncoded + ">.downloadcodes"
    );
    targetTextArea.textContent += youtubeUrl + " ";
  }
}

function printLibrary(myArray) {
  for (let index = 0; index < myArray.length; index++) {
    createFolder(myArray[index].folderName);
    addFile(
      myArray[index].fileName,
      myArray[index].folderName,
      myArray[index].youtubeUrl
    );
    addDownloadCode(myArray[index].youtubeUrl, myArray[index].folderName);
  }
}

function addTooltip(element, tooltip) {
  element.classList.add("tooltip");
  const tooltipElement = document.createElement("span");
  tooltipElement.textContent = tooltip;
  tooltipElement.classList.add("tooltiptext");
  element.appendChild(tooltipElement);
}

function processResponseTitle(res, youtubeUrl, counter) {
  const targetElement = document.querySelector(`[href="${youtubeUrl}"]`);
  if (targetElement == null) {
    fetchLoop(counter + 1);
  } else {
    if (res == "Unauthorized") {
      targetElement.classList.add("needcheck");
      addTooltip(targetElement, "Check in Youtube.com");
    } else if (res == "Bad Request") {
      targetElement.classList.add("error");
      addTooltip(targetElement, "Instagram or Twitch");
    } else if (res == "Not Found") {
      targetElement.classList.add("error");
      addTooltip(targetElement, "Removed");
    } else if (res == "Forbidden") {
      targetElement.classList.add("error");
      addTooltip(targetElement, "Private");
    } else if (res.title == null || res.title == undefined) {
      targetElement.classList.add("new-error");
      console.log(res + " " + youtubeUrl);
    } else if (
      targetElement.textContent.substr(0, res.title.length) != res.title
    ) {
      targetElement.classList.add("needcheck");
      addTooltip(targetElement, res.title);
    } else {
      targetElement.classList.add("samename");
    }
    fetchLoop(counter + 1);
  }
}

function checkError(res, counter) {
  if (res.ok) {
    return res.json();
  } else {
    return res.text();
  }
}

function displayStatus(youtubeUrl, counter) {
  fetch("https://www.youtube.com/oembed?url=" + youtubeUrl + "&format=json")
    .then((res) => checkError(res, counter))
    .then((res) => processResponseTitle(res, youtubeUrl, counter));
}

function fetchLoop(counter) {
  if (counter == myArray.length) {
    // 300)){//
    console.log("done");
  } else {
    if (myArray[counter].youtubeUrl == "") {
      fetchLoop(counter + 1);
    } else {
      displayStatus(myArray[counter].youtubeUrl, counter);
    }
  }
}

function printStatus() {
  fetchLoop(0);
}

//readFile().then((value) => {
processText(filelist);
printLibrary(myArray);
printStatus();
//});
