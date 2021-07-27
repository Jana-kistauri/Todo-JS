get();


async function get() {
  let todos = await fetch("https://ucha.ge/todo/server.php").then(function(r) {
    return r.json();
  });

  console.log(todos);
  renderTodos(todos);
}

document.querySelector('#add-item-btn').addEventListener('click', add);

async function add() {
  let text = document.getElementById('new-item-text').value;

  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=add&text=' + encodeURIComponent(text)
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);

  document.getElementById('new-item-text').value = '';
}

async function editItem(id, text) {
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=update&id=' + id +'&text=' + encodeURIComponent(text) 
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}

async function removeStatus(id, text, updateStatus){
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=update&id=' + id +'&text='+ updateStatus + encodeURIComponent(text)
  }).then(function(r) {
    return r.json();
  });


  clearListsContainer();
  renderTodos(todos);
}

async function deleteItem(id){
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=remove&id=' + id
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}


async function updateStatus(id, status){
  let todos = await fetch("https://ucha.ge/todo/server.php", {
    method: 'POST',
    headers: {  'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'action=update&id=' + id + '&done=' + status
  }).then(function(r) {
    return r.json();
  });

  clearListsContainer();
  renderTodos(todos);
}

function renderTodos(list) {
  for(let i = 0; i < list.length; i++) {
    let item = list[i];
    renderItem(item);
  };
};

function renderItem(item) {
  let div = document.createElement('div');

  if(item.text[0] == "$") {
    item.text = item.text.substring(1);
    div.classList.add('trash-div');
    div.innerHTML = `
      <input type="text" disabled class="editInput" value="${item.text}">
      <button class="btn back"><i class="fas fa-level-up-alt blue"></i></i></button>
      <button class="btn delete"><i class="fas fa-ban red"></i></button>
    `;

    div.querySelector(".btn.back").addEventListener("click", function() {
        removeStatus(item.id, item.text, "");
    });
    div.querySelector(".btn.delete").addEventListener("click", function() {
        deleteItem(item.id);
    });



  }else {
    div.classList.add('todo-div');
    div.innerHTML = `
      <input type="checkbox" class="check">
      <input type="text" disabled class="editInput" value="${item.text}">
      <button class="btn edit"><i class="fas fa-pencil-alt blue"></i></button>
      <button class="btn save"><i class="fas fa-check blue"></i></button>
      <button class="btn delete"><i class="fas fa-trash red"></i></button>
    `;

    let checkbox = div.querySelector(".check");
    checkbox.checked = item.done;
    if(checkbox.checked) {
      div.style.borderBottom = "5px solid #4BB543"
    }
    checkbox.addEventListener("change", function() {
      updateStatus(item.id, this.checked);
    });

    div.querySelector(".btn.edit").addEventListener("click", function() {
      div.querySelector(".editInput").disabled = false;
      div.classList.add('editing');
    });

    div.querySelector(".btn.save").addEventListener("click", function() {
        let text = div.querySelector(".editInput").value;
        editItem(item.id, text);
    });

    div.querySelector(".btn.delete").addEventListener("click", function() {
        removeStatus(item.id, item.text, "$");
    });

  }


  if(div.classList.contains("trash-div")) {
    document.querySelector('#trash').appendChild(div);
  } else {
    document.querySelector('#list').appendChild(div);
  }
}

function clearListsContainer() {
  document.querySelector("#list").innerHTML = '';
  document.querySelector("#trash").innerHTML = '';
}

document.querySelector("#show").addEventListener("click", function() {
  let trash = document.getElementById("trash");
  let show = this;
  show.style.display = "none";

  let hide = document.querySelector("#hide");
  hide.style.display = "flex";
  trash.style.display = "block";

  hide.addEventListener("click", function() {
    this.style.display = "none";
    show.style.display = "flex";
    trash.style.display = "none";
  })
})