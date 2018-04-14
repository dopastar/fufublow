function hasClass(ele, cls) {
  if (typeof ele == "undefined") {
    return;
  }
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
  if (typeof ele == "undefined") {
    return;
  }
  if (!hasClass(ele, cls)){
    if (ele.className == '') {
      ele.className = cls;
    }else{
      ele.className += " " + cls;
    }
  }
}

function removeClass(ele, cls) {
  if (typeof ele == "undefined") {
    return;
  }
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
    if (ele.className.slice(-1) == ' ') {
      ele.className = ele.className.slice(0, -1);
    }
  }
}

function toggleClass(ele, cls) {
  if (typeof ele == "undefined") {
    return;
  }
  if (hasClass(ele, cls)) {
    removeClass(ele, cls);
  }else if (!hasClass(ele, cls)) {
    addClass(ele, cls);
  }
}

