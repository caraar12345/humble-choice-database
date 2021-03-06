fetch('export.json')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        appendData(data);
    })
    .catch(function (err) {
        console.log('error: ' + err);
    });

function generateMonthTitle(month_year) {
    month = month_year.split('-')[0];
    year = month_year.split('-')[1];
    return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + year;
}

function appendData(data) {
    var mainContainer = document.getElementById("database");
    var month_selector = document.getElementById("month_selector");

    for (var i = 0; i < data.length; i++) {
        var month_div = document.createElement("div");
        month_div.innerHTML = `<br>`;

        var selector_link = document.createElement("a");
        selector_link.innerHTML = `${generateMonthTitle(data[i].month)}`;
        selector_link.href = `#${data[i].month}`;
        selector_link.className = "btn btn-light m-1";

        var month_title_row = document.createElement("div");
        month_title_row.className = "row";

        var month_title = document.createElement("h2");
        month_title.innerHTML = `${generateMonthTitle(data[i].month)}`;
        month_title.className = "col";
        month_title.id = `${data[i].month}`;

        var back_to_top = document.createElement("a");
        back_to_top.className = "btn btn-outline-primary col-sm-2";
        back_to_top.style = "padding-left: 12px; margin-right: 12px; margin-bottom: 8px;";
        back_to_top.setAttribute("role","button");
        back_to_top.href = `#top`;
        back_to_top.innerHTML = `Back to top`;

        var link_to_month = document.createElement("a");
        link_to_month.className = "btn btn-outline-primary col-sm-2";
        link_to_month.style = "padding-left: 12px; margin-right: 12px; margin-bottom: 8px;";
        link_to_month.setAttribute("role","button");
        link_to_month.href = `${data[i].url}`;
        link_to_month.innerHTML = `View`;

        month_title_row.appendChild(month_title);
        month_title_row.appendChild(back_to_top);
        month_title_row.appendChild(link_to_month);
        month_div.appendChild(month_title_row);

        var games_title = document.createElement("h3");
        games_title.innerHTML = `Games`;
        month_div.appendChild(games_title);

        var games_grid = document.createElement("div");
        games_grid.className = "row row-cols-1 row-cols-md-3 g-4";
        for (var j = 0; j < data[i].games.length; j++) {
            var game_div = document.createElement("div");
            game_div.innerHTML = `
        <div class="card">
            <img class="card-img-top" src="${data[i].games[j].image}" alt="Game image">
            <div class="card-body">
                <h4 class="card-title pt-1">${data[i].games[j].title}</h4>
            </div>
        </div>
        `;
            games_grid.appendChild(game_div);
        }
        month_div.appendChild(games_grid);

        var extras_title = document.createElement("h3");
        extras_title.innerHTML = "<br>Extras";
        var extras_grid = document.createElement("div");
        if (data[i].extras.length == 0) {
            extras_grid.innerHTML = `<h4>No extras found for this month</h4>`;
        } else {
          extras_grid.className = "row row-cols-1 row-cols-md-4 g-4";
          for (var j = 0; j < data[i].extras.length; j++) {
              var extra_div = document.createElement("div");
              extra_div.innerHTML = `
          <div class="card">
              <img class="card-img-top" src="${data[i].extras[j].image}" alt="Extras image">
              <div class="card-body">
                  <h4 class="card-title pt-1">${data[i].extras[j].title}</h4>
              </div>
          </div>
          `;
              extras_grid.appendChild(extra_div);
          }
        }

        month_div.appendChild(extras_title);
        month_div.appendChild(extras_grid);
        mainContainer.appendChild(month_div);
        month_selector.appendChild(selector_link);
      }
}
