const rotateIconBtn = () => {
  const btn = $('.js-btn--more')
  let countDeg = 360

  btn.on('click', function() {
    $(this).find('svg').css('rotate', `${countDeg}deg`)
    countDeg = countDeg + 360
  })
}

const rotate90degIconBtn = () => {
  const btn = $('.js-btn--rotate-180')
  let countDeg = 180

  btn.on('click', function() {
    $(this).find('svg').css('rotate', `${countDeg}deg`)
    countDeg = countDeg + 180
  })
}

export const buttonsFns = () => {
  rotateIconBtn()
  rotate90degIconBtn()
}

