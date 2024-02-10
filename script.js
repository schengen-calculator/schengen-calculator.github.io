class SchengenStay {
  entryDate
  exitDate
  numDays
}

let stays = []
function createDateInput() {
  let input = document.createElement("input")
  input.className = "form-control"
  input.type = "date"
  return input
}

function createNumDaysLabel() {
  let label = document.createElement("div")
  label.className = "text-bg-secondary p-2 rounded d-inline-block"
  let text = document.createTextNode("21")
  label.appendChild(text)
  return label
}

function createDeleteButton() {
  let button = document.createElement("button")
  button.className = "btn btn-danger"

  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svg.setAttribute("width", "20")
  svg.setAttribute("height", "20")
  svg.setAttribute("fill", "currentColor")
  svg.setAttribute("viewBox", "0 0 16 16")

  let path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("d", "M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0")
  svg.appendChild(path)

  // Append svg to button
  button.appendChild(svg)
  return button
}

class SchengenCalculator {
  controlDateInputElement
  emptyEntryDateInputElement
  emptyEntryDateInput
  emptyExitDateInputElement
  emptyExitDateInput  

  constructor() {
    this.controlDateInputElement = document.getElementById("controlDateInput")
    this.controlDateInputElement.addEventListener("change", function(event) {
      var selectedDate = event.target.value
      console.log("Selected date:", selectedDate)
    })

    this.emptyEntryDateInputElement = document.getElementById("emptyEntryDateInput")
    this.emptyEntryDateInputEvent = this.emptyEntryDateInputEvent.bind(this)
    this.emptyEntryDateInputElement.addEventListener("change", this.emptyEntryDateInputEvent)
    this.emptyExitDateInputElement = document.getElementById("emptyExitDateInput")
    this.emptyExitDateInputEvent = this.emptyExitDateInputEvent.bind(this)
    this.emptyExitDateInputElement.addEventListener("change", this.emptyExitDateInputEvent)
  }

  addRow(entryDate, exitDate) {
    console.log("addRow", entryDate, exitDate)
    let tableBody = document.getElementById("table").getElementsByTagName('tbody')[0]

    console.log(tableBody.rows.length)

    let row = tableBody.insertRow(tableBody.rows.length - 1)

    let entryDateCell = row.insertCell(0)
    let exitDateCell = row.insertCell(1)
    let numStaysCell = row.insertCell(2)
    let deleteButtonCell = row.insertCell(3)

    let entryDateElement = createDateInput()
    entryDateElement.value = entryDate
    entryDateCell.appendChild(entryDateElement)
    let exitDateElement = createDateInput()
    exitDateElement.value = exitDate
    exitDateCell.appendChild(exitDateElement)
    numStaysCell.appendChild(createNumDaysLabel())
    deleteButtonCell.appendChild(createDeleteButton())
  }

  addToList() {
    if (!this.emptyEntryDateInput || !this.emptyExitDateInput) {
      return
    }
    this.addRow(this.emptyEntryDateInput, this.emptyExitDateInput)

    console.log("clear dates")

    this.emptyEntryDateInput = ""
    this.emptyExitDateInput = ""
    console.log(this.emptyEntryDateInputElement.value)
    this.emptyEntryDateInputElement.value = ""
    console.log(this.emptyEntryDateInputElement.value)
    this.emptyExitDateInputElement.value = ""
  }

  emptyEntryDateInputEvent(event) {
    this.emptyEntryDateInput = event.target.value
    this.addToList()
  }

  emptyExitDateInputEvent(event) {
    this.emptyExitDateInput = event.target.value
    this.addToList()
  }
}

var calc = new SchengenCalculator()
