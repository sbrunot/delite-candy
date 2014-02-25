define(["dcl/dcl",
        "delite/register",
        "dojo/keys",
        "delite/Widget",
        "delite/Invalidating"
], function (dcl, register, keys, Widget, Invalidating) {

	// module:
	//		deliteful/Input

	var Input = dcl([Widget, Invalidating], {
		// summary:
		//		Input widget that wraps an HTML input element to make it compatible with delite/KeyNav.

		accept: "",
		alt: "",
		autocomplete: "",
		autofocus: "",
		checked: "",
		disabled: "",
		form: "",
		formaction: "",
		formenctype: "",
		formmethod: "",
		formnovalidate: "",
		formtarget: "",
		height: "",
		list: "",
		max: "",
		maxlength: "",
		min: "",
		multiple: "",
		name: "",
		pattern: "",
		placeholder: "",
		readonly: "",
		required: "",
		size: "",
		src: "",
		step: "",
		type: "text",
		value: "",
		width: "",
		
		preCreate: function () {
			this.addInvalidatingProperties("accept",
					"alt",
					"autocomplete",
					"autofocus",
					"checked",
					"disabled",
					"form",
					"formaction",
					"formenctype",
					"formmethod",
					"formnovalidate",
					"formtarget",
					"height",
					"list",
					"max",
					"maxlength",
					"min",
					"multiple",
					"name",
					"pattern",
					"placeholder",
					"readonly",
					"required",
					"size",
					"src",
					"step",
					"type",
					"value",
					"width");
		},

		refreshRendering: function (props) {
			var inputFocused = null;
			for (var prop in props) {
				if (props[prop]) {
					if (prop === "type") {
						if (this._input) {
							inputFocused = (this.ownerDocument.activeElement === this._input);
							this._input.parentNode.removeChild(this._input);
						}
						this._input = this.ownerDocument.createElement("input");
						delete this._input.id;
						this._input.type = this.type;
						this._input.setAttribute("tabindex", "-1");
						this.appendChild(this._input);
					} else {
						this._input[prop] = this[prop];
					}
					if (inputFocused) {
						this._input.focus();
					}
				}
			}
		},

		buildRendering: function () {
			this.setAttribute("tabindex", "0");
			this.on("keydown", function (evt) {
				if (evt.keyCode === keys.ENTER) {
					this._input.focus();
				}
				if (evt.keyCode === keys.ESCAPE) {
					this.focus();
				}
			});
		}

	});

	return register("dc-input", [HTMLElement, Input]);
});