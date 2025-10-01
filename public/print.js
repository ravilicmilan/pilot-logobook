function printContent(elements) {
  let divToPrint = document.getElementById('logbook-table');
  let htmlToPrint = `
    <style type="text/css">
      @page {
        /* Define the size of the page for printing */
        /* size: A4; */
        /* Define margins for the page */
        margin: 1cm;
        margin-bottom: 2cm; /* Adjust as needed to make space for the footer */
        /* Add content to the bottom-right of each page */
        
        @bottom-right {
          content: "Page " counter(page) " of " counter(pages);
          font-family: Arial;
          font-size: 10px;
          border-top: 1px solid #ccc;
          padding-top: 5px;
        }
      }
      .footer-on-last-page {
        position: running(footer); /* Assign the footer to a named running element */
      }
      @bottom-center {
        content: element(footer); /* Display the named running element at the bottom center */
      }
      #header,
      #button-wrapper,
      #pagination-wrapper,
      #search-params-wrapper,
      #logbook-table th:nth-child(1),
      #logbook-table .td-action:nth-child(1),
      #row-total td:nth-child(1),
      #row-subtotal td:nth-child(1),
      .td-action {
        display: none !important;
      }
      body {
        overflow-x: hidden;
        font-family: Arial;
      }
      #table-wrapper {
        overflow-x: hidden;
      }
      table {
        border: 1px inset #333;
        border-collapse: collapse;
      }
      table th, table td {
        border: 1px inset #333;
        color: #333;
        border-collapse: collapse;
        border-spacing: 0;
        font-size: 9px;
        text-align: center;
      }
      table td {
        padding: 10px 0;
      }
      .td-date {
        min-width: 65px !important;
      }
      #row-total td, #row-subtotal td {
        font-weight: bold;
      }
      .td-pic_time,
      .td-dual_time,
      .td-total_flight_time,
      .td-single_engine_time,
      .td-multi_engine_time {
        min-width: 40px !important;
      }
      .td-remarks {
        min-width: 80px !important;
      }
      .td-route {
        min-width: 100px !important;
      }
    </style>
  `;

  let additionalStyles = `<style>`;

  elements.forEach((id) => {
    additionalStyles += `.td-${id}, .th-${id}, #subtotal-${id}, #total-${id} { display: none !important; } `;
  });

  additionalStyles += `</style>`;

  htmlToPrint += additionalStyles;
  htmlToPrint += divToPrint.outerHTML;
  const newWin = window.open('');
  newWin.document.body.innerHTML = htmlToPrint;
  newWin.print();
  newWin.close();
}
