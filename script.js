function createDateInput() {
  let input = document.createElement("input")
  input.className = "form-control"
  input.type = "date"
  return input
}

function createNumDaysLabel() {
  let label = document.createElement("div")
  label.className = "text-bg-secondary p-2 rounded d-inline-block"
  let text = document.createTextNode("")
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

class SchengenStay {
  entryDate
  exitDate
  numDays
  numDaysElement
  rowElement
  removeCallbacks

  constructor(rowElement) {
    this.rowElement = rowElement
    this.removeCallbacks = []
    this.numDays = 0
  }

  update () {
    console.log("entryDate:", this.entryDate)
    console.log("exitDate:", this.exitDate)

    let newNumDays = 0

    if (this.entryDate && this.exitDate) {
      if (!this.numDaysElement) {
        this.numDaysElement = createNumDaysLabel()

        this.rowElement.insertCell(2).appendChild(this.numDaysElement)

        let deleteButton = createDeleteButton()
        deleteButton.addEventListener("click", (event) => {
          for (const listener of this.removeCallbacks) {
            listener()
          }
        })
        this.rowElement.insertCell(3).appendChild(deleteButton)
      }
      newNumDays = 44
    }

    if (this.numDaysElement && newNumDays != this.numDays) {
      this.numDays = newNumDays
      this.numDaysElement.childNodes[0].nodeValue = this.numDays
    }
  }

  onRemovedClicked(listener) {
    this.removeCallbacks.push(listener)
  }
}

class SchengenCalculator {
  controlDateInputElement
  stays
  totalDays

  constructor() {
    this.stays = []

    this.controlDateInputElement = document.getElementById("controlDateInput")
    this.controlDateInputElement.addEventListener("change", function(event) {
      var selectedDate = event.target.value
      console.log("Selected date:", selectedDate)
    })

    this.addRow()
    return
  }

  addRow() {
    let tableBody = document.getElementById("table").getElementsByTagName('tbody')[0]
    let row = tableBody.insertRow()

    let entryDateElement = createDateInput()
    row.insertCell(0).appendChild(entryDateElement)

    let exitDateElement = createDateInput()
    row.insertCell(1).appendChild(exitDateElement)

    let stay = new SchengenStay(row)
    this.stays.push(stay)

    entryDateElement.addEventListener("change", (event) => {
      stay.entryDate = event.target.value
      stay.update()
      if (stay.numDaysElement && this.stays[this.stays.length - 1] === stay) {
        this.addRow()
      }
    })
    exitDateElement.addEventListener("change", (event) => {
      stay.exitDate = event.target.value
      stay.update()
      if (stay.numDaysElement && this.stays[this.stays.length - 1] === stay) {
        this.addRow()
      }
    })
    stay.onRemovedClicked(() => {
      row.remove()
      this.stays.splice(this.stays.indexOf(stay), 1)
    })
  }
} 

var calc = new SchengenCalculator()
