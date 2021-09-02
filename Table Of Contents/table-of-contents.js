let contents = document.getElementById("table-of-contents");
let headers = document.getElementsByTagName("h1");
for (let header of headers) {

}

function makeHeader(header){
  let div = document.createElement("div");
  if (header.nodeName === "H2") {
    div.setAttribute("class", "toc h2");
  }else{
    div.setAttribute("class", "toc h1");
  }
  div.innerHTML = `<span>${header.innerHTML}</span><p>123</p>`;
  div.onclick = () => {
    header.scrollIntoView();
  }
  return div;
}



function getIndex(docEl, el) {
  while (el != null && el.parentNode != docEl) {
    el = el.parentNode;
  }

  if (el == null) return -1;
  let i = 0;
  for (let child of docEl.children) {
    if (child == el) return i;
    i++;
  }
  return -1;
}

function makeContents(docId, contentsId){
  let contents = document.getElementById(contentsId);
  let doc = document.getElementById(docId);

  let contentsIdx = getIndex(doc, contents);

  let headers = [];
  let h1s = doc.getElementsByTagName("h1");
  for (let h1 of h1s) {
    let idx = getIndex(doc, h1);
    if (idx > contentsIdx) {
      headers.push({
        header: h1,
        index: idx,
      })
    }
  }

  let h2s = doc.getElementsByTagName("h2");
  for (let h2 of h2s) {
    let idx = getIndex(doc, h2);
    if (idx > contentsIdx) {
      headers.push({
        header: h2,
        index: idx,
      })
    }
  }

  headers.sort((a,b)=> a.index > b.index ? 1 : -1)
  for (let header of headers) {
    contents.appendChild(makeHeader(header.header));
  }


}

export {makeContents}
