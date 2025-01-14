window.Alchemy = {} if typeof (window.Alchemy) is "undefined"

$.extend Alchemy,

  ElementDirtyObserver: (selector) ->
    $(selector).find('input[type="text"], select').change (e) =>
      $content = $(e.target)
      $content.addClass('dirty')
      @setElementDirty $content.closest(".element-editor")
      return

  setElementDirty: (element) ->
    $element = $(element)
    $element.addClass('dirty')
    window.onbeforeunload = @pageUnload

  pageUnload: ->
    Alchemy.t('page_dirty_notice')

  setElementClean: (element) ->
    $element = $(element)
    $element.removeClass('dirty')
    $element.find('> .element-body .dirty').removeClass('dirty')
    window.onbeforeunload = undefined

  isPageDirty: ->
    $('#element_area').find('.element-editor.dirty').length > 0

  isElementDirty: (element) ->
    $(element).hasClass('dirty')

  checkPageDirtyness: (element) ->
    callback = undefined
    if $(element).is("form")
      callback = ->
        $form = $("<form action=\"#{element.action}\" method=\"POST\" style=\"display: none\" />")
        $form.append $(element).find("input")
        $form.appendTo "body"
        Alchemy.pleaseWaitOverlay()
        $form.submit()
    else if $(element).is("a")
      callback = ->
        Turbolinks.visit(element.pathname)
    if Alchemy.isPageDirty()
      Alchemy.openConfirmDialog Alchemy.t('page_dirty_notice'),
        title: Alchemy.t('warning')
        ok_label: Alchemy.t('ok')
        cancel_label: Alchemy.t('cancel')
        on_ok: ->
          window.onbeforeunload = undefined
          callback()
      false
    else
      true

  PageLeaveObserver: ->
    $('#main_navi a').click (event) ->
      unless Alchemy.checkPageDirtyness(event.currentTarget)
        event.preventDefault()
