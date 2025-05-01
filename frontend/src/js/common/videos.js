export const videosFns = () => {
  const $VIDEO_SHELL = $('.js-videos-item-shell')
  const $VIDEOS_LAY_ITEM = $('.js-videos-lay-item')

  $.each($VIDEO_SHELL, function (_, el) {
    const copyVideoToOverlayShell = () => {
      $VIDEOS_LAY_ITEM.html('').append($videoFileCopy)

      const $videoEl = $($videoFileCopy[0])

      if ($videoFileCopy[0].outerHTML.toLowerCase().includes('iframe')) {
        if ($videoFileCopy.attr('src').toLowerCase().includes('rutube')) {
          setTimeout(() => {
            $videoFileCopy[0].contentWindow?.postMessage(
              JSON.stringify({
                type: 'player:play',
              }),
              'https://rutube.ru'
            )
          }, 2000)
        }
      }

      if ($videoFileCopy[0].outerHTML.toLowerCase().includes('<video')) {
        $videoFileCopy.attr('controls', true).attr('autoplay', true)
        $videoFileCopy[0].play()
      }
    }

    const openVideoOverlay = () => {
      $btn.on('click', function () {
        copyVideoToOverlayShell()
      })
    }

    const $el = $(el)
    const $btn = $el.find('.js-videos-item-btn')
    const $videoFile = $el.find('.videos__item-video')
    const $videoFileCopy = $videoFile.clone().removeClass().addClass('videos-lay__item-video')

    openVideoOverlay()
  })
}
