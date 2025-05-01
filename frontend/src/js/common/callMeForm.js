import { ERROR_CLASS, SHOW_CLASS } from '../lib/constants'
import { deleteSpinner, renderSpinner } from '../lib/utils'

export const CallMeFormFns = () => {
  const $formShell = $('.js-call-form-shell')

  $.each($formShell, function(_, el) {
    const $formShellEl = $(el)

    const $form = $formShellEl.find('.js-call-form')
    const $formSuccess = $formShellEl.find('.js-call-form-success')
    const $formError = $formShellEl.find('.js-call-form-error')

    const formTypeSpare = $formShellEl.attr('data-form-type') === 'spare'
    const formTypeCall = $formShellEl.attr('data-form-type') === 'call'

    const regExpPhone = /^[-+\d(), ]+$/
    const regExpPhoneAlphabet = /^[-+\d(), ]+$/

    const $inputs = $form.find('.js-input')
    const name = $form.find('[name="fullName"]')
    const phone = $form.find('[name="phone"]')

    const $SUBMIT_BTN = $form.find('.js-call-form-submit-btn')

    const ERROR_PHONE = 'error-phone'

    let isPhoneValid = false

    const clearInputs = () => {
      $inputs.val('')
    }

    const isInputsValues = (submitBtnClick) => {
      let inputsWithVal = true

      $.each($inputs, function(_, el) {
        const $el = $(el)

        if ($el.val().trim() === '') {
          if (submitBtnClick) {
            $el.parent().addClass(ERROR_CLASS)

            if ($el[0].name === 'phone') {
              phone.parent().removeClass(ERROR_PHONE)
            }
          }

          inputsWithVal = false
        }
      })

      return inputsWithVal
    }

    const checkInputValByFocusout = () => {
      $.each($inputs, function(_, el) {
        const $el = $(el)

        $el.on('focusout', function() {
          if ($el.val().trim() === '') {
            $el.parent().addClass(ERROR_CLASS)

            if ($el[0].name === 'phone') {
              phone.parent().removeClass(ERROR_PHONE)
            }
          }
        })
      })
    }

    const sendData = () => {

      // http://x92617p0.beget.tech/api/v1/add_consultation
      //   это для формы принимает массив params - в нем поля fullName и phone и bot - проверка на бота если пользователь вводил что-то с клавиатуры тогда 0 иначе 1
      // в заголовке Api-Key - tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH
      //   Content-Type - application/json
      // параметры отправлять в x-www-from-urlencoded
      // params[fullName]=Иван&params[phone]=4454555&bot=0

      $form.removeClass(SHOW_CLASS)
      renderSpinner($formShellEl)

      if (formTypeCall) {
        $.ajax({
          type: 'post',
          url: '/api/v1/add_consultation',
          headers: {
            'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
          },
          data: `params[fullName]=${name.val()}&params[phone]=${phone.val()}&bot=0`,
          contentType: 'application/x-www-form-urlencoded',
          success: (data) => {
            deleteSpinner()
            name.val('')
            phone.val('')
            $formSuccess.addClass(SHOW_CLASS)
          },
          error: () => {
            deleteSpinner()
            $formError.addClass(SHOW_CLASS)
          },
        })
      }

      // --------------------------------------------------

      // Отправить выбранные детали
      // /api/v1/add_order
      // все тоже самое что и с parts
      // принимает параметры в json
      // {
      //   "name": "Иван",
      //   "phone": "56456456456",
      //   "parts": ["90.32.031-01СБ", "20005493AAFG", "100.71.011СБ"]
      // }
      if (formTypeSpare) {
        const data = {}
        data.name = name.val()
        data.phone = phone.val()

        let items = window.localStorage.getItem('items')
        items = JSON.parse(items)

        const parts = []

        if (items) {
          $.each(items, function(_, el) {
            parts.push(el.article)
          })

          data.parts = parts
        }

        $.ajax({
          type: 'post',
          url: '/api/v1/add_order',
          headers: {
            'Api-Key': 'tUKdAP2Gmv/?Vyv23CI16rDsAB=UN7yFpQvirTa5Ix21BzP4w6lFfqr1qSoySJfKVhXCpH',
          },
          data: JSON.stringify(data),
          dataType: 'json',
          contentType: 'application/json',
          success: (data) => {
            deleteSpinner()
            name.val('')
            phone.val('')
            $formSuccess.addClass(SHOW_CLASS)
          },
          error: () => {
            deleteSpinner()
            $formError.addClass(SHOW_CLASS)
          },
        })
      }
    }

    const checkFormFields = (submitBtnClick) => {
      const allInputsWithValues = isInputsValues(submitBtnClick)

      if (allInputsWithValues && isPhoneValid) {
        return true
      }
    }

    const checkInputValue = function(value, regexp) {
      if (regexp.test(value)) return true
    }

    const checkPhoneValue = (submitBtnClick) => {
      const checkPhone = checkInputValue(phone.val(), regExpPhone)

      if (!checkPhone) {
        phone.parent().addClass(ERROR_PHONE)
        isPhoneValid = false
      } else {
        phone.parent().removeClass(ERROR_PHONE)
        isPhoneValid = true
      }
    }

    const checkInputValueByInput = () => {
      $inputs.on('input', function() {
        const $t = $(this)
        const $tVal = $t.val()

        const $inputBox = $t.parent()
        if ($tVal.trim() !== '') {
          $inputBox.removeClass(ERROR_CLASS)
        }

        if (checkInputValue($tVal, regExpPhone) && $t.attr('name') === 'phone') {
          if ($tVal.charAt(0) !== '+') {
            $t.val(`+${$tVal}`)
          }
        }


        setTimeout(() => {
          checkFormFields()
        }, 100)
      })
    }

    const checkSpecialInputsForError = () => {
      phone.on('input', () => {
        checkPhoneValue()
      })
    }

    const checkAllFieldsFormBySubmitBtnPress = () => {
      $SUBMIT_BTN.on('click', function(e) {

        checkPhoneValue(true)

        if (checkFormFields(true)) {
          sendData()
        }
      })
    }

    // clearInputs()
    checkInputValueByInput()
    checkInputValByFocusout()
    checkSpecialInputsForError()
    checkAllFieldsFormBySubmitBtnPress()
  })


}
