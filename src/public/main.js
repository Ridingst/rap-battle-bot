$(document).ready(function() {
	var table = $('#results').DataTable({
      processing: false,
      dom: 'Bfrtip',
      ajax: {
          url: "/results",
          dataSrc: "data"
      },
      columns: [
          { data : "date", type: "date" },
          { data : "participant" },
          { data : "question"},
          { data : "answer"},
      ],
      buttons: [
          {
              extend: 'collection',
              text: 'Show/Hide Columns',
              buttons: [ 'columnsVisibility' ],
              visibility: true
          },
          {
            extend: 'csv',
            text: "Export to CSV",
          },
      ],
      "order": [[1, 'asc']]
    });
});