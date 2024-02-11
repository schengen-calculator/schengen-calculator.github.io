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
  numDaysChangedCallbacks

  constructor(rowElement) {
    this.rowElement = rowElement
    this.removeCallbacks = []
    this.numDaysChangedCallbacks = []
    this.numDays = 0
  }

  update () {
    console.log("entryDate:", this.entryDate)
    console.log("exitDate:", this.exitDate)

    let newNumDays = 0

    if (this.entryDate && this.exitDate && this.exitDate >= this.entryDate) {
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
      newNumDays = this.exitDate.diff(this.entryDate, "day") + 1
    }

    if (this.numDaysElement && newNumDays != this.numDays) {
      this.numDays = newNumDays
      this.numDaysElement.childNodes[0].nodeValue = this.numDays

      for (const listener of this.numDaysChangedCallbacks) {
        listener()
      }
    }
  }

  onRemovedClicked(listener) {
    this.removeCallbacks.push(listener)
  }
  onNumDaysChanged(listener) {
    this.numDaysChangedCallbacks.push(listener)
  }
}

class SchengenCalculator {
  controlDate
  periodStartDate
  stays
  totalDays
  permissionCard
  permissionCardText
  tableBody

  constructor() {
    this.tableBody = document.getElementById("table").getElementsByTagName('tbody')[0]
    this.permissionCard = document.getElementById("permissionCard")
    this.permissionCardText = document.getElementById("permissionCardText")

    this.stays = []
    this.totalDays = 0

    this.controlDate = dayjs()
    this.periodStartDate = this.controlDate.subtract(179, "day")

    let controlDateInputElement = document.getElementById("controlDateInput")
    controlDateInputElement.value = this.controlDate.format("YYYY-MM-DD")
    controlDateInputElement.addEventListener("change", (event) => {
      this.controlDate = dayjs(event.target.value)
      this.periodStartDate = this.controlDate.subtract(179, "day")
      this.updatePermissionCard()
    })

    document.getElementById("clearButton").addEventListener("click", () => { 
      this.stays = []
      this.tableBody.innerHTML = ""
      this.addRow()
      this.updateTotalDays()
    })

    this.addRow()
    this.updatePermissionCard()
    return
  }

  addRow() {
    let row = this.tableBody.insertRow()

    let entryDateElement = createDateInput()
    row.insertCell(0).appendChild(entryDateElement)

    let exitDateElement = createDateInput()
    row.insertCell(1).appendChild(exitDateElement)

    let stay = new SchengenStay(row)
    this.stays.push(stay)

    entryDateElement.addEventListener("change", (event) => {
      stay.entryDate = dayjs(event.target.value)
      stay.update()
      exitDateElement.min = event.target.value
      if (stay.numDaysElement && this.stays[this.stays.length - 1] === stay) {
        this.addRow()
      }
    })
    exitDateElement.addEventListener("change", (event) => {
      stay.exitDate = dayjs(event.target.value)
      stay.update()
      entryDateElement.max = event.target.value
      if (stay.numDaysElement && this.stays[this.stays.length - 1] === stay) {
        this.addRow()
      }
    })
    stay.onRemovedClicked(() => {
      row.remove()
      this.stays.splice(this.stays.indexOf(stay), 1)
      this.updateTotalDays()
    })
    stay.onNumDaysChanged(() => {
      this.updateTotalDays()
    })
  }

  updateTotalDays() {
    let totalDays = 0
    for (const stay of this.stays) {
      totalDays += stay.numDays
    }
    if (this.totalDays !== totalDays) {
      this.totalDays = totalDays
      this.updatePermissionCard()
    }
  }

  updatePermissionCard() { 
    let text = "Start of 180 days period: " + this.periodStartDate.format("L")
    text += "<br> Days of stay within 180 days: " + this.totalDays
    if (this.totalDays > 90) {
      this.permissionCard.className = "card-header text-bg-danger mb-3"
      this.permissionCard.textContent = "Overstay"
    }
    else {
      this.permissionCard.className = "card-header text-bg-success mb-3"
      this.permissionCard.textContent = "Stay permitted"
    }
    this.permissionCardText.innerHTML = text
  }
}
dayjs.extend(window.dayjs_plugin_localizedFormat)
var calc = new SchengenCalculator()
