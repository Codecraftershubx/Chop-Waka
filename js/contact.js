$(function () {
	$("#send_message").click(function (event) {
		event.preventDefault();

		$("#responsePrompt").hide();
		$("#responsePrompt").html("");

		$("#send_message").attr("disabled", "");

		var name_contact = $("input#name_contact").val();
		var email_contact = $("input#email_contact").val();
		var phone_contact = $("input#phone_contact").val();
		var message_contact = $("#message_contact").val();

		if (name_contact == "") {
			$("input#name_contact").focus();

			$("#responsePrompt").html(
				'<div class="alert alert-danger" role="alert">Please enter a name.</div>'
			);
			$("#responsePrompt").show();

			$("#send_message").removeAttr("disabled");
			return false;
		}

		var email_pattern =
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (email_contact == "" || !email_contact.match(email_pattern)) {
			$("input#name_contact").focus();

			$("#responsePrompt").html(
				'<div class="alert alert-danger" role="alert">Enter a valid email address.</div>'
			);
			$("#responsePrompt").show();

			$("#send_message").removeAttr("disabled");
			return false;
		}

		var mobile_pattern =
			/^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
		if (
			phone_contact == "" ||
			!phone_contact.match(mobile_pattern) ||
			!phone_contact.startsWith("+")
		) {
			$("input#phone_contact").focus();

			$("#responsePrompt").html(
				'<div class="alert alert-danger" role="alert">Enter a valid phone number begining with +</div>'
			);
			$("#responsePrompt").show();

			$("#send_message").removeAttr("disabled");
			return false;
		}

		if (message_contact == "") {
			$("#message_contact").focus();

			$("#responsePrompt").html(
				'<div class="alert alert-danger" role="alert">Message cannot be empty!</div>'
			);
			$("#responsePrompt").show();

			$("#send_message").removeAttr("disabled");
			return false;
		}

		$(".button_spinner").show();
		$("input#name_contact").prop("disabled", true);
		$("input#email_contact").prop("disabled", true);
		$("input#phone_contact").prop("disabled", true);
		$("#message_contact").prop("disabled", true);

		var form_data =
			"name_contact=" +
			name_contact +
			"&email_contact=" +
			email_contact +
			"&phone_contact=" +
			encodeURIComponent(phone_contact) +
			"&message_contact=" +
			encodeURIComponent(message_contact);

		$.ajax({
			url: "email/send_feedback",
			type: "POST",
			data: form_data,
		}).done(function (response) {
			if (response == "success") {
				$("#responsePrompt").html(
					'<div class="alert alert-success" role="alert">Message sent! Thank you for the feedback.</div>'
				);
			} else {
				$("#responsePrompt").html(
					'<div class="alert alert-danger" role="alert">' +
						response +
						"</div>"
				);
			}
			$("#responsePrompt").show();
			$("#send_message").removeAttr("disabled");
			$(".button_spinner").hide();
			$("input#name_contact").prop("disabled", false);
			$("input#email_contact").prop("disabled", false);
			$("input#phone_contact").prop("disabled", false);
			$("#message_contact").prop("disabled", false);

			$("html, body").animate(
				{
					scrollTop: $("#top-area").offset().top,
				},
				500
			);
		});

		return false;
	});
});
