function pkStartCalc() {
    initializeOperators();
    clearInputs();
}

function pkShowCalc() {
    document.getElementById("pk_calc_view").style.display = 'block';
    document.getElementById("pk_operators_view").style.display = 'none';
    document.getElementById("pk_memory_view").style.display = 'none';
}

function pkShowOperators() {
    document.getElementById("pk_calc_view").style.display = 'none';
    document.getElementById("pk_operators_view").style.display = 'block';
    document.getElementById("pk_memory_view").style.display = 'none';
}

function pkShowMemory() {
    document.getElementById("pk_calc_view").style.display = 'none';
    document.getElementById("pk_operators_view").style.display = 'none';
    document.getElementById("pk_memory_view").style.display = 'block';
}

function initializeOperators() {
    let pk_initial_operators = ['+', '-', '*', '/', '%'];
    let pk_select = document.getElementById("pk_oparator");
    pk_initial_operators.forEach( function(pk_element) {
       let pk_option = document.createElement("option");
       pk_option.text = pk_element;
       pk_option.value = pk_element;
       // pk_option.setAttribute('data-label-first', fetchLabels(pk_element)[0]);
       // pk_option.setAttribute('data-label-second', fetchLabels(pk_element)[1]);
       pk_select.add(pk_option);
    });

    setLabels();
}

function clearInputs() {
  Array.from(document.getElementsByClassName('pk_calc_element')).forEach( function(pk_input) {
    pk_input.value = '';
  })
}

function fetchLabels(el) {
  switch (el) {
      case '+':
          return ['składnik', 'składnik'];
      case '-':
          return ['odjemna', 'odjemnik'];
      case '*':
          return ['czynnik', 'czynnik'];
      case '/':
          return ['dzielna', 'dzielnik'];
      case '%':
          return ['dzielna', 'modulo'];
      case '^':
          return ['podstawa', 'wykładnik'];
      case '√':
          return ['liczba', 'stopień'];
      default:
          return ['liczba pierwsza', 'liczba druga'];
  }
}

function resetPickedOperators() {
  let pk_pickced_operators = Array.from(document.getElementsByClassName('picked'));
  let pk_select = document.getElementById("pk_oparator");
  pk_select.innerHTML = null;
  pk_pickced_operators.forEach( function(pk_element) {
     let pk_option = document.createElement("option");
     pk_option.text = pk_element.getAttribute('data-text');
     pk_option.value = pk_element.getAttribute('data-value');
     // pk_option.setAttribute('data-label-first', pk_element.getAttribute('data-label-first'));
     // pk_option.setAttribute('data-label-second', pk_element.getAttribute('data-label-second'));
     pk_select.add(pk_option);
  });
  setLabels();
}

function setLabels() {
  // let first_label = fetchLabels(document.getElementById("pk_oparator").value)[0];
  // let second_label = fetchLabels(document.getElementById("pk_oparator").value)[1];
  let [first_label, second_label] = fetchLabels(document.getElementById("pk_oparator").value);
  // let first_label = ((pk_select.options.length > 0) && (pk_select.options[0].getAttribute('data-label-first') != undefined)) ?
  //    pk_select.options[0].getAttribute('data-label-first') :
  //   'pierwsza liczba'

  // let second_label = ((pk_select.options.length > 0) && (pk_select.options[0].getAttribute('data-label-second') != undefined)) ?
  //    pk_select.options[0].getAttribute('data-label-second') :
  //   'druga liczba'

  document.getElementById("pk_first").labels[0].innerHTML = first_label;
  document.getElementById("pk_second").labels[0].innerHTML = second_label;

}

function pkTogglePick(el) {
  el.classList.toggle('picked');
  resetPickedOperators();
}

function pkCount() {
    document.getElementById('pkInfoBox').innerHTML = '';
    let pk_first = parseInt(document.getElementById("pk_first").value);
    let pk_oparator = document.getElementById("pk_oparator").value;
    let pk_second = parseInt(document.getElementById("pk_second").value);

    let pk_result = document.getElementById("pk_result");

    let pk_final_result = pkGetReult(pk_oparator, pk_first, pk_second);
    pk_result.value = pk_final_result;

    pkAddToMemoryTable(pk_first, pk_oparator, pk_second, pk_final_result);
}

function pkGetReult(pk_oparator, pk_first, pk_second) {
  switch (pk_oparator) {
      case '+':
          return (pk_first + pk_second);
      case '-':
          return (pk_first - pk_second);
      case '*':
          return (pk_first * pk_second);
      case '/':
          if (pk_second == 0) {
              pkShowErrorMessage('no_0_division');
              return null;
          } else {
              return (pk_first / pk_second);
          }
      case '%':
          if (pk_second == 0) {
              pkShowErrorMessage('no_0_division');
              return null;
          } else {
              return (pk_first % pk_second);
          }
      case '^':
          return (pk_first ** pk_second);
      case '√':
          if (pk_first < 0) {
              pkShowErrorMessage('no_negative_for_sq_root');
              return null;
          } else if (pk_second == 0) {
              pkShowErrorMessage('no_0_division');
              return null;
          } else {
              return (pk_first ^ (1 / pk_second));
          }
      default:
          pkShowErrorMessage(null);
          return null;
  }
}

function pkShowErrorMessage(pk_type) {
  document.getElementById('pkInfoBox').innerHTML = pkSetError_message(pk_type);
}

function pkSetError_message(pk_type) {
  switch (pk_type) {
      case 'no_0_division':
        return 'Nie mozna dzielić przez 0';
        // break;
      case 'no_negative_for_sq_root':
        return 'Nie mozna pierwiastkować liczb ujemnych';
        // break;
      default:
        return "Nieznane działanie";
  }
}

function pkSetAgainMessageError(pk_first, pk_operator, pk_second) {
  if ((['/', '%', '√'].includes(pk_operator)) && (pk_second == 0)) {
      return pkSetError_message('no_0_division');
  } else if (('√' == pk_operator) && (pk_first < 0)) {
      return pkSetError_message('no_negative_for_sq_root');
  } else {
      return pkSetError_message(null);
  }
}

function pkAddToMemoryTable(pk_first, pk_operator, pk_second, pk_final_result) {
  let pk_table = document.getElementById('pk-results');
  let pk_rows_count = document.getElementsByTagName('tr').length;
  let pk_row = pk_table.insertRow(pk_rows_count);

  let pk_cell_first = pk_row.insertCell(0);
  pk_cell_first.innerHTML = pk_rows_count;

  let pk_cell_second = pk_row.insertCell(1);
  pk_cell_second.innerHTML = pk_first;

  let pk_cell_third = pk_row.insertCell(2);
  pk_cell_third.innerHTML = pk_operator;

  let pk_cell_fourth = pk_row.insertCell(3);
  pk_cell_fourth.innerHTML = pk_second;

  let pk_cell_fifth = pk_row.insertCell(4);
  // if pk_final_result was null, that means there was an error message
  // pk_cell_fifth.innerHTML = pk_final_result === null ? pkSetAgainMessageError(pk_first, pk_operator, pk_second) : pk_final_result;
  if (pk_final_result === null) {
      pk_cell_fifth.innerHTML = pkSetAgainMessageError(pk_first, pk_operator, pk_second);
      pk_cell_fifth.style.color = 'red';
  } else {
      pk_cell_fifth.innerHTML = pk_final_result;
  }
}
