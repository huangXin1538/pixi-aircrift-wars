function getWidth (precent) {
  let w = document.body.clientWidth > 720 ? 720 : document.body.clientWidth;
  return (precent / 50) * w / 2;
}
function getHeight (precent) {
  let h = document.body.clientHeight;
  return (precent / 50) * h / 2;
}

export {getWidth, getHeight};