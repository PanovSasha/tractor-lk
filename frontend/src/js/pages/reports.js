import { formatBytes, isEnterPressed } from '../lib/utils'
import { DISABLE_CLASS, HIDDEN_CLASS, SHOW_CLASS } from '../lib/constants'

export const reportsFns = () => {
  const $UPLOAD = $('.js-upload')

  const $UPLOAD_INPUT = $UPLOAD.find('.js-upload-input')
  const $UPLOAD_INPUT_LABEL = $UPLOAD.find('.js-upload-input-label')
  const $UPLOAD_INPUT_FILE = $UPLOAD.find('.js-upload-input-file')
  const $UPLOAD_INPUT_FILE_NAME = $UPLOAD.find('.js-upload-input-file-name')
  const $UPLOAD_INPUT_FILE_SIZE = $UPLOAD.find('.js-upload-input-file-size')

  const $UPLOAD_SELECT_YEARS = $UPLOAD.find('.js-upload-select-year')
  const $UPLOAD_SELECT_YEARS_CURRENT_BTN = $UPLOAD_SELECT_YEARS.find('.js-select-current-btn')
  const $UPLOAD_SELECT_YEARS_OPTIONS = $UPLOAD_SELECT_YEARS.find('.js-select-option')

  const $UPLOAD_SELECT_QUARTER = $UPLOAD.find('.js-upload-select-quarter')
  const $UPLOAD_SELECT_QUARTER_CURRENT_BTN = $UPLOAD_SELECT_QUARTER.find('.js-select-current-btn')

  const $UPLOAD_SELECT_QUARTER_OPTIONS = $UPLOAD_SELECT_QUARTER.find('.js-select-option')

  const $UPLOAD_BTN = $UPLOAD.find('.js-upload-btn')

  let IS_YEAR_SELECTED = false
  let IS_QUARTER_SELECTED = false
  let IS_FILE = false

  const checkAllValues = () => {
    if (IS_FILE && IS_YEAR_SELECTED && IS_QUARTER_SELECTED) {
      $UPLOAD_BTN.prop('disabled', false).removeClass(DISABLE_CLASS)
    }
  }

  const sendReport = () => {
    const data = new FormData(document.querySelector('.js-upload'))

    data.set('year', $UPLOAD_SELECT_YEARS_CURRENT_BTN.attr('data-year'))
    data.set('quarter', $UPLOAD_SELECT_QUARTER_CURRENT_BTN.attr('data-quarter'))

    $.ajax({
      url: `/api/v1/add_report`,
      method: 'post',
      contentType: false,
      processData: false,
      data: data,
      headers: {
        'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
      },
      success: function(result) {
        if (result.status === 'success') {
          location.reload()
        }
      },
    })
  }

  const inputFns = () => {
    const checkInput = () => {
      $UPLOAD_INPUT.on('change', function(e) {
        $UPLOAD_INPUT_LABEL.addClass(HIDDEN_CLASS)
        $UPLOAD_INPUT_FILE.addClass(SHOW_CLASS)

        const file = this.files[0]

        $UPLOAD_INPUT_FILE_NAME.html(file.name)
        $UPLOAD_INPUT_FILE_SIZE.html(formatBytes(file.size))

        IS_FILE = true
        checkAllValues()
      })
    }

    checkInput()
  }


  const onSelectFns = () => {
    $UPLOAD_SELECT_YEARS_OPTIONS.on('click', function() {
      const $t = $(this)

      $UPLOAD_SELECT_YEARS_CURRENT_BTN.attr('data-year', $t.attr('data-id'))
      IS_YEAR_SELECTED = true
      checkAllValues()
    })

    $UPLOAD_SELECT_QUARTER_OPTIONS.on('click', function() {
      const $t = $(this)

      $UPLOAD_SELECT_QUARTER_CURRENT_BTN.attr('data-quarter', $t.attr('data-id'))
      IS_QUARTER_SELECTED = true
      checkAllValues()
    })
  }

  const submitFormDataByUploadBtnPress = () => {
    $UPLOAD_BTN.on('click', function() {
      sendReport()
    })
  }

  const filterReports = () => {
    const $reportsShell = $('.js-reports')
    const $reportsSelectOptions = $reportsShell.find('.js-select-option')
    const $reports = $reportsShell.find('.js-reports-items').children()

    $reportsSelectOptions.on('click', function() {
      const $t = $(this)


      if ($t.attr('data-year') === '0') {
        $reports.show()
      } else {
        $reports.hide()

        $.each($reports, function(_, el) {
          const $el = $(el)

          if ($t.attr('data-year') === $el.attr('data-reports-year')) {
            $el.show()
          }
        })
      }
    })
  }

  inputFns()
  onSelectFns()
  filterReports()
  submitFormDataByUploadBtnPress()
}
