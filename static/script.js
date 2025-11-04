// script.js file containing JavaScript for application

// This ensures all the code inside runs only after the HTML document
// has fully loaded and the DOM is ready to be manipulated.
$(document).ready(function() {

  // Cache key DOM elements for efficiency
  var modal = $('#modal');          // The modal pop-up element for Add/Edit
  var form = $('#vendorForm');      // The form inside the modal

  // ===============================
  // ADD BUTTON HANDLER
  // ===============================
  // Triggered when the user clicks the “Add Supplier” button at the top of the page.
  $('#addBtn').click(function() {
    // Update modal title for clarity
    $('#modalTitle').text('Add Supplier');

    // Reset any pre-existing form data to ensure a blank form
    form[0].reset();

    // Clear the hidden rowIndex input so Flask knows this is a NEW record
    $('#rowIndex').val('');

    // Display the modal by changing its CSS from display:none to display:block
    modal.show();
  });

  // ===============================
  // CLOSE BUTTON HANDLER
  // ===============================
  // Triggered when the user clicks the “×” icon in the modal.
  $('.close').click(function() {
    // Simply hides the modal again
    modal.hide();
  });

  // ===============================
  // EDIT BUTTON HANDLER
  // ===============================
  // Triggered when the user clicks “Edit” next to an existing row in the table.
  $('.editBtn').click(function() {

    // Find the <tr> (table row) that contains the clicked Edit button
    const row = $(this).closest('tr');

    // Determine the row’s index position within the table body (0-based)
    const index = row.index();

    // Store that index in the hidden input #rowIndex so the Flask app
    // knows which record to update in the CSV later
    $('#rowIndex').val(index);

    // Extract data from each table cell (td) and populate the modal form fields
    $('#supplier').val(row.find('td:eq(0)').text());
    $('#product').val(row.find('td:eq(1)').text());
    $('#manager').val(row.find('td:eq(2)').text());
    $('#company').val(row.find('td:eq(3)').text());
    $('#startDate').val(row.find('td:eq(4)').text());

    // Update modal title to reflect editing context
    $('#modalTitle').text('Edit Supplier');

    // Finally, show the modal with the current supplier’s data prefilled
    modal.show();
  });

  // ===============================
  // FORM SUBMISSION HANDLER
  // ===============================
  // Handles both Add and Edit operations when the user clicks “Save”
  form.submit(function(e) {

    // Prevent the browser’s default form submission behavior (page reload)
    e.preventDefault();

    // Determine if we’re adding a new record or editing an existing one
    const index = $('#rowIndex').val();

    // Collect the current field values into a JSON object
    const data = {
      'Supplier': $('#supplier').val(),
      'Product': $('#product').val(),
      'Supplier Manager': $('#manager').val(),
      'Company': $('#company').val(),
      'Contract Start Date': $('#startDate').val()
    };

    // ===============================
    // ADD MODE
    // ===============================
    // If no index is set, this means we’re adding a new supplier record
    if (index === '') {
      $.ajax({
        url: '/add',                       // Flask endpoint for adding a row
        type: 'POST',                      // Send data via POST
        contentType: 'application/json',   // Tell Flask to expect JSON
        data: JSON.stringify(data),        // Convert data object to JSON string
        success: function() {
          // Reload page after success to reflect the newly added row
          location.reload();
        }
      });
    }
    // ===============================
    // EDIT MODE
    // ===============================
    else {
      // Include the row index to tell Flask which record to update
      data['index'] = index;

      $.ajax({
        url: '/edit',                      // Flask endpoint for editing a row
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function() {
          // Reload page to show the updated record in the table
          location.reload();
        }
      });
    }
  });
});