$(document).ready ->
  $(".signin_box_button").click (e)->
  	$(".input—validate").each ->
      $(this).removeClass("error_input")
      if $(this).val() == ""||$(this).val()==null
        $(this).addClass("error_input")
        e.preventDefault()