onValidation
============

JQuery validation plugin

Works on "required" class of form fields

**Valid fields:** textbox, textarea, checkbox, radio button, select box

Data attributes for text fields (data-validate attribute):
-----------------------------------------------------
"alpha-num",
"date",
"address",
"phone",
"email",
"number"

Compare one field to another: 
-------------

Use **"data-compare"** attribute on the field you want to use to do the comparison, and use the **"data-id"** value of the field you want to compare it to


Example usage: 
-------------

Example of email form field:

	<div class="form-group">
 		<label for="EmailAddress">Email Address</label>
		<input class="form-control required" data-validate="email" data-id="EmailAddress" name="EmailAddress" type="text" value="" />	
		<span class="field-validation-valid" data-for="EmailAddress"></span>
	</div>

  
