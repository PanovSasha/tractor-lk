import { pointsSlider } from '../swiper'
import { $RESULT_SHELL } from './buy'
import { $WINDOW, ACTIVE_CLASS, TABLET_WIDTH } from '../../lib/constants'

const $MAP_TAB = $('[data-tab="map"]')
const $LIST_TAB = $('[data-tab="list"]')

export const pointFunctions = (el, i) => {
  const { name } = el

  const pointStr = `.js-buy-map-point-${i}`

  const $point = $(pointStr)
  $point.append(`
            <div class="buy-map-point__shell">
              <img 
              class="buy-map-point__icon"
              loading="lazy" src="/assets/svg/icons/point.svg" alt="">
              
              <div class="buy-map-point__title">
                ${name}
              </div>
            </div>
        `)
}

export const renderPoint = (el, map, i, YMapMarker) => {
  const [latitude, longitude] = el.coordinates

  const point = document.createElement('div')
  point.className = `buy-map__point js-buy-map-point js-buy-map-point-${i}`

  point.onclick = () => {
    map.update({
      location: {
        center: [Number(longitude), Number(latitude)],
        duration: 500,
      },
    })

    pointsSlider.slideTo(i, 1)
    $('.buy-actions__point').removeClass(ACTIVE_CLASS)
    $('.buy-actions__point.swiper-slide-active').addClass(ACTIVE_CLASS)

    if ($WINDOW.width() < TABLET_WIDTH) {
      $LIST_TAB.click()
    }
  }

  const marker = new YMapMarker(
    {
      coordinates: [longitude, latitude],
      draggable: false,
    },
    point
  )

  map.addChild(marker)

  pointFunctions(el, i)
}

export const renderNearList = (points, map) => {
  const renderNearListPoints = (points) => {
    const renderType = (type) => {
      let str = ''

      $.each(type, function (i, el) {
        if (i === 0) {
          str = el
        } else {
          str = str + ` / ${el}`
        }
      })

      return str
    }

    const renderPhones = (phones, formattedPhone) => {
      let phonesStr = ''

      $.each(phones, function (i, el) {
        if (el !== '') {
          phonesStr =
            phonesStr +
            `
                   <a
                    class="btn btn--primary buy-actions__point-phone"
                    href="tel:${el}">${formattedPhone[i]}</a>
                `
        }
      })

      return phonesStr
    }

    const renderSite = (site) => {
      if (site) {
        return `
          <a target="_blank" class="buy-actions__point-site btn btn--secondary" href=${site}>
            Перейти на сайт
          </a>
          `
      } else return ''
    }

    const renderMail = (mails) => {
      let mailsStr = ''

      $.each(mails, function (_, el) {
        if (el !== '') {
          mailsStr =
            mailsStr +
            `
                <a
                  class="buy-actions__point-mail accessibility-link"
                  href="mailto:${el}">
                  ${el}
                </a>
                `
        }
      })

      return mailsStr
    }

    let pointsStr = ''

    $.each(points, function (_, el) {
      const { elem } = el

      const { name, typeText, phone, formattedPhone, address, site, mail, coordinates } = elem

      pointsStr =
        pointsStr +
        `
                  <div 
                  data-latitude="${coordinates[0]}" 
                  data-longitude="${coordinates[1]}"
                  class="buy-actions__point swiper-slide js-buy-actions-point">
           
                   
              <p class="buy-actions__point-type">
                ${renderType(typeText)}
              </p>
              
              <h3 class="buy-actions__point-name">
                ${name}
              </h3>
              
              <p class="buy-actions__point-address">
                ${address}
              </p>
              
              <div class="buy-actions__point-mails">
                   ${renderMail(mail)}
              </div>
              
              <div class="buy-actions__point-contacts">
                ${renderSite(site)}

                  ${renderPhones(phone, formattedPhone)}
              </div>
            </div>
            `
    })

    return pointsStr
  }

  const nearListPointsFns = (map) => {
    const $listPointBtns = $('.js-buy-actions-point')

    $listPointBtns.on('click', function () {
      const $t = $(this)

      $listPointBtns.removeClass(ACTIVE_CLASS)
      $t.addClass(ACTIVE_CLASS)

      if ($WINDOW.width() < TABLET_WIDTH) {
        $MAP_TAB.click()
      }

      map.update({
        location: {
          center: [$t.attr('data-longitude'), $t.attr('data-latitude')],
          duration: 500,
        },
      })
    })
  }

  $RESULT_SHELL.text('').append(`
            ${renderNearListPoints(points)}
       `)

  nearListPointsFns(map)

  pointsSlider.slideTo(0, 200)
  pointsSlider.update()
}

