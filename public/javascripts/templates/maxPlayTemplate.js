<img src="/images/<%= picture%>"><h1><%= name %></h1><div class="right"><p><%= date %></p><p><%= time %></p><button type="button" data-toggle="modal" data-target="#myModal" class="btn btn-primary"></div><p>Театр: <span><%= theatre %></span></p><p>Труппа: <span><%= troupe %></span></p><div class="price"><p>Цена:<span> от <%= price[0] %>грн</span></p></div><button class="less">Скрыть</button><div class="add"><p>Актёры: <span><%= starring %></span></p><p>О чём: <span><%= summary %></span></p></div>