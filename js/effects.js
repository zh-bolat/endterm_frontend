/*
  Forma — jQuery features
  Everything that uses jQuery lives in this file:
  favorites panel, product details, FAQ accordion and smooth scrolling.
  $(function () { ... }) runs the code when the DOM is ready.
*/

$(function () {

  /* ===== Favorites panel: fadeIn / fadeOut ===== */
  const $panel = $('#favorites-panel');          // ID selector
  const $toggle = $('#favorites-toggle');

  function openPanel() {
    $panel.stop(true, true).fadeIn(200);
    $toggle.attr('aria-expanded', 'true');
  }

  function closePanel() {
    $panel.stop(true, true).fadeOut(200);
    $toggle.attr('aria-expanded', 'false');
  }

  $toggle.on('click', function (event) {
    event.stopPropagation(); // otherwise the document click below closes it again
    if ($panel.is(':visible')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  $panel.find('.favorites-close').on('click', closePanel);   // traversal: find()

  // A click anywhere outside the panel closes it
  $(document).on('click', function (event) {
    if ($panel.is(':visible') && $(event.target).closest('#favorites-panel').length === 0) {
      closePanel();
    }
  });

  // Escape closes the panel and returns focus to the button
  $(document).on('keydown', function (event) {
    if (event.key === 'Escape' && $panel.is(':visible')) {
      closePanel();
      $toggle.trigger('focus');
    }
  });

  // "Remove" inside the panel: the row slides up, then the product is removed.
  // The list is rebuilt by JavaScript, so the handler is delegated to the panel.
  $panel.on('click', '.favorite-remove', function (event) {
    event.stopPropagation();
    const $item = $(this).closest('.favorite-item');           // traversal: closest()
    const name = $item.find('.favorite-name').text();

    $item.slideUp(250, function () {
      toggleFavorite($item.data('id'));
      showToast(name + ' removed from favorites', 'info');
    });
  });


  /* ===== FAQ accordion on the About page: slideDown / slideUp =====
     Only one answer is open at a time, so the list stays short. */
  $('#faq .faq-question').on('click', function () {     // descendant selector
    const $question = $(this);
    const $item = $question.parent();                    // traversal: parent()
    const $answer = $question.next('.faq-answer');       // traversal: next()
    const isOpen = $item.hasClass('is-open');

    // Close the other open items
    $item.siblings('.is-open')                           // traversal: siblings()
      .removeClass('is-open')
      .find('.faq-answer').slideUp(250)
      .end()
      .find('.faq-question').attr('aria-expanded', 'false');

    // Open or close the clicked one
    $item.toggleClass('is-open', !isOpen);
    $question.attr('aria-expanded', String(!isOpen));
    if (isOpen) {
      $answer.slideUp(250);
    } else {
      $answer.slideDown(250);
    }
  });

});