export const renderPointsToMap = (data, map, marker, YMapMarker) => {
  const distanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => {
      return deg * (Math.PI / 180)
    }

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1) // deg2rad below
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const sortNearPoints = (data, coordsGeoPoint, YMapMarker) => {
    const sortedPointsByDistance = []

    let leftBottom = []
    let rightTop = []

    $.each(data, function (i, elem) {
      const [latitude, longitude] = elem.coordinates

      const distance = distanceBetweenPoints(coordsGeoPoint[1], coordsGeoPoint[0], latitude, longitude)

      sortedPointsByDistance[i] = { distance, elem }
    })

    sortedPointsByDistance.sort(function (a, b) {
      return a.distance - b.distance
    })

    $.each(sortedPointsByDistance, function (i, el) {
      renderPoint(el.elem, map, i, YMapMarker)
    })

    renderNearList(sortedPointsByDistance, map)

    if (sortedPointsByDistance.length > 6) {
      sortedPointsByDistance.length = 7
    }

    let sortedPointsByDistanceLength = sortedPointsByDistance.length

    $.each(sortedPointsByDistance, function (i, el) {
      if (
        i + 2 <= sortedPointsByDistance.length - 1 &&
        sortedPointsByDistance[i].distance + sortedPointsByDistance[i + 1].distance <=
          sortedPointsByDistance[i + 2].distance
      ) {
        sortedPointsByDistanceLength = i + 2
      }
    })

    sortedPointsByDistance.length = sortedPointsByDistanceLength

    leftBottom = [sortedPointsByDistance[0].elem.coordinates[1], sortedPointsByDistance[0].elem.coordinates[0]]
    rightTop = [sortedPointsByDistance[0].elem.coordinates[1], sortedPointsByDistance[0].elem.coordinates[0]]

    $.each(sortedPointsByDistance, function (i, el) {
      const { longitude, latitude } = el

      if (latitude < leftBottom[0]) {
        leftBottom[0] = longitude
      }

      if (latitude > rightTop[0]) {
        rightTop[0] = longitude
      }

      if (longitude < leftBottom[1]) {
        leftBottom[1] = latitude
      }

      if (latitude > rightTop[1]) {
        rightTop[1] = latitude
      }
    })

    return { leftBottom, rightTop }
  }

  const changeGeoCoordsForBoundsMap = (leftBottom, rightTop, coordsGeoPoint) => {
    let checkedLeftBottom = leftBottom
    let checkedRightTop = rightTop

    if (coordsGeoPoint[0] < checkedLeftBottom[0]) {
      checkedLeftBottom[0] = coordsGeoPoint[0]
    }

    if (coordsGeoPoint[1] < checkedLeftBottom[1]) {
      checkedLeftBottom[1] = coordsGeoPoint[1]
    }

    if (coordsGeoPoint[0] > checkedRightTop[0]) {
      checkedRightTop[0] = coordsGeoPoint[0]
    }

    if (coordsGeoPoint[1] > checkedRightTop[1]) {
      checkedRightTop[1] = coordsGeoPoint[1]
    }

    checkedLeftBottom[0] = Number(checkedLeftBottom[0]) - 0.4
    checkedLeftBottom[1] = Number(checkedLeftBottom[1]) - 0.4

    checkedRightTop[0] = Number(checkedRightTop[0]) + 0.4
    checkedRightTop[1] = Number(checkedRightTop[1]) + 0.4

    return { checkedLeftBottom, checkedRightTop }
  }

  $(`.js-buy-map-point`).hide()

  const coordsGeoPoint = marker._props.coordinates
  const { leftBottom, rightTop } = sortNearPoints(data, coordsGeoPoint, YMapMarker)

  const { checkedLeftBottom, checkedRightTop } = changeGeoCoordsForBoundsMap(leftBottom, rightTop, coordsGeoPoint)

  map.setLocation({
    bounds: [checkedLeftBottom, checkedRightTop],
    duration: 500,
  })
}
