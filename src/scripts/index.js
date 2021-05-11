import Swiper from 'swiper/swiper-bundle.js'
import 'swiper/swiper-bundle.css'
import IMask from 'imask'
import noUiSlider from 'noUiSlider/distribute/nouislider.min.js'
import 'noUiSlider/distribute/nouislider.min.css'

import ScrollMagic from 'scrollmagic'
import { gsap, TweenMax } from 'gsap'
import { ScrollToPlugin } from 'gsap/all'
gsap.registerPlugin(ScrollToPlugin)

class Init {
  constructor() {
    this.init()

    // Init smothscroll
    this.controller = new ScrollMagic.Controller()
    this.controller.scrollTo(function (newpos) {
      TweenMax.to(window, 0.6, { scrollTo: { y: newpos } })
    })

    this.directionScroll = []
  }

  init() {
    this.events()

    this.actions().initPhoneMask()

    this.actions().initCatalogRangeSlider()

    setTimeout(() => {
      this.actions().showBody()
      this.actions().scrollToBlockOnLoading()
    }, 300)

    if (document.querySelectorAll('.case__slider').length) {
      const caseSliders = document.querySelectorAll('.case__slider')
      caseSliders.forEach((item) => {
        this.actions().initCaseSlider(item)
      })
    }
  }

  events() {
    const _this = this

    document.addEventListener('scroll', (e) => {
      _this.actions().toggleHeaderOnScroll()
    })

    window.ap(document).on('click', '.header-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
      if (document.documentElement.clientWidth < 1024) {
        _this.actions().toggleMenu(this)
      }
    })

    window.ap(document).on('click', '.footer-list__link', function (e) {
      e.preventDefault()
      _this.actions().scrollToBlock(this)
    })

    window.ap(document).on('input', '[data-type="textarea"]', function () {
      _this.actions().autoGrowTextarea(this)
    })

    const emailInput = document.querySelectorAll('input[data-type="email"]')
    emailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkEmail(this)
      })
    })

    const noTelAndEmailInput = document.querySelectorAll(
      'input:not([data-type="tel"]):not([data-type="email"]), textarea'
    )
    noTelAndEmailInput.forEach((item) => {
      item.addEventListener('blur', function () {
        _this.actions().checkOtherInputs(this)
      })
    })

    window.ap(document).on('click', '.tabs__btn', function (e) {
      e.preventDefault()
      _this.actions().tabChange(this)
    })

    window.ap(document).on('click', '.tabs__btn', function (e) {
      e.preventDefault()
      _this.actions().tabChange(this)
    })

    window.ap(document).on('click', '.popup-btn', function (e) {
      e.preventDefault()
      _this.actions().showPopup(this)
    })

    window.ap(document).on('click', '.overlay, .popup__close', function (e) {
      e.preventDefault()
      _this.actions().hidePopup(this)
    })

    window.ap(document).on('click', '.select-open', function (e) {
      e.preventDefault()
      _this.actions().toggleSelect(this)
    })

    window.ap(document).on('input', '.select-block input', function (e) {
      _this.actions().changeSelectItem(this)
    })

    document.addEventListener('click', (e) => {
      const selectBtn = document.querySelectorAll('.select-open')
      const container = document.querySelector('.select-block')
      if (selectBtn.length) {
        selectBtn.forEach((item) => {
          if (
            e.target !== container &&
            e.target.closest('.select-block') === null &&
            e.target !== item &&
            e.target.closest('.select-open') === null
          ) {
            item.classList.remove('active')
            item.closest('.select').querySelector('.select-block').classList.remove('active')
          }
        })
      }
    })

    const inputs = document.querySelectorAll('input')
    if (inputs.length) {
      inputs.forEach((item) => {
        item.addEventListener('focus', function () {
          this.select()
        })
      })
    }

    window.ap(document).on('click', '.header__burger', function (e) {
      e.preventDefault()
      _this.actions().toggleMenu(this)
    })

    if (document.documentElement.clientWidth < 1024) {
      window.ap(document).on('click', '.header__btn', function (e) {
        e.preventDefault()
        _this.actions().toggleMenu(this)
      })
    }
  }

  actions() {
    const _this = this

    return {
      scrollToBlockOnLoading() {
        if (localStorage.getItem('idBLock')) {
          const element = document.querySelector(`#${localStorage.getItem('idBLock')}`)
          const topPos = element.getBoundingClientRect().top + window.pageYOffset
          window.scrollTo({
            top: topPos
          })
          localStorage.removeItem('idBLock')
        }
      },
      scrollToBlock(el) {
        const id = el.getAttribute('href').split('#')[1] || ''
        const linkPathname = el.getAttribute('href').split('#')[0]
        const currentPathname = location.pathname
        if (id.length > 0 && currentPathname === linkPathname) {
          _this.controller.scrollTo(`#${id}`)
        }
        if (currentPathname !== linkPathname) {
          localStorage.setItem('idBLock', id)
          location.href = linkPathname
        }
      },
      toggleHeaderOnScroll() {
        _this.directionScroll.push(window.pageYOffset)
        if (_this.directionScroll[0] < _this.directionScroll[1] && window.pageYOffset > 200) {
          _this.directionScroll = _this.directionScroll.slice(0, 0)
          document.querySelector('.header').classList.add('header--hidden')
        }
        if (_this.directionScroll[0] > _this.directionScroll[1]) {
          _this.directionScroll = _this.directionScroll.slice(0, 0)
          document.querySelector('.header').classList.remove('header--hidden')
        }
      },
      initPhoneMask() {
        document.querySelectorAll('[data-type="tel"]').forEach((item) => {
          const telMask = IMask(item, {
            mask: '+{7} 000 000 00 00'
          })
          let flagInput = true
          item.addEventListener('input', (e) => {
            if ((e.target.value === '+7 8' || e.target.value === '+7') && flagInput === true) {
              e.target.value = '+7'
              telMask.masked.reset()
              telMask.value = '+7'
              flagInput = false
            } else if (e.target.value === '') {
              flagInput = true
            }
          })
          telMask.on('accept', function () {
            item.classList.remove('input-border')
          })
          telMask.on('complete', function () {
            item.classList.add('input-border')
          })
        })
      },
      checkEmail(el) {
        const pattern = /^[a-z0-9_.-]+@[a-z0-9_.-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i
        if (el.value !== '') {
          if (el.value.search(pattern) === 0) {
            el.classList.remove('input-err')
            el.classList.add('input-border')
          } else {
            el.classList.add('input-err')
            el.classList.remove('input-border')
          }
        } else {
          el.classList.remove('input-err')
          el.classList.remove('input-border')
        }
      },
      checkOtherInputs(el) {
        if (el.value !== '') {
          el.classList.add('input-border')
        } else {
          el.classList.remove('input-border')
        }
      },
      showBody() {
        document.querySelector('body').style.opacity = 1
      },
      autoGrowTextarea(el) {
        el.style.height = '2px'
        el.style.height = el.scrollHeight + 'px'
      },
      getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth
      },
      tabChange(el) {
        const tabDataAttr = el.getAttribute('data-tab')
        const tabContainers = el.closest('.tabs').querySelectorAll('.tabs__container')
        const tabNavigationItem = el.closest('.tabs').querySelectorAll('.tabs__btn')

        tabContainers.forEach((item) => {
          item.classList.remove('tabs__container--active')
          if (item.getAttribute('data-tab') === tabDataAttr) {
            item.classList.add('tabs__container--active')
          }
        })

        tabNavigationItem.forEach((item) => {
          if (item.getAttribute('data-tab') !== tabDataAttr) {
            item.classList.remove('tabs__btn--active')
          }
        })

        el.classList.add('tabs__btn--active')
      },
      showPopup(el) {
        const overlay = document.querySelector('.overlay')
        const popupSelector = el.getAttribute('data-popup')
        const popup = document.querySelector(`.popup[data-popup="${popupSelector}"]`)
        const popupClose = popup.querySelector('.popup__close')
        const popupServices = el.getAttribute('data-services')

        el.classList.add('popup-trigger')
        popup.classList.add('popup--active')
        overlay.classList.add('overlay--active')
        if (this.getScrollbarWidth()) {
          document.querySelector('html').classList.add('compensate-for-scrollbar')
        }
        document.querySelector('html').classList.add('fixed')
        if (document.documentElement.clientWidth > 1024) {
          popupClose.focus()
        }

        if (popupServices) {
          popup.querySelector('.select-open span').innerText = popupServices
          popup.querySelector(`.select-block input[value="${popupServices}"]`).checked = true
        }
      },
      hidePopup(el) {
        if (el.classList.contains('overlay--menu')) {
          el.classList.remove('overlay--menu')
          document.querySelector('.header__wrap').classList.remove('header__wrap--active')
          document.querySelector('.header__burger').classList.remove('header__burger--active')
        } else {
          const overlay = document.querySelector('.overlay')
          const popup = document.querySelector('.popup--active')
          const popupTrigger = document.querySelector('.popup-trigger')
          popup.classList.remove('popup--active')
          overlay.classList.remove('overlay--active')
          popupTrigger.focus()
          popupTrigger.classList.remove('popup-trigger')
        }
        document.querySelector('html').classList.remove('compensate-for-scrollbar')
        document.querySelector('html').classList.remove('fixed')
      },
      toggleSelect(el) {
        el.classList.toggle('active')
        el.closest('.select').querySelector('.select-block').classList.toggle('active')
      },
      changeSelectItem(el) {
        const selectOpen = el.closest('.select').querySelector('.select-open')
        _this.actions().toggleSelect(selectOpen)
        el.closest('.select').querySelector('.select-open span').innerText = el.value
      },
      initCatalogRangeSlider() {
        const portfolioSliders = document.querySelectorAll('.portfolio-slider')
        if (portfolioSliders.length) {
          portfolioSliders.forEach((item) => {
            const min = +item.getAttribute('data-min')
            const max = +item.getAttribute('data-max')
            const step = +item.getAttribute('data-step')
            const minInput = item.previousElementSibling.querySelector('.portfolio-slider-from')
            const maxInput = item.previousElementSibling.querySelector('.portfolio-slider-to')
            noUiSlider.create(item, {
              start: [min, max],
              step: step,
              connect: true,
              range: {
                min: [min],
                max: [max]
              },
              format: {
                to: function (value) {
                  return Math.round(value)
                },
                from: function (value) {
                  return value
                }
              }
            })

            item.noUiSlider.on('slide', function (values, handle) {
              ;(handle ? maxInput : minInput).value = values[handle]
            })

            minInput.addEventListener('change', function () {
              item.noUiSlider.set([this.value.replace(/\s/g, ''), null])
            })

            maxInput.addEventListener('change', function () {
              item.noUiSlider.set([null, this.value.replace(/\s/g, '')])
            })
          })
        }
      },
      initCaseSlider(el) {
        const prevArr = el.querySelector('.swiper-button-prev')
        const nextArr = el.querySelector('.swiper-button-next')
        const pagination = el.querySelector('.swiper-pagination')
        ;(() =>
          new Swiper(el, {
            loop: true,
            spaceBetween: 15,
            slidesPerView: 'auto',
            navigation: {
              prevEl: prevArr,
              nextEl: nextArr
            },
            pagination: {
              el: pagination,
              clickable: true
            },
            breakpoints: {
              768: {
                slidesPerView: 2
              }
            }
          }))()
      },
      toggleMenu(el) {
        const burger = document.querySelector('.header__burger')
        const menu = document.querySelector('.header__wrap')
        const overlay = document.querySelector('.overlay')

        burger.classList.toggle('header__burger--active')
        overlay.classList.toggle('overlay--menu')
        menu.classList.toggle('header__wrap--active')
        if (!el.classList.contains('header__btn')) {
          document.querySelector('html').classList.toggle('fixed')
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.controller = new Init()
})
